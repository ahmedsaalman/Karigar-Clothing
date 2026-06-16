import { useState, useEffect } from 'react';

const HERO_IMAGE_URL = 'https://images.augustman.com/wp-content/uploads/sites/2/2023/09/22195652/Untitled-2023-09-22T140903.658.png';

function Preloader() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress bar
    const interval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + Math.random() * 15 : prev));
    }, 200);

    // Preload the main hero image
    const img = new Image();
    img.src = HERO_IMAGE_URL;

    // Safety timeout in case load takes too long or hangs
    const safetyTimeout = setTimeout(() => {
      setProgress(100);
      setIsLoaded(true);
      sessionStorage.setItem('aamadmii_loaded', 'true');
    }, 3500);

    img.onload = () => {
      clearTimeout(safetyTimeout);
      setProgress(100);
      setTimeout(() => {
        setIsLoaded(true);
        // Save to session storage so it doesn't show again in the same session
        sessionStorage.setItem('aamadmii_loaded', 'true');
      }, 600);
    };

    img.onerror = () => {
      clearTimeout(safetyTimeout);
      setProgress(100);
      setIsLoaded(true);
      sessionStorage.setItem('aamadmii_loaded', 'true');
    };

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimeout);
    };
  }, []);

  // Check if already loaded in this session
  const alreadyLoaded = sessionStorage.getItem('aamadmii_loaded') === 'true';
  if (alreadyLoaded || isLoaded) return null;

  return (
    <>
      <style>{preloaderCSS}</style>
      <div className="preloader">
        <div className="preloader__content">
          <div className="preloader__brand">
            <span className="brand-name">Aam</span>
            <span className="brand-co">Admii</span>
          </div>
          <div className="preloader__track">
            <div 
              className="preloader__bar" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="preloader__text">Crafting Excellence...</p>
        </div>
      </div>
    </>
  );
}

const preloaderCSS = `
  .preloader {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .preloader__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    width: 280px;
  }

  .preloader__brand {
    font-family: 'Outfit', sans-serif;
    font-size: 2.5rem;
    font-weight: 800;
    letter-spacing: 2px;
  }
  .brand-name { color: #111111; }
  .brand-co { color: var(--color-gold); }

  .preloader__track {
    width: 100%;
    height: 2px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .preloader__bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--color-gold);
    box-shadow: 0 0 15px var(--color-gold-glow);
    transition: width 0.4s cubic-bezier(0.1, 0, 0.3, 1);
  }

  .preloader__text {
    font-family: 'Inter', sans-serif;
    color: #666;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-top: 8px;
    animation: preloaderPulse 1.5s infinite ease-in-out;
  }

  @keyframes preloaderPulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
`;

export default Preloader;
