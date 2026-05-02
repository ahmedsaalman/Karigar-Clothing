const mongoose = require('mongoose');

const DiscountCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Discount code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountPercent: {
      type: Number,
      required: [true, 'Discount percent is required'],
      min: 1,
      max: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    usageLimit: {
      type: Number,
      default: null, // null = unlimited
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Virtual: check if code is expired
DiscountCodeSchema.virtual('isExpired').get(function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

// Virtual: check if usage limit reached
DiscountCodeSchema.virtual('isExhausted').get(function () {
  if (this.usageLimit === null) return false;
  return this.usageCount >= this.usageLimit;
});

module.exports = mongoose.model('DiscountCode', DiscountCodeSchema);
