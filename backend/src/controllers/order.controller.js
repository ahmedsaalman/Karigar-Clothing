const Order = require('../models/Order');
const Product = require('../models/Product');
const DiscountCode = require('../models/DiscountCode');
const Cart = require('../models/Cart');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const SHIPPING_FLAT = 250;
const SHIPPING_FREE_THRESHOLD = 5000;

// ── POST /api/orders ─────────────────────────────────────────
const placeOrder = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      items,
      shippingAddress,
      paymentMethod,
      orderNotes,
      discountCode,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    let createdOrder = null;
    await session.withTransaction(async () => {
      const enrichedItems = await Promise.all(
        items.map(async (item) => {
          const product = await Product.findById(item.productId).session(session);
          if (!product) {
            throw { statusCode: 404, message: `Product ${item.productId} no longer exists` };
          }
          if (!product.inStock || product.stockCount < item.quantity) {
            throw { statusCode: 400, message: `${product.name} is out of stock` };
          }
          return {
            product: product._id,
            name: product.name,
            price: product.price,
            size: item.size,
            quantity: item.quantity,
            image: product.thumbnail,
          };
        })
      );

      const calculatedSubtotal = enrichedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      let appliedDiscountCode = null;
      let discountPercent = 0;
      if (discountCode) {
        const candidate = await DiscountCode.findOne({
          code: discountCode.toUpperCase(),
          isActive: true,
        }).session(session);

        if (!candidate) {
          throw { statusCode: 400, message: 'Discount code is invalid or inactive' };
        }
        if (candidate.expiresAt && new Date() > candidate.expiresAt) {
          throw { statusCode: 400, message: 'Discount code has expired' };
        }
        if (candidate.usageLimit !== null && candidate.usageCount >= candidate.usageLimit) {
          throw { statusCode: 400, message: 'Discount code usage limit reached' };
        }

        appliedDiscountCode = candidate.code;
        discountPercent = candidate.discountPercent;
        candidate.usageCount += 1;
        await candidate.save({ session });
      }

      const discountAmount = Math.round(calculatedSubtotal * (discountPercent / 100));
      const discountedTotal = calculatedSubtotal - discountAmount;
      const shipping = discountedTotal > SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_FLAT;
      const grandTotal = discountedTotal + shipping;

      for (const item of enrichedItems) {
        const updatedProduct = await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stockCount: -item.quantity } },
          { session, new: true }
        );
        if (updatedProduct) {
          updatedProduct.inStock = updatedProduct.stockCount > 0;
          await updatedProduct.save({ session });
        }
      }

      const [order] = await Order.create(
        [
          {
            user: req.user._id,
            items: enrichedItems,
            shippingAddress,
            paymentMethod,
            orderNotes: orderNotes || '',
            discountCode: appliedDiscountCode,
            discountPercent,
            subtotal: calculatedSubtotal,
            shipping,
            grandTotal,
          },
        ],
        { session }
      );
      createdOrder = order;

      await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } }, { session });
    });

    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};

// ── GET /api/orders  (current user's orders) ─────────────────
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name thumbnail slug');

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/orders/:id ──────────────────────────────────────
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'items.product',
      'name thumbnail slug'
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Users can only view their own orders; admins can view all
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/orders/admin/all  (admin only) ──────────────────
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('items.product', 'name thumbnail');

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// ── PATCH /api/orders/:id/status  (admin only) ───────────────
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
