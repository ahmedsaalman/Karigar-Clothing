// src/pages/NotFoundPage.jsx

import { useNavigate, Link } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>

      <p style={styles.code}>404</p>
      <h1 style={styles.title}>Page Not Found</h1>
      <p style={styles.text}>
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div style={styles.buttons}>
        <button
          onClick={() => navigate(-1)}
          style={styles.backBtn}
        >
          ← Go Back
        </button>
        <Link to="/" style={styles.homeBtn}>
          Go to Homepage
        </Link>
      </div>

    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    padding: '60px 20px',
    textAlign: 'center',
    gap: '16px',
  },
  code: {
    fontSize: '8rem',
    fontWeight: '800',
    color: '#f0f0f0',
    lineHeight: 1,
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  text: {
    color: '#888',
    fontSize: '1rem',
    marginBottom: '16px',
  },
  buttons: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  backBtn: {
    padding: '12px 28px',
    backgroundColor: 'transparent',
    color: '#1a1a1a',
    border: '1px solid #1a1a1a',
    fontSize: '0.9rem',
    cursor: 'pointer',
    borderRadius: '2px',
  },
  homeBtn: {
    padding: '12px 28px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '700',
    borderRadius: '2px',
    display: 'inline-block',
  },
};

export default NotFoundPage;