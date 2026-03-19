// src/components/StatsBar.jsx

function StatsBar({
  products = 0,
  happyCustomers = 0,
  yearsOfCraft = 0,
  citiesDelivered = 0,
}) {
  const stats = [
    { label: 'Products', value: products },
    { label: 'Happy Customers', value: happyCustomers },
    { label: 'Years of Craft', value: yearsOfCraft },
    { label: 'Cities Delivered', value: citiesDelivered },
  ];

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        {stats.map((item) => (
          <div key={item.label} style={styles.statCard}>
            <p style={styles.value}>{item.value.toLocaleString()}</p>
            <p style={styles.label}>{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles = {
  section: {
    backgroundColor: '#111',
    borderTop: '1px solid #2a2a2a',
    borderBottom: '1px solid #2a2a2a',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  statCard: {
    textAlign: 'center',
    padding: '12px 8px',
  },
  value: {
    color: '#d4af37',
    fontSize: '1.8rem',
    fontWeight: '700',
    lineHeight: '1.2',
    marginBottom: '6px',
  },
  label: {
    color: '#b5b5b5',
    fontSize: '0.78rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
};

export default StatsBar;
