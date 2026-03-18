// src/components/Header.jsx

function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        
        {/* Brand Logo/Name */}
        <div style={styles.brand}>
          <h1 style={styles.brandName}>Karigar Co.</h1>
          <p style={styles.tagline}>Crafted for the Professionals</p>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          <a href="#" style={styles.navLink}>Home</a>
          <a href="#" style={styles.navLink}>Collection</a>
          <a href="#" style={styles.navLink}>About</a>
          <a href="#" style={styles.navLink}>Contact</a>
        </nav>

        {/* Cart Icon placeholder */}
        <div style={styles.cartArea}>
          <span style={styles.cartIcon}>🛒</span>
          <span style={styles.cartCount}>0</span>
        </div>

      </div>
    </header>
  );
}

// Inline styles object - we'll move to CSS later
const styles = {
  header: {
    backgroundColor: '#1a1a1a',
    padding: '0 20px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 0',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandName: {
    color: '#d4af37',       // golden color - premium feel
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
    padding: '4px 0',
    borderBottom: '2px solid transparent',
    transition: 'color 0.2s, border-color 0.2s',
  },
  cartArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
  },
  cartIcon: {
    fontSize: '1.4rem',
  },
  cartCount: {
    backgroundColor: '#d4af37',
    color: '#1a1a1a',
    borderRadius: '50%',
    width: '22px',
    height: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
};

export default Header;