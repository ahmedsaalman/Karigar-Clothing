// src/components/ProductCard.jsx

import { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWishlistContext } from '../context/WishlistContext';
import Badge from './Badge';
import PriceDisplay from './PriceDisplay';
import LazyImage from './LazyImage';
import { getAssetUrl } from '../services/apiClient';

function ProductCard({ product, animDelay = 0 }) {
  const { addToCart } = useCart();
  const { showSuccess } = useToast();
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
  const [addedConfirm, setAddedConfirm] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const wishlisted = isWishlisted(id);

  function handleWishlistToggle(e) {
    e.stopPropagation();
    const added = toggleWishlist(product);
    showSuccess(added ? `${name} added to wishlist!` : `${name} removed from wishlist`);
  }

  function handleSizeSelect(size) {
    setSelectedSize(selectedSize === size ? null : size);
    setSizeError(false);
  }

  function handleAddToCart(e) {
    e.stopPropagation();
    if (!inStock) return;
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addToCart(product, selectedSize);
    showSuccess(`${name} (${selectedSize}) added to cart!`);
    setAddedToCart(true);
    setAddedConfirm(true);
    setSizeError(false);
    setTimeout(() => setAddedToCart(false), 1500);
    setTimeout(() => setAddedConfirm(false), 2500);
  }

  function renderStars(r) {
    return (
      <div className="pc-stars" style={{ display: 'flex', gap: '2px' }}>
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill={i < Math.floor(r) ? 'var(--color-gold)' : '#e2e8f0'}
            stroke={i < Math.floor(r) ? 'var(--color-gold)' : '#cbd5e1'}
            style={{ flexShrink: 0 }}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        ))}
      </div>
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
            src={getAssetUrl(image)}
            alt={name}
            className="pc__img"
            onError={e => { e.target.src = 'https://placehold.co/400x500/f8f9fa/111111?text=Aam+Admii'; }}
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
                  border: (color === 'white' || color === '#ffffff') ? '1px solid #e2e8f0' : '1px solid transparent',
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
                ? <strong style={{ color: 'var(--color-text-primary)' }}>{selectedSize}</strong>
                : <em style={{ color: sizeError ? '#e05c5c' : 'var(--color-text-muted)', fontStyle: 'normal', fontSize: '0.75rem' }}>Select one</em>
              }
            </p>
            <div className="pc__sizes">
              {sizes.map(size => (
                <button
                  key={size}
                  className={`pc__size-btn ${selectedSize === size ? 'pc__size-btn--active' : ''} ${sizeError && !selectedSize ? 'pc__size-btn--error-hint' : ''}`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeError && (
              <p className="pc__size-error">← Pick a size to add to cart</p>
            )}
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
              {!inStock ? 'Out of Stock' : addedToCart ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Added!
                </div>
              ) : 'Add to Cart'}
            </button>
          </div>
          {addedConfirm && (
            <div className="pc__added-confirm">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {selectedSize} · Added to your cart
            </div>
          )}

        </div>
      </article>
    </>
  );
}

const productCardCSS = `
  .pc {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
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
    box-shadow: 0 16px 40px rgba(0,0,0,0.08), 0 0 0 1px var(--color-gold-glow);
    border-color: var(--color-gold-glow);
  }
  .pc--oos { opacity: 0.68; }
  .pc--oos:hover { opacity: 0.9; }

  /* Image */
  .pc__img-wrap {
    position: relative;
    padding-bottom: 125%;
    overflow: hidden;
    background: #f9f9f9;
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
    background: rgba(255,255,255,0.75);
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
    color: var(--color-text-primary);
    background: rgba(255,255,255,0.95);
    padding: 8px 20px;
    border: 1px solid var(--color-border);
    border-radius: 2px;
    font-family: var(--font-body);
    font-weight: 700;
  }

  /* Wishlist */
  .pc__wish-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(8px);
    border: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-muted);
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
    color: var(--color-error) !important;
    background: rgba(224,92,92,0.12) !important;
    border-color: rgba(224,92,92,0.3) !important;
    animation: heartBeat 0.5s ease;
  }
  .pc__wish-btn:hover {
    color: var(--color-error);
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
    background: var(--color-gold);
    padding: 12px;
    text-align: center;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    z-index: 3;
  }
  .pc__quick-view span {
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #ffffff;
    font-family: var(--font-body);
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
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-text-primary);
    line-height: 1.3;
    transition: color 0.2s ease;
  }
  .pc__name:hover { color: var(--color-gold); }
  .pc__rating { display: flex; align-items: center; gap: 6px; }
  .pc-stars { color: var(--color-gold); font-size: 0.78rem; letter-spacing: 1px; }
  .pc__rev-count { color: var(--color-text-muted); font-size: 0.74rem; }

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
    color: var(--color-text-muted);
    font-family: var(--font-body);
  }
  .pc__sizes { display: flex; gap: 6px; flex-wrap: wrap; }
  .pc__size-btn {
    min-width: 36px;
    padding: 5px 10px;
    font-size: 0.7rem;
    font-weight: 600;
    font-family: var(--font-body);
    color: var(--color-text-secondary);
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.18s ease;
  }
  .pc__size-btn:hover {
    color: var(--color-gold);
    border-color: var(--color-border-hover);
    background: var(--color-gold-dim);
  }
  .pc__size-btn--active {
    background: var(--color-gold) !important;
    color: #ffffff !important;
    border-color: var(--color-gold) !important;
    font-weight: 800 !important;
  }

  /* Actions */
  .pc__actions {
    display: flex;
    gap: 8px;
    margin-top: auto;
  }

  /* Inline size error */
  .pc__size-error {
    font-size: 0.7rem;
    color: #e05c5c;
    font-weight: 700;
    margin: 0;
    animation: pcShake 0.35s ease;
  }
  @keyframes pcShake {
    0%,100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
  .pc__size-btn--error-hint {
    border-color: rgba(224,92,92,0.5) !important;
  }

  /* Inline added-to-cart confirmation */
  .pc__added-confirm {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 12px;
    background: rgba(76,175,125,0.12);
    border: 1px solid rgba(76,175,125,0.3);
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 700;
    color: #4caf7d;
    letter-spacing: 0.5px;
    animation: pcConfirmIn 0.3s ease;
  }
  @keyframes pcConfirmIn {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .pc__details-btn {
    flex: 1;
    padding: 11px 8px;
    background: transparent;
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-family: var(--font-body);
    border-radius: 4px;
    transition: all 0.2s ease;
  }
  .pc__details-btn:hover {
    color: var(--color-text-primary);
    border-color: rgba(0,0,0,0.15);
    background: rgba(0,0,0,0.02);
  }
  .pc__cart-btn {
    flex: 2;
    padding: 11px 12px;
    background: var(--color-gold);
    color: #ffffff;
    border: none;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-family: var(--font-body);
    border-radius: 4px;
    transition: all 0.25s ease;
  }
  .pc__cart-btn:hover:not(.pc__cart-btn--disabled) {
    background: var(--color-gold-light);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px var(--color-gold-dim);
  }
  .pc__cart-btn--success {
    background: #4caf7d !important;
    color: #fff !important;
    animation: successPop 0.35s ease;
  }
  .pc__cart-btn--disabled {
    background: var(--color-bg-muted) !important;
    color: var(--color-text-muted) !important;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

export default memo(ProductCard, (prev, next) => prev.product.id === next.product.id);