// src/pages/HomePage.jsx

import Welcome from '../components/Welcome';
import ProductGrid from '../components/ProductGrid';
import StatsBar from '../components/StatsBar';
import products, { featuredProducts } from '../data/products';

// Receive onAddToCart from App, pass it to ProductGrid
function HomePage({ onAddToCart }) {
  return (
    <div>

      <Welcome />

      <StatsBar
        products={150}
        happyCustomers={10000}
        yearsOfCraft={8}
        citiesDelivered={45}
      />

      <ProductGrid
        products={featuredProducts}
        title="Featured Collection"
        subtitle="Hand-picked by our style experts."
        columns={3}
        onAddToCart={onAddToCart}    // pass it through
      />

      <ProductGrid
        products={products}
        title="Full Collection"
        subtitle="Explore our complete range."
        columns={4}
        onAddToCart={onAddToCart}    // pass it through
      />

    </div>
  );
}

export default HomePage;