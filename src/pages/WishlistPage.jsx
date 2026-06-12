// src/pages/WishlistPage.jsx

import { useNavigate } from 'react-router-dom';
import { useWishlistContext } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getAssetUrl } from '../services/apiClient';
import { useState } from 'react';

function WishlistPage() {
  const {
    wishlistItems,
    removeFromWishlist,
    clearWishlist,
  } = useWishlistContext();

  const { addToCart } = useCart();
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const [selectedSizes, setSelectedSizes] = useState({});
  const [sizeErrors, setSizeErrors] = useState({});

  function handleSizeSelect(productId, size) {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
    // Clear any size error for this product when user selects a size
    setSizeErrors(prev => ({ ...prev, [productId]: false }));
  }

  function handleMoveToCart(product) {
    const size = selectedSizes[product.id];
    if (!size) {
      setSizeErrors(prev => ({ ...prev, [product.id]: true }));
      return;
    }
    addToCart(product, size);
    removeFromWishlist(product.id);
    showSuccess(`${product.name} moved to cart!`);
  }

  function handleRemove(product) {
    removeFromWishlist(product.id);
    showSuccess(`${product.name} removed from wishlist`);
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);
  }

  if (wishlistItems.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIconWrap}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.2 }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <h2 style={styles.emptyTitle}>Your wishlist is empty</h2>
        <p style={styles.emptyText}>
          Save items you love and come back to them later.
        </p>
        <button
          onClick={() => navigate('/products')}
          style={styles.shopBtn}
        >
          Browse Collection
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Wishlist</h1>
          <p style={styles.subtitle}>
            {wishlistItems.length} saved item
            {wishlistItems.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={clearWishlist} style={styles.clearBtn}>
          Clear All
        </button>
      </div>

      <div style={styles.grid}>
        {wishlistItems.map(product => (
          <div key={product.id} style={styles.card}>

            <div style={styles.imageContainer}>
              <img
                src={getAssetUrl(product.image)}
                alt={product.name}
                style={styles.image}
                onError={e => {
                  e.target.src =
                    'https://placehold.co/300x360/ffffff/ff5400?text=Aam+Admii';
                }}
              />
              <button
                onClick={() => handleRemove(product)}
                style={styles.removeBtn}
                title="Remove from wishlist"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div style={styles.cardContent}>

              <h3
                style={styles.productName}
                onClick={() => navigate(`/products/${product.id}`)}
              >
                {product.name}
              </h3>

              <p style={styles.price}>{formatPrice(product.price)}</p>

              <div style={styles.sizeSection}>
                <p style={styles.sizeLabel}>
                  Size:
                  {selectedSizes[product.id]
                    ? <strong style={{ color: 'var(--color-gold)' }}> {selectedSizes[product.id]}</strong>
                    : <span style={styles.selectPrompt}> Select</span>
                  }
                </p>
                <div style={styles.sizes}>
                  {product.sizes?.map(size => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(product.id, size)}
                      style={{
                        ...styles.sizeBtn,
                        backgroundColor:
                          selectedSizes[product.id] === size
                            ? 'var(--color-gold)'
                            : 'transparent',
                        color:
                          selectedSizes[product.id] === size
                            ? '#ffffff'
                            : 'var(--color-text-secondary)',
                        borderColor:
                          selectedSizes[product.id] === size
                            ? 'var(--color-gold)'
                            : 'var(--color-border)',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.cardActions}>
                <button
                  onClick={() => handleMoveToCart(product)}
                  style={styles.cartBtn}
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => navigate(`/products/${product.id}`)}
                  style={styles.viewBtn}
                >
                  View
                </button>
              </div>
              {sizeErrors[product.id] && (
                <p style={styles.sizeError}>Please select a size first</p>
              )}

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '100px 24px 140px',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '48px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: 'var(--color-text-primary)',
    marginBottom: '4px',
    fontFamily: 'var(--font-display)',
  },
  subtitle: {
    color: 'var(--color-text-muted)',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-error)',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    opacity: 0.8,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '32px',
  },
  card: {
    backgroundColor: 'var(--color-bg-elevated)',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease',
  },
  imageContainer: {
    position: 'relative',
    paddingBottom: '125%',
    backgroundColor: 'var(--color-bg-elevated)',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  removeBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(8px)',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  cardContent: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flex: 1,
  },
  productName: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: 'var(--color-text-primary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
  },
  price: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: 'var(--color-price)',
  },
  sizeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sizeLabel: {
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  selectPrompt: {
    color: 'var(--color-error)',
    fontStyle: 'italic',
  },
  sizes: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  sizeBtn: {
    minWidth: '40px',
    padding: '6px 12px',
    border: '1px solid var(--color-border)',
    fontSize: '0.75rem',
    fontWeight: '700',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.2s',
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
    marginTop: 'auto',
  },
  sizeError: {
    fontSize: '0.75rem',
    color: 'var(--color-error, #dc2626)',
    fontWeight: '600',
    margin: '0',
    padding: '6px 10px',
    background: 'rgba(220,38,38,0.08)',
    border: '1px solid rgba(220,38,38,0.2)',
    borderRadius: '5px',
    textAlign: 'center',
    animation: 'fadeIn 0.2s ease',
  },
  cartBtn: {
    flex: 2,
    padding: '12px',
    backgroundColor: 'var(--color-gold)',
    color: '#ffffff',
    border: 'none',
    fontSize: '0.75rem',
    fontWeight: '800',
    letterSpacing: '1px',
    cursor: 'pointer',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  viewBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    border: '1px solid var(--color-border)',
    fontSize: '0.75rem',
    fontWeight: '700',
    cursor: 'pointer',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '160px 24px',
    gap: '20px',
    textAlign: 'center',
  },
  emptyIconWrap: {
    marginBottom: '10px',
    color: 'var(--color-gold)',
  },
  emptyTitle: {
    fontSize: '2rem',
    fontWeight: '900',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-display)',
  },
  emptyText: {
    color: 'var(--color-text-muted)',
    fontSize: '1.05rem',
    maxWidth: '350px',
    lineHeight: '1.6',
  },
  shopBtn: {
    marginTop: '12px',
    padding: '16px 44px',
    backgroundColor: 'var(--color-gold)',
    color: '#ffffff',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: '800',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.3s',
  },
};

export default WishlistPage;