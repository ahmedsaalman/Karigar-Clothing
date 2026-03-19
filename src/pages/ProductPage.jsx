// src/pages/ProductsPage.jsx

import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SectionTitle from '../components/SectionTitle';
import { getProducts, searchProducts } from '../services/productService';

function ProductsPage({ onAddToCart }) {

  // ── STATE ──────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // ── EFFECT 1: Load products on page mount ─────────────
  // The [] means this runs ONCE when component first appears

  useEffect(() => {

    // Define the async function inside the effect
    async function loadProducts() {
      try {
        // try: attempt this code
        setIsLoading(true);    // show spinner
        setError(null);        // clear any previous errors

        const data = await getProducts();
        // await PAUSES here until getProducts() finishes
        // during this pause, React doesn't freeze —
        // user can still interact with other parts of the page

        setProducts(data);     // store the data in state

      } catch (err) {
        // catch: if ANYTHING in try goes wrong, come here
        // err.message is the error text from our throw statement
        setError(err.message);
      } finally {
        // finally: runs whether try succeeded OR catch ran
        // ALWAYS runs — perfect for cleanup
        setIsLoading(false);   // hide spinner either way
      }
    }

    loadProducts();
    // Call the function immediately after defining it

  }, []);
  // [] = run once on mount


  // ── EFFECT 2: Search when query changes ───────────────
  // [searchQuery] = re-run whenever searchQuery changes

  useEffect(() => {

    // If search is empty, reload all products
    if (searchQuery.trim() === '') {
      // trim() removes spaces from start and end
      // '   '.trim() === '' is true

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
      // return exits the effect early
      // the code below won't run
    }

    // Search with the query
    async function runSearch() {
      try {
        setIsSearching(true);
        const data = await searchProducts(searchQuery);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsSearching(false);
      }
    }

    // DEBOUNCE — wait 500ms after user stops typing
    // Without this: searches on every single keystroke
    // With this: searches 500ms after user pauses

    // Set a timer
    const timer = setTimeout(() => {
      runSearch();
    }, 500);

    // CLEANUP FUNCTION
    // This runs if searchQuery changes BEFORE the 500ms is up
    // It cancels the previous timer — only the last one fires
    return () => {
      clearTimeout(timer);
    };

  }, [searchQuery]);
  // Re-run whenever searchQuery changes


  // ── RETRY HANDLER ─────────────────────────────────────
  function handleRetry() {
    // Reset state and trigger reload
    setError(null);
    setProducts([]);
    setIsLoading(true);

    async function reload() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    reload();
  }


  // ── RENDER ────────────────────────────────────────────

  return (
    <div style={styles.page}>

      {/* Page Header */}
      <div style={styles.header}>
        <SectionTitle
          title="Our Collection"
          subtitle="Premium shirts crafted for professionals"
        />

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search shirts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          {/* Show X button only if there's a query */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={styles.clearBtn}
            >
              ✕
            </button>
          )}
        </div>

        {/* Search query feedback */}
        {searchQuery && (
          <p style={styles.searchFeedback}>
            {isSearching
              ? 'Searching...'
              : `${products.length} results for "${searchQuery}"`
            }
          </p>
        )}
      </div>


      {/* ── CONDITIONAL RENDERING ── */}
      {/* Show different UI based on state */}

      {/* Loading state — initial load */}
      {isLoading && (
        <LoadingSpinner message="Loading our collection..." />
      )}

      {/* Error state */}
      {!isLoading && error && (
        <ErrorMessage
          message={error}
          onRetry={handleRetry}
        />
      )}

      {/* Success state — show products */}
      {!isLoading && !error && (
        <>
          {/* Searching indicator */}
          {isSearching && (
            <p style={styles.searchingText}>Searching...</p>
          )}

          {/* No results */}
          {products.length === 0 && !isSearching && (
            <div style={styles.noResults}>
              <p style={styles.noResultsText}>
                No shirts found
                {searchQuery ? ` for "${searchQuery}"` : ''}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={styles.showAllBtn}
                >
                  Show All Products
                </button>
              )}
            </div>
          )}

          {/* Product Grid */}
          {products.length > 0 && (
            <div style={styles.grid}>
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}

          {/* Results count */}
          {products.length > 0 && (
            <p style={styles.count}>
              Showing {products.length} product
              {products.length !== 1 ? 's' : ''}
            </p>
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
    padding: '4px',
  },
  searchFeedback: {
    textAlign: 'center',
    color: '#888',
    fontSize: '0.85rem',
    marginTop: '12px',
  },
  searchingText: {
    textAlign: 'center',
    color: '#888',
    fontSize: '0.9rem',
    padding: '20px',
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
    letterSpacing: '1px',
  },
  count: {
    textAlign: 'center',
    color: '#888',
    fontSize: '0.85rem',
    marginTop: '32px',
  },
};

export default ProductsPage;