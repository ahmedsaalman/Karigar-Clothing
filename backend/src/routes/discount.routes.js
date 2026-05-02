const express = require('express');
const { body } = require('express-validator');
const {
  validateDiscount,
  createDiscount,
  getAllDiscounts,
} = require('../controllers/discount.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

// Authenticated users can validate a code
router.post(
  '/validate',
  protect,
  [body('code').trim().notEmpty().withMessage('Discount code is required')],
  validateDiscount
);

// Admin-only
router.post(
  '/',
  protect,
  adminOnly,
  [
    body('code').trim().notEmpty().withMessage('Code is required'),
    body('discountPercent').isInt({ min: 1, max: 100 }).withMessage('Invalid discount percent'),
  ],
  createDiscount
);
router.get('/', protect, adminOnly, getAllDiscounts);

module.exports = router;
