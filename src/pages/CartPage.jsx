// src/pages/CartPage.jsx

import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';

function CartPage() {

  // Get everything from context — no props needed
  const {
    cartItems,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const shipping = cartTotal > 5000 ? 0 : 250;
  const total = cartTotal + shipping;

  function formatPrice(amount) {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  function handleRemove(item) {
    removeFromCart(item.id, item.size);
    showSuccess(`${item.name} removed from cart`);
  }

  function handleClearCart() {
    clearCart();
    showSuccess('Cart cleared');
  }

  if (cartItems.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIcon}>🛒</div>
        <h2 style={styles.emptyTitle}>Your cart is empty</h2>
        <p style={styles.emptyText}>
          Looks like you haven't added anything yet.
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

  return (
    <div style={styles.page}>

      <div style={styles.pageHeader}>
        <h1 style={styles.title}>Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          style={styles.clearBtn}
        >
          Clear All
        </button>
      </div>

      <div style={styles.layout}>

        {/* Cart Items */}
        <div style={styles.itemsList}>
          {cartItems.map(item => (
            <div key={`${item.id}-${item.size}`} style={styles.cartItem}>

              <img
                src={item.image}
                alt={item.name}
                style={styles.itemImage}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100x120';
                }}
              />

              <div style={styles.itemInfo}>
                <h3
                  style={styles.itemName}
                  onClick={() => navigate(`/products/${item.id}`)}
                >
                  {item.name}
                </h3>
                <p style={styles.itemMeta}>Size: <strong>{item.size}</strong></p>
                <p style={styles.itemUnitPrice}>
                  {formatPrice(item.price)} each
                </p>

                {/* Quantity Controls */}
                <div style={styles.quantityControl}>
                  <button
                    onClick={() => updateQuantity(
                      item.id, item.size, item.quantity - 1
                    )}
                    style={styles.quantityBtn}
                  >
                    −
                  </button>
                  <span style={styles.quantityDisplay}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(
                      item.id, item.size, item.quantity + 1
                    )}
                    style={styles.quantityBtn}
                  >
                    +
                  </button>
                </div>
              </div>

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

        {/* Order Summary */}
        <div style={styles.summary}>
          <h2 style={styles.summaryTitle}>Order Summary</h2>

          <div style={styles.summaryRows}>
            <div style={styles.summaryRow}>
              <span>Subtotal ({cartItems.length} items)</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? '#27ae60' : 'inherit' }}>
                {shipping === 0 ? 'FREE' : formatPrice(shipping)}
              </span>
            </div>
            {shipping > 0 && (
              <p style={styles.freeShippingNote}>
                Add {formatPrice(5000 - cartTotal)} more for free shipping
              </p>
            )}
            <div style={styles.divider} />
            <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button style={styles.checkoutBtn}>
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
    alignItems: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1a1a1a',
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
    border: '1px solid #ddd',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '8px',
  },
  quantityBtn: {
    width: '32px',
    height: '32px',
    border: 'none',
    backgroundColor: '#f5f5f5',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  quantityDisplay: {
    width: '40px',
    textAlign: 'center',
    fontSize: '0.9rem',
    fontWeight: '600',
    borderLeft: '1px solid #ddd',
    borderRight: '1px solid #ddd',
    lineHeight: '32px',
  },
  itemRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemTotal: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#999',
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
  },
  summaryTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '24px',
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
  freeShippingNote: {
    fontSize: '0.8rem',
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
    fontSize: '1rem',
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
    marginBottom: '12px',
    borderRadius: '2px',
  },
  continueBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'transparent',
    color: '#555',
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
  emptyTitle: { fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a' },
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