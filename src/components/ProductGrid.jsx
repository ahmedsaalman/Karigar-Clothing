// src/components/ProductGrid.jsx

import ProductCard from './ProductCard';
import SectionTitle from './SectionTitle';

function ProductGrid({
  products,
  title = 'Our Collection',
  subtitle = null,
  eyebrow = null,
  columns = 3,
}) {
  if (!products || products.length === 0) {
    return (
      <>
        <style>{gridCSS}</style>
        <div className="pgrid-empty">
          <div className="pgrid-empty__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <p className="pgrid-empty__text">No products found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{gridCSS}</style>
      <section className="pgrid-section">
        <SectionTitle title={title} subtitle={subtitle} eyebrow={eyebrow} />

        <div className={`pgrid pgrid--cols-${columns}`}>
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              animDelay={i * 60}
            />
          ))}
        </div>

        <p className="pgrid-count">
          {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
      </section>
    </>
  );
}

const gridCSS = `
  .pgrid-section {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 80px 20px;
  }
  .pgrid {
    display: grid;
    gap: 32px;
    grid-template-columns: 1fr;
  }
  @media (min-width: 480px) {
    .pgrid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 900px) {
    .pgrid--cols-3 { grid-template-columns: repeat(3, 1fr); }
    .pgrid--cols-4 { grid-template-columns: repeat(4, 1fr); }
  }
  .pgrid-count {
    text-align: center;
    color: var(--color-text-muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-top: 48px;
    font-family: var(--font-body);
  }

  /* Empty state */
  .pgrid-empty {
    text-align: center;
    padding: 120px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  .pgrid-empty__icon { color: var(--color-gold); }
  .pgrid-empty__text {
    color: var(--color-text-secondary);
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
  }
`;

export default ProductGrid;