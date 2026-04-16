// src/App.jsx

import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import RootLayout from './layouts/RootLayout';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {

  // Cart state lives here — highest level
  // Accessible to all pages through RootLayout context
  const [cartItems, setCartItems] = useState([]);

  // ── CART FUNCTIONS ─────────────────────────────────────

  function handleAddToCart(product, selectedSize) {
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        item => item.id === product.id && item.size === selectedSize
      );

      if (existingIndex !== -1) {
        // Already in cart — increase quantity
        return prevItems.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // New item — add to cart
      return [
        ...prevItems,
        { ...product, size: selectedSize, quantity: 1 }
      ];
    });
  }

  function handleRemoveFromCart(productId, size) {
    setCartItems(prevItems =>
      prevItems.filter(
        item => !(item.id === productId && item.size === size)
      )
    );
  }

  function handleUpdateQuantity(productId, size, newQuantity) {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId, size);
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

  // ── ROUTES ─────────────────────────────────────────────

  return (
    <Routes>

      {/*
        RootLayout wraps ALL routes.
        Every page gets Header and Footer automatically.
        We pass cart data and handlers as props.
      */}
      <Route
        element={
          <RootLayout
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
          />
        }
      >

        {/* index = the default child route for "/" */}
        <Route index element={<HomePage />} />

        {/* Products listing page */}
        <Route path="/products" element={<ProductsPage />} />

        {/*
          Dynamic route — :productId is a variable
          /products/1 → productId = "1"
          /products/oxford-shirt → productId = "oxford-shirt"
        */}
        <Route path="/products/:productId" element={<ProductDetailPage />} />

        {/* Cart page */}
        <Route path="/cart" element={<CartPage />} />

        {/* About page */}
        <Route path="/about" element={<AboutPage />} />

        {/*
          Catch-all — must be LAST
          Matches anything not matched above
          The * is special syntax meaning "anything"
        */}
        <Route path="*" element={<NotFoundPage />} />

      </Route>

    </Routes>
  );
}

export default App;