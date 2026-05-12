// src/components/ErrorMessage.jsx

function ErrorMessage({ message, onRetry }) {
  return (
    <>
      <style>{errorCSS}</style>
      <div className="error-wrap">
        <div className="error-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
          </svg>
        </div>

        <h3 className="error-title">Something went wrong</h3>
        <p className="error-message">
          {message || "We couldn't load the products. Please try again."}
        </p>

        {onRetry && (
          <button onClick={onRetry} className="error-retry-btn">
            Try Again
          </button>
        )}
      </div>
    </>
  );
}

const errorCSS = `
  .error-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 20px;
    gap: 20px;
    text-align: center;
  }
  .error-icon { color: var(--color-error); }
  .error-title {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 800;
    color: #ffffff;
    margin: 0;
  }
  .error-message {
    color: var(--color-text-secondary);
    font-size: 1rem;
    max-width: 400px;
    line-height: 1.6;
    margin: 0;
  }
  .error-retry-btn {
    margin-top: 8px;
    padding: 14px 36px;
    background: var(--color-gold);
    color: #000000;
    border: none;
    border-radius: 6px;
    font-family: var(--font-display);
    font-size: 0.9rem;
    font-weight: 900;
    letter-spacing: 1.5px;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.3s;
  }
  .error-retry-btn:hover {
    background: var(--color-gold-light);
    transform: translateY(-2px);
    box-shadow: var(--shadow-gold);
  }
`;

export default ErrorMessage;