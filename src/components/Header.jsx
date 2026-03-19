// src/components/Header.jsx

import { useState } from 'react';   // ALWAYS import useState

function Header({ cartCount = 0 }) {   // cartCount comes from App later

  // State for mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Collection', href: '#' },
    { label: 'About', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  return (
    <header style={styles.header}>
      <div style={styles.container}>

        {/* Brand */}
        <div style={styles.brand}>
          <h1 style={styles.brandName}>Karigar Co.</h1>
          <p style={styles.tagline}>Crafted for Professionals</p>
        </div>

        {/* Desktop Navigation */}
        <nav style={styles.nav}>
          {navLinks.map(link => (
            <a key={link.label} href={link.href} style={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side — cart + hamburger */}
        <div style={styles.rightSide}>

          {/* Cart Button */}
          <div style={styles.cartArea}>
            <span style={styles.cartIcon}>🛒</span>
            {/* Only show count badge if cart has items */}
            {cartCount > 0 && (
              <span style={styles.cartCount}>{cartCount}</span>
            )}
          </div>

          {/* Hamburger button — mobile only */}
          <button
            style={styles.hamburger}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            // Toggle: if open → close, if closed → open
            // !isMenuOpen flips the boolean
            aria-label="Toggle menu"
          >
            {/* Change icon based on state */}
            {isMenuOpen ? '✕' : '☰'}
          </button>

        </div>

      </div>

      {/* Mobile Menu — only renders when isMenuOpen is true */}
      {isMenuOpen && (
        <div style={styles.mobileMenu}>
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              style={styles.mobileNavLink}
              onClick={() => setIsMenuOpen(false)}
              // Close menu when a link is clicked
            >
              {link.label}
            </a>
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
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '0.9rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
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
    padding: '4px',
  },
  mobileMenu: {
    backgroundColor: '#2a2a2a',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    borderTop: '1px solid #333',
  },
  mobileNavLink: {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '1rem',
    padding: '8px 0',
    borderBottom: '1px solid #333',
    letterSpacing: '1px',
  },
};

export default Header;