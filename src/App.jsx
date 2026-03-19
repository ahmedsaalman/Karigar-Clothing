// src/App.jsx

import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';

function App() {

  const [cartItems, setCartItems] = useState([]);

  // Simple page state — we'll replace with React Router in Lesson 5
  const [currentPage, setCurrentPage] = useState('home');

  function handleAddToCart(product, selectedSize) {
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        item => item.id === product.id && item.size === selectedSize
      );

      if (existingIndex !== -1) {
        return prevItems.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { ...product, size: selectedSize, quantity: 1 }];
    });
  }

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity, 0
  );

  // Render different page based on currentPage state
  function renderPage() {
    if (currentPage === 'products') {
      return <ProductsPage onAddToCart={handleAddToCart} />;
    }
    return <HomePage onAddToCart={handleAddToCart} />;
  }

  return (
    <div>
      <Header
        cartCount={cartCount}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        // pass navigation handler to header
      />
      <main>
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;