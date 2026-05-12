// src/pages/ProductDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Badge from '../components/Badge';
import PriceDisplay from '../components/PriceDisplay';
import LazyImage from '../components/LazyImage';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ImageZoomPortal from '../components/ImageZoomPortal';

function ProductDetailPage() {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setIsLoading(true);
        setError(null);
        setSelectedSize(null);
        setSelectedImage(0);

        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
    window.scrollTo(0, 0);
  }, [productId]);

  function handleAddToCart() {
    if (!selectedSize) {
      showError('Please select a size first');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize);
    }
    showSuccess(`${quantity} × ${product.name} (${selectedSize}) added to cart!`);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  }

  if (isLoading) return <LoadingSpinner message="Refining product details..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => navigate(`/products/${productId}`)} />;
  if (!product) return <ErrorMessage message="Product not found" />;

  const images = product.images || [product.image];

  return (
    <>
      <style>{detailCSS}</style>
      <div className="pdp">
        <nav className="pdp-nav">
          <Link to="/" className="pdp-nav__link">Home</Link>
          <span className="pdp-nav__sep">/</span>
          <Link to="/products" className="pdp-nav__link">Collection</Link>
          <span className="pdp-nav__sep">/</span>
          <span className="pdp-nav__curr">{product.name}</span>
        </nav>

        <div className="pdp-main">
          {/* Gallery */}
          <div className="pdp-gallery">
            <div className="pdp-gallery__main" onClick={() => setIsZoomOpen(true)}>
              <LazyImage
                src={images[selectedImage]}
                alt={product.name}
                className="pdp-gallery__img"
              />
              {product.badge && (
                <div className="pdp-gallery__badge">
                  <Badge type={product.badge} />
                </div>
              )}
              <div className="pdp-gallery__zoom-hint">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                <span>Click to zoom</span>
              </div>
            </div>

            <div className="pdp-gallery__thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`pdp-gallery__thumb ${selectedImage === i ? 'pdp-gallery__thumb--active' : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="pdp-info">
            <header className="pdp-header">
              <h1 className="pdp-title">{product.name}</h1>
              <div className="pdp-rating">
                <div className="pdp-stars">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={i < Math.floor(product.rating) ? '#c9a84c' : 'rgba(255,255,255,0.1)'}
                      stroke={i < Math.floor(product.rating) ? '#c9a84c' : 'rgba(255,255,255,0.2)'}
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <span className="pdp-rating-text">{product.rating} ({product.reviewCount} reviews)</span>
              </div>
            </header>

            <div className="pdp-price">
              <PriceDisplay price={product.price} originalPrice={product.originalPrice} />
            </div>

            <p className="pdp-desc">{product.description}</p>

            <div className="pdp-divider" />

            {/* Colors */}
            <div className="pdp-option">
              <label className="pdp-option__label">
                Color: <span>{product.colorNames?.[selectedColor]}</span>
              </label>
              <div className="pdp-swatches">
                {product.colors?.map((color, i) => (
                  <button
                    key={i}
                    className={`pdp-swatch ${selectedColor === i ? 'pdp-swatch--active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(i)}
                    title={product.colorNames?.[i]}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="pdp-option">
              <label className="pdp-option__label">
                Size: <span className={!selectedSize ? 'pdp-option__req' : ''}>{selectedSize || 'Select Size'}</span>
              </label>
              <div className="pdp-sizes">
                {product.sizes?.map(size => (
                  <button
                    key={size}
                    className={`pdp-size-btn ${selectedSize === size ? 'pdp-size-btn--active' : ''}`}
                    onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="pdp-option">
              <label className="pdp-option__label">Quantity:</label>
              <div className="pdp-qty">
                <button className="pdp-qty__btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <span className="pdp-qty__val">{quantity}</span>
                <button className="pdp-qty__btn" onClick={() => setQuantity(q => Math.min(10, q + 1))}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
            </div>

            {/* Stock */}
            <div className={`pdp-stock ${product.inStock ? 'pdp-stock--in' : 'pdp-stock--out'}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                {product.inStock 
                  ? <polyline points="20 6 9 17 4 12" />
                  : <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                }
              </svg>
              <span>{product.inStock ? `In Stock (${product.stockCount} available)` : 'Out of Stock'}</span>
            </div>

            {/* Actions */}
            <div className="pdp-actions">
              <button
                className={`pdp-cart-btn ${addedToCart ? 'pdp-cart-btn--success' : ''}`}
                disabled={!product.inStock}
                onClick={handleAddToCart}
              >
                {addedToCart ? (
                  <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '8px' }}><polyline points="20 6 9 17 4 12" /></svg>Added!</>
                ) : (
                  product.inStock ? `Add to Cart` : 'Out of Stock'
                )}
              </button>
              <button className="pdp-wish-btn" onClick={() => navigate('/cart')}>
                View Shopping Cart
              </button>
            </div>

            <button className="pdp-back" onClick={() => navigate('/products')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back to Collection
            </button>
          </div>
        </div>
      </div>

      {isZoomOpen && (
        <ImageZoomPortal
          images={images}
          initialIndex={selectedImage}
          onClose={() => setIsZoomOpen(false)}
        />
      )}
    </>
  );
}

const detailCSS = `
  .pdp {
    max-width: 1300px;
    margin: 0 auto;
    padding: 100px 24px;
    background: #0a0a0a;
  }
  .pdp-nav {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 48px;
    font-family: 'Inter', sans-serif;
  }
  .pdp-nav__link {
    color: #4a3f35;
    text-decoration: none;
    font-size: 0.75rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-weight: 600;
    transition: color 0.2s;
  }
  .pdp-nav__link:hover { color: #c9a84c; }
  .pdp-nav__sep { color: #2a2218; font-size: 0.7rem; }
  .pdp-nav__curr { color: #f5efe6; font-size: 0.75rem; letter-spacing: 1px; text-transform: uppercase; font-weight: 700; }

  .pdp-main {
    display: grid;
    grid-template-columns: 1fr;
    gap: 60px;
  }
  @media (min-width: 900px) {
    .pdp-main { grid-template-columns: 1.2fr 1fr; }
  }

  /* Gallery */
  .pdp-gallery {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .pdp-gallery__main {
    position: relative;
    aspect-ratio: 3/4;
    background: #141414;
    border-radius: 4px;
    overflow: hidden;
    cursor: zoom-in;
    border: 1px solid rgba(255,255,255,0.05);
  }
  .pdp-gallery__badge {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 5;
  }
  .pdp-gallery__zoom-hint {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: rgba(10,10,10,0.6);
    backdrop-filter: blur(8px);
    padding: 8px 16px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #f5efe6;
    font-size: 0.7rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-weight: 600;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
  }
  .pdp-gallery__main:hover .pdp-gallery__zoom-hint {
    opacity: 1;
    transform: translateY(0);
  }

  .pdp-gallery__thumbs {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  .pdp-gallery__thumb {
    width: 80px;
    height: 100px;
    flex-shrink: 0;
    background: #141414;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 4px;
    padding: 0;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;
  }
  .pdp-gallery__thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.5;
    transition: opacity 0.2s;
  }
  .pdp-gallery__thumb:hover img { opacity: 0.8; }
  .pdp-gallery__thumb--active {
    border-color: #c9a84c;
    box-shadow: 0 0 0 2px rgba(201,168,76,0.2);
  }
  .pdp-gallery__thumb--active img { opacity: 1; }

  /* Info */
  .pdp-info {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  .pdp-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(2rem, 4vw, 3rem);
    color: #f5efe6;
    margin: 0;
    line-height: 1.1;
  }
  .pdp-rating {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 12px;
  }
  .pdp-stars { display: flex; gap: 4px; }
  .pdp-rating-text {
    font-size: 0.75rem;
    color: #4a3f35;
    letter-spacing: 0.5px;
    font-family: 'Inter', sans-serif;
  }

  .pdp-price {
    padding: 24px 0;
    border-top: 1px solid rgba(255,255,255,0.06);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .pdp-desc {
    color: #b0a090;
    font-size: 0.95rem;
    line-height: 1.8;
    margin: 0;
  }
  .pdp-divider { height: 1px; background: rgba(255,255,255,0.06); }

  /* Options */
  .pdp-option {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .pdp-option__label {
    font-size: 0.72rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #4a3f35;
    font-weight: 700;
  }
  .pdp-option__label span { color: #f5efe6; margin-left: 8px; }
  .pdp-option__req { color: #e87b7b !important; font-style: italic; opacity: 0.8; }

  .pdp-swatches { display: flex; gap: 12px; }
  .pdp-swatch {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #0a0a0a;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
    cursor: pointer;
    transition: all 0.2s;
  }
  .pdp-swatch--active {
    box-shadow: 0 0 0 2px #c9a84c;
    transform: scale(1.15);
  }

  .pdp-sizes { display: flex; gap: 10px; flex-wrap: wrap; }
  .pdp-size-btn {
    min-width: 52px;
    height: 44px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    color: #b0a090;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 4px;
  }
  .pdp-size-btn:hover { border-color: rgba(201,168,76,0.5); color: #f5efe6; }
  .pdp-size-btn--active {
    background: #c9a84c;
    color: #0a0a0a;
    border-color: #c9a84c;
    font-weight: 700;
  }

  /* Qty */
  .pdp-qty {
    display: flex;
    align-items: center;
    width: fit-content;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 4px;
    overflow: hidden;
  }
  .pdp-qty__btn {
    width: 44px;
    height: 44px;
    border: none;
    background: transparent;
    color: #b0a090;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pdp-qty__btn:hover { background: rgba(255,255,255,0.05); color: #f5efe6; }
  .pdp-qty__val {
    width: 50px;
    text-align: center;
    color: #f5efe6;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
  }

  /* Stock */
  .pdp-stock {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    font-weight: 600;
  }
  .pdp-stock--in { color: #4caf7d; }
  .pdp-stock--out { color: #e87b7b; }

  /* Actions */
  .pdp-actions {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 10px;
  }
  .pdp-cart-btn {
    width: 100%;
    padding: 20px;
    background: #c9a84c;
    color: #0a0a0a;
    border: none;
    border-radius: 4px;
    font-size: 0.9rem;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pdp-cart-btn:hover:not(:disabled) {
    background: #e0c06e;
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(201,168,76,0.3);
  }
  .pdp-cart-btn--success {
    background: #4caf7d !important;
    color: #fff !important;
  }
  .pdp-cart-btn:disabled {
    background: #1a1a1a;
    color: #4a3f35;
    cursor: not-allowed;
  }

  .pdp-wish-btn {
    width: 100%;
    padding: 18px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    color: #b0a090;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }
  .pdp-wish-btn:hover {
    border-color: rgba(255,255,255,0.3);
    color: #f5efe6;
    background: rgba(255,255,255,0.03);
  }

  .pdp-back {
    display: flex;
    align-items: center;
    gap: 10px;
    background: none;
    border: none;
    color: #4a3f35;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    padding: 10px 0;
    transition: color 0.2s;
    margin-top: 10px;
  }
  .pdp-back:hover { color: #c9a84c; }
`;

export default ProductDetailPage;