// src/pages/ProductDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Badge from '../components/Badge';
import PriceDisplay from '../components/PriceDisplay';
import { getProductById } from '../services/productService';


import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ImageZoomPortal from '../components/ImageZoomPortal';

function ProductDetailPage() {

  // Get the :productId from the URL
  const { productId } = useParams();

  // Get cart function from RootLayout's Outlet context
    const { addToCart } = useCart();
    const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // ── STATE ───────────────────────────────────────────
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  // ── FETCH PRODUCT ───────────────────────────────────
  // Re-runs if productId changes (user navigates to different product)
  useEffect(() => {
    async function loadProduct() {
      try {
        setIsLoading(true);
        setError(null);
        // Reset selections when product changes
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
  }, [productId]);
  // productId in dependency array means:
  // "Re-run this effect when productId changes"


  // ── HANDLERS ────────────────────────────────────────
function handleAddToCart() {
  if (!selectedSize) {
    showError('Please select a size first');
    return;
  }
  for (let i = 0; i < quantity; i++) {
    addToCart(product, selectedSize);
  }
  showSuccess(
    `${quantity} × ${product.name} (${selectedSize}) added to cart!`
  );
  setAddedToCart(true);
  setTimeout(() => setAddedToCart(false), 2000);
}

function handleTouchStart(event) {
  setTouchStartX(event.changedTouches[0].clientX);
}

function handleTouchEnd(event) {
  if (touchStartX === null || !product?.images || product.images.length <= 1) return;
  const endX = event.changedTouches[0].clientX;
  const deltaX = touchStartX - endX;
  const threshold = 40;

  if (deltaX > threshold) {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  } else if (deltaX < -threshold) {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  }

  setTouchStartX(null);
}


  // ── LOADING STATE ────────────────────────────────────
  if (isLoading) {
    return <LoadingSpinner message="Loading product details..." />;
  }

  // ── ERROR STATE ──────────────────────────────────────
  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => navigate(`/products/${productId}`)}
      />
    );
  }

  // ── NULL STATE (no product found) ────────────────────
  if (!product) {
    return (
      <ErrorMessage message="Product not found" />
    );
  }


  // ── MAIN RENDER ──────────────────────────────────────
  return (
    <div style={styles.page}>

      {/* Breadcrumb Navigation */}
      <nav style={styles.breadcrumb}>
        <Link to="/" style={styles.breadcrumbLink}>Home</Link>
        <span style={styles.breadcrumbSep}>/</span>
        <Link to="/products" style={styles.breadcrumbLink}>Collection</Link>
        <span style={styles.breadcrumbSep}>/</span>
        <span style={styles.breadcrumbCurrent}>{product.name}</span>
      </nav>


      {/* Main Product Section */}
      <div style={styles.productSection}>

        {/* LEFT: Image Gallery */}
        <div style={styles.gallery}>

          {/* Main Image */}
          <div
            style={styles.mainImageContainer}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={product.images?.[selectedImage] || product.image}
              alt={product.name}
              style={{ ...styles.mainImage, cursor: 'zoom-in' }}
              onClick={() => setIsZoomOpen(true)}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x700?text=Karigar+Co.';
              }}
            />
            {/* Badge on main image */}
            <div style={styles.badgePosition}>
              <Badge type={product.badge} />
            </div>
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div style={styles.thumbnails}>
              {product.images.map((img, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.thumbnail,
                    border: selectedImage === index
                      ? '2px solid #1a1a1a'
                      : '2px solid transparent',
                  }}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    style={styles.thumbnailImage}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x80';
                    }}
                  />
                </div>
              ))}
            </div>
          )}

        </div>


        {/* RIGHT: Product Info */}
        <div style={styles.info}>

          {/* Name and Rating */}
          <h1 style={styles.productName}>{product.name}</h1>

          <div style={styles.ratingRow}>
            <span style={styles.stars}>
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </span>
            <span style={styles.ratingText}>
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div style={styles.priceSection}>
            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
            />
          </div>

          {/* Description */}
          <p style={styles.description}>{product.description}</p>

          <div style={styles.divider} />

          {/* Color Selection */}
          <div style={styles.selectionSection}>
            <p style={styles.selectionLabel}>
              Color:
              <span style={styles.selectionValue}>
                {' '}{product.colorNames?.[selectedColor] || 'Select'}
              </span>
            </p>
            <div style={styles.colorSwatches}>
              {product.colors?.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(index)}
                  style={{
                    ...styles.colorSwatch,
                    backgroundColor: color,
                    border: selectedColor === index
                      ? '3px solid #1a1a1a'
                      : '2px solid transparent',
                    outline: selectedColor === index
                      ? '2px solid #d4af37'
                      : 'none',
                  }}
                  title={product.colorNames?.[index]}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div style={styles.selectionSection}>
            <p style={styles.selectionLabel}>
              Size:
              {selectedSize
                ? <span style={styles.selectionValue}> {selectedSize}</span>
                : <span style={{ color: '#e74c3c', fontStyle: 'italic' }}>
                    {' '}Required — select one
                  </span>
              }
            </p>
            <div style={styles.sizeButtons}>
              {product.sizes?.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(
                    selectedSize === size ? null : size
                  )}
                  style={{
                    ...styles.sizeBtn,
                    backgroundColor: selectedSize === size
                      ? '#1a1a1a' : '#ffffff',
                    color: selectedSize === size ? '#ffffff' : '#333',
                    borderColor: selectedSize === size
                      ? '#1a1a1a' : '#ddd',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div style={styles.selectionSection}>
            <p style={styles.selectionLabel}>Quantity:</p>
            <div style={styles.quantityControl}>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={styles.quantityBtn}
              >
                −
              </button>
              <span style={styles.quantityDisplay}>{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(10, q + 1))}
                style={styles.quantityBtn}
              >
                +
              </button>
            </div>
          </div>

          {/* Stock info */}
          <p style={{
            fontSize: '0.85rem',
            color: product.inStock ? '#27ae60' : '#e74c3c',
            fontWeight: '600',
          }}>
            {product.inStock
              ? `✓ In Stock (${product.stockCount} available)`
              : '✕ Out of Stock'
            }
          </p>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              style={{
                ...styles.addToCartBtn,
                backgroundColor: addedToCart
                  ? '#27ae60'
                  : product.inStock ? '#1a1a1a' : '#ddd',
                cursor: product.inStock ? 'pointer' : 'not-allowed',
              }}
            >
              {addedToCart
                ? `✓ Added ${quantity} to Cart!`
                : product.inStock
                  ? `Add ${quantity > 1 ? `${quantity} ` : ''}to Cart`
                  : 'Out of Stock'
              }
            </button>

            <button
              onClick={() => navigate('/cart')}
              style={styles.viewCartBtn}
            >
              View Cart
            </button>
          </div>

          {/* Back to collection */}
          <button
            onClick={() => navigate('/products')}
            style={styles.backLink}
          >
            ← Back to Collection
          </button>

        </div>
      </div>

      {isZoomOpen && (
        <ImageZoomPortal
          images={product.images || [product.image]}
          initialIndex={selectedImage}
          onClose={() => setIsZoomOpen(false)}
        />
      )}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px 80px',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '40px',
  },
  breadcrumbLink: {
    color: '#888',
    textDecoration: 'none',
    fontSize: '0.85rem',
  },
  breadcrumbSep: {
    color: '#ccc',
    fontSize: '0.85rem',
  },
  breadcrumbCurrent: {
    color: '#1a1a1a',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  productSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'start',
  },
  gallery: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  mainImageContainer: {
    position: 'relative',
    borderRadius: '4px',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    aspectRatio: '3/4',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  badgePosition: {
    position: 'absolute',
    top: '16px',
    left: '16px',
  },
  thumbnails: {
    display: 'flex',
    gap: '8px',
  },
  thumbnail: {
    width: '70px',
    height: '70px',
    borderRadius: '2px',
    overflow: 'hidden',
    cursor: 'pointer',
    flexShrink: 0,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  productName: {
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: '0.5px',
    lineHeight: '1.2',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  stars: {
    color: '#d4af37',
    fontSize: '1rem',
  },
  ratingText: {
    color: '#888',
    fontSize: '0.85rem',
  },
  priceSection: {
    padding: '16px 0',
    borderTop: '1px solid #f0f0f0',
    borderBottom: '1px solid #f0f0f0',
  },
  description: {
    color: '#555',
    fontSize: '0.95rem',
    lineHeight: '1.8',
  },
  divider: {
    height: '1px',
    backgroundColor: '#f0f0f0',
  },
  selectionSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  selectionLabel: {
    fontSize: '0.85rem',
    color: '#555',
    fontWeight: '600',
  },
  selectionValue: {
    color: '#1a1a1a',
    fontWeight: '700',
  },
  colorSwatches: {
    display: 'flex',
    gap: '8px',
  },
  colorSwatch: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'transform 0.15s',
  },
  sizeButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  sizeBtn: {
    padding: '10px 18px',
    border: '1px solid #ddd',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.15s',
    borderRadius: '2px',
    fontWeight: '600',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    width: 'fit-content',
    border: '1px solid #ddd',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  quantityBtn: {
    width: '40px',
    height: '40px',
    border: 'none',
    backgroundColor: '#f5f5f5',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityDisplay: {
    width: '48px',
    textAlign: 'center',
    fontSize: '1rem',
    fontWeight: '600',
    borderLeft: '1px solid #ddd',
    borderRight: '1px solid #ddd',
    lineHeight: '40px',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  addToCartBtn: {
    padding: '16px',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.9rem',
    fontWeight: '700',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    borderRadius: '2px',
  },
  viewCartBtn: {
    padding: '16px',
    backgroundColor: 'transparent',
    color: '#1a1a1a',
    border: '1px solid #1a1a1a',
    fontSize: '0.9rem',
    fontWeight: '700',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    borderRadius: '2px',
  },
  backLink: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '0.85rem',
    cursor: 'pointer',
    textAlign: 'left',
    padding: 0,
    textDecoration: 'underline',
  },
};

export default ProductDetailPage;