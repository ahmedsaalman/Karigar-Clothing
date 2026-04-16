// src/layouts/RootLayout.jsx

import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState } from 'react';

function RootLayout({ cartItems, onAddToCart, onRemoveFromCart }) {

  // Calculate cart count from cartItems array
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div style={styles.wrapper}>

      {/* Header is always visible */}
      <Header cartCount={cartCount} />

      {/* Main content area */}
      <main style={styles.main}>
        {/*
          Outlet is where the matched child route renders.
          Think of it as a "slot" that React Router fills in.

          We pass data to child routes using the context prop.
          Child routes can read this via useOutletContext() hook.
        */}
        <Outlet context={{ cartItems, onAddToCart, onRemoveFromCart }} />
      </main>

      {/* Footer is always visible */}
      <Footer />

    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,  // takes all available space between header and footer
  },
};

export default RootLayout;