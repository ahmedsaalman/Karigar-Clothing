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

  const searchInputRef = useRef(null);

  const { data: allProducts, isLoading, error, refetch } = useFetch(getProducts);

  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

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
    if (searchInputRef.current) searchInputRef.current.focus();
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
                ref={searchInputRef}
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
    background: #0a0a0a;
  }

  /* Hero */
  .pp-hero {
    background: linear-gradient(to bottom, #0f0f0f, #0a0a0a);
    border-bottom: 1px solid rgba(255,255,255,0.04);
    padding: 72px 20px 0;
  }
  .pp-hero__inner {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Controls */
  .pp-controls-wrap {
    position: sticky;
    top: 72px;
    z-index: 50;
    background: rgba(10,10,10,0.92);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    padding: 16px 20px;
  }
  .pp-controls {
    max-width: 1200px;
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
    color: #4a3f35;
    pointer-events: none;
  }
  .pp-search__input {
    width: 100%;
    padding: 10px 40px 10px 40px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px;
    font-size: 0.88rem;
    color: #b0a090;
    font-family: 'Inter', sans-serif;
    transition: border-color 0.2s ease, background 0.2s ease;
  }
  .pp-search__input:focus {
    border-color: rgba(201,168,76,0.4);
    background: rgba(201,168,76,0.04);
  }
  .pp-search__input::placeholder { color: #3a3028; }
  .pp-search__clear {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #4a3f35;
    font-size: 0.8rem;
    cursor: pointer;
    padding: 4px;
    line-height: 1;
    transition: color 0.15s ease;
  }
  .pp-search__clear:hover { color: #e87b7b; }

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
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #3a3028;
    white-space: nowrap;
    font-family: 'Inter', sans-serif;
  }
  .pp-filter-pills { display: flex; gap: 6px; flex-wrap: wrap; }
  .pp-pill {
    padding: 6px 14px;
    font-size: 0.73rem;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    text-transform: capitalize;
    letter-spacing: 0.5px;
    color: #4a3f35;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 999px;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  .pp-pill:hover {
    color: #c9a84c;
    border-color: rgba(201,168,76,0.35);
  }
  .pp-pill--active {
    background: rgba(201,168,76,0.12) !important;
    color: #c9a84c !important;
    border-color: rgba(201,168,76,0.4) !important;
    font-weight: 600 !important;
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
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px;
    font-size: 0.82rem;
    color: #b0a090;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: border-color 0.2s ease;
  }
  .pp-sort:focus { border-color: rgba(201,168,76,0.4); }
  .pp-sort option { background: #1a1a1a; color: #b0a090; }
  .pp-sort__chevron {
    position: absolute;
    right: 12px;
    color: #4a3f35;
    pointer-events: none;
  }

  /* Results info */
  .pp-results-info {
    max-width: 1200px;
    margin: 8px auto 0;
    font-size: 0.72rem;
    letter-spacing: 1px;
    color: #3a3028;
    font-family: 'Inter', sans-serif;
  }

  /* Grid area */
  .pp-grid-area {
    max-width: 1200px;
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
    color: #4a3f35;
    margin: 0;
    font-family: 'Inter', sans-serif;
  }
  .pp-show-all-btn {
    padding: 11px 28px;
    background: transparent;
    color: #c9a84c;
    border: 1px solid rgba(201,168,76,0.35);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-family: 'Inter', sans-serif;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .pp-show-all-btn:hover {
    background: rgba(201,168,76,0.08);
    border-color: rgba(201,168,76,0.6);
  }

  @media (max-width: 640px) {
    .pp-controls { gap: 12px; }
    .pp-search { max-width: 100%; min-width: 0; width: 100%; }
    .pp-filter-group--right { margin-left: 0; }
  }
`;

export default ProductsPage;