// src/pages/CheckoutPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import useForm from '../hooks/useForm';
import FormField from '../components/FormField';
import withAuthGuard from '../components/withAuthGuard';
import { postRequest } from '../services/apiClient';
import checkoutHero from '../../photos/shirt_pics/sample5.jpg';

const VALIDATION_RULES = {
  firstName: {
    required: true,
    requiredMessage: 'First name is required',
    minLength: 2,
    minLengthMessage: 'First name must be at least 2 characters',
    pattern: /^[a-zA-Z\s]+$/,
    patternMessage: 'First name can only contain letters',
  },
  lastName: {
    required: true,
    requiredMessage: 'Last name is required',
    minLength: 2,
    minLengthMessage: 'Last name must be at least 2 characters',
  },
  email: {
    required: true,
    requiredMessage: 'Email is required',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    patternMessage: 'Please enter a valid email address',
  },
  phone: {
    required: true,
    requiredMessage: 'Phone number is required',
    pattern: /^(\+92|0)[0-9]{10}$/,
    patternMessage: 'Enter a valid Pakistani number (e.g. 03001234567)',
  },
  address: {
    required: true,
    requiredMessage: 'Street address is required',
    minLength: 10,
    minLengthMessage: 'Please enter a complete address',
  },
  city: {
    required: true,
    requiredMessage: 'City is required',
  },
  province: {
    required: true,
    requiredMessage: 'Please select a province',
  },
  postalCode: {
    required: true,
    requiredMessage: 'Postal code is required',
    pattern: /^[0-9]{5}$/,
    patternMessage: 'Enter a valid 5-digit postal code',
  },
  agreedToTerms: {
    required: true,
    requiredMessage: 'You must agree to the terms',
    custom: value =>
      !value ? 'You must agree to the terms and conditions' : null,
  },
};

const INITIAL_VALUES = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  paymentMethod: 'cod',
  orderNotes: '',
  agreedToTerms: false,
};

const PROVINCES = [
  { value: 'sindh', label: 'Sindh' },
  { value: 'punjab', label: 'Punjab' },
  { value: 'kpk', label: 'Khyber Pakhtunkhwa' },
  { value: 'balochistan', label: 'Balochistan' },
  { value: 'islamabad', label: 'Islamabad Capital Territory' },
  { value: 'gilgit', label: 'Gilgit-Baltistan' },
  { value: 'ajk', label: 'Azad Jammu & Kashmir' },
];

