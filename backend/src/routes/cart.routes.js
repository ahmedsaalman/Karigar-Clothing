const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth.middleware');
const {
  getMyCart,
  upsertCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cart.controller');

const router = express.Router();

router.use(protect);

router.get('/', getMyCart);
router.put(
  '/item',
  [
    body('productId').isMongoId().withMessage('Valid productId is required'),
    body('size').trim().notEmpty().withMessage('Size is required'),
    body('quantity').isInt({ min: 1, max: 20 }).withMessage('Quantity must be between 1 and 20'),
  ],
  upsertCartItem
);
router.delete('/item/:productId/:size', removeCartItem);
router.delete('/', clearCart);

module.exports = router;
