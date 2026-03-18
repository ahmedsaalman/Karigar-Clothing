// src/pages/HomePage.jsx

import Welcome from '../components/Welcome';
import ProductGrid from '../components/ProductGrid';
import SectionTitle from '../components/SectionTitle';
import products, { featuredProducts } from '../data/products';

function HomePage() {
  return (
    <div>

      {/* Hero Section */}
      <Welcome />

      {/* Featured Products */}
      <ProductGrid
        products={featuredProducts}
        title="Featured Collection"
        subtitle="Hand-picked by our style experts. The finest shirts in our catalog."
        columns={3}
      />

      {/* Divider Banner */}
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
        </div>
      </div>

      {/* Full Collection */}
      <ProductGrid
        products={products}
        title="Full Collection"
        subtitle="Explore our complete range of premium shirts."
        columns={4}
      />

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
  },
  bannerEyebrow: {
    color: '#d4af37',
    fontSize: '0.8rem',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: '16px',
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
    fontWeight: '700',
    marginBottom: '20px',
    letterSpacing: '1px',
  },
  bannerSubtext: {
    color: '#888',
    fontSize: '1rem',
    lineHeight: '1.8',
  },
};

export default HomePage;