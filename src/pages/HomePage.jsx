// src/pages/HomePage.jsx

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Welcome from '../components/Welcome';
import ProductGrid from '../components/ProductGrid';
import StatsBar from '../components/StatsBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import useFetch from '../hooks/useFetch';
import { getProducts } from '../services/productService';

function HomePage() {
  const navigate = useNavigate();

  // useFetch custom hook replaces manual useState + useEffect
  const fetchFeatured = useCallback(
    () => getProducts().then(products =>
      products.filter(p => p.featured)
    ),
    []
  );

  const {
    data: featuredProducts,
    isLoading,
    error,
    refetch,
  } = useFetch(fetchFeatured);

  return (
    <div>

      <Welcome />

      <StatsBar
        products={150}
        happyCustomers={10000}
        yearsOfCraft={8}
        citiesDelivered={45}
      />

      {isLoading && (
        <LoadingSpinner message="Loading featured collection..." />
      )}

      {!isLoading && error && (
        <ErrorMessage message={error} onRetry={refetch} />
      )}

      {!isLoading && !error && featuredProducts && (
        <ProductGrid
          products={featuredProducts}
          title="Featured Collection"
          subtitle="Hand-picked by our style experts."
          columns={3}
        />
      )}

      {/* Banner */}
      <div style={styles.banner}>
        <div style={styles.bannerContent}>
          <p style={styles.bannerEyebrow}>The Karigar Promise</p>
          <h2 style={styles.bannerTitle}>
            Every Shirt. Perfectly Crafted.
          </h2>
          <p style={styles.bannerSubtext}>
            We use only the finest fabrics sourced from certified mills.
            Each shirt goes through 47 quality checks before it reaches you.
          </p>
          <button
            onClick={() => navigate('/products')}
            style={styles.bannerBtn}
          >
            Shop Full Collection
          </button>
        </div>
      </div>

    </div>
  );
}

const styles = {
  banner: {
    backgroundColor: '#1a1a1a',
    padding: '80px 20px',
  },
  bannerContent: {
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'center',
  },
  bannerEyebrow: {
    color: '#d4af37',
    fontSize: '0.8rem',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
    fontWeight: '700',
    letterSpacing: '1px',
  },
  bannerSubtext: {
    color: '#888',
    fontSize: '1rem',
    lineHeight: '1.8',
  },
  bannerBtn: {
    marginTop: '8px',
    padding: '14px 36px',
    backgroundColor: '#d4af37',
    color: '#1a1a1a',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    borderRadius: '2px',
  },
};

export default HomePage;