// src/components/SectionTitle.jsx

function SectionTitle({ 
  title, 
  subtitle, 
  align = 'center',   // default value
  theme = 'light'     // 'light' or 'dark'
}) {
  const isDark = theme === 'dark';

  return (
    <div style={{
      ...styles.container,
      textAlign: align,
    }}>
      
      {/* Decorative line above title */}
      <div style={{
        ...styles.decorator,
        // center or left align the decorator line
        margin: align === 'center' ? '0 auto 16px' : '0 0 16px',
      }} />

      <h2 style={{
        ...styles.title,
        color: isDark ? '#ffffff' : '#1a1a1a',
      }}>
        {title}
      </h2>

      {/* Subtitle is optional - only renders if provided */}
      {subtitle && (
        <p style={{
          ...styles.subtitle,
          color: isDark ? '#aaa' : '#666',
        }}>
          {subtitle}
        </p>
      )}

    </div>
  );
}

const styles = {
  container: {
    marginBottom: '48px',
  },
  decorator: {
    width: '40px',
    height: '3px',
    backgroundColor: '#d4af37',
  },
  title: {
    fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
    fontWeight: '700',
    letterSpacing: '1px',
    marginBottom: '12px',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: '1rem',
    lineHeight: '1.6',
    maxWidth: '500px',
    margin: '0 auto',
  },
};

export default SectionTitle;