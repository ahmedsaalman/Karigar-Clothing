// src/components/ProductCard.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWishlistContext } from '../context/WishlistContext';
import Badge from './Badge';
import PriceDisplay from './PriceDisplay';
import LazyImage from './LazyImage';
import { memo } from 'react';

function ProductCard({ product, animDelay = 0 }) {
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
  const [isHovered, setIsHovered] = useState(false);

  const wishlisted = isWishlisted(id);

  function handleWishlistToggle(e) {
    e.stopPropagation();
    const added = toggleWishlist(product);
    showSuccess(added ? `${name} added to wishlist!` : `${name} removed from wishlist`);
  }

  function handleAddToCart(e) {
    e.stopPropagation();
    if (!inStock) return;
    if (!selectedSize) {
      showError('Please select a size first');
      return;
    }
    addToCart(product, selectedSize);
    showSuccess(`${name} (${selectedSize}) added to cart!`);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  }

  function renderStars(r) {
    const full = Math.floor(r);
    const half = r % 1 >= 0.5;
    return (
      <span className="pc-stars">
        {'★'.repeat(full)}
        {half ? '½' : ''}
        {'☆'.repeat(5 - full - (half ? 1 : 0))}
      </span>
    );
  }

  return (
    <>
      <style>{productCardCSS}</style>
      <article
        className={`pc ${!inStock ? 'pc--oos' : ''} ${isHovered ? 'pc--hovered' : ''}`}
        style={{ animationDelay: `${animDelay}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate(`/products/${id}`)}
      >
        {/* Image */}
        <div className="pc__img-wrap">
          <LazyImage
            src={image}
            alt={name}
            className="pc__img"
            onError={e => { e.target.src = 'https://via.placeholder.com/400x500?text=Karigar'; }}
          />

          {/* Overlays */}
          {badge && (
            <div className="pc__badge">
              <Badge type={badge} />
            </div>
          )}

          {!inStock && (
            <div className="pc__oos-overlay">
              <span className="pc__oos-label">Out of Stock</span>
            </div>
          )}

          {/* Wishlist */}
          <button
            className={`pc__wish-btn ${wishlisted ? 'pc__wish-btn--active' : ''}`}
            onClick={handleWishlistToggle}
            title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          {/* Quick view overlay */}
          <div className="pc__quick-view" onClick={e => { e.stopPropagation(); navigate(`/products/${id}`); }}>
            <span>View Details</span>
          </div>
        </div>

        {/* Content */}
        <div className="pc__body" onClick={e => e.stopPropagation()}>

          <div className="pc__meta">
            <h3 className="pc__name" onClick={() => navigate(`/products/${id}`)}>{name}</h3>
            <div className="pc__rating">
              {renderStars(rating)}
              <span className="pc__rev-count">({reviewCount})</span>
            </div>
          </div>

          {/* Colors */}
          <div className="pc__colors">
            {colors.map((color, i) => (
              <div
                key={i}
                className="pc__swatch"
                style={{
                  backgroundColor: color,
                  border: (color === 'white' || color === '#ffffff') ? '1px solid #3a3a3a' : '1px solid transparent',
                }}
                title={colorNames[i]}
              />
            ))}
          </div>

          {/* Size selector */}
          <div className="pc__sizes-wrap">
            <p className="pc__size-label">
              Size:{' '}
              {selectedSize
                ? <strong style={{ color: '#f5efe6' }}>{selectedSize}</strong>
                : <em style={{ color: '#e05c5c', fontStyle: 'normal', fontSize: '0.75rem' }}>Select one</em>
              }
            </p>
            <div className="pc__sizes">
              {sizes.map(size => (
                <button
                  key={size}
                  className={`pc__size-btn ${selectedSize === size ? 'pc__size-btn--active' : ''}`}
                  onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <PriceDisplay price={price} originalPrice={originalPrice} />

          {/* Actions */}
          <div className="pc__actions">
            <button
              className="pc__details-btn"
              onClick={() => navigate(`/products/${id}`)}
            >
              Details
            </button>
            <button
              className={`pc__cart-btn ${addedToCart ? 'pc__cart-btn--success' : ''} ${!inStock ? 'pc__cart-btn--disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              {!inStock ? 'Out of Stock' : addedToCart ? '✓ Added!' : 'Add to Cart'}
            </button>
          </div>

        </div>
      </article>
    </>
  );
}

const productCardCSS = `
  .pc {
    background: #141414;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1),
                box-shadow 0.35s cubic-bezier(0.4,0,0.2,1),
                border-color 0.35s ease;
    animation: staggerFadeUp 0.5s ease both;
    position: relative;
  }
  .pc:hover, .pc--hovered {
    transform: translateY(-6px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.15);
    border-color: rgba(201,168,76,0.2);
  }
  .pc--oos { opacity: 0.68; }
  .pc--oos:hover { opacity: 0.9; }

  /* Image */
  .pc__img-wrap {
    position: relative;
    padding-bottom: 125%;
    overflow: hidden;
    background: #1a1a1a;
  }
  .pc__img {
    position: absolute !important;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.55s cubic-bezier(0.4,0,0.2,1);
  }
  .pc:hover .pc__img { transform: scale(1.06); }

  .pc__badge {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 3;
  }

  /* Out of stock */
  .pc__oos-overlay {
    position: absolute;
    inset: 0;
    background: rgba(10,10,10,0.65);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    backdrop-filter: blur(2px);
  }
  .pc__oos-label {
    font-size: 0.7rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #b0a090;
    background: rgba(20,20,20,0.9);
    padding: 8px 20px;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 2px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
  }

  /* Wishlist */
  .pc__wish-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(20,20,20,0.85);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b6055;
    z-index: 4;
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.25s ease;
  }
  .pc:hover .pc__wish-btn {
    opacity: 1;
    transform: scale(1);
  }
  .pc__wish-btn--active {
    opacity: 1 !important;
    transform: scale(1) !important;
    color: #e87b7b !important;
    background: rgba(224,92,92,0.12) !important;
    border-color: rgba(224,92,92,0.3) !important;
    animation: heartBeat 0.5s ease;
  }
  .pc__wish-btn:hover {
    color: #e87b7b;
    background: rgba(224,92,92,0.1);
    border-color: rgba(224,92,92,0.25);
    transform: scale(1.1) !important;
  }

  /* Quick view */
  .pc__quick-view {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(201,168,76,0.9);
    backdrop-filter: blur(4px);
    padding: 12px;
    text-align: center;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    z-index: 3;
  }
  .pc__quick-view span {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #0a0a0a;
    font-family: 'Inter', sans-serif;
  }
  .pc:hover .pc__quick-view { transform: translateY(0); }

  /* Body */
  .pc__body {
    padding: 18px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
  }
  .pc__meta { display: flex; flex-direction: column; gap: 6px; }
  .pc__name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1rem;
    font-weight: 600;
    color: #f5efe6;
    line-height: 1.3;
    transition: color 0.2s ease;
  }
  .pc__name:hover { color: #c9a84c; }
  .pc__rating { display: flex; align-items: center; gap: 6px; }
  .pc-stars { color: #c9a84c; font-size: 0.78rem; letter-spacing: 1px; }
  .pc__rev-count { color: #4a3f35; font-size: 0.74rem; }

  /* Colors */
  .pc__colors { display: flex; gap: 6px; align-items: center; }
  .pc__swatch {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.15s ease;
  }
  .pc__swatch:hover { transform: scale(1.25); }

  /* Sizes */
  .pc__sizes-wrap { display: flex; flex-direction: column; gap: 8px; }
  .pc__size-label {
    font-size: 0.74rem;
    color: #4a3f35;
    font-family: 'Inter', sans-serif;
  }
  .pc__sizes { display: flex; gap: 6px; flex-wrap: wrap; }
  .pc__size-btn {
    min-width: 36px;
    padding: 5px 10px;
    font-size: 0.7rem;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    color: #6b6055;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.18s ease;
  }
  .pc__size-btn:hover {
    color: #c9a84c;
    border-color: rgba(201,168,76,0.4);
    background: rgba(201,168,76,0.06);
  }
  .pc__size-btn--active {
    background: #c9a84c !important;
    color: #0a0a0a !important;
    border-color: #c9a84c !important;
    font-weight: 700 !important;
  }

  /* Actions */
  .pc__actions {
    display: flex;
    gap: 8px;
    margin-top: auto;
  }
  .pc__details-btn {
    flex: 1;
    padding: 11px 8px;
    background: transparent;
    color: #b0a090;
    border: 1px solid rgba(255,255,255,0.1);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-family: 'Inter', sans-serif;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
  .pc__details-btn:hover {
    color: #f5efe6;
    border-color: rgba(255,255,255,0.25);
    background: rgba(255,255,255,0.04);
  }
  .pc__cart-btn {
    flex: 2;
    padding: 11px 12px;
    background: #c9a84c;
    color: #0a0a0a;
    border: none;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-family: 'Inter', sans-serif;
    border-radius: 4px;
    transition: all 0.25s ease;
  }
  .pc__cart-btn:hover:not(.pc__cart-btn--disabled) {
    background: #e0c06e;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(201,168,76,0.3);
  }
  .pc__cart-btn--success {
    background: #4caf7d !important;
    color: #fff !important;
    animation: successPop 0.35s ease;
  }
  .pc__cart-btn--disabled {
    background: #2a2a2a !important;
    color: #4a3f35 !important;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

export default memo(ProductCard, (prev, next) => prev.product.id === next.product.id);