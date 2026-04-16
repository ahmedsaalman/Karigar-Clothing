// src/pages/HomePage.jsx
// Small update — use Link/navigate for the buttons

import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import Welcome from '../components/Welcome';
import ProductGrid from '../components/ProductGrid';
import StatsBar from '../components/StatsBar';
import { featuredProducts } from '../data/products';

function HomePage() {
  const { onAddToCart } = useOutletContext();

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
        onAddToCart={onAddToCart}
      />
    </div>
  );
}

export default HomePage;