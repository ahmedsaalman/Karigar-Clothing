// src/components/ErrorMessage.jsx

function ErrorMessage({ message, onRetry }) {
  return (
    <div style={styles.container}>

      <div style={styles.icon}>⚠️</div>

      <h3 style={styles.title}>Something went wrong</h3>

      <p style={styles.message}>
        {/* Show the actual error, or a default message */}
        {message || "We couldn't load the products. Please try again."}
      </p>

      {/* Only show retry button if onRetry function was passed */}
      {onRetry && (
        <button
          onClick={onRetry}
          style={styles.retryBtn}
        >
          Try Again
        </button>
      )}

    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    gap: '16px',
    textAlign: 'center',
  },
  icon: {
    fontSize: '3rem',
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  message: {
    color: '#666',
    fontSize: '0.9rem',
    maxWidth: '400px',
    lineHeight: '1.6',
  },
  retryBtn: {
    marginTop: '8px',
    padding: '12px 32px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    fontSize: '0.85rem',
    fontWeight: '700',
    letterSpacing: '1px',
    cursor: 'pointer',
    textTransform: 'uppercase',
  },
};

export default ErrorMessage;