// src/services/productService.js
// This file contains ALL API-related code
// Components just call these functions — they don't need to
// know anything about fetch, URLs, or data transformation

// The base URL — change this one place when backend is ready
const BASE_URL = 'https://dummyjson.com';

// PKR conversion rate (USD to PKR)
const USD_TO_PKR = 280;

// ── TRANSFORM FUNCTION ───────────────────────────────────
// Converts API data shape to our app's data shape
// This is called a "mapper" or "transformer"

function transformProduct(apiProduct) {

  // Calculate price in PKR
  // Math.round removes decimal places
  const priceInPKR = Math.round(apiProduct.price * USD_TO_PKR);

  // Calculate original price before discount
  // Formula: if 10% discount, original = current / (1 - 0.10)
  const discount = apiProduct.discountPercentage / 100;
  const originalPriceInPKR = Math.round(priceInPKR / (1 - discount));

  // Has discount only if discount is meaningful (over 1%)
  const hasDiscount = apiProduct.discountPercentage > 1;

  return {
    id: apiProduct.id,
    name: apiProduct.title,
    slug: apiProduct.title.toLowerCase().replace(/ /g, '-'),
    price: priceInPKR,
    originalPrice: hasDiscount ? originalPriceInPKR : priceInPKR,
    image: apiProduct.thumbnail,
    images: apiProduct.images || [apiProduct.thumbnail],
    rating: apiProduct.rating,
    reviewCount: Math.floor(Math.random() * 200) + 20,
    description: apiProduct.description,
    inStock: apiProduct.stock > 0,
    stockCount: apiProduct.stock,
    category: apiProduct.category,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#ffffff', '#1a1a1a', '#8b7355'],
    colorNames: ['White', 'Black', 'Tan'],
    badge: apiProduct.discountPercentage > 15 ? 'sale' :
           apiProduct.rating >= 4.8 ? 'bestseller' : null,
    featured: apiProduct.rating >= 4.5,
  };
}

// ── API FUNCTIONS ─────────────────────────────────────────

// Get all shirts
async function getProducts() {
  const response = await fetch(`${BASE_URL}/products/category/mens-shirts`);

  // Check if response was successful
  if (!response.ok) {
    // response.ok is false when status is 400, 500, etc.
    throw new Error(`Failed to load products (Status: ${response.status})`);
    // throw stops execution and sends error to catch block
  }

  const data = await response.json();

  // data.products is the array from the API
  // .map transforms each item to our shape
  return data.products.map(transformProduct);
}

// Get single product by ID
async function getProductById(id) {
  const response = await fetch(`${BASE_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error(`Product not found (Status: ${response.status})`);
  }

  const data = await response.json();
  return transformProduct(data);
}

// Search products
async function searchProducts(query) {
  const response = await fetch(
    `${BASE_URL}/products/search?q=${query}`
  );

  if (!response.ok) {
    throw new Error('Search failed');
  }

  const data = await response.json();
  return data.products.map(transformProduct);
}

// Export all functions so components can use them
export { getProducts, getProductById, searchProducts };