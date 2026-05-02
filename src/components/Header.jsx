// src/components/Header.jsx

import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlistContext } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import SearchFocusButton from './SearchFocusButton';
import { useWindowSize } from '../hooks/useWindowSize';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlistContext();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useWindowSize();

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Collection', to: '/products' },
    { label: 'About', to: '/about' },
  ];

  function getNavLinkStyle({ isActive }) {
    return {
      ...styles.navLink,
      color: isActive ? '#d4af37' : '#ffffff',
      borderBottom: isActive
        ? '2px solid #d4af37'
        : '2px solid transparent',
    };
  }

  return (
    <header style={styles.header}>
      <div style={styles.container}>

        <Link to="/" style={styles.brandLink}>
          <div style={styles.brand}>
            <h1 style={styles.brandName}>Karigar Co.</h1>
            {!isMobile && (
              <p style={styles.tagline}>Crafted for Professionals</p>
            )}
          </div>
        </Link>

        {!isMobile && (
          <nav style={styles.nav}>
            {navLinks.map(link => (
              <NavLink
                key={link.label}
                to={link.to}
                style={getNavLinkStyle}
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <button style={{ ...styles.navLink, background: 'none', border: 'none', cursor: 'pointer', borderBottom: '2px solid transparent' }} onClick={logout}>
                Logout
              </button>
            ) : (
              <NavLink to="/login" style={getNavLinkStyle}>
                Login
              </NavLink>
            )}
          </nav>
        )}

        <div style={styles.rightSide}>

          <SearchFocusButton />

          {/* Wishlist */}
          <div
            style={styles.iconArea}
            onClick={() => navigate('/wishlist')}
            title="Wishlist"
          >
            <span style={styles.icon}>♡</span>
            {wishlistCount > 0 && (
              <span style={styles.badge}>{wishlistCount}</span>
            )}
          </div>

          {/* Cart */}
          <div
            style={styles.iconArea}
            onClick={() => navigate('/cart')}
            title="Cart"
          >
            <span style={styles.icon}>🛒</span>
            {cartCount > 0 && (
              <span style={styles.badge}>{cartCount}</span>
            )}
          </div>

          <button
            style={styles.hamburger}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>

        </div>
      </div>

      {isMenuOpen && (
        <nav style={styles.mobileMenu}>
          {navLinks.map(link => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === '/'}
              style={({ isActive }) => ({
                ...styles.mobileNavLink,
                color: isActive ? '#d4af37' : '#ffffff',
              })}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/wishlist"
            style={({ isActive }) => ({
              ...styles.mobileNavLink,
              color: isActive ? '#d4af37' : '#ffffff',
            })}
            onClick={() => setIsMenuOpen(false)}
          >
            Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
          </NavLink>
          {isAuthenticated ? (
            <button
              style={{ ...styles.mobileNavLink, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#ffffff' }}
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              style={({ isActive }) => ({
                ...styles.mobileNavLink,
                color: isActive ? '#d4af37' : '#ffffff',
              })}
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </NavLink>
          )}
        </nav>
      )}

    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#1a1a1a',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandLink: {
    textDecoration: 'none',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandName: {
    color: '#d4af37',
    fontSize: '1.8rem',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  tagline: {
    color: '#888',
    fontSize: '0.7rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  nav: {
    display: 'flex',
    gap: '32px',
  },
  navLink: {
    textDecoration: 'none',
    fontSize: '0.9rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '4px 0',
    transition: 'color 0.2s',
  },
  rightSide: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  iconArea: {
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: '1.3rem',
    color: '#ffffff',
  },
  badge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#d4af37',
    color: '#1a1a1a',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.65rem',
    fontWeight: '800',
  },
  hamburger: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontSize: '1.4rem',
    cursor: 'pointer',
  },
  mobileMenu: {
    backgroundColor: '#2a2a2a',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    borderTop: '1px solid #333',
  },
  mobileNavLink: {
    textDecoration: 'none',
    fontSize: '1rem',
    padding: '12px 0',
    borderBottom: '1px solid #333',
    letterSpacing: '1px',
    display: 'block',
  },
};

export default Header;