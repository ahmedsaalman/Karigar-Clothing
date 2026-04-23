// src/components/Header.jsx

import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import SearchFocusButton from './SearchFocusButton';

function Header({ cartCount = 0 }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

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
            <p style={styles.tagline}>Crafted for Professionals</p>
          </div>
        </Link>

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
        </nav>

        <div style={styles.rightSide}>

          {/* Search Button — new addition */}
          <SearchFocusButton />

          {/* Cart */}
          <div
            style={styles.cartArea}
            onClick={() => navigate('/cart')}
          >
            <span style={styles.cartIcon}>🛒</span>
            {cartCount > 0 && (
              <span style={styles.cartCount}>{cartCount}</span>
            )}
          </div>

          <button
            style={styles.hamburger}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
    gap: '20px',
  },
  cartArea: {
    position: 'relative',
    cursor: 'pointer',
  },
  cartIcon: {
    fontSize: '1.4rem',
  },
  cartCount: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#d4af37',
    color: '#1a1a1a',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
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