// src/components/PriceDisplay.jsx

function PriceDisplay({ price, originalPrice }) {
  const hasDiscount = originalPrice && originalPrice > price;
  
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Format number as Pakistani Rupees
  // Intl.NumberFormat is built into JavaScript — no library needed
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div style={styles.container}>
      
      {/* Current price - always shown */}
      <span style={styles.currentPrice}>
        {formatPrice(price)}
      </span>

      {/* Original price and discount - only shown if discounted */}
      {hasDiscount && (
        <>
          <span style={styles.originalPrice}>
            {formatPrice(originalPrice)}
          </span>
          <span style={styles.discountBadge}>
            -{discountPercent}%
          </span>
        </>
      )}

    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  currentPrice: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  originalPrice: {
    fontSize: '0.9rem',
    color: '#999',
    textDecoration: 'line-through',
  },
  discountBadge: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#e74c3c',
    backgroundColor: '#fde8e8',
    padding: '2px 6px',
    borderRadius: '4px',
  },
};

export default PriceDisplay;