// src/components/Header.jsx
// Add onNavigate prop to nav links

import { useState } from 'react';

function Header({ cartCount = 0, currentPage, onNavigate }) {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Collection', page: 'products' },
    { label: 'About', page: 'about' },
  ];

  return (
    <header style={styles.header}>
      <div style={styles.container}>

        <div style={styles.brand}>
          <h1
            style={styles.brandName}
            onClick={() => onNavigate('home')}
          >
            Karigar Co.
          </h1>
          <p style={styles.tagline}>Crafted for Professionals</p>
        </div>

        <nav style={styles.nav}>
          {navLinks.map(link => (
            <button
              key={link.label}
              onClick={() => onNavigate(link.page)}
              style={{
                ...styles.navLink,
                // Highlight active page
                color: currentPage === link.page ? '#d4af37' : '#ffffff',
                borderBottom: currentPage === link.page
                  ? '2px solid #d4af37'
                  : '2px solid transparent',
              }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div style={styles.rightSide}>
          <div style={styles.cartArea}>
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
        <div style={styles.mobileMenu}>
          {navLinks.map(link => (
            <button
              key={link.label}
              style={styles.mobileNavLink}
              onClick={() => {
                onNavigate(link.page);
                setIsMenuOpen(false);
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
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
  brand: {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  },
  brandName: {
    color: '#d4af37',
    fontSize: '1.8rem',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    cursor: 'pointer',
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
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: '#ffffff',
    fontSize: '0.9rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    padding: '4px 0',
    transition: 'color 0.2s',
  },
  rightSide: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
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
    gap: '8px',
    borderTop: '1px solid #333',
  },
  mobileNavLink: {
    background: 'none',
    border: 'none',
    borderBottom: '1px solid #333',
    color: '#ffffff',
    fontSize: '1rem',
    padding: '12px 0',
    cursor: 'pointer',
    textAlign: 'left',
    letterSpacing: '1px',
  },
};

export default Header;
