const Product = require('../models/Product');

// ── GET /api/products ────────────────────────────────────────
// Supports: ?category=formal&search=oxford&featured=true&sort=price_asc
const getProducts = async (req, res, next) => {
  try {
    const { category, search, featured, sort } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'name') sortOption = { name: 1 };

    const products = await Product.find(filter).sort(sortOption);

    res.json({ success: true, count: products.length, products });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/products/:id ────────────────────────────────────
const getProductById = async (req, res, next) => {
  try {
    // Support lookup by MongoDB _id OR by slug
    const { id } = req.params;
    const product = await Product.findOne(
      id.match(/^[0-9a-fA-F]{24}$/)
        ? { _id: id }
        : { slug: id }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/products (Admin) ───────────────────────────────
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/products/:id (Admin) ────────────────────────────
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/products/:id (Admin) ─────────────────────────
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
