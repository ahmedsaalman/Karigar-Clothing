// src/context/CartContext.jsx

import { createContext, useContext, useState } from 'react';

// ── STEP 1: CREATE ────────────────────────────────────
// createContext() makes the channel
// The null is the default value if no Provider is found above
const CartContext = createContext(null);

// ── PROVIDER COMPONENT ────────────────────────────────
// This component wraps your app and BROADCASTS cart data
// Any child component can tune in with useContext(CartContext)

function CartProvider({ children }) {

  const [cartItems, setCartItems] = useState([]);

  // ── CART OPERATIONS ─────────────────────────────────

  function addToCart(product, selectedSize) {
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        item => item.id === product.id && item.size === selectedSize
      );

      if (existingIndex !== -1) {
        return prevItems.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prevItems,
        { ...product, size: selectedSize, quantity: 1 }
      ];
    });
  }

  function removeFromCart(productId, size) {
    setCartItems(prevItems =>
      prevItems.filter(
        item => !(item.id === productId && item.size === size)
      )
    );
  }

  function updateQuantity(productId, size, newQuantity) {
    if (newQuantity < 1) {
      removeFromCart(productId, size);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  // ── DERIVED VALUES ────────────────────────────────
  // Calculated from cartItems — no separate state needed

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const isInCart = (productId, size) =>
    cartItems.some(
      item => item.id === productId && item.size === size
    );

  // ── THE VALUE OBJECT ──────────────────────────────
  // Everything we broadcast to consumers
  // Any component that calls useContext(CartContext)
  // gets access to ALL of these

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
  };

  return (
    // ── STEP 2: PROVIDE ──────────────────────────────
    // value prop is what gets broadcast
    // children renders everything wrapped inside CartProvider
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// ── CUSTOM HOOK ───────────────────────────────────────
// Instead of calling useContext(CartContext) everywhere,
// we make a clean custom hook: useCart()
// This is the industry standard pattern

function useCart() {
  const context = useContext(CartContext);

  // Safety check — warn developer if used outside provider
  if (context === null) {
    throw new Error('useCart must be used inside a CartProvider');
  }

  return context;
}

// Export both the Provider and the hook
export { CartProvider, useCart };