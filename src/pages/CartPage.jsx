// src/pages/CartPage.jsx
// Now uses all the new reducer-powered cart features

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { postRequest } from '../services/apiClient';

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
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIcon}>🛒</div>
        <h2 style={styles.emptyTitle}>Your cart is empty</h2>
        <p style={styles.emptyText}>
          Browse our collection and find your perfect shirt.
        </p>
        <button
          onClick={() => navigate('/products')}
          style={styles.shopBtn}
        >
          Browse Collection
        </button>
      </div>
    );
  }

  // ── CART WITH ITEMS ───────────────────────────────
  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Shopping Cart</h1>
          <p style={styles.subtitle}>{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={handleClearCart} style={styles.clearBtn}>
          Clear Cart
        </button>
      </div>

      <div style={styles.layout}>

        {/* ── LEFT: Cart Items ── */}
        <div style={styles.itemsList}>

          {cartItems.map(item => (
            <div key={`${item.id}-${item.size}`} style={styles.cartItem}>

              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                style={styles.itemImage}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/90x110';
                }}
              />

              {/* Info */}
              <div style={styles.itemInfo}>
                <h3
                  style={styles.itemName}
                  onClick={() => navigate(`/products/${item.id}`)}
                >
                  {item.name}
                </h3>
                <p style={styles.itemMeta}>
                  Size: <strong>{item.size}</strong>
                </p>
                <p style={styles.itemUnitPrice}>
                  {formatPrice(item.price)} per item
                </p>

                {/* Quantity Stepper */}
                <div style={styles.quantityControl}>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => updateQuantity(
                      item.id, item.size, item.quantity - 1
                    )}
                  >
                    −
                  </button>
                  <span style={styles.qtyDisplay}>{item.quantity}</span>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => updateQuantity(
                      item.id, item.size, item.quantity + 1
                    )}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Right: Total + Remove */}
              <div style={styles.itemRight}>
                <p style={styles.itemTotal}>
                  {formatPrice(item.price * item.quantity)}
                </p>
                <button
                  onClick={() => handleRemove(item)}
                  style={styles.removeBtn}
                >
                  Remove
                </button>
              </div>

            </div>
          ))}

        </div>

        {/* ── RIGHT: Order Summary ── */}
        <div style={styles.summary}>

          <h2 style={styles.summaryTitle}>Order Summary</h2>

          {/* Price Breakdown */}
          <div style={styles.summaryRows}>

            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            {/* Discount Row — only shows when discount applied */}
            {discountCode && (
              <div style={{ ...styles.summaryRow, color: '#27ae60' }}>
                <span>
                  Discount ({discountCode} — {discountPercent}% off)
                </span>
                <span>−{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? '#27ae60' : 'inherit' }}>
                {shipping === 0 ? 'FREE' : formatPrice(shipping)}
              </span>
            </div>

            {shipping > 0 && (
              <p style={styles.shippingNote}>
                Add {formatPrice(5000 - cartTotal)} more for free shipping
              </p>
            )}

            <div style={styles.divider} />

            <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>

          </div>

          {/* Discount Code Section */}
          <div style={styles.discountSection}>

            {discountCode ? (
              // Discount already applied
              <div style={styles.appliedDiscount}>
                <div style={styles.appliedDiscountInfo}>
                  <span style={styles.discountTag}>🏷️ {discountCode}</span>
                  <span style={styles.discountSaving}>
                    Saving {formatPrice(discountAmount)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    removeDiscount();
                    showSuccess('Discount removed');
                  }}
                  style={styles.removeDiscountBtn}
                >
                  Remove
                </button>
              </div>
            ) : (
              // Discount input
              <div style={styles.discountInput}>
                <p style={styles.discountLabel}>Have a discount code?</p>
                <div style={styles.discountRow}>
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={discountInput}
                    onChange={e => setDiscountInput(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && handleApplyDiscount()}
                    style={styles.codeInput}
                  />
                  <button
                    onClick={handleApplyDiscount}
                    disabled={discountLoading || !discountInput.trim()}
                    style={{
                      ...styles.applyBtn,
                      opacity: discountLoading || !discountInput.trim()
                        ? 0.6 : 1,
                    }}
                  >
                    {discountLoading ? '...' : 'Apply'}
                  </button>
                </div>
                <p style={styles.discountHint}>
                  Try: KARIGAR10, NEWUSER20, PREMIUM15
                </p>
              </div>
            )}

          </div>

          {/* Checkout Button */}
          <button style={styles.checkoutBtn} onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>

          <button
            onClick={() => navigate('/products')}
            style={styles.continueBtn}
          >
            ← Continue Shopping
          </button>

        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '60px 20px 100px',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '40px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '4px',
  },
  subtitle: {
    color: '#888',
    fontSize: '0.9rem',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: '#e74c3c',
    fontSize: '0.85rem',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: '48px',
    alignItems: 'start',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cartItem: {
    display: 'flex',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  itemImage: {
    width: '90px',
    height: '110px',
    objectFit: 'cover',
    borderRadius: '2px',
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  itemName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#1a1a1a',
    cursor: 'pointer',
  },
  itemMeta: {
    fontSize: '0.8rem',
    color: '#666',
  },
  itemUnitPrice: {
    fontSize: '0.8rem',
    color: '#888',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    width: 'fit-content',
    border: '1px solid #e0e0e0',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '8px',
  },
  qtyBtn: {
    width: '32px',
    height: '32px',
    border: 'none',
    backgroundColor: '#f5f5f5',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyDisplay: {
    width: '40px',
    textAlign: 'center',
    fontSize: '0.9rem',
    fontWeight: '600',
    borderLeft: '1px solid #e0e0e0',
    borderRight: '1px solid #e0e0e0',
    lineHeight: '32px',
  },
  itemRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minWidth: '80px',
  },
  itemTotal: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#bbb',
    fontSize: '0.8rem',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  summary: {
    backgroundColor: '#ffffff',
    padding: '28px',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    position: 'sticky',
    top: '100px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',
  },
  summaryTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f0f0f0',
  },
  summaryRows: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: '#555',
  },
  shippingNote: {
    fontSize: '0.78rem',
    color: '#d4af37',
    fontStyle: 'italic',
  },
  divider: {
    height: '1px',
    backgroundColor: '#f0f0f0',
    margin: '4px 0',
  },
  totalRow: {
    fontWeight: '700',
    color: '#1a1a1a',
    fontSize: '1.05rem',
  },
  discountSection: {
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: '#fafafa',
    borderRadius: '4px',
    border: '1px solid #f0f0f0',
  },
  appliedDiscount: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appliedDiscountInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  discountTag: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#27ae60',
  },
  discountSaving: {
    fontSize: '0.78rem',
    color: '#888',
  },
  removeDiscountBtn: {
    background: 'none',
    border: 'none',
    color: '#e74c3c',
    fontSize: '0.8rem',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  discountInput: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  discountLabel: {
    fontSize: '0.82rem',
    color: '#666',
    fontWeight: '600',
  },
  discountRow: {
    display: 'flex',
    gap: '8px',
  },
  codeInput: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #e0e0e0',
    fontSize: '0.85rem',
    letterSpacing: '1px',
    outline: 'none',
    borderRadius: '2px',
  },
  applyBtn: {
    padding: '10px 16px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    borderRadius: '2px',
    flexShrink: 0,
  },
  discountHint: {
    fontSize: '0.75rem',
    color: '#aaa',
  },
  checkoutBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    borderRadius: '2px',
    marginBottom: '12px',
  },
  continueBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'transparent',
    color: '#888',
    border: 'none',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '120px 20px',
    gap: '16px',
    textAlign: 'center',
  },
  emptyIcon: { fontSize: '4rem', opacity: 0.3 },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  emptyText: { color: '#888', fontSize: '0.95rem' },
  shopBtn: {
    marginTop: '8px',
    padding: '14px 36px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    borderRadius: '2px',
  },
};

export default CartPage;