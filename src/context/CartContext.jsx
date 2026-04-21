// src/context/CartContext.jsx

import { createContext, useContext, useReducer } from 'react';

// ── ACTION TYPES ──────────────────────────────────────
// Defined as constants to prevent typo bugs
// Convention: SCREAMING_SNAKE_CASE

const CART_ACTIONS = {
  ADD_ITEM:         'CART_ADD_ITEM',
  REMOVE_ITEM:      'CART_REMOVE_ITEM',
  UPDATE_QUANTITY:  'CART_UPDATE_QTY',
  CLEAR:            'CART_CLEAR',
  APPLY_DISCOUNT:   'CART_APPLY_DISCOUNT',
  REMOVE_DISCOUNT:  'CART_REMOVE_DISCOUNT',
};

// ── INITIAL STATE ─────────────────────────────────────
// All cart-related state lives in ONE object
// This is a major advantage over multiple useState calls

const initialState = {
  items: [],
  discountCode: null,
  discountPercent: 0,
};

// ── DISCOUNT CODES ────────────────────────────────────
// In a real app this would come from the backend
const VALID_DISCOUNT_CODES = {
  'KARIGAR10': 10,
  'NEWUSER20': 20,
  'PREMIUM15': 15,
};

// ── THE REDUCER ───────────────────────────────────────
// One function handles ALL cart state changes
// Pure function: same inputs always give same output
// No side effects inside a reducer

function cartReducer(state, action) {

  switch (action.type) {

    // ── ADD ITEM ──────────────────────────────────────
    case CART_ACTIONS.ADD_ITEM: {

      const { product, size } = action.payload;

      // Check if this exact product+size already in cart
      const existingIndex = state.items.findIndex(
        item => item.id === product.id && item.size === size
      );

      if (existingIndex !== -1) {
        // Item exists — create new array with updated quantity
        const updatedItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );

        // Return NEW state object — spread existing state,
        // override only what changed
        return {
          ...state,
          items: updatedItems,
        };
      }

      // Item doesn't exist — add it as new entry
      const newItem = {
        ...product,
        size,
        quantity: 1,
      };

      return {
        ...state,
        items: [...state.items, newItem],
      };
    }

    // ── REMOVE ITEM ───────────────────────────────────
    case CART_ACTIONS.REMOVE_ITEM: {
      const { productId, size } = action.payload;

      return {
        ...state,
        items: state.items.filter(
          item => !(item.id === productId && item.size === size)
        ),
      };
    }

    // ── UPDATE QUANTITY ───────────────────────────────
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, size, quantity } = action.payload;

      // If quantity is 0 or less, remove the item entirely
      if (quantity < 1) {
        return {
          ...state,
          items: state.items.filter(
            item => !(item.id === productId && item.size === size)
          ),
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === productId && item.size === size
            ? { ...item, quantity }
            : item
        ),
      };
    }

    // ── CLEAR CART ────────────────────────────────────
    case CART_ACTIONS.CLEAR: {
      return {
        ...initialState,   // reset to starting state completely
      };
    }

    // ── APPLY DISCOUNT ────────────────────────────────
    case CART_ACTIONS.APPLY_DISCOUNT: {
      const code = action.payload.toUpperCase();
      const percent = VALID_DISCOUNT_CODES[code];

      if (!percent) {
        // Invalid code — return state unchanged
        // We signal the error differently (see below)
        return state;
      }

      return {
        ...state,
        discountCode: code,
        discountPercent: percent,
      };
    }

    // ── REMOVE DISCOUNT ───────────────────────────────
    case CART_ACTIONS.REMOVE_DISCOUNT: {
      return {
        ...state,
        discountCode: null,
        discountPercent: 0,
      };
    }

    // ── DEFAULT ───────────────────────────────────────
    // Unknown action — return state unchanged
    // Always required to prevent crashes
    default:
      return state;
  }
}

// ── CREATE CONTEXT ────────────────────────────────────
const CartContext = createContext(null);

// ── PROVIDER ──────────────────────────────────────────
function CartProvider({ children }) {

  // useReducer replaces all our useState calls
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // ── ACTION CREATORS ───────────────────────────────
  // These are helper functions that build and dispatch actions.
  // Components call these instead of calling dispatch directly.
  // This is cleaner and hides the action structure from components.

  function addToCart(product, size) {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, size },
    });
  }

  function removeFromCart(productId, size) {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { productId, size },
    });
  }

  function updateQuantity(productId, size, quantity) {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, size, quantity },
    });
  }

  function clearCart() {
    dispatch({ type: CART_ACTIONS.CLEAR });
  }

  function applyDiscount(code) {
    const upperCode = code.toUpperCase();
    const isValid = VALID_DISCOUNT_CODES[upperCode] !== undefined;

    if (!isValid) {
      // Return false so the component knows it failed
      return false;
    }

    dispatch({
      type: CART_ACTIONS.APPLY_DISCOUNT,
      payload: code,
    });

    return true;  // signal success
  }

  function removeDiscount() {
    dispatch({ type: CART_ACTIONS.REMOVE_DISCOUNT });
  }

  // ── DERIVED VALUES ────────────────────────────────
  // Calculated from state — not stored in state
  // Recalculated automatically whenever state changes

  const cartCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const discountAmount = subtotal * (state.discountPercent / 100);
  const cartTotal = subtotal - discountAmount;
  const shipping = cartTotal > 5000 ? 0 : 250;
  const grandTotal = cartTotal + shipping;

  const isInCart = (productId, size) =>
    state.items.some(
      item => item.id === productId && item.size === size
    );

  // ── BROADCAST VALUE ───────────────────────────────
  const value = {
    // State
    cartItems: state.items,
    discountCode: state.discountCode,
    discountPercent: state.discountPercent,

    // Derived
    cartCount,
    subtotal,
    discountAmount,
    cartTotal,
    shipping,
    grandTotal,

    // Actions
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

// ── CUSTOM HOOK ────────────────────────────────────────
function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}

export { CartProvider, useCart };