// src/pages/CheckoutPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import useForm from '../hooks/useForm';
import FormField from '../components/FormField';
import withAuthGuard from '../components/withAuthGuard';
import { postRequest, getAssetUrl } from '../services/apiClient';
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
      // Logic for actual order placement is skipped as per request
      showSuccess('order placing yet to be implemented thankyou for ordering');
      
      // Optionally clear cart and redirect to home after a delay
      setTimeout(() => {
        clearCart();
        navigate('/');
      }, 3000);
    } catch (error) {
      showError(error.message || 'Could not place order');
    }
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <>
        <style>{checkoutCSS}</style>
        <div className="checkout-empty">
          <div className="checkout-empty__icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.2 }}>
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h2 className="checkout-empty__title">Your cart is empty</h2>
          <button onClick={() => navigate('/products')} className="checkout-empty__btn">
            Browse Collection
          </button>
        </div>
      </>
    );
  }

  if (orderPlaced) {
    return (
      <>
        <style>{checkoutCSS}</style>
        <div className="checkout-success">
          <div className="checkout-success__icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="checkout-success__title">Order Placed!</h1>
          <p className="checkout-success__text">
            Thank you for your order. Your order ID is <strong>{orderId}</strong>.
          </p>
          <p className="checkout-success__subtext">You will receive a confirmation shortly.</p>
          <div className="checkout-success__actions">
            <button onClick={() => navigate('/')} className="checkout-btn--primary">Return to Home</button>
            <button onClick={() => navigate('/products')} className="checkout-btn--outline">Continue Shopping</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{checkoutCSS}</style>
      <div className="checkout-page">
        <header className="checkout-header">
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-subtitle">{cartCount} item{cartCount !== 1 ? 's' : ''} in your order</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="checkout-layout" noValidate>
          <div className="checkout-main">
            <section className="checkout-section">
              <h2 className="checkout-section__title">Contact Information</h2>
              <div className="checkout-row">
                <FormField label="First Name" name="firstName" value={values.firstName} onChange={handleChange} onBlur={handleBlur} error={errors.firstName} touched={touched.firstName} placeholder="First Name" required />
                <FormField label="Last Name" name="lastName" value={values.lastName} onChange={handleChange} onBlur={handleBlur} error={errors.lastName} touched={touched.lastName} placeholder="Last Name" required />
              </div>
              <FormField label="Email Address" name="email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} touched={touched.email} placeholder="email@example.com" required />
              <FormField label="Phone Number" name="phone" type="tel" value={values.phone} onChange={handleChange} onBlur={handleBlur} error={errors.phone} touched={touched.phone} placeholder="03001234567" hint="For delivery updates" required />
            </section>

            <section className="checkout-section">
              <h2 className="checkout-section__title">Shipping Address</h2>
              <FormField label="Street Address" name="address" value={values.address} onChange={handleChange} onBlur={handleBlur} error={errors.address} touched={touched.address} placeholder="Street Address" required />
              <div className="checkout-row">
                <FormField label="City" name="city" value={values.city} onChange={handleChange} onBlur={handleBlur} error={errors.city} touched={touched.city} placeholder="City" required />
                <FormField label="Postal Code" name="postalCode" value={values.postalCode} onChange={handleChange} onBlur={handleBlur} error={errors.postalCode} touched={touched.postalCode} placeholder="75400" required />
              </div>
              <FormField label="Province" name="province" type="select" value={values.province} onChange={handleChange} onBlur={handleBlur} error={errors.province} touched={touched.province} options={PROVINCES} required />
            </section>

            <section className="checkout-section">
              <h2 className="checkout-section__title">Payment Method</h2>
              <div className="checkout-payments">
                {[
                  { value: 'cod', label: 'Cash on Delivery', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
                  { value: 'bank', label: 'Bank Transfer', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg> },
                  { value: 'easypaisa', label: 'EasyPaisa', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> },
                ].map(method => (
                  <label key={method.value} className={`checkout-pay-opt ${values.paymentMethod === method.value ? 'checkout-pay-opt--active' : ''}`}>
                    <input type="radio" name="paymentMethod" value={method.value} checked={values.paymentMethod === method.value} onChange={handleChange} />
                    <span className="checkout-pay-opt__icon">{method.icon}</span>
                    <span className="checkout-pay-opt__label">{method.label}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="checkout-section">
              <h2 className="checkout-section__title">Order Notes</h2>
              <FormField label="Special Instructions (Optional)" name="orderNotes" type="textarea" value={values.orderNotes} onChange={handleChange} onBlur={handleBlur} error={errors.orderNotes} touched={touched.orderNotes} placeholder="Instructions for delivery..." rows={3} />
            </section>

            <section className="checkout-section">
              <FormField label="" name="agreedToTerms" type="checkbox" value={values.agreedToTerms} onChange={handleChange} onBlur={handleBlur} error={errors.agreedToTerms} touched={touched.agreedToTerms} placeholder="I agree to the Terms & Conditions" required />
            </section>
          </div>

          <aside className="checkout-summary">
            <h2 className="checkout-summary__title">Order Summary</h2>
            <div className="checkout-summary__items">
              {cartItems.map(item => (
                <div key={`${item.id}-${item.size}`} className="checkout-summary-item">
                  <img src={getAssetUrl(item.image)} alt={item.name} className="checkout-summary-item__img" onError={e => { e.target.src = 'https://via.placeholder.com/48x56'; }} />
                  <div className="checkout-summary-item__info">
                    <p className="checkout-summary-item__name">{item.name}</p>
                    <p className="checkout-summary-item__meta">{item.size} × {item.quantity}</p>
                  </div>
                  <p className="checkout-summary-item__price">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="checkout-summary__totals">
              <div className="checkout-row-val"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="checkout-row-val"><span>Shipping</span><span className="checkout-success-text">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
              <div className="checkout-divider" />
              <div className="checkout-row-val checkout-row-val--total"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
            </div>

            <button type="submit" disabled={isSubmitting} className="checkout-submit-btn">
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </aside>
        </form>
      </div>
    </>
  );
}

const checkoutCSS = `
  .checkout-page { max-width: var(--container-max); margin: 0 auto; padding: 100px 20px; }
  .checkout-header { margin-bottom: 40px; }
  .checkout-title { font-family: var(--font-display); font-size: 2.5rem; font-weight: 900; color: var(--color-text-primary); margin: 0; }
  .checkout-subtitle { font-size: 0.9rem; color: var(--color-text-muted); margin-top: 4px; }

  .checkout-layout { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: start; }
  @media (min-width: 1000px) { .checkout-layout { grid-template-columns: 1fr 400px; } }

  .checkout-main { display: flex; flex-direction: column; gap: 24px; }
  .checkout-section { background: var(--color-bg-elevated); padding: 32px; border-radius: 8px; border: 1px solid var(--color-border); }
  .checkout-section__title { font-family: var(--font-display); font-size: 1.1rem; font-weight: 800; color: var(--color-text-primary); margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid var(--color-border); text-transform: uppercase; letter-spacing: 1px; }
  .checkout-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  .checkout-payments { display: flex; flex-direction: column; gap: 12px; }
  .checkout-pay-opt { display: flex; align-items: center; gap: 12px; padding: 16px; background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: 6px; cursor: pointer; transition: all 0.2s; }
  .checkout-pay-opt input { display: none; }
  .checkout-pay-opt--active { border-color: var(--color-gold); background: var(--color-gold-dim); }
  .checkout-pay-opt__icon { color: var(--color-gold); }
  .checkout-pay-opt__label { font-size: 0.9rem; font-weight: 700; color: var(--color-text-primary); }

  .checkout-summary { background: var(--color-bg-elevated); padding: 32px; border-radius: 8px; border: 1px solid var(--color-border); position: sticky; top: 100px; }
  .checkout-summary__title { font-family: var(--font-display); font-size: 1.3rem; font-weight: 800; color: var(--color-text-primary); margin-bottom: 24px; }
  .checkout-summary__items { display: flex; flex-direction: column; gap: 16px; max-height: 300px; overflow-y: auto; margin-bottom: 24px; }
  .checkout-summary-item { display: flex; gap: 12px; align-items: center; }
  .checkout-summary-item__img { width: 50px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid var(--color-border); }
  .checkout-summary-item__info { flex: 1; min-width: 0; }
  .checkout-summary-item__name { font-size: 0.85rem; font-weight: 700; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .checkout-summary-item__meta { font-size: 0.75rem; color: var(--color-text-muted); }
  .checkout-summary-item__price { font-size: 0.9rem; font-weight: 800; color: var(--color-price); }

  .checkout-summary__totals { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; padding-top: 20px; border-top: 1px solid var(--color-border); }
  .checkout-row-val { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--color-text-secondary); }
  .checkout-row-val--total { font-family: var(--font-display); font-size: 1.4rem; font-weight: 900; color: var(--color-price); margin-top: 4px; }
  .checkout-divider { height: 1px; background: var(--color-border); }
  .checkout-success-text { color: var(--color-success); font-weight: 700; }

  .checkout-submit-btn { width: 100%; padding: 18px; background: var(--color-gold); color: #ffffff; border: none; border-radius: 6px; font-family: var(--font-display); font-size: 1.1rem; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; transition: all 0.3s; }
  .checkout-submit-btn:hover:not(:disabled) { background: var(--color-gold-light); transform: translateY(-2px); box-shadow: 0 4px 14px var(--color-gold-glow); }
  .checkout-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .checkout-empty, .checkout-success { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 120px 20px; text-align: center; max-width: 500px; margin: 0 auto; }
  .checkout-empty__icon { margin-bottom: 24px; color: var(--color-gold); opacity: 0.4; }
  .checkout-empty__title { font-family: var(--font-display); font-size: 2rem; font-weight: 900; color: var(--color-text-primary); margin-bottom: 24px; }
  .checkout-empty__btn { padding: 16px 40px; background: var(--color-gold); color: #ffffff; border: none; border-radius: 6px; font-weight: 800; text-transform: uppercase; cursor: pointer; }

  .checkout-success__icon { width: 80px; height: 80px; background: var(--color-success); color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
  .checkout-success__title { font-family: var(--font-display); font-size: 2.5rem; font-weight: 900; color: var(--color-text-primary); margin-bottom: 16px; }
  .checkout-success__text { color: var(--color-text-secondary); font-size: 1.1rem; margin-bottom: 8px; }
  .checkout-success__subtext { color: var(--color-text-muted); margin-bottom: 32px; }
  .checkout-success__actions { display: flex; gap: 16px; }
  .checkout-btn--primary { padding: 14px 28px; background: var(--color-gold); color: #ffffff; border: none; border-radius: 6px; font-weight: 800; cursor: pointer; }
  .checkout-btn--outline { padding: 14px 28px; background: transparent; border: 1px solid var(--color-border); color: var(--color-text-primary); border-radius: 6px; font-weight: 800; cursor: pointer; }

  @media (max-width: 768px) {
    .checkout-page { padding: 80px 16px 40px; }
    .checkout-title { font-size: 2rem; }
    .checkout-section { padding: 24px 20px; }
    .checkout-row { grid-template-columns: 1fr; gap: 0; }
    .checkout-summary { padding: 24px 20px; position: static; }
    .checkout-success__title { font-size: 2rem; }
    .checkout-success__actions { flex-direction: column; width: 100%; }
    .checkout-success__actions button { width: 100%; }
    .checkout-header { text-align: center; }
  }
`;

export default withAuthGuard(CheckoutPage);