// src/components/Badge.jsx


const BADGE_CONFIG = {
  sale: {
    label: 'Sale',
    backgroundColor: '#e74c3c',
    color: '#ffffff',
  },
  new: {
    label: 'New',
    backgroundColor: '#27ae60',
    color: '#ffffff',
  },
  bestseller: {
    label: 'Best Seller',
    backgroundColor: '#d4af37',
    color: '#1a1a1a',
  },
  premium: {
    label: 'Premium',
    backgroundColor: '#1a1a1a',
    color: '#d4af37',
  },
  featured: {
    label: 'Featured',
    backgroundColor: '#2c3e50',
    color: '#ffffff',
  },
};

function Badge({ type }) {
  // If no type or unknown type, render nothing
  if (!type || !BADGE_CONFIG[type]) return null;

  const config = BADGE_CONFIG[type];

  return (
    <span style={{
      ...styles.badge,
      backgroundColor: config.backgroundColor,
      color: config.color,
    }}>
      {config.label}
    </span>
  );
}

const styles = {
  badge: {
    display: 'inline-block',
    padding: '4px 10px',
    fontSize: '0.7rem',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    borderRadius: '2px',
  },
};

export default Badge;