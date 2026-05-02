const DiscountCode = require('../models/DiscountCode');
const { validationResult } = require('express-validator');

// ── POST /api/discounts/validate ─────────────────────────────
const validateDiscount = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Discount code is required' });
    }

    const discount = await DiscountCode.findOne({ code: code.toUpperCase() });

    if (!discount) {
      return res.status(404).json({ success: false, message: 'Invalid discount code' });
    }

    if (!discount.isActive) {
      return res.status(400).json({ success: false, message: 'This discount code is no longer active' });
    }

    if (discount.expiresAt && new Date() > discount.expiresAt) {
      return res.status(400).json({ success: false, message: 'This discount code has expired' });
    }

    if (discount.usageLimit !== null && discount.usageCount >= discount.usageLimit) {
      return res.status(400).json({ success: false, message: 'This discount code has reached its usage limit' });
    }

    res.json({
      success: true,
      code: discount.code,
      discountPercent: discount.discountPercent,
      message: `${discount.discountPercent}% discount applied!`,
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/discounts  (admin only) ────────────────────────
const createDiscount = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const discount = await DiscountCode.create(req.body);
    res.status(201).json({ success: true, discount });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/discounts  (admin only) ─────────────────────────
const getAllDiscounts = async (req, res, next) => {
  try {
    const discounts = await DiscountCode.find().sort({ createdAt: -1 });
    res.json({ success: true, count: discounts.length, discounts });
  } catch (error) {
    next(error);
  }
};

module.exports = { validateDiscount, createDiscount, getAllDiscounts };
