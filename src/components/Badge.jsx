// src/components/Badge.jsx

const BADGE_CONFIG = {
  sale: {
    label: 'Sale',
    bg: 'rgba(224, 92, 92, 0.15)',
    color: '#e87b7b',
    border: 'rgba(224, 92, 92, 0.35)',
  },
  new: {
    label: 'New',
    bg: 'rgba(76, 175, 125, 0.15)',
    color: '#5fcb92',
    border: 'rgba(76, 175, 125, 0.35)',
  },
  bestseller: {
    label: 'Best Seller',
    bg: 'rgba(201, 168, 76, 0.15)',
    color: '#c9a84c',
    border: 'rgba(201, 168, 76, 0.4)',
  },
  premium: {
    label: 'Premium',
    bg: 'rgba(180, 140, 220, 0.15)',
    color: '#c49ee0',
    border: 'rgba(180, 140, 220, 0.35)',
  },
  featured: {
    label: 'Featured',
    bg: 'rgba(100, 160, 220, 0.15)',
    color: '#82b8e8',
    border: 'rgba(100, 160, 220, 0.35)',
  },
};

function Badge({ type }) {
  if (!type || !BADGE_CONFIG[type]) return null;
  const { label, bg, color, border } = BADGE_CONFIG[type];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      fontSize: '0.62rem',
      fontWeight: '700',
      letterSpacing: '1.2px',
      textTransform: 'uppercase',
      borderRadius: '999px',
      backgroundColor: bg,
      color: color,
      border: `1px solid ${border}`,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      lineHeight: 1.4,
      fontFamily: "'Inter', sans-serif",
    }}>
      {label}
    </span>
  );
}

export default Badge;