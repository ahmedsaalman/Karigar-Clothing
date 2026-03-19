// src/components/ProductCard.jsx

import { useState } from 'react';
import Badge from './Badge';
import PriceDisplay from './PriceDisplay';

function ProductCard({ product, onAddToCart }) {
  // onAddToCart is a function passed from parent
  // when called, it updates the cart count in App

  const {
    name,
    price,
    originalPrice,
    image,
    badge,
    inStock,
    rating,
    reviewCount,
    sizes,
    colors,
    colorNames,
  } = product;

  // ── LOCAL STATE ──────────────────────────────────
  // Each card has its OWN independent state
  // Liking card 1 doesn't affect card 2

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  // ── EVENT HANDLERS ───────────────────────────────

  function handleWishlistToggle() {
    setIsWishlisted(!isWishlisted);
    // ! flips the boolean: false→true, true→false
  }

  function handleSizeSelect(size) {
    // If clicking already selected size, deselect it
    if (selectedSize === size) {
      setSelectedSize(null);
    } else {
      setSelectedSize(size);
    }
  }

  function handleAddToCart() {
    if (!inStock) return;          // guard clause
    if (!selectedSize) {
      alert('Please select a size first');
      return;
    }

    // Tell parent component an item was added
    // Parent will update the global cart count
    if (onAddToCart) {
      onAddToCart(product, selectedSize);
    }

    // Show "Added!" feedback for 2 seconds
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  // ── HELPERS ──────────────────────────────────────

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

  // ── RENDER ───────────────────────────────────────

  return (
    <article style={{ ...styles.card, opacity: inStock ? 1 : 0.7 }}>

      {/* IMAGE SECTION */}
      <div style={styles.imageContainer}>

        <img
          src={image}
          alt={name}
          style={styles.image}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Karigar+Co.';
          }}
        />

        {/* Badge */}
        <div style={styles.badgePosition}>
          <Badge type={badge} />
        </div>

        {/* Out of stock overlay */}
        {!inStock && (
          <div style={styles.outOfStockOverlay}>
            <span style={styles.outOfStockText}>Out of Stock</span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          style={styles.wishlistBtn}
          onClick={handleWishlistToggle}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          {/* Heart changes based on isWishlisted state */}
          <span style={{
            color: isWishlisted ? '#e74c3c' : '#999',
            fontSize: '1.2rem',
            transition: 'color 0.2s',
          }}>
            {isWishlisted ? '♥' : '♡'}
          </span>
        </button>

      </div>

      {/* CONTENT SECTION */}
      <div style={styles.content}>

        <h3 style={styles.name}>{name}</h3>

        {/* Rating */}
        <div style={styles.ratingRow}>
          {renderStars(rating)}
          <span style={styles.reviewCount}>({reviewCount})</span>
        </div>

        {/* Color swatches */}
        <div style={styles.colorsRow}>
          <span style={styles.colorsLabel}>Colors:</span>
          {colors.map((color, index) => (
            <div
              key={index}
              style={{
                ...styles.colorSwatch,
                backgroundColor: color,
                border: color === 'white' || color === '#ffffff'
                  ? '1px solid #ddd'
                  : '1px solid transparent',
              }}
              title={colorNames[index]}
            />
          ))}
        </div>

        {/* Size Selector — interactive */}
        <div>
          <p style={styles.sizeLabel}>
            Size:
            {selectedSize
              ? <span style={styles.selectedSizeText}> {selectedSize}</span>
              : <span style={styles.noSizeText}> Select one</span>
            }
          </p>
          <div style={styles.sizesRow}>
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => handleSizeSelect(size)}
                style={{
                  ...styles.sizeBtn,
                  // Dynamic styles based on whether this size is selected
                  backgroundColor: selectedSize === size
                    ? '#1a1a1a'
                    : '#ffffff',
                  color: selectedSize === size
                    ? '#ffffff'
                    : '#555',
                  borderColor: selectedSize === size
                    ? '#1a1a1a'
                    : '#ddd',
                  fontWeight: selectedSize === size ? '700' : '400',
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <PriceDisplay price={price} originalPrice={originalPrice} />

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          style={{
            ...styles.cartBtn,
            // Three visual states: added, active, disabled
            backgroundColor: addedToCart
              ? '#27ae60'
              : inStock ? '#1a1a1a' : '#f0f0f0',
            color: inStock ? '#ffffff' : '#999',
            cursor: inStock ? 'pointer' : 'not-allowed',
          }}
        >
          {/* Button text changes based on state */}
          {!inStock
            ? 'Out of Stock'
            : addedToCart
              ? '✓ Added to Cart!'
              : 'Add to Cart'
          }
        </button>

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
    transition: 'transform 0.2s, box-shadow 0.2s',
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
    zIndex: 2,
  },
  content: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
  },
  name: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  stars: {
    color: '#d4af37',
    fontSize: '0.85rem',
  },
  reviewCount: {
    color: '#888',
    fontSize: '0.8rem',
  },
  colorsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  colorsLabel: {
    fontSize: '0.75rem',
    color: '#888',
    marginRight: '4px',
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
  selectedSizeText: {
    color: '#1a1a1a',
    fontWeight: '700',
  },
  noSizeText: {
    color: '#e74c3c',
    fontStyle: 'italic',
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
  cartBtn: {
    width: '100%',
    padding: '12px',
    border: 'none',
    fontSize: '0.8rem',
    fontWeight: '700',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    transition: 'background-color 0.3s',
    borderRadius: '2px',
    marginTop: 'auto',
  },
};

export default ProductCard;