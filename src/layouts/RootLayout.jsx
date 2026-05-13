// src/layouts/RootLayout.jsx

import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { useCart } from '../context/CartContext';
import { Suspense } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';

function RootLayout() {
  const location = useLocation();
  const { cartCount } = useCart();

  return (
    <div style={styles.wrapper}>
      <Header cartCount={cartCount} />
      <main style={styles.main}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
            <div key={location.pathname} style={styles.routeTransition}>
              <Outlet />
            </div>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0a0a0a',
  },
  main: {
    flex: 1,
  },
  routeTransition: {
    animation: 'pageFadeIn 400ms ease both',
  },
};

export default RootLayout;