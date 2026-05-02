import { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

function ImageZoomPortal({ images, initialIndex = 0, onClose }) {
  // Using uncontrolled state for current index within portal
  // since we just pass initialIndex. Or we can lift it up. Let's keep it here.
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrev = useCallback((e) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback((e) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev(e);
      } else if (e.key === 'ArrowRight') {
        handleNext(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Prevent scrolling on background
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handlePrev, handleNext, onClose]);

  const modalContent = (
    <div style={styles.overlay} onClick={onClose}>
      <button style={styles.closeBtn} onClick={onClose} aria-label="Close">
        ✕
      </button>

      {images.length > 1 && (
        <button
          style={{ ...styles.navBtn, left: '20px' }}
          onClick={handlePrev}
          aria-label="Previous image"
        >
          ‹
        </button>
      )}

      <div style={styles.imageContainer} onClick={e => e.stopPropagation()}>
        <img
          src={images[currentIndex]}
          alt={`Zoomed view ${currentIndex + 1}`}
          style={styles.image}
        />
        <div style={styles.counter}>
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && (
        <button
          style={{ ...styles.navBtn, right: '20px' }}
          onClick={handleNext}
          aria-label="Next image"
        >
          ›
        </button>
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(5px)',
  },
  closeBtn: {
    position: 'absolute',
    top: '24px',
    right: '32px',
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '2rem',
    cursor: 'pointer',
    zIndex: 10000,
    padding: '10px',
    opacity: 0.8,
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: '#ffffff',
    fontSize: '3rem',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: '50%',
    zIndex: 10000,
    transition: 'background-color 0.2s',
  },
  imageContainer: {
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '85vh',
    objectFit: 'contain',
    borderRadius: '4px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  },
  counter: {
    color: '#ffffff',
    marginTop: '16px',
    fontSize: '0.9rem',
    letterSpacing: '2px',
    opacity: 0.8,
  },
};

export default ImageZoomPortal;
