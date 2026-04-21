// src/components/PriceDisplay.jsx
// Updated with useMemo for formatted prices

import { useMemo } from 'react';

function PriceDisplay({ price, originalPrice }) {

  // useMemo caches these formatted strings
  // Only recalculates if price or originalPrice changes
  // Small optimization but good practice for formatters

  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);
  }, [price]);

  const formattedOriginal = useMemo(() => {
    if (!originalPrice || originalPrice <= price) return null;
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(originalPrice);
  }, [originalPrice, price]);

  const discountPercent = useMemo(() => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }, [price, originalPrice]);

  const hasDiscount = discountPercent > 0;

  return (
    <div style={styles.container}>
      <span style={styles.currentPrice}>{formattedPrice}</span>
      {hasDiscount && (
        <>
          <span style={styles.originalPrice}>{formattedOriginal}</span>
          <span style={styles.discountBadge}>-{discountPercent}%</span>
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