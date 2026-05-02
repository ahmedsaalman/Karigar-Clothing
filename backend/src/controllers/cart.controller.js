const { validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

const getMyCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    await cart.populate('items.product', 'name slug thumbnail price inStock stockCount');

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

const upsertCartItem = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { productId, size, quantity } = req.body;
    const product = await Product.findById(productId).select('stockCount inStock');
    if (!product || !product.inStock) {
      return res.status(400).json({ success: false, message: 'Product is unavailable' });
    }
    if (quantity > product.stockCount) {
      return res.status(400).json({ success: false, message: 'Requested quantity is unavailable' });
    }

    const cart = await getOrCreateCart(req.user._id);
    const idx = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (idx >= 0) {
      cart.items[idx].quantity = quantity;
    } else {
      cart.items.push({ product: productId, size, quantity });
    }

    await cart.save();
    await cart.populate('items.product', 'name slug thumbnail price inStock stockCount');
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const { productId, size } = req.params;
    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter(
      (item) => !(item.product.toString() === productId && item.size === size)
    );
    await cart.save();
    await cart.populate('items.product', 'name slug thumbnail price inStock stockCount');

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyCart, upsertCartItem, removeCartItem, clearCart };
