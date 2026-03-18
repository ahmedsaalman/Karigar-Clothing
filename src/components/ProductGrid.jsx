// src/components/ProductGrid.jsx

import ProductCard from './ProductCard';
import SectionTitle from './SectionTitle';

function ProductGrid({ 
  products,                           // array of product objects
  title = "Our Collection",           // section title with default
  subtitle = null,                    // optional subtitle
  columns = 3,                        // how many columns
}) {

  // Handle empty state gracefully
  if (!products || products.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p style={styles.emptyText}>No products found.</p>
      </div>
    );
  }

  return (
    <section style={styles.section}>
      
      <SectionTitle title={title} subtitle={subtitle} />

      {/* 
        CSS Grid with dynamic column count based on prop.
        repeat(auto-fill) with minmax makes it responsive automatically
      */}
      <div style={{
        ...styles.grid,
        gridTemplateColumns: `repeat(auto-fill, minmax(${
          columns === 4 ? '240px' : columns === 2 ? '340px' : '280px'
        }, 1fr))`,
      }}>
        {products.map((product) => (
          /*
            KEY PROP — React requires a unique key when rendering lists.
            Helps React identify which items changed, added, or removed.
            Always use a stable unique ID — never use array index if possible.
          */
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {/* Product count */}
      <p style={styles.productCount}>
        Showing {products.length} product{products.length !== 1 ? 's' : ''}
      </p>

    </section>
  );
}

const styles = {
  section: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '80px 20px',
  },
  grid: {
    display: 'grid',
    gap: '24px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  emptyText: {
    color: '#999',
    fontSize: '1.1rem',
  },
  productCount: {
    textAlign: 'center',
    color: '#888',
    fontSize: '0.85rem',
    marginTop: '32px',
  },
};

export default ProductGrid;