// src/pages/ProductPage.jsx — ProductsPage

import { useState, useEffect, useRef, useCallback, useMemo, useTransition } from 'react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SectionTitle from '../components/SectionTitle';
import useFetch from '../hooks/useFetch';
import { getProducts, searchProducts } from '../services/productService';

function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { data: allProducts, isLoading, error, refetch } = useFetch(getProducts);


  useEffect(() => {
    if (!filterQuery.trim()) { setSearchResults(null); return; }
    async function runSearch() {
      try {
        setIsSearching(true);
        const results = await searchProducts(filterQuery);
        setSearchResults(results);
      } catch { setSearchResults([]); }
      finally { setIsSearching(false); }
    }
    runSearch();
  }, [filterQuery]);

  const baseProducts = searchResults !== null ? searchResults : allProducts || [];

  const categories = useMemo(() => {
    if (!allProducts) return ['all'];
    return ['all', ...Array.from(new Set(allProducts.map(p => p.category)))];
  }, [allProducts]);

  const processedProducts = useMemo(() => {
    let result = [...baseProducts];
    if (filterCategory !== 'all') result = result.filter(p => p.category === filterCategory);
    switch (sortBy) {
      case 'price-low':  result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating':     result.sort((a, b) => b.rating - a.rating); break;
      case 'name':       result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return result;
  }, [baseProducts, filterCategory, sortBy]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    startTransition(() => { setFilterQuery(''); setSearchResults(null); });
  }, []);

  return (
    <>
      <style>{productsPageCSS}</style>
      <div className="pp-page">

        {/* Page header */}
        <div className="pp-hero">
          <div className="pp-hero__inner">
            <SectionTitle
              title="Our Collection"
              subtitle="Premium shirts crafted for the discerning professional."
              eyebrow="All Products"
            />
          </div>
        </div>

        {/* Controls bar */}
        <div className="pp-controls-wrap">
          <div className="pp-controls">

            {/* Search */}
            <div className="pp-search">
              <svg className="pp-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search shirts..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  startTransition(() => setFilterQuery(e.target.value));
                }}
                className="pp-search__input"
                aria-label="Search products"
              />
              {searchQuery && (
                <button onClick={handleClearSearch} className="pp-search__clear" aria-label="Clear search">✕</button>
              )}
            </div>

            {/* Category filter */}
            <div className="pp-filter-group">
              <span className="pp-filter-label">Category:</span>
              <div className="pp-filter-pills">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`pp-pill ${filterCategory === cat ? 'pp-pill--active' : ''}`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="pp-filter-group pp-filter-group--right">
              <span className="pp-filter-label">Sort:</span>
              <div className="pp-sort-wrap">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="pp-sort"
                  aria-label="Sort products"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="name">Name: A–Z</option>
                </select>
                <svg className="pp-sort__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>
          </div>

          <p className="pp-results-info">
            {isSearching
              ? 'Searching...'
              : `${processedProducts.length} product${processedProducts.length !== 1 ? 's' : ''} found`}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Product grid */}
        <div className="pp-grid-area">
          {isLoading && <LoadingSpinner message="Loading collection..." />}

          {!isLoading && error && <ErrorMessage message={error} onRetry={refetch} />}

          {!isLoading && !error && (
            processedProducts.length === 0 ? (
              <div className="pp-no-results">
                <div className="pp-no-results__icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <p className="pp-no-results__text">
                  No products found{searchQuery ? ` for "${searchQuery}"` : ''}.
                </p>
                <button onClick={handleClearSearch} className="pp-show-all-btn">
                  Show All Products
                </button>
              </div>
            ) : (
              <div
                className="pp-grid"
                style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 0.2s' }}
              >
                {processedProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} animDelay={i * 50} />
                ))}
              </div>
            )
          )}
        </div>

      </div>
    </>
  );
}

