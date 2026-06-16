import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Toast from './components/Toast';
import Preloader from './components/Preloader';

function lazyWithRetry(componentImport) {
  return lazy(async () => {
    const pageHasRefreshed = window.sessionStorage.getItem('page-has-refreshed') === 'true';
    try {
      const component = await componentImport();
      window.sessionStorage.removeItem('page-has-refreshed'); // Reset on success
      return component;
    } catch (error) {
      if (!pageHasRefreshed) {
        window.sessionStorage.setItem('page-has-refreshed', 'true');
        window.location.reload();
        return new Promise(() => {}); // Return pending promise while reloading
      }
      throw error;
    }
  });
}

const HomePage = lazyWithRetry(() => import('./pages/HomePage'));
const ProductsPage = lazyWithRetry(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazyWithRetry(() => import('./pages/ProductDetailPage'));
const CartPage = lazyWithRetry(() => import('./pages/CartPage'));
const WishlistPage = lazyWithRetry(() => import('./pages/WishlistPage'));
const AboutPage = lazyWithRetry(() => import('./pages/AboutPage'));
const NotFoundPage = lazyWithRetry(() => import('./pages/NotFoundPage'));
const FaqPage = lazyWithRetry(() => import('./pages/FaqPage'));
const CheckoutPage = lazyWithRetry(() => import('./pages/CheckoutPage'));
const LoginPage = lazyWithRetry(() => import('./pages/LoginPage'));
const SignUpPage = lazyWithRetry(() => import('./pages/SignUpPage'));
const AdminDashboardPage = lazyWithRetry(() => import('./pages/AdminDashboardPage'));

function App() {
  return (
    <>
      <Preloader />
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route
            path="/products/:productId"
            element={<ProductDetailPage />}
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toast />
    </>
  );
}

export default App;