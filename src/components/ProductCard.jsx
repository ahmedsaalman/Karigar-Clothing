// src/components/ProductCard.jsx
// Add the "View Details" button that navigates to product page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from './Badge';
import PriceDisplay from './PriceDisplay';

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  const {
    id,
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

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  function handleWishlistToggle() {
    setIsWishlisted(!isWishlisted);
  }

  function handleSizeSelect(size) {
    setSelectedSize(selectedSize === size ? null : size);
  }

  function handleAddToCart() {
    if (!inStock || !selectedSize) {
      if (!selectedSize) alert('Please select a size');
      return;
    }
    if (onAddToCart) onAddToCart(product, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  function handleViewDetails() {
    // Navigate to the product detail page
    navigate(`/products/${id}`);
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

      {/* Image Section */}
      <div style={styles.imageContainer}>
        <img
          src={image}
          alt={name}
          style={styles.image}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Karigar+Co.';
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
        >
          <span style={{ color: isWishlisted ? '#e74c3c' : '#999' }}>
            {isWishlisted ? '♥' : '♡'}
          </span>
        </button>
      </div>

      {/* Content Section */}
      <div style={styles.content}>

        <h3
          style={styles.name}
          onClick={handleViewDetails}
        >
          {name}
        </h3>

        <div style={styles.ratingRow}>
          {renderStars(rating)}
          <span style={styles.reviewCount}>({reviewCount})</span>
        </div>

        {/* Color swatches */}
        <div style={styles.colorsRow}>
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

        {/* Size Selector */}
        <div>
          <p style={styles.sizeLabel}>
            Size:
            {selectedSize
              ? <span style={{ color: '#1a1a1a', fontWeight: '700' }}>
                  {' '}{selectedSize}
                </span>
              : <span style={{ color: '#e74c3c', fontStyle: 'italic' }}>
                  {' '}Select one
                </span>
            }
          </p>
          <div style={styles.sizesRow}>
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => handleSizeSelect(size)}
                style={{
                  ...styles.sizeBtn,
                  backgroundColor: selectedSize === size
                    ? '#1a1a1a' : '#ffffff',
                  color: selectedSize === size ? '#ffffff' : '#555',
                  borderColor: selectedSize === size ? '#1a1a1a' : '#ddd',
                  fontWeight: selectedSize === size ? '700' : '400',
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <PriceDisplay price={price} originalPrice={originalPrice} />

        {/* Two buttons: View Details + Add to Cart */}
        <div style={styles.buttonGroup}>
          <button
            onClick={handleViewDetails}
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
                : inStock ? '#1a1a1a' : '#ddd',
              cursor: inStock ? 'pointer' : 'not-allowed',
              flex: 2,
            }}
          >
            {!inStock
              ? 'Out of Stock'
              : addedToCart
                ? '✓ Added!'
                : 'Add to Cart'
            }
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
    transition: 'box-shadow 0.2s',
  },
  imageContainer: {
    position: 'relative',
    paddingBottom: '120%',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  image: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    objectFit: 'cover',
  },
  badgePosition: {
    position: 'absolute',
    top: '12px', left: '12px',
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
    top: '12px', right: '12px',
    width: '36px', height: '36px',
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
    gap: '6px',
    alignItems: 'center',
  },
  colorSwatch: {
    width: '18px', height: '18px',
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