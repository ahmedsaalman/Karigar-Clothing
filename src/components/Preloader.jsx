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
    img.onload = () => {
      setProgress(100);
      setTimeout(() => {
        setIsLoaded(true);
        // Save to session storage so it doesn't show again in the same session
        sessionStorage.setItem('karigar_loaded', 'true');
      }, 600);
    };

    return () => clearInterval(interval);
  }, []);

  // Check if already loaded in this session
  const alreadyLoaded = sessionStorage.getItem('karigar_loaded') === 'true';
  if (alreadyLoaded || isLoaded) return null;

  return (
    <>
      <style>{preloaderCSS}</style>
      <div className="preloader">
        <div className="preloader__content">
          <div className="preloader__brand">
            <span className="brand-name">Karigar</span>
            <span className="brand-co">Co.</span>
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
    background: #000000;
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
  .brand-name { color: #ffffff; }
  .brand-co { color: #FFB800; }

  .preloader__track {
    width: 100%;
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .preloader__bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: #FFB800;
    box-shadow: 0 0 15px rgba(255, 184, 0, 0.5);
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
