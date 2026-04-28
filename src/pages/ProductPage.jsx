// src/pages/ProductsPage.jsx

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SectionTitle from '../components/SectionTitle';
import useFetch from '../hooks/useFetch';
import useDebounce from '../hooks/useDebounce';
import { getProducts, searchProducts } from '../services/productService';

function ProductsPage() {

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const searchInputRef = useRef(null);
  const debouncedQuery = useDebounce(searchQuery, 500);

  const {
    data: allProducts,
    isLoading,
    error,
    refetch,
  } = useFetch(getProducts);

  // Auto focus search input
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Search effect — uses debouncedQuery from custom hook
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults(null);
      return;
    }

    async function runSearch() {
      try {
        setIsSearching(true);
        const results = await searchProducts(debouncedQuery);
        setSearchResults(results);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }

    runSearch();
  }, [debouncedQuery]);

  const baseProducts = searchResults !== null
    ? searchResults
    : allProducts || [];

  const categories = useMemo(() => {
    if (!allProducts) return ['all'];
    const cats = allProducts.map(p => p.category);
    return ['all', ...Array.from(new Set(cats))];
  }, [allProducts]);

  const processedProducts = useMemo(() => {
    let result = [...baseProducts];

    if (filterCategory !== 'all') {
      result = result.filter(p => p.category === filterCategory);
    }

    switch (sortBy) {
      case 'price-low':
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
        break;
    }

    return result;
  }, [baseProducts, filterCategory, sortBy]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults(null);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <SectionTitle
          title="Our Collection"
          subtitle="Premium shirts crafted for professionals"
        />

        <div style={styles.searchContainer}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search shirts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          {searchQuery && (
            <button onClick={handleClearSearch} style={styles.clearBtn}>
              ✕
            </button>
          )}
        </div>

        <div style={styles.controls}>
          <div style={styles.filterGroup}>
            <span style={styles.controlLabel}>Category:</span>
            <div style={styles.filterButtons}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  style={{
                    ...styles.filterBtn,
                    backgroundColor:
                      filterCategory === cat ? '#1a1a1a' : 'transparent',
                    color: filterCategory === cat ? '#ffffff' : '#555',
                    borderColor:
                      filterCategory === cat ? '#1a1a1a' : '#ddd',
                  }}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.filterGroup}>
            <span style={styles.controlLabel}>Sort:</span>
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

        <p style={styles.resultsInfo}>
          {isSearching
            ? 'Searching...'
            : `${processedProducts.length} product${processedProducts.length !== 1 ? 's' : ''} found`}
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {isLoading && <LoadingSpinner message="Loading collection..." />}

      {!isLoading && error && (
        <ErrorMessage message={error} onRetry={refetch} />
      )}

      {!isLoading && !error && (
        <>
          {processedProducts.length === 0 ? (
            <div style={styles.noResults}>
              <p style={styles.noResultsText}>
                No products found
                {searchQuery ? ` for "${searchQuery}"` : ''}
              </p>
              <button onClick={handleClearSearch} style={styles.showAllBtn}>
                Show All Products
              </button>
            </div>
          ) : (
            <div style={styles.grid}>
              {processedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
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