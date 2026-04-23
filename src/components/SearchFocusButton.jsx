// src/components/SearchFocusButton.jsx
// Completely rewritten — now a real search modal trigger

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchProducts } from '../services/productService';

function SearchFocusButton() {

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const inputRef = useRef(null);        // focus input when modal opens
  const modalRef = useRef(null);        // detect clicks outside modal
  const navigate = useNavigate();

  // ── Auto-focus input when modal opens ────────────
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  // Runs whenever isOpen changes


  // ── Close modal on Escape key ─────────────────────
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        handleClose();
      }
    }

    if (isOpen) {
      // Add listener when modal is open
      document.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup — remove listener when modal closes
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);


  // ── Search with debounce ──────────────────────────
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const data = await searchProducts(query);
        // Only show first 5 results in the modal
        setResults(data.slice(0, 5));
      } catch (err) {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);


  // ── Handlers ─────────────────────────────────────
  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  }

  function handleProductClick(productId) {
    handleClose();
    navigate(`/products/${productId}`);
  }

  function handleViewAll() {
    handleClose();
    navigate(`/products`);
  }

  // Format price simply
  function formatPrice(price) {
    return `PKR ${price.toLocaleString()}`;
  }

  return (
    <>
      {/* The search icon button in the header */}
      <button
        onClick={handleOpen}
        style={styles.searchIconBtn}
        title="Search products"
      >
        🔍
      </button>

      {/* Modal Overlay — only renders when isOpen is true */}
      {isOpen && (
        <>
          {/* Dark backdrop behind the modal */}
          <div
            style={styles.backdrop}
            onClick={handleClose}
            // Clicking backdrop closes modal
          />

          {/* The actual modal */}
          <div style={styles.modal} ref={modalRef}>

            {/* Search Input Row */}
            <div style={styles.searchRow}>
              <span style={styles.searchIcon}>🔍</span>

              <input
                ref={inputRef}
                type="text"
                placeholder="Search shirts, styles, collections..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={styles.input}
              />

              {/* Clear input button */}
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  style={styles.clearInputBtn}
                >
                  ✕
                </button>
              )}

              {/* Close modal button */}
              <button
                onClick={handleClose}
                style={styles.closeBtn}
              >
                ESC
              </button>
            </div>

            {/* Results Area */}
            <div style={styles.results}>

              {/* No query yet — show hints */}
              {!query && (
                <div style={styles.hints}>
                  <p style={styles.hintsTitle}>Popular Searches</p>
                  <div style={styles.hintTags}>
                    {['Oxford', 'Linen', 'Formal', 'Slim Fit', 'White'].map(hint => (
                      <button
                        key={hint}
                        onClick={() => setQuery(hint)}
                        style={styles.hintTag}
                      >
                        {hint}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Searching indicator */}
              {query && isSearching && (
                <div style={styles.searching}>
                  <p style={styles.searchingText}>Searching...</p>
                </div>
              )}

              {/* No results */}
              {query && !isSearching && results.length === 0 && (
                <div style={styles.noResults}>
                  <p style={styles.noResultsText}>
                    No results for <strong>"{query}"</strong>
                  </p>
                  <p style={styles.noResultsHint}>
                    Try different keywords
                  </p>
                </div>
              )}

              {/* Results list */}
              {results.length > 0 && (
                <div>
                  <p style={styles.resultsLabel}>
                    {results.length} results for "{query}"
                  </p>

                  {results.map(product => (
                    <div
                      key={product.id}
                      style={styles.resultItem}
                      onClick={() => handleProductClick(product.id)}
                    >
                      {/* Product image thumbnail */}
                      <img
                        src={product.image}
                        alt={product.name}
                        style={styles.resultImage}
                        onError={e => {
                          e.target.src = 'https://via.placeholder.com/50x60';
                        }}
                      />

                      {/* Product info */}
                      <div style={styles.resultInfo}>
                        <p style={styles.resultName}>{product.name}</p>
                        <p style={styles.resultCategory}>
                          {product.category}
                        </p>
                      </div>

                      {/* Price */}
                      <p style={styles.resultPrice}>
                        {formatPrice(product.price)}
                      </p>

                      {/* Arrow */}
                      <span style={styles.resultArrow}>→</span>

                    </div>
                  ))}

                  {/* View all results button */}
                  <button
                    onClick={handleViewAll}
                    style={styles.viewAllBtn}
                  >
                    View all results for "{query}" →
                  </button>

                </div>
              )}

            </div>

          </div>
        </>
      )}
    </>
  );
}

// CSS animation for modal
const modalCSS = `
  @keyframes modalSlideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Inject animation CSS
function SearchFocusButtonWithStyle() {
  return (
    <>
      <style>{modalCSS}</style>
      <SearchFocusButton />
    </>
  );
}

const styles = {
  searchIconBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.1rem',
    cursor: 'pointer',
    padding: '6px 8px',
    color: '#ffffff',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 200,
    backdropFilter: 'blur(2px)',
  },
  modal: {
    position: 'fixed',
    top: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    maxWidth: '600px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    zIndex: 201,
    overflow: 'hidden',
    animation: 'modalSlideDown 0.2s ease',
  },
  searchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    borderBottom: '1px solid #f0f0f0',
  },
  searchIcon: {
    fontSize: '1.1rem',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    color: '#1a1a1a',
    backgroundColor: 'transparent',
  },
  clearInputBtn: {
    background: 'none',
    border: 'none',
    color: '#aaa',
    fontSize: '0.85rem',
    cursor: 'pointer',
    padding: '4px',
    flexShrink: 0,
  },
  closeBtn: {
    background: 'none',
    border: '1px solid #e0e0e0',
    color: '#888',
    fontSize: '0.7rem',
    padding: '4px 8px',
    cursor: 'pointer',
    borderRadius: '4px',
    flexShrink: 0,
    letterSpacing: '1px',
  },
  results: {
    maxHeight: '400px',
    overflowY: 'auto',
  },
  hints: {
    padding: '20px',
  },
  hintsTitle: {
    fontSize: '0.75rem',
    color: '#aaa',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },
  hintTags: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  hintTag: {
    padding: '6px 14px',
    backgroundColor: '#f5f5f5',
    border: 'none',
    borderRadius: '20px',
    fontSize: '0.85rem',
    color: '#555',
    cursor: 'pointer',
  },
  searching: {
    padding: '32px 20px',
    textAlign: 'center',
  },
  searchingText: {
    color: '#888',
    fontSize: '0.9rem',
  },
  noResults: {
    padding: '32px 20px',
    textAlign: 'center',
  },
  noResultsText: {
    color: '#555',
    fontSize: '0.95rem',
    marginBottom: '8px',
  },
  noResultsHint: {
    color: '#aaa',
    fontSize: '0.85rem',
  },
  resultsLabel: {
    fontSize: '0.75rem',
    color: '#aaa',
    padding: '12px 20px 8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  resultItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
    borderTop: '1px solid #f8f8f8',
  },
  resultImage: {
    width: '44px',
    height: '52px',
    objectFit: 'cover',
    borderRadius: '2px',
    flexShrink: 0,
    backgroundColor: '#f5f5f5',
  },
  resultInfo: {
    flex: 1,
    minWidth: 0,
  },
  resultName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  resultCategory: {
    fontSize: '0.75rem',
    color: '#aaa',
    textTransform: 'capitalize',
  },
  resultPrice: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#1a1a1a',
    flexShrink: 0,
  },
  resultArrow: {
    color: '#ccc',
    fontSize: '0.9rem',
    flexShrink: 0,
  },
  viewAllBtn: {
    width: '100%',
    padding: '14px 20px',
    backgroundColor: '#fafafa',
    border: 'none',
    borderTop: '1px solid #f0f0f0',
    color: '#555',
    fontSize: '0.85rem',
    cursor: 'pointer',
    textAlign: 'left',
    fontWeight: '600',
  },
};

export default SearchFocusButtonWithStyle;