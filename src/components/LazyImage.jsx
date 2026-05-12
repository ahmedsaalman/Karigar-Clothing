// src/components/LazyImage.jsx

import { useState, useEffect, useRef } from 'react';

function LazyImage({ src, alt, className, style, containerStyle, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '150px' }
    );
    if (wrapRef.current) observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{lazyCSS}</style>
      <div
        ref={wrapRef}
        className="lazy-wrap"
        style={containerStyle}
      >
        {/* Dark shimmer while loading */}
        {!isLoaded && (
          <div className="lazy-shimmer" />
        )}

        {isInView && (
          <img
            src={src}
            alt={alt}
            className={className}
            onLoad={() => setIsLoaded(true)}
            style={{
              ...style,
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.45s ease',
            }}
            {...props}
          />
        )}
      </div>
    </>
  );
}

const lazyCSS = `
  .lazy-wrap {
    position: absolute;
    inset: 0;
    background: #141414;
    overflow: hidden;
  }
  .lazy-shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(20,20,20,0) 0%,
      rgba(255,255,255,0.03) 50%,
      rgba(20,20,20,0) 100%
    );
    background-size: 200% 100%;
    animation: lazyShimmer 1.5s infinite;
  }
  @keyframes lazyShimmer {
    0% { background-position: -100% 0; }
    100% { background-position: 100% 0; }
  }
`;

export default LazyImage;
