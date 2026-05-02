/**
 * Seed Script — populates the database with:
 *  - 6 products from the existing static data
 *  - 3 discount codes (KARIGAR10, NEWUSER20, PREMIUM15)
 *
 * Usage:
 *   node src/seed.js          → seed the DB
 *   node src/seed.js --clear  → wipe products & discount codes only
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const DiscountCode = require('./models/DiscountCode');

const products = [
  {
    name: 'Oxford Button-Down',
    slug: 'oxford-button-down',
    price: 2999,
    originalPrice: 3999,
    category: 'formal',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#ffffff', '#1a3a5c', '#c0c0c0'],
    colorNames: ['White', 'Navy Blue', 'Silver Grey'],
    inStock: true,
    stockCount: 45,
    thumbnail: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'],
    rating: 4.8,
    reviewCount: 128,
    description:
      'The cornerstone of a professional wardrobe. Crafted from premium 100% Egyptian cotton with a classic oxford weave.',
    badge: 'bestseller',
    featured: true,
  },
  {
    name: 'Linen Slim Fit',
    slug: 'linen-slim-fit',
    price: 3499,
    originalPrice: 3499,
    category: 'casual',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#f5f0e8', '#8fbc8f', '#cd853f'],
    colorNames: ['Cream', 'Sage Green', 'Tan'],
    inStock: true,
    stockCount: 28,
    thumbnail: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400',
    images: ['https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800'],
    rating: 4.6,
    reviewCount: 89,
    description:
      'Breathable linen construction for the modern professional who values comfort without compromising style.',
    badge: 'new',
    featured: true,
  },
  {
    name: 'Poplin Dress Shirt',
    slug: 'poplin-dress-shirt',
    price: 2499,
    originalPrice: 2999,
    category: 'formal',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['#ffffff', '#f5f5dc', '#add8e6'],
    colorNames: ['White', 'Cream', 'Light Blue'],
    inStock: true,
    stockCount: 62,
    thumbnail: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400',
    images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800'],
    rating: 4.5,
    reviewCount: 203,
    description: 'Ultra-smooth poplin weave with a crisp finish that holds its shape all day.',
    badge: 'sale',
    featured: false,
  },
  {
    name: 'Chambray Work Shirt',
    slug: 'chambray-work-shirt',
    price: 1999,
    originalPrice: 1999,
    category: 'casual',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#6b8cba', '#708090', '#8b7355'],
    colorNames: ['Chambray Blue', 'Slate', 'Khaki'],
    inStock: false,
    stockCount: 0,
    thumbnail: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400',
    images: ['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800'],
    rating: 4.3,
    reviewCount: 67,
    description: 'Relaxed chambray weave that transitions effortlessly from office to weekend.',
    badge: null,
    featured: false,
  },
  {
    name: 'Merino Wool Shirt',
    slug: 'merino-wool-shirt',
    price: 5999,
    originalPrice: 7499,
    category: 'premium',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#2f4f4f', '#800020', '#36454f'],
    colorNames: ['Dark Slate', 'Burgundy', 'Charcoal'],
    inStock: true,
    stockCount: 15,
    thumbnail: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400',
    images: ['https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800'],
    rating: 4.9,
    reviewCount: 45,
    description:
      'Superfine merino wool with natural temperature regulation. The pinnacle of Karigar craftsmanship.',
    badge: 'premium',
    featured: true,
  },
  {
    name: 'Flannel Check Shirt',
    slug: 'flannel-check-shirt',
    price: 2799,
    originalPrice: 2799,
    category: 'casual',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['#8b0000', '#2f4f4f', '#4a3728'],
    colorNames: ['Red Check', 'Green Check', 'Brown Check'],
    inStock: true,
    stockCount: 33,
    thumbnail: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'],
    rating: 4.4,
    reviewCount: 91,
    description: 'Soft brushed flannel in classic check patterns. Perfect for cooler months.',
    badge: null,
    featured: false,
  },
];

const discountCodes = [
  { code: 'KARIGAR10', discountPercent: 10, isActive: true },
  { code: 'NEWUSER20', discountPercent: 20, isActive: true },
  { code: 'PREMIUM15', discountPercent: 15, isActive: true },
];

const seed = async () => {
  await connectDB();

  const clearOnly = process.argv.includes('--clear');

  console.log('\n🌱 Karigar Seed Script');
  console.log('─────────────────────');

  // Clear existing data
  await Product.deleteMany();
  await DiscountCode.deleteMany();
  console.log('🗑️  Cleared existing products and discount codes');

  if (clearOnly) {
    console.log('✅ Clear complete. Exiting.\n');
    await mongoose.connection.close();
    process.exit(0);
  }

  // Insert products
  const inserted = await Product.insertMany(products);
  console.log(`✅ Seeded ${inserted.length} products`);

  // Insert discount codes
  const codes = await DiscountCode.insertMany(discountCodes);
  console.log(`✅ Seeded ${codes.length} discount codes`);

  console.log('\nReady! Start the server with: npm run dev\n');
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