const productsPageCSS = `
  .pp-page {
    min-height: 100vh;
    background: var(--color-bg);
  }

  /* Hero */
  .pp-hero {
    background: linear-gradient(to bottom, var(--color-bg-elevated), var(--color-bg));
    border-bottom: 1px solid var(--color-border);
    padding: 72px 20px 0;
  }
  .pp-hero__inner {
    max-width: var(--container-max);
    margin: 0 auto;
  }

  /* Controls */
  .pp-controls-wrap {
    position: sticky;
    top: 72px;
    z-index: 50;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--color-border);
    padding: 16px 20px;
  }
  .pp-controls {
    max-width: var(--container-max);
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }

  /* Search */
  .pp-search {
    position: relative;
    flex: 1;
    min-width: 200px;
    max-width: 360px;
  }
  .pp-search__icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-muted);
    pointer-events: none;
  }
  .pp-search__input {
    width: 100%;
    padding: 10px 40px 10px 40px;
    background: var(--color-bg-muted);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 0.88rem;
    color: #ffffff;
    font-family: var(--font-body);
    transition: border-color 0.2s ease, background 0.2s ease;
  }
  .pp-search__input:focus {
    border-color: var(--color-gold);
    background: var(--color-bg-elevated);
  }
  .pp-search__input::placeholder { color: var(--color-text-muted); }
  .pp-search__clear {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--color-text-muted);
    font-size: 0.8rem;
    cursor: pointer;
    padding: 4px;
    line-height: 1;
    transition: color 0.15s ease;
  }
  .pp-search__clear:hover { color: var(--color-error); }

  /* Filter group */
  .pp-filter-group {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .pp-filter-group--right { margin-left: auto; }
  .pp-filter-label {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--color-text-muted);
    white-space: nowrap;
    font-family: var(--font-body);
  }
  .pp-filter-pills { display: flex; gap: 6px; flex-wrap: wrap; }
  .pp-pill {
    padding: 6px 14px;
    font-size: 0.73rem;
    font-weight: 600;
    font-family: var(--font-body);
    text-transform: capitalize;
    letter-spacing: 0.5px;
    color: var(--color-text-secondary);
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: 999px;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  .pp-pill:hover {
    color: var(--color-gold);
    border-color: var(--color-gold);
  }
  .pp-pill--active {
    background: var(--color-gold) !important;
    color: #000000 !important;
    border-color: var(--color-gold) !important;
    font-weight: 800 !important;
  }

  /* Sort */
  .pp-sort-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .pp-sort {
    appearance: none;
    -webkit-appearance: none;
    padding: 8px 36px 8px 14px;
    background: var(--color-bg-muted);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 0.82rem;
    color: #ffffff;
    font-family: var(--font-body);
    cursor: pointer;
    transition: border-color 0.2s ease;
  }
  .pp-sort:focus { border-color: var(--color-gold); }
  .pp-sort option { background: #111111; color: #ffffff; }
  .pp-sort__chevron {
    position: absolute;
    right: 12px;
    color: var(--color-text-muted);
    pointer-events: none;
  }

  /* Results info */
  .pp-results-info {
    max-width: var(--container-max);
    margin: 8px auto 0;
    font-size: 0.72rem;
    letter-spacing: 1px;
    color: var(--color-text-muted);
    font-family: var(--font-body);
  }

  /* Grid area */
  .pp-grid-area {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 48px 20px 80px;
  }
  .pp-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }
  @media (min-width: 480px) {
    .pp-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 900px) {
    .pp-grid { grid-template-columns: repeat(3, 1fr); }
  }

  /* No results */
  .pp-no-results {
    text-align: center;
    padding: 100px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .pp-no-results__icon { font-size: 2.5rem; opacity: 0.3; }
  .pp-no-results__text {
    font-size: 0.95rem;
    color: var(--color-text-secondary);
    margin: 0;
    font-family: var(--font-body);
  }
  .pp-show-all-btn {
    padding: 11px 28px;
    background: transparent;
    color: var(--color-gold);
    border: 1px solid var(--color-gold);
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-family: var(--font-body);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .pp-show-all-btn:hover {
    background: var(--color-gold-dim);
    transform: translateY(-2px);
  }

  @media (max-width: 640px) {
    .pp-controls { gap: 12px; }
    .pp-search { max-width: 100%; min-width: 0; width: 100%; }
    .pp-filter-group--right { margin-left: 0; }
  }
`;

export default ProductsPage;