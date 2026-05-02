// src/components/Welcome.jsx
// Update buttons to actually navigate

import { useNavigate } from 'react-router-dom';
import modelHero from '../../photos/shirt_pics/sample3.jpg';

function Welcome() {
  const navigate = useNavigate();
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section style={styles.hero}>
      <div style={styles.container}>
        <p style={styles.eyebrow}>New Collection 2025</p>
        <h1 style={styles.heading}>
          Premium Shirts for <br />
          <span style={styles.highlight}>Professionals</span>
        </h1>
        <p style={styles.subtext}>Every stitch tells a story of craftsmanship.</p>
        <p style={styles.date}>Today is {formattedDate}</p>
        <div style={styles.buttonGroup}>
          <button
            style={styles.primaryBtn}
            onClick={() => navigate('/products')}
          >
            Shop Collection
          </button>
          <button
            style={styles.secondaryBtn}
            onClick={() => navigate('/about')}
          >
            Our Story
          </button>
        </div>
      </div>
    </section>
  );
}

const styles = {
  hero: {
    backgroundImage: `linear-gradient(rgba(28, 20, 14, 0.72), rgba(28, 20, 14, 0.82)), url(${modelHero})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '60px 20px',
  },
  container: { maxWidth: '700px' },
  eyebrow: {
    color: '#d7b17c',
    fontSize: '0.85rem',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: '16px',
  },
  heading: {
    color: '#f7ede0',
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: '700',
    lineHeight: '1.2',
    marginBottom: '24px',
  },
  highlight: { color: '#d7b17c' },
  subtext: {
    color: '#e4d5c2',
    fontSize: '1.1rem',
    marginBottom: '12px',
  },
  date: {
    color: '#cebca5',
    fontSize: '0.85rem',
    marginBottom: '40px',
    fontStyle: 'italic',
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    backgroundColor: '#8b5e3c',
    color: '#fff4e6',
    border: 'none',
    padding: '14px 32px',
    fontSize: '0.9rem',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    borderRadius: '2px',
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    color: '#f7ede0',
    border: '1px solid #a78865',
    padding: '14px 32px',
    fontSize: '0.9rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    borderRadius: '2px',
  },
};

export default Welcome;