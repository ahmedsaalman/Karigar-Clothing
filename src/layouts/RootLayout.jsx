// src/layouts/RootLayout.jsx

import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { Suspense } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';

function RootLayout() {

  // Get cart count directly from context
  // No props needed — context broadcasts it
  const { cartCount } = useCart();

  return (
    <div style={styles.wrapper}>
      <Header cartCount={cartCount} />
      <main style={styles.main}>
        {/*
          No more context prop needed on Outlet.
          Pages get cart data from useCart() directly.
        */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
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
    flex: 1,
  },
};

export default RootLayout;