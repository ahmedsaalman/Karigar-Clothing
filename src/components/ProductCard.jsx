// src/components/ProductCard.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWishlistContext } from '../context/WishlistContext';
import Badge from './Badge';
import PriceDisplay from './PriceDisplay';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showSuccess, showError } = useToast();
  const { toggleWishlist, isWishlisted } = useWishlistContext();
  const navigate = useNavigate();

  const {
    id, name, price, originalPrice,
    image, badge, inStock,
    rating, reviewCount,
    sizes, colors, colorNames,
  } = product;

  const [selectedSize, setSelectedSize] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const wishlisted = isWishlisted(id);

  function handleWishlistToggle() {
    const added = toggleWishlist(product);
    if (added) {
      showSuccess(`${name} added to wishlist!`);
    } else {
      showSuccess(`${name} removed from wishlist`);
    }
  }

  function handleAddToCart() {
    if (!inStock) return;
    if (!selectedSize) {
      showError('Please select a size first');
      return;
    }
    addToCart(product, selectedSize);
    showSuccess(`${name} (${selectedSize}) added to cart!`);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <span style={styles.stars}>
        {'★'.repeat(full)}
        {half ? '½' : ''}
        {'☆'.repeat(5 - full - (half ? 1 : 0))}
      </span>
    );
  }

  return (
    <article style={{ ...styles.card, opacity: inStock ? 1 : 0.75 }}>

      <div style={styles.imageContainer}>
        <img
          src={image}
          alt={name}
          style={styles.image}
          onError={e => {
            e.target.src =
              'https://via.placeholder.com/400x300?text=Karigar';
          }}
        />
        <div style={styles.badgePosition}>
          <Badge type={badge} />
        </div>
        {!inStock && (
          <div style={styles.outOfStockOverlay}>
            <span style={styles.outOfStockText}>Out of Stock</span>
          </div>
        )}
        <button
          style={styles.wishlistBtn}
          onClick={handleWishlistToggle}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <span style={{ color: wishlisted ? '#e74c3c' : '#999' }}>
            {wishlisted ? '♥' : '♡'}
          </span>
        </button>
      </div>

      <div style={styles.content}>

        <h3
          style={styles.name}
          onClick={() => navigate(`/products/${id}`)}
        >
          {name}
        </h3>

        <div style={styles.ratingRow}>
          {renderStars(rating)}
          <span style={styles.reviewCount}>({reviewCount})</span>
        </div>

        <div style={styles.colorsRow}>
          {colors.map((color, index) => (
            <div
              key={index}
              style={{
                ...styles.colorSwatch,
                backgroundColor: color,
                border:
                  color === 'white' || color === '#ffffff'
                    ? '1px solid #ddd'
                    : '1px solid transparent',
              }}
              title={colorNames[index]}
            />
          ))}
        </div>

        <div>
          <p style={styles.sizeLabel}>
            Size:
            {selectedSize ? (
              <span style={{ color: '#1a1a1a', fontWeight: '700' }}>
                {' '}{selectedSize}
              </span>
            ) : (
              <span style={{ color: '#e74c3c', fontStyle: 'italic' }}>
                {' '}Select one
              </span>
            )}
          </p>
          <div style={styles.sizesRow}>
            {sizes.map(size => (
              <button
                key={size}
                onClick={() =>
                  setSelectedSize(selectedSize === size ? null : size)
                }
                style={{
                  ...styles.sizeBtn,
                  backgroundColor:
                    selectedSize === size ? '#1a1a1a' : '#ffffff',
                  color: selectedSize === size ? '#ffffff' : '#555',
                  borderColor:
                    selectedSize === size ? '#1a1a1a' : '#ddd',
                  fontWeight: selectedSize === size ? '700' : '400',
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <PriceDisplay price={price} originalPrice={originalPrice} />

        <div style={styles.buttonGroup}>
          <button
            onClick={() => navigate(`/products/${id}`)}
            style={styles.detailsBtn}
          >
            Details
          </button>
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            style={{
              ...styles.cartBtn,
              backgroundColor: addedToCart
                ? '#27ae60'
                : inStock
                ? '#1a1a1a'
                : '#ddd',
              cursor: inStock ? 'pointer' : 'not-allowed',
              flex: 2,
            }}
          >
            {!inStock
              ? 'Out of Stock'
              : addedToCart
              ? '✓ Added!'
              : 'Add to Cart'}
          </button>
        </div>

      </div>
    </article>
  );
}

const styles = {
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
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  badgePosition: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    zIndex: 2,
  },
  outOfStockOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(255,255,255,0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  outOfStockText: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    padding: '8px 20px',
    fontSize: '0.75rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  wishlistBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    zIndex: 2,
  },
  content: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1,
  },
  name: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1a1a1a',
    cursor: 'pointer',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  stars: { color: '#d4af37', fontSize: '0.85rem' },
  reviewCount: { color: '#888', fontSize: '0.8rem' },
  colorsRow: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  colorSwatch: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  sizeLabel: {
    fontSize: '0.8rem',
    color: '#555',
    marginBottom: '8px',
  },
  sizesRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  sizeBtn: {
    padding: '6px 12px',
    border: '1px solid #ddd',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.15s',
    borderRadius: '2px',
    backgroundColor: '#ffffff',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
  },
  detailsBtn: {
    flex: 1,
    padding: '12px 8px',
    backgroundColor: 'transparent',
    color: '#1a1a1a',
    border: '1px solid #1a1a1a',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '1px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    borderRadius: '2px',
  },
  cartBtn: {
    padding: '12px',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    transition: 'background-color 0.3s',
    borderRadius: '2px',
  },
};

export default ProductCard;