// src/pages/CartPage.jsx
// Now uses all the new reducer-powered cart features

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { postRequest } from '../services/apiClient';
import cartHero from '../../photos/shirt_pics/sample6.jpg';

function CartPage() {
  const {
    cartItems,
    cartCount,
    subtotal,
    discountCode,
    discountPercent,
    discountAmount,
    cartTotal,
    shipping,
    grandTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyDiscount,
    removeDiscount,
  } = useCart();

  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // Local state for discount input
  const [discountInput, setDiscountInput] = useState('');
  const [discountLoading, setDiscountLoading] = useState(false);

  function formatPrice(amount) {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  function handleRemove(item) {
    removeFromCart(item.id, item.size);
    showSuccess(`${item.name} removed`);
  }

  function handleClearCart() {
    if (window.confirm('Clear your entire cart?')) {
      clearCart();
      showSuccess('Cart cleared');
    }
  }

  async function handleApplyDiscount() {
    if (!discountInput.trim()) return;

    setDiscountLoading(true);
    try {
      const response = await postRequest('/discounts/validate', { code: discountInput });
      applyDiscount(response.code, response.discountPercent);
      showSuccess(`Discount applied! ${response.code} — ${response.discountPercent}% off`);
      setDiscountInput('');
    } catch (error) {
      showError(error.message || 'Invalid discount code');
    } finally {
      setDiscountLoading(false);
    }
  }

  // ── EMPTY CART ────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <>
        <style>{cartCSS}</style>
        <div className="cart-empty">
          <div className="cart-empty__icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.2 }}>
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h2 className="cart-empty__title">Your cart is empty</h2>
          <p className="cart-empty__text">
            Browse our collection and find your perfect shirt.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="cart-empty__btn"
          >
            Browse Collection
          </button>
        </div>
      </>
    );
  }

  // ── CART WITH ITEMS ───────────────────────────────
  return (
    <>
      <style>{cartCSS}</style>
      <div className="cart-page">
        <header className="cart-header">
          <div className="cart-header__info">
            <h1 className="cart-title">Shopping Cart</h1>
            <p className="cart-subtitle">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={handleClearCart} className="cart-clear-btn">
            Clear Cart
          </button>
        </header>

        <div className="cart-layout">
          {/* Left: Items */}
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={`${item.id}-${item.size}`} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item__img"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/90x110'; }}
                />
                <div className="cart-item__info">
                  <h3 className="cart-item__name" onClick={() => navigate(`/products/${item.id}`)}>
                    {item.name}
                  </h3>
                  <p className="cart-item__meta">Size: <strong>{item.size}</strong></p>
                  <p className="cart-item__price">{formatPrice(item.price)}</p>
                  <div className="cart-qty">
                    <button className="cart-qty__btn" onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                    <span className="cart-qty__val">{item.quantity}</span>
                    <button className="cart-qty__btn" onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                  </div>
                </div>
                <div className="cart-item__right">
                  <p className="cart-item__total">{formatPrice(item.price * item.quantity)}</p>
                  <button onClick={() => handleRemove(item)} className="cart-item__remove">Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Summary */}
          <div className="cart-summary">
            <h2 className="cart-summary__title">Order Summary</h2>
            <div className="cart-summary__rows">
              <div className="cart-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {discountCode && (
                <div className="cart-row cart-row--success">
                  <span>Discount ({discountCode})</span>
                  <span>−{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="cart-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'cart-row--success' : ''}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && <p className="cart-shipping-note">Add {formatPrice(5000 - cartTotal)} more for free shipping</p>}
              <div className="cart-divider" />
              <div className="cart-row cart-row--total"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
            </div>

            <div className="cart-discount">
              {discountCode ? (
                <div className="cart-discount__applied">
                  <div className="cart-discount__tag">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                    {discountCode}
                  </div>
                  <button onClick={removeDiscount} className="cart-discount__remove">Remove</button>
                </div>
              ) : (
                <div className="cart-discount__input">
                  <p className="cart-discount__label">Promo Code</p>
                  <div className="cart-discount__row">
                    <input type="text" placeholder="Enter code" value={discountInput} onChange={e => setDiscountInput(e.target.value.toUpperCase())} className="cart-discount__field" />
                    <button onClick={handleApplyDiscount} disabled={discountLoading || !discountInput.trim()} className="cart-discount__btn">
                      {discountLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="cart-checkout-btn" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
            <button className="cart-continue-btn" onClick={() => navigate('/products')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const cartCSS = `
  .cart-page { max-width: var(--container-max); margin: 0 auto; padding: 100px 20px; min-height: 80vh; }
  .cart-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
  .cart-title { font-family: var(--font-display); font-size: 2.5rem; font-weight: 900; color: #ffffff; margin: 0; }
  .cart-subtitle { font-size: 0.9rem; color: var(--color-text-muted); margin-top: 4px; }
  .cart-clear-btn { background: none; border: none; color: var(--color-error); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; opacity: 0.7; transition: opacity 0.2s; }
  .cart-clear-btn:hover { opacity: 1; }

  .cart-layout { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: start; }
  @media (min-width: 1000px) { .cart-layout { grid-template-columns: 1fr 380px; } }

  .cart-items { display: flex; flex-direction: column; gap: 16px; }
  .cart-item { display: flex; gap: 20px; padding: 24px; background: var(--color-bg-elevated); border: 1px solid var(--color-border); border-radius: 8px; }
  .cart-item__img { width: 100px; height: 130px; object-fit: cover; border-radius: 4px; border: 1px solid var(--color-border); }
  .cart-item__info { flex: 1; display: flex; flex-direction: column; gap: 6px; }
  .cart-item__name { font-family: var(--font-display); font-size: 1.1rem; font-weight: 800; color: #ffffff; cursor: pointer; transition: color 0.2s; }
  .cart-item__name:hover { color: var(--color-gold); }
  .cart-item__meta { font-size: 0.85rem; color: var(--color-text-muted); }
  .cart-item__meta strong { color: var(--color-gold); }
  .cart-item__price { font-size: 0.95rem; font-weight: 700; color: var(--color-text-secondary); }

  .cart-qty { display: flex; align-items: center; width: fit-content; background: rgba(255,255,255,0.03); border: 1px solid var(--color-border); border-radius: 4px; margin-top: 10px; }
  .cart-qty__btn { width: 32px; height: 32px; border: none; background: transparent; color: #ffffff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
  .cart-qty__btn:hover { background: rgba(255,255,255,0.05); }
  .cart-qty__val { width: 40px; text-align: center; font-size: 0.9rem; font-weight: 800; color: #ffffff; }

  .cart-item__right { display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; }
  .cart-item__total { font-family: var(--font-display); font-size: 1.2rem; font-weight: 800; color: var(--color-price); }
  .cart-item__remove { background: none; border: none; color: var(--color-text-muted); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: color 0.2s; }
  .cart-item__remove:hover { color: var(--color-error); }

  .cart-summary { background: var(--color-bg-elevated); padding: 32px; border-radius: 8px; border: 1px solid var(--color-border); position: sticky; top: 100px; }
  .cart-summary__title { font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; color: #ffffff; margin-bottom: 24px; }
  .cart-summary__rows { display: flex; flex-direction: column; gap: 14px; margin-bottom: 30px; }
  .cart-row { display: flex; justify-content: space-between; font-size: 0.95rem; color: var(--color-text-secondary); }
  .cart-row--success { color: var(--color-success); font-weight: 700; }
  .cart-row--total { font-family: var(--font-display); font-size: 1.5rem; font-weight: 900; color: var(--color-price); border-top: 1px solid var(--color-border); padding-top: 16px; margin-top: 4px; }
  .cart-shipping-note { font-size: 0.75rem; color: var(--color-gold); font-style: italic; margin-top: -10px; }
  .cart-divider { height: 1px; background: var(--color-border); margin: 4px 0; }

  .cart-discount { margin-bottom: 24px; padding: 20px; background: rgba(255,255,255,0.02); border: 1px solid var(--color-border); border-radius: 6px; }
  .cart-discount__applied { display: flex; justify-content: space-between; align-items: center; }
  .cart-discount__tag { display: flex; align-items: center; gap: 8px; color: var(--color-success); font-weight: 800; font-size: 0.9rem; }
  .cart-discount__remove { background: none; border: none; color: var(--color-error); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; cursor: pointer; }
  .cart-discount__label { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: var(--color-text-muted); margin-bottom: 12px; }
  .cart-discount__row { display: flex; gap: 8px; }
  .cart-discount__field { flex: 1; background: rgba(0,0,0,0.2); border: 1px solid var(--color-border); padding: 10px 14px; color: #ffffff; font-size: 0.9rem; border-radius: 4px; }
  .cart-discount__btn { background: var(--color-gold); color: #000000; border: none; padding: 0 16px; border-radius: 4px; font-weight: 800; cursor: pointer; }
  .cart-discount__btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .cart-checkout-btn { width: 100%; padding: 18px; background: var(--color-gold); color: #000000; border: none; border-radius: 6px; font-family: var(--font-display); font-size: 1.1rem; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; transition: all 0.3s; margin-bottom: 16px; }
  .cart-checkout-btn:hover { background: var(--color-gold-light); transform: translateY(-2px); box-shadow: var(--shadow-gold); }
  .cart-continue-btn { width: 100%; padding: 12px; background: transparent; border: none; color: var(--color-text-muted); font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: color 0.2s; }
  .cart-continue-btn:hover { color: #ffffff; }

  .cart-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 120px 20px; text-align: center; }
  .cart-empty__icon { margin-bottom: 24px; opacity: 0.4; color: var(--color-gold); }
  .cart-empty__title { font-family: var(--font-display); font-size: 2rem; font-weight: 900; color: #ffffff; margin-bottom: 12px; }
  .cart-empty__text { color: var(--color-text-muted); margin-bottom: 32px; font-size: 1.1rem; }
  .cart-empty__btn { padding: 16px 40px; background: var(--color-gold); color: #000000; border: none; border-radius: 6px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; cursor: pointer; transition: all 0.3s; }
  .cart-empty__btn:hover { background: var(--color-gold-light); transform: translateY(-2px); box-shadow: var(--shadow-gold); }
`;

export default CartPage;