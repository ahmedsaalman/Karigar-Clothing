// src/App.jsx
// App owns the GLOBAL cart state
// It passes handlers DOWN to children

import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

function App() {

  // ── GLOBAL STATE ─────────────────────────────────
  // Cart lives here because BOTH Header (count badge)
  // AND ProductCard (add button) need access to it

  const [cartItems, setCartItems] = useState([]);

  // ── CART HANDLER ──────────────────────────────────
  // This function is passed DOWN to ProductCard via
  // App → HomePage → ProductGrid → ProductCard

  function handleAddToCart(product, selectedSize) {
    setCartItems(prevItems => {

      // Check if item already exists with same size
      const existingIndex = prevItems.findIndex(
        item => item.id === product.id && item.size === selectedSize
      );

      if (existingIndex !== -1) {
        // Item exists — increment quantity
        // map creates a NEW array (never mutate state directly)
        return prevItems.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Item doesn't exist — add new entry
        return [
          ...prevItems,
          {
            ...product,
            size: selectedSize,
            quantity: 1,
          }
        ];
      }
    });
  }

  // Derive total count from cartItems
  // No separate state needed — calculated from existing state
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // ── RENDER ───────────────────────────────────────

  return (
    <div>
      {/* Pass cartCount DOWN to Header for the badge */}
      <Header cartCount={cartCount} />

      <main>
        {/* Pass handler DOWN through HomePage */}
        <HomePage onAddToCart={handleAddToCart} />
      </main>

      <Footer />
    </div>
  );
}

export default App;