// src/pages/ProductsPage.jsx
// Updated with useRef for focus and previous query tracking

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SectionTitle from '../components/SectionTitle';
import { getProducts, searchProducts } from '../services/productService';

function ProductsPage() {

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [filterCategory, setFilterCategory] = useState('all');

  // ── useRef USE CASE 1: DOM Reference ──────────────
  // searchInputRef.current will point to the actual <input> element
  const searchInputRef = useRef(null);

  // ── useRef USE CASE 2: Persisting Value ───────────
  // Track how many times search has run
  // We don't want this to trigger re-renders
  const searchCountRef = useRef(0);

  // Track previous search query for comparison
  const prevQueryRef = useRef('');


  // ── Auto-focus search input on page load ──────────
  useEffect(() => {
    // searchInputRef.current IS the actual input DOM element
    // We can call any DOM method on it
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
  // [] = run once on mount


  // ── Load products ─────────────────────────────────
  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);


  // ── Search with debounce ──────────────────────────
  useEffect(() => {
    if (searchQuery === prevQueryRef.current) return;
    prevQueryRef.current = searchQuery;
    // Update ref — does NOT trigger re-render

    if (searchQuery.trim() === '') {
      async function reloadAll() {
        try {
          setIsSearching(true);
          const data = await getProducts();
          setProducts(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsSearching(false);
        }
      }
      reloadAll();
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        searchCountRef.current += 1;  // increment without re-render
        console.log(`Search #${searchCountRef.current}: "${searchQuery}"`);
        const data = await searchProducts(searchQuery);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);


  // ── useMemo: Filter + Sort Products ───────────────
  // This calculation runs on EVERY render without useMemo
  // With useMemo, it only runs when products, filterCategory,
  // or sortBy changes

  const processedProducts = useMemo(() => {

    // Start with all products
    let result = [...products];

    // Step 1: Filter by category
    if (filterCategory !== 'all') {
      result = result.filter(
        product => product.category === filterCategory
      );
    }

    // Step 2: Sort
    switch (sortBy) {
      case 'price-low':
        // sort returns negative/positive/zero to determine order
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order
        break;
    }

    return result;

  }, [products, filterCategory, sortBy]);
  // Only recalculates when these three values change


  // ── useMemo: Get unique categories from products ──
  const categories = useMemo(() => {
    const cats = products.map(p => p.category);
    // Set removes duplicates, Array.from converts back to array
    return ['all', ...Array.from(new Set(cats))];
  }, [products]);
  // Only recalculates when products changes


  // ── useCallback: Clear search ─────────────────────
  // Stable function reference — won't cause child re-renders
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    // After clearing, re-focus the input
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
  // [] = this function never needs to be recreated


  // ── RENDER ────────────────────────────────────────
  return (
    <div style={styles.page}>

      {/* Page Header */}
      <div style={styles.header}>
        <SectionTitle
          title="Our Collection"
          subtitle="Premium shirts crafted for professionals"
        />

        {/* Search Bar — ref attached to input */}
        <div style={styles.searchContainer}>
          <input
            ref={searchInputRef}        // ← useRef attached here
            type="text"
            placeholder="Search shirts... (auto-focused)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}   // stable useCallback function
              style={styles.clearBtn}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter + Sort Controls */}
        <div style={styles.controls}>

          {/* Category Filter */}
          <div style={styles.filterGroup}>
            <span style={styles.controlLabel}>Category:</span>
            <div style={styles.filterButtons}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  style={{
                    ...styles.filterBtn,
                    backgroundColor: filterCategory === cat
                      ? '#1a1a1a' : 'transparent',
                    color: filterCategory === cat
                      ? '#ffffff' : '#555',
                    borderColor: filterCategory === cat
                      ? '#1a1a1a' : '#ddd',
                  }}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div style={styles.filterGroup}>
            <span style={styles.controlLabel}>Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={styles.sortSelect}
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

        </div>

        {/* Results info */}
        <p style={styles.resultsInfo}>
          {isSearching
            ? 'Searching...'
            : `${processedProducts.length} product${processedProducts.length !== 1 ? 's' : ''} found`
          }
          {searchQuery && ` for "${searchQuery}"`}
        </p>

      </div>


      {/* Loading */}
      {isLoading && (
        <LoadingSpinner message="Loading collection..." />
      )}

      {/* Error */}
      {!isLoading && error && (
        <ErrorMessage message={error} />
      )}

      {/* Products */}
      {!isLoading && !error && (
        <>
          {processedProducts.length === 0 ? (
            <div style={styles.noResults}>
              <p style={styles.noResultsText}>
                No products found
                {searchQuery ? ` for "${searchQuery}"` : ''}
              </p>
              <button
                onClick={handleClearSearch}
                style={styles.showAllBtn}
              >
                Show All Products
              </button>
            </div>
          ) : (
            <div style={styles.grid}>
              {processedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 20px',
  },
  header: {
    marginBottom: '48px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  searchContainer: {
    position: 'relative',
    maxWidth: '500px',
    margin: '0 auto',
  },
  searchInput: {
    width: '100%',
    padding: '14px 48px 14px 20px',
    border: '1px solid #ddd',
    fontSize: '0.95rem',
    outline: 'none',
    backgroundColor: '#fafafa',
    boxSizing: 'border-box',
    borderRadius: '2px',
  },
  clearBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    color: '#999',
    cursor: 'pointer',
  },
  controls: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  controlLabel: {
    fontSize: '0.8rem',
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
  },
  filterButtons: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '6px 14px',
    border: '1px solid #ddd',
    fontSize: '0.8rem',
    cursor: 'pointer',
    borderRadius: '20px',
    transition: 'all 0.15s',
    textTransform: 'capitalize',
  },
  sortSelect: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    fontSize: '0.85rem',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    borderRadius: '2px',
    outline: 'none',
  },
  resultsInfo: {
    textAlign: 'center',
    color: '#888',
    fontSize: '0.85rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '24px',
  },
  noResults: {
    textAlign: 'center',
    padding: '80px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  noResultsText: {
    color: '#888',
    fontSize: '1rem',
  },
  showAllBtn: {
    padding: '10px 24px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    fontSize: '0.85rem',
    cursor: 'pointer',
    borderRadius: '2px',
  },
};

export default ProductsPage;