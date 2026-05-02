// src/components/Footer.jsx

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        
        <div style={styles.grid}>
          
          {/* Brand column */}
          <div>
            <h3 style={styles.brandName}>Karigar Co.</h3>
            <p style={styles.brandDesc}>
              Premium shirts crafted for the modern professional. 
              Quality that speaks before you do.
            </p>
          </div>

          {/* Links column */}
          <div>
            <h4 style={styles.colTitle}>Quick Links</h4>
            <ul style={styles.linkList}>
              <li><a href="/" style={styles.link}>Home</a></li>
              <li><a href="/products" style={styles.link}>Collection</a></li>
              <li><a href="/faq" style={styles.link}>FAQs</a></li>
              <li><a href="#" style={styles.link}>Care Instructions</a></li>
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 style={styles.colTitle}>Contact</h4>
            <ul style={styles.linkList}>
              <li style={styles.contactItem}>📍 Karachi, Pakistan</li>
              <li style={styles.contactItem}>📞 +92 300 1234567</li>
              <li style={styles.contactItem}>✉️ hello@karigar.co</li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={styles.bottomBar}>
          <p style={styles.copyright}>
            © {currentYear} Karigar Co. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#1a1a1a',
    color: '#aaa',
    padding: '60px 20px 20px',
    marginTop: '80px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    marginBottom: '40px',
  },
  brandName: {
    color: '#d4af37',
    fontSize: '1.4rem',
    letterSpacing: '2px',
    marginBottom: '12px',
  },
  brandDesc: {
    fontSize: '0.85rem',
    lineHeight: '1.7',
  },
  colTitle: {
    color: '#ffffff',
    fontSize: '0.85rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '16px',
  },
  linkList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  link: {
    color: '#aaa',
    textDecoration: 'none',
    fontSize: '0.85rem',
  },
  contactItem: {
    fontSize: '0.85rem',
    marginBottom: '6px',
  },
  bottomBar: {
    borderTop: '1px solid #333',
    paddingTop: '20px',
    textAlign: 'center',
  },
  copyright: {
    fontSize: '0.8rem',
    color: '#555',
  },
};

export default Footer;