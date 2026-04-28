// src/pages/WishlistPage.jsx

import { useNavigate } from 'react-router-dom';
import { useWishlistContext } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
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

  function handleSizeSelect(productId, size) {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  }

  function handleMoveToCart(product) {
    const size = selectedSizes[product.id];
    if (!size) {
      alert(`Please select a size for ${product.name}`);
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
        <div style={styles.emptyIcon}>♡</div>
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
                src={product.image}
                alt={product.name}
                style={styles.image}
                onError={e => {
                  e.target.src =
                    'https://via.placeholder.com/300x360?text=Karigar';
                }}
              />
              <button
                onClick={() => handleRemove(product)}
                style={styles.removeBtn}
                title="Remove from wishlist"
              >
                ✕
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
                    ? <strong> {selectedSizes[product.id]}</strong>
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
                            ? '#1a1a1a'
                            : '#ffffff',
                        color:
                          selectedSizes[product.id] === size
                            ? '#ffffff'
                            : '#555',
                        borderColor:
                          selectedSizes[product.id] === size
                            ? '#1a1a1a'
                            : '#ddd',
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
    padding: '60px 20px 100px',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '40px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '4px',
  },
  subtitle: {
    color: '#888',
    fontSize: '0.9rem',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: '#e74c3c',
    fontSize: '0.85rem',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
  },
  imageContainer: {
    position: 'relative',
    paddingBottom: '120%',
    backgroundColor: '#f5f5f5',
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
    top: '10px',
    right: '10px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#ffffff',
    color: '#888',
    fontSize: '0.75rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    zIndex: 2,
  },
  cardContent: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1,
  },
  productName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#1a1a1a',
    cursor: 'pointer',
  },
  price: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  sizeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sizeLabel: {
    fontSize: '0.8rem',
    color: '#555',
  },
  selectPrompt: {
    color: '#e74c3c',
    fontStyle: 'italic',
  },
  sizes: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  sizeBtn: {
    padding: '5px 10px',
    border: '1px solid #ddd',
    fontSize: '0.72rem',
    cursor: 'pointer',
    borderRadius: '2px',
    transition: 'all 0.15s',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
  },
  cartBtn: {
    flex: 2,
    padding: '10px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
    cursor: 'pointer',
    borderRadius: '2px',
    textTransform: 'uppercase',
  },
  viewBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: 'transparent',
    color: '#1a1a1a',
    border: '1px solid #1a1a1a',
    fontSize: '0.75rem',
    fontWeight: '700',
    cursor: 'pointer',
    borderRadius: '2px',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '120px 20px',
    gap: '16px',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '4rem',
    color: '#e0e0e0',
    lineHeight: 1,
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  emptyText: {
    color: '#888',
    fontSize: '0.95rem',
    maxWidth: '300px',
  },
  shopBtn: {
    marginTop: '8px',
    padding: '14px 36px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    borderRadius: '2px',
  },
};

export default WishlistPage;