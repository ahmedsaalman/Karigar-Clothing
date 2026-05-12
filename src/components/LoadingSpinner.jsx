// src/components/LoadingSpinner.jsx

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <>
      <style>{spinnerCSS}</style>
      <div className="spinner-wrap">
        <div className="spinner-ring">
          <div className="spinner-ring__outer" />
          <div className="spinner-ring__inner" />
        </div>
        {message && <p className="spinner-msg">{message}</p>}
      </div>
    </>
  );
}

const spinnerCSS = `
  .spinner-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    gap: 20px;
    min-height: 200px;
  }
  .spinner-ring {
    position: relative;
    width: 52px;
    height: 52px;
  }
  .spinner-ring__outer {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid rgba(201, 168, 76, 0.12);
    border-top-color: #c9a84c;
    animation: spin 0.9s linear infinite;
  }
  .spinner-ring__inner {
    position: absolute;
    inset: 8px;
    border-radius: 50%;
    border: 1.5px solid rgba(201, 168, 76, 0.08);
    border-bottom-color: rgba(201, 168, 76, 0.5);
    animation: spin 0.6s linear infinite reverse;
  }
  .spinner-msg {
    font-size: 0.78rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #4a3f35;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    margin: 0;
  }
`;

export default LoadingSpinner;