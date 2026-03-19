// src/components/LoadingSpinner.jsx

function LoadingSpinner({ message = "Loading products..." }) {
  return (
    <div style={styles.container}>

      {/* The spinning circle */}
      <div style={styles.spinner} />

      {/* Loading message */}
      <p style={styles.message}>{message}</p>

    </div>
  );
}

// The spinning animation uses CSS keyframes
// We inject it as a style tag
const spinnerCSS = `
  @keyframes spin {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    gap: '20px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #f0f0f0',
    borderTop: '4px solid #d4af37',     // gold spinning part
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  message: {
    color: '#888',
    fontSize: '0.9rem',
    letterSpacing: '1px',
  },
};

// This component also injects the CSS animation
function LoadingSpinnerWithStyle(props) {
  return (
    <>
      {/* style tag injects our animation keyframe */}
      <style>{spinnerCSS}</style>
      <LoadingSpinner {...props} />
    </>
  );
}

export default LoadingSpinnerWithStyle;