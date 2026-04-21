// src/context/CartContext.jsx
// Add useCallback to action creators for stable references

import { createContext, useContext, useReducer, useCallback } from 'react';

// ... (keep all existing code — CART_ACTIONS, initialState, cartReducer)

function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // ── Wrap action creators in useCallback ───────────
  // This gives stable function references to consumers
  // Components using these functions won't re-render
  // unnecessarily when CartProvider re-renders

  const addToCart = useCallback((product, size) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, size },
    });
  }, []);
  // [] = dispatch never changes, so addToCart never needs to change

  const removeFromCart = useCallback((productId, size) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { productId, size },
    });
  }, []);

  const updateQuantity = useCallback((productId, size, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, size, quantity },
    });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR });
  }, []);

  const applyDiscount = useCallback((code) => {
    const upperCode = code.toUpperCase();
    const isValid = VALID_DISCOUNT_CODES[upperCode] !== undefined;
    if (!isValid) return false;
    dispatch({ type: CART_ACTIONS.APPLY_DISCOUNT, payload: code });
    return true;
  }, []);

  const removeDiscount = useCallback(() => {
    dispatch({ type: CART_ACTIONS.REMOVE_DISCOUNT });
  }, []);

  // ── useMemo for derived values ─────────────────────
  // These recalculate only when state.items changes
  // Not on every CartProvider render

  const cartCount = useMemo(
    () => state.items.reduce((total, item) => total + item.quantity, 0),
    [state.items]
  );

  const subtotal = useMemo(
    () => state.items.reduce(
      (total, item) => total + item.price * item.quantity, 0
    ),
    [state.items]
  );

  const discountAmount = useMemo(
    () => subtotal * (state.discountPercent / 100),
    [subtotal, state.discountPercent]
  );

  const cartTotal = useMemo(
    () => subtotal - discountAmount,
    [subtotal, discountAmount]
  );

  const shipping = cartTotal > 5000 ? 0 : 250;
  const grandTotal = cartTotal + shipping;

  const isInCart = useCallback(
    (productId, size) =>
      state.items.some(
        item => item.id === productId && item.size === size
      ),
    [state.items]
  );

  const value = {
    cartItems: state.items,
    discountCode: state.discountCode,
    discountPercent: state.discountPercent,
    cartCount,
    subtotal,
    discountAmount,
    cartTotal,
    shipping,
    grandTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyDiscount,
    removeDiscount,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}