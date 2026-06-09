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
      } catch {
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
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
              <span style={styles.searchIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>

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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
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
                        className="search-hint-tag"
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
                      className="search-result-item"
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
      transform: translateY(-20px) translateX(-50%);
    }
    to {
      opacity: 1;
      transform: translateY(0) translateX(-50%);
    }
  }
  .search-result-item {
    transition: background-color 0.2s ease;
  }
  .search-result-item:hover {
    background-color: var(--color-bg-elevated) !important;
  }
  .search-hint-tag {
    transition: all 0.2s ease;
  }
  .search-hint-tag:hover {
    border-color: var(--color-gold) !important;
    color: var(--color-gold) !important;
    background-color: var(--color-bg-card) !important;
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
    color: 'var(--color-text-primary)',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 200,
    backdropFilter: 'blur(8px)',
  },
  modal: {
    position: 'fixed',
    top: '100px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '94%',
    maxWidth: '600px',
    backgroundColor: 'var(--color-bg-card)',
    borderRadius: '12px',
    border: '1px solid var(--color-border)',
    boxShadow: '0 32px 64px rgba(0,0,0,0.08)',
    zIndex: 201,
    overflow: 'hidden',
    animation: 'modalSlideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  searchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px 24px',
    borderBottom: '1px solid var(--color-border)',
  },
  searchIcon: {
    fontSize: '1.1rem',
    color: 'var(--color-gold)',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '1.1rem',
    color: 'var(--color-text-primary)',
    backgroundColor: 'transparent',
    fontFamily: 'var(--font-body)',
  },
  clearInputBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-muted)',
    fontSize: '0.85rem',
    cursor: 'pointer',
    padding: '4px',
    flexShrink: 0,
  },
  closeBtn: {
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-secondary)',
    fontSize: '0.7rem',
    padding: '6px 10px',
    cursor: 'pointer',
    borderRadius: '4px',
    flexShrink: 0,
    letterSpacing: '1px',
    fontWeight: '800',
  },
  results: {
    maxHeight: '450px',
    overflowY: 'auto',
  },
  hints: {
    padding: '24px',
  },
  hintsTitle: {
    fontSize: '0.7rem',
    color: 'var(--color-text-muted)',
    fontWeight: '800',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '16px',
  },
  hintTags: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  hintTag: {
    padding: '8px 16px',
    backgroundColor: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  searching: {
    padding: '48px 24px',
    textAlign: 'center',
  },
  searchingText: {
    color: 'var(--color-text-muted)',
    fontSize: '0.9rem',
    fontStyle: 'italic',
  },
  noResults: {
    padding: '48px 24px',
    textAlign: 'center',
  },
  noResultsText: {
    color: 'var(--color-text-primary)',
    fontSize: '1rem',
    fontWeight: '700',
    marginBottom: '8px',
  },
  noResultsHint: {
    color: 'var(--color-text-muted)',
    fontSize: '0.85rem',
  },
  resultsLabel: {
    fontSize: '0.7rem',
    color: 'var(--color-text-muted)',
    padding: '16px 24px 8px',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    fontWeight: '800',
  },
  resultItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '16px 24px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    borderTop: '1px solid var(--color-border)',
  },
  resultImage: {
    width: '48px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px',
    flexShrink: 0,
    backgroundColor: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
  },
  resultInfo: {
    flex: 1,
    minWidth: 0,
  },
  resultName: {
    fontSize: '1rem',
    fontWeight: '800',
    color: 'var(--color-text-primary)',
    marginBottom: '2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontFamily: 'var(--font-display)',
  },
  resultCategory: {
    fontSize: '0.75rem',
    color: 'var(--color-text-secondary)',
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  resultPrice: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: 'var(--color-price)',
    flexShrink: 0,
  },
  resultArrow: {
    color: 'var(--color-text-muted)',
    fontSize: '1.1rem',
    flexShrink: 0,
  },
  viewAllBtn: {
    width: '100%',
    padding: '18px 24px',
    backgroundColor: 'var(--color-bg-elevated)',
    border: 'none',
    borderTop: '1px solid var(--color-border)',
    color: 'var(--color-gold)',
    fontSize: '0.85rem',
    cursor: 'pointer',
    textAlign: 'center',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
  },
};

export default SearchFocusButtonWithStyle;