function CheckoutPage() {
  const {
    cartItems,
    grandTotal,
    cartCount,
    clearCart,
    subtotal,
    shipping,
    discountCode,
    discountPercent,
  } = useCart();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(INITIAL_VALUES, VALIDATION_RULES);

  function formatPrice(amount) {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  async function onSubmit(formValues) {
    try {
      const payload = {
        items: cartItems.map((item) => ({
          productId: item.id,
          size: item.size,
          quantity: item.quantity,
        })),
        shippingAddress: {
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          phone: formValues.phone,
          address: formValues.address,
          city: formValues.city,
          province: formValues.province,
          postalCode: formValues.postalCode,
        },
        paymentMethod: formValues.paymentMethod,
        orderNotes: formValues.orderNotes,
        discountCode,
        discountPercent,
        subtotal,
        shipping,
        grandTotal,
      };

      const response = await postRequest('/orders', payload);
      setOrderId(response.order.orderId);
      setOrderPlaced(true);
      clearCart();
      showSuccess('Order placed successfully!');
    } catch (error) {
      showError(error.message || 'Could not place order');
    }
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div style={styles.emptyContainer}>
        <p style={styles.emptyIcon}>🛒</p>
        <h2 style={styles.emptyTitle}>Your cart is empty</h2>
        <button
          onClick={() => navigate('/products')}
          style={styles.shopBtn}
        >
          Browse Collection
        </button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div style={styles.successContainer}>
        <div style={styles.successIcon}>✓</div>
        <h1 style={styles.successTitle}>Order Placed!</h1>
        <p style={styles.successText}>
          Thank you for your order. Your order ID is{' '}
          <strong>{orderId}</strong>.
        </p>
        <p style={styles.successSubtext}>
          You will receive a confirmation shortly.
        </p>
        <div style={styles.successActions}>
          <button
            onClick={() => navigate('/')}
            style={styles.homeBtn}
          >
            Return to Home
          </button>
          <button
            onClick={() => navigate('/products')}
            style={styles.shopMoreBtn}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      <h1 style={styles.title}>Checkout</h1>
      <p style={styles.subtitle}>
        {cartCount} item{cartCount !== 1 ? 's' : ''} in your order
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={styles.layout}
        noValidate
      >

        {/* LEFT: Form Fields */}
        <div style={styles.formSections}>

          {/* Contact Info */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Contact Information</h2>
            <div style={styles.twoCol}>
              <FormField
                label="First Name"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.firstName}
                touched={touched.firstName}
                placeholder="Ahmad"
                required
              />
              <FormField
                label="Last Name"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.lastName}
                touched={touched.lastName}
                placeholder="Khan"
                required
              />
            </div>
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              placeholder="ahmad@example.com"
              required
            />
            <FormField
              label="Phone Number"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phone}
              touched={touched.phone}
              placeholder="03001234567"
              hint="We'll use this for delivery updates"
              required
            />
          </div>

          {/* Shipping Address */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Shipping Address</h2>
            <FormField
              label="Street Address"
              name="address"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.address}
              touched={touched.address}
              placeholder="House 12, Street 5, Block A"
              required
            />
            <div style={styles.twoCol}>
              <FormField
                label="City"
                name="city"
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.city}
                touched={touched.city}
                placeholder="Karachi"
                required
              />
              <FormField
                label="Postal Code"
                name="postalCode"
                value={values.postalCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.postalCode}
                touched={touched.postalCode}
                placeholder="75400"
                required
              />
            </div>
            <FormField
              label="Province"
              name="province"
              type="select"
              value={values.province}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.province}
              touched={touched.province}
              options={PROVINCES}
              required
            />
          </div>

          {/* Payment */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Payment Method</h2>
            <div style={styles.paymentOptions}>
              {[
                { value: 'cod', label: 'Cash on Delivery', icon: '💵' },
                { value: 'bank', label: 'Bank Transfer', icon: '🏦' },
                { value: 'easypaisa', label: 'EasyPaisa', icon: '📱' },
              ].map(method => (
                <label key={method.value} style={{
                  ...styles.paymentOption,
                  border: values.paymentMethod === method.value
                    ? '2px solid #1a1a1a'
                    : '2px solid #e0e0e0',
                  backgroundColor: values.paymentMethod === method.value
                    ? '#f8f8f8'
                    : '#ffffff',
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={values.paymentMethod === method.value}
                    onChange={handleChange}
                    style={styles.radioInput}
                  />
                  <span style={styles.paymentIcon}>{method.icon}</span>
                  <span style={styles.paymentLabel}>{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Order Notes */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Order Notes</h2>
            <FormField
              label="Special Instructions (Optional)"
              name="orderNotes"
              type="textarea"
              value={values.orderNotes}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.orderNotes}
              touched={touched.orderNotes}
              placeholder="Any special instructions for delivery..."
              rows={3}
            />
          </div>

          {/* Terms */}
          <div style={styles.section}>
            <FormField
              label=""
              name="agreedToTerms"
              type="checkbox"
              value={values.agreedToTerms}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.agreedToTerms}
              touched={touched.agreedToTerms}
              placeholder="I agree to the Terms & Conditions and Privacy Policy"
              required
            />
          </div>

        </div>

        {/* RIGHT: Order Summary */}
        <div style={styles.summary}>

          <h2 style={styles.summaryTitle}>Order Summary</h2>

          <div style={styles.summaryItems}>
            {cartItems.map(item => (
              <div key={`${item.id}-${item.size}`} style={styles.summaryItem}>
                <div style={styles.summaryItemLeft}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={styles.summaryItemImage}
                    onError={e => {
                      e.target.src = 'https://via.placeholder.com/48x56';
                    }}
                  />
                  <div>
                    <p style={styles.summaryItemName}>{item.name}</p>
                    <p style={styles.summaryItemMeta}>
                      Size: {item.size} × {item.quantity}
                    </p>
                  </div>
                </div>
                <p style={styles.summaryItemPrice}>
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div style={styles.summaryTotals}>
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span style={{ color: '#27ae60' }}>
                {grandTotal > 5000 ? 'FREE' : 'PKR 250'}
              </span>
            </div>
            <div style={styles.divider} />
            <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
              <span>Total</span>
              <span>
                {formatPrice(
                  grandTotal > 5000 ? grandTotal : grandTotal + 250
                )}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...styles.submitBtn,
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </button>

        </div>

      </form>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '60px 20px 100px',
    backgroundImage: `linear-gradient(rgba(244, 234, 222, 0.9), rgba(244, 234, 222, 0.9)), url(${checkoutHero})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '8px',
    animation: 'panelFadeUp 500ms ease',
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
    marginBottom: '40px',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '48px',
    alignItems: 'start',
  },
  formSections: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: '28px',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1a1a1a',
    paddingBottom: '12px',
    borderBottom: '1px solid #f0f0f0',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  paymentOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  radioInput: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  paymentIcon: {
    fontSize: '1.2rem',
  },
  paymentLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333',
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
    gap: '20px',
  },
  summaryTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1a1a1a',
    paddingBottom: '16px',
    borderBottom: '1px solid #f0f0f0',
  },
  summaryItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '280px',
    overflowY: 'auto',
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  summaryItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
    minWidth: 0,
  },
  summaryItemImage: {
    width: '44px',
    height: '52px',
    objectFit: 'cover',
    borderRadius: '2px',
    flexShrink: 0,
    backgroundColor: '#f5f5f5',
  },
  summaryItemName: {
    fontSize: '0.82rem',
    fontWeight: '600',
    color: '#1a1a1a',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '140px',
  },
  summaryItemMeta: {
    fontSize: '0.75rem',
    color: '#888',
    marginTop: '2px',
  },
  summaryItemPrice: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#1a1a1a',
    flexShrink: 0,
  },
  summaryTotals: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    paddingTop: '16px',
    borderTop: '1px solid #f0f0f0',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.88rem',
    color: '#555',
  },
  divider: {
    height: '1px',
    backgroundColor: '#f0f0f0',
  },
  totalRow: {
    fontWeight: '700',
    color: '#1a1a1a',
    fontSize: '1rem',
  },
  submitBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    borderRadius: '2px',
    transition: 'opacity 0.2s',
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
  emptyIcon: {
    fontSize: '4rem',
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  shopBtn: {
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
  successContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '100px 20px',
    gap: '20px',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '0 auto',
  },
  successIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#27ae60',
    color: '#ffffff',
    fontSize: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
  },
  successTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  successText: {
    color: '#555',
    fontSize: '1rem',
    lineHeight: '1.6',
  },
  successSubtext: {
    color: '#888',
    fontSize: '0.9rem',
  },
  successActions: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '8px',
  },
  homeBtn: {
    padding: '12px 28px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: '700',
    cursor: 'pointer',
    borderRadius: '2px',
  },
  shopMoreBtn: {
    padding: '12px 28px',
    backgroundColor: 'transparent',
    color: '#1a1a1a',
    border: '1px solid #1a1a1a',
    fontSize: '0.9rem',
    cursor: 'pointer',
    borderRadius: '2px',
  },
};

export default withAuthGuard(CheckoutPage);