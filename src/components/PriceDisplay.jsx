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
    <>
      <style>{priceCSS}</style>
      <div className="price-container">
        <span className="price-current">{formattedPrice}</span>
        {hasDiscount && (
          <>
            <span className="price-original">{formattedOriginal}</span>
            <span className="price-badge">-{discountPercent}% OFF</span>
          </>
        )}
      </div>
    </>
  );
}

const priceCSS = `
  .price-container {
    display: flex;
    align-items: baseline;
    gap: 12px;
    flex-wrap: wrap;
  }
  .price-current {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--color-price);
    font-family: var(--font-display);
    letter-spacing: -0.5px;
  }
  .price-original {
    font-size: 0.9rem;
    color: var(--color-text-muted);
    text-decoration: line-through;
    font-weight: 500;
  }
  .price-badge {
    font-size: 0.7rem;
    font-weight: 900;
    color: #000000;
    background: var(--color-gold);
    padding: 4px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

export default PriceDisplay;