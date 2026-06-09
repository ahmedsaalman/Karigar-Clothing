// src/pages/AboutPage.jsx

import { useNavigate } from 'react-router-dom';

function AboutPage() {
  const navigate = useNavigate();

  const values = [
    {
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M2 12h20"/><path d="m19 9-7 7-7-7"/></svg>,
      title: 'Master Craftsmanship',
      description:
        'Every shirt passes through the hands of craftsmen with decades of experience. 47 quality checks before it reaches you.',
    },
    {
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a7 7 0 0 1-7 7c-1 0-2.2-.2-3-.7Z"/><path d="M7 21c0-2.5 2-3 2-3"/></svg>,
      title: 'Ethical Sourcing',
      description:
        'Our fabrics are sourced from certified mills that meet our strict standards for labor practices and environmental responsibility.',
    },
    {
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22 22 2"/><path d="M8 22V14"/><path d="M14 22V10"/><path d="M20 22V6"/></svg>,
      title: 'Perfect Fit',
      description:
        'We obsess over measurements. Our size guide is built from thousands of data points to ensure your shirt fits like it was made for you.',
    },
    {
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>,
      title: 'Lifetime Guarantee',
      description:
        'If an Aam Admii shirt ever fails due to craftsmanship, we replace it. No questions asked. That is our promise.',
    },
  ];

  return (
    <div>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <p style={styles.eyebrow}>Est. 2017 — Karachi, Pakistan</p>
          <h1 style={styles.heroTitle}>
            We Make Shirts.<br />
            <span style={styles.heroAccent}>We Don't Compromise.</span>
          </h1>
          <p style={styles.heroText}>
            Aam Admii was born from a simple frustration — great shirts
            were either too expensive or too poorly made. We decided to
            change that.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div style={styles.storySection}>
        <div style={styles.storyContent}>
          <h2 style={styles.storyTitle}>The Aam Admii Story</h2>
          <p style={styles.storyText}>
            Aam Admii means the common person — clothing made for everyone who deserves premium comfort and style.
          </p>
          <p style={styles.storyText}>
            We started in a small workshop in Karachi with a simple mission: build shirts that everyone is proud to wear.
            Eight years later, we have delivered over 50,000 shirts across
            45 cities in Pakistan.
          </p>
          <p style={styles.storyText}>
            Every decision we make — the cotton we pick, the buttons we
            source, the thread we use — comes back to one question:
            <em> "Would an Aam Admii be proud to wear this?"</em>
          </p>
        </div>
      </div>

      {/* Values Grid */}
      <div style={styles.valuesSection}>
        <h2 style={styles.valuesTitle}>What We Stand For</h2>
        <div style={styles.valuesGrid}>
          {values.map((value, index) => (
            <div key={index} style={styles.valueCard}>
              <span style={styles.valueIcon}>{value.icon}</span>
              <h3 style={styles.valueTitle}>{value.title}</h3>
              <p style={styles.valueDesc}>{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to experience Aam Admii quality?</h2>
        <button
          onClick={() => navigate('/products')}
          style={styles.ctaBtn}
        >
          Shop the Collection
        </button>
      </div>

    </div>
  );
}

const styles = {
  hero: {
    backgroundColor: 'var(--color-bg-elevated)',
    padding: '100px 20px',
    textAlign: 'center',
    borderBottom: '1px solid var(--color-border)',
  },
  heroContent: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  eyebrow: {
    color: 'var(--color-gold)',
    fontSize: '0.8rem',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: '20px',
  },
  heroTitle: {
    color: 'var(--color-text-primary)',
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: '700',
    lineHeight: '1.2',
    marginBottom: '24px',
  },
  heroAccent: {
    color: 'var(--color-gold)',
  },
  heroText: {
    color: 'var(--color-text-secondary)',
    fontSize: '1.1rem',
    lineHeight: '1.8',
  },
  storySection: {
    padding: '80px 20px',
    backgroundColor: 'var(--color-bg)',
    borderBottom: '1px solid var(--color-border)',
  },
  storyContent: {
    maxWidth: '700px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  storyTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    marginBottom: '8px',
  },
  storyText: {
    color: 'var(--color-text-secondary)',
    fontSize: '1rem',
    lineHeight: '1.9',
  },
  valuesSection: {
    padding: '80px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  valuesTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    textAlign: 'center',
    marginBottom: '48px',
  },
  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '32px',
  },
  valueCard: {
    padding: '32px',
    backgroundColor: 'var(--color-bg-card)',
    borderRadius: '4px',
    border: '1px solid var(--color-border)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  valueIcon: {
    fontSize: '2rem',
    color: 'var(--color-gold)',
  },
  valueTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
  },
  valueDesc: {
    color: 'var(--color-text-secondary)',
    fontSize: '0.9rem',
    lineHeight: '1.7',
  },
  cta: {
    backgroundColor: 'var(--color-gold)',
    padding: '80px 20px',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '32px',
  },
  ctaBtn: {
    padding: '16px 48px',
    backgroundColor: '#ffffff',
    color: 'var(--color-gold)',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    borderRadius: '2px',
    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
  },
};

export default AboutPage;