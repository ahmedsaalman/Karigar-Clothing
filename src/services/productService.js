import { getRequest } from './apiClient';

const mapProduct = (product) => ({
  ...product,
  id: product._id,
  image: product.thumbnail,
});

// ── Get all products ──────────────────────────────────────────
// Supports optional filters: { category, search, featured, sort }
async function getProducts(filters = {}) {
  const params = new URLSearchParams();

  if (filters.category) params.set('category', filters.category);
  if (filters.search) params.set('search', filters.search);
  if (filters.featured) params.set('featured', 'true');
  if (filters.sort) params.set('sort', filters.sort);

  const query = params.toString();
  const data = await getRequest(`/products${query ? `?${query}` : ''}`);
  return data.products.map(mapProduct);
}

// ── Get single product by ID or slug ─────────────────────────
async function getProductById(id) {
  const data = await getRequest(`/products/${id}`);
  return mapProduct(data.product);
}

// ── Search products ───────────────────────────────────────────
async function searchProducts(query) {
  return getProducts({ search: query });
}

export { getProducts, getProductById, searchProducts };