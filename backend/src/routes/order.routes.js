const express = require('express');
const { body } = require('express-validator');
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/order.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

// All order routes require authentication
router.use(protect);

router.post(
  '/',
  [
    body('items').isArray({ min: 1 }).withMessage('Order items are required'),
    body('items.*.productId').isMongoId().withMessage('Invalid product id'),
    body('items.*.size').trim().notEmpty().withMessage('Size is required'),
    body('items.*.quantity')
      .isInt({ min: 1, max: 20 })
      .withMessage('Quantity must be between 1 and 20'),
    body('shippingAddress.firstName').trim().notEmpty().withMessage('First name is required'),
    body('shippingAddress.lastName').trim().notEmpty().withMessage('Last name is required'),
    body('shippingAddress.email').isEmail().withMessage('Valid email is required'),
    body('shippingAddress.phone').trim().notEmpty().withMessage('Phone is required'),
    body('shippingAddress.address').trim().notEmpty().withMessage('Address is required'),
    body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
    body('shippingAddress.province').trim().notEmpty().withMessage('Province is required'),
    body('shippingAddress.postalCode').trim().notEmpty().withMessage('Postal code is required'),
    body('paymentMethod')
      .isIn(['cod', 'bank', 'easypaisa'])
      .withMessage('Invalid payment method'),
  ],
  placeOrder
);
router.get('/', getMyOrders);
router.get('/admin/all', adminOnly, getAllOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', adminOnly, updateOrderStatus);

module.exports = router;
