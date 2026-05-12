// src/services/productService.js

import { getRequest } from './apiClient';
import localProducts from '../data/products';

const mapProduct = (product) => ({
  ...product,
  id: product._id ?? product.id,
  image: product.thumbnail ?? product.image,
});

// ── Get all products ──────────────────────────────────────────
// Supports optional filters: { category, search, featured, sort }
async function getProducts(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.search)   params.set('search',   filters.search);
    if (filters.featured) params.set('featured',  'true');
    if (filters.sort)     params.set('sort',       filters.sort);

    const query = params.toString();
    const data  = await getRequest(`/products${query ? `?${query}` : ''}`);
    return data.products.map(mapProduct);
  } catch {
    // Backend unavailable — fall back to local dummy data
    let result = localProducts.map(mapProduct);

    if (filters.category) result = result.filter(p => p.category === filters.category);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }
    if (filters.featured) result = result.filter(p => p.featured);

    return result;
  }
}

// ── Get single product by ID or slug ─────────────────────────
async function getProductById(id) {
  try {
    const data = await getRequest(`/products/${id}`);
    return mapProduct(data.product);
  } catch {
    // Fall back to local data
    const product = localProducts.find(
      p => String(p.id) === String(id) || p.slug === id
    );
    if (!product) throw new Error('Product not found');
    return mapProduct(product);
  }
}

// ── Search products ───────────────────────────────────────────
async function searchProducts(query) {
  return getProducts({ search: query });
}

export { getProducts, getProductById, searchProducts };