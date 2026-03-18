// src/components/ProductCard.jsx

import Badge from './Badge';
import PriceDisplay from './PriceDisplay';

function ProductCard({ product }) {
  // Destructure from product object for cleaner code
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

  // Generate star display from rating number
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    
    return (
      <span style={styles.stars}>
        {'★'.repeat(fullStars)}
        {hasHalf && '½'}
        {'☆'.repeat(5 - fullStars - (hasHalf ? 1 : 0))}
      </span>
    );
  };

  return (
    <article style={{
      ...styles.card,
      // Dimmed appearance for out of stock items
      opacity: inStock ? 1 : 0.7,
    }}>

      {/* ── IMAGE SECTION ── */}
      <div style={styles.imageContainer}>
        
        <img
          src={image}
          alt={name}
          style={styles.image}
          // Graceful fallback if image fails to load
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Karigar+Co.';
          }}
        />

        {/* Badge overlaid on image */}
        <div style={styles.badgePosition}>
          <Badge type={badge} />
        </div>

        {/* Out of stock overlay */}
        {!inStock && (
          <div style={styles.outOfStockOverlay}>
            <span style={styles.outOfStockText}>Out of Stock</span>
          </div>
        )}

        {/* Quick action buttons - appear on hover via CSS class */}
        <div style={styles.quickActions}>
          <button style={styles.wishlistBtn} title="Add to Wishlist">
            ♡
          </button>
        </div>

      </div>

      {/* ── CONTENT SECTION ── */}
      <div style={styles.content}>

        {/* Product Name */}
        <h3 style={styles.name}>{name}</h3>

        {/* Rating Row */}
        <div style={styles.ratingRow}>
          {renderStars(rating)}
          <span style={styles.reviewCount}>({reviewCount})</span>
        </div>

        {/* Color Swatches */}
        <div style={styles.colorsRow}>
          {colors.map((color, index) => (
            <div
              key={index}
              style={{
                ...styles.colorSwatch,
                backgroundColor: color,
                // White needs a border to be visible
                border: color === 'white' || color === '#ffffff'
                  ? '1px solid #ddd'
                  : '1px solid transparent',
              }}
              title={colorNames[index]}
            />
          ))}
        </div>

        {/* Available Sizes */}
        <div style={styles.sizesRow}>
          {sizes.map((size) => (
            <span key={size} style={styles.sizeTag}>
              {size}
            </span>
          ))}
        </div>

        {/* Price */}
        <PriceDisplay price={price} originalPrice={originalPrice} />

        {/* Add to Cart Button */}
        <button
          style={{
            ...styles.cartBtn,
            ...(inStock ? styles.cartBtnActive : styles.cartBtnDisabled),
          }}
          disabled={!inStock}
        >
          {inStock ? 'Add to Cart' : 'Out of Stock'}
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
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  imageContainer: {
    position: 'relative',
    paddingBottom: '120%',  // creates 5:6 aspect ratio
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
    transition: 'transform 0.3s ease',
  },
  badgePosition: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    zIndex: 2,
  },
  outOfStockOverlay: {
    position: 'absolute',
    inset: 0,                    // shorthand for top/right/bottom/left: 0
    backgroundColor: 'rgba(255,255,255,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  outOfStockText: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    padding: '8px 16px',
    fontSize: '0.8rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  quickActions: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    zIndex: 2,
  },
  wishlistBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    cursor: 'pointer',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1,                    // takes remaining space
  },
  name: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: '0.5px',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  stars: {
    color: '#d4af37',
    fontSize: '0.9rem',
    letterSpacing: '1px',
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
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  sizesRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  sizeTag: {
    fontSize: '0.7rem',
    padding: '2px 8px',
    border: '1px solid #ddd',
    color: '#555',
    letterSpacing: '0.5px',
  },
  cartBtn: {
    width: '100%',
    padding: '12px',
    border: 'none',
    fontSize: '0.8rem',
    fontWeight: '700',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    marginTop: 'auto',         // pushes button to bottom of card
    transition: 'background-color 0.2s',
  },
  cartBtnActive: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
  },
  cartBtnDisabled: {
    backgroundColor: '#f0f0f0',
    color: '#999',
    cursor: 'not-allowed',
  },
};

export default ProductCard;