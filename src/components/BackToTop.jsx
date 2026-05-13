// src/components/BackToTop.jsx

import { useState, useEffect } from 'react';

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <>
      <style>{stylesCSS}</style>
      <button
        onClick={scrollToTop}
        className="back-to-top"
        aria-label="Back to top"
        title="Back to top"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
        </svg>
      </button>
    </>
  );
}

const stylesCSS = `
  .back-to-top {
    position: fixed;
    bottom: 30px;
    left: 30px;
    width: 50px;
    height: 50px;
    background: var(--color-gold);
    color: #000000;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    box-shadow: 0 8px 32px rgba(212, 175, 55, 0.25);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: slideUpFade 0.4s ease both;
  }
  .back-to-top:hover {
    transform: translateY(-5px);
    background: var(--color-gold-light);
    box-shadow: 0 12px 40px rgba(212, 175, 55, 0.4);
  }
  .back-to-top:active {
    transform: scale(0.9);
  }

  @keyframes slideUpFade {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 768px) {
    .back-to-top {
      bottom: 20px;
      left: 20px;
      width: 44px;
      height: 44px;
    }
  }
`;

export default BackToTop;
