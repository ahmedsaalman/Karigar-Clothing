// src/pages/HomePage.jsx

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Welcome from '../components/Welcome';
import ProductGrid from '../components/ProductGrid';
import StatsBar from '../components/StatsBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import useFetch from '../hooks/useFetch';
import { getProducts } from '../services/productService';
import apiClient from '../services/apiClient';

function HomePage() {
  const navigate = useNavigate();

  const promoUrl = apiClient.getAssetUrl('/assets/photos/model_pics/model6.jpg');
  const article1 = apiClient.getAssetUrl('/assets/photos/article_01/blckwh1.png');
  const article2 = apiClient.getAssetUrl('/assets/photos/article_02/001.png');
  const article3 = apiClient.getAssetUrl('/assets/photos/article_02/002.png');

  const fetchFeatured = useCallback(
    () => getProducts().then(p => p.filter(x => x.featured)),
    []
  );
  const { data: featuredProducts, isLoading, error, refetch } = useFetch(fetchFeatured);

  return (
    <>
      <style>{homeCSS}</style>

      {/* ── Hero ── */}
      <Welcome />

      {/* ── Stats ── */}
      <StatsBar products={150} happyCustomers={10000} yearsOfCraft={8} citiesDelivered={45} />

      {/* ── Featured Collection ── */}
      <div className="home-featured">
        {isLoading && <LoadingSpinner message="Loading featured collection..." />}
        {!isLoading && error && <ErrorMessage message={error} onRetry={refetch} />}
        {!isLoading && !error && featuredProducts && (
          <ProductGrid
            products={featuredProducts}
            title="Featured Collection"
            subtitle="Hand-picked by our style experts."
            eyebrow="Curated for you"
            columns={3}
          />
        )}
      </div>

      {/* ── Karigar Promise Banner ── */}
      <section className="promise-banner">
        <div
          className="promise-banner__bg"
          style={{ backgroundImage: `url(${promoUrl})` }}
        />
        <div className="promise-banner__overlay" />
        <div className="promise-banner__content">
          <p className="promise-banner__eyebrow">The Karigar Promise</p>
          <h2 className="promise-banner__title">Every Shirt.<br />Perfectly Crafted.</h2>
          <p className="promise-banner__sub">
            We use only the finest fabrics sourced from certified mills.
            Each shirt goes through 47 quality checks before it reaches you.
          </p>
          <button className="btn-primary" onClick={() => navigate('/products')}>
            Shop Full Collection
          </button>
        </div>
      </section>

      {/* ── Category Teasers ── */}
      <section className="cat-teasers">
        <div className="cat-teasers__inner">
          <div className="cat-teasers__header">
            <p className="cat-teasers__eyebrow">Browse By Style</p>
            <h2 className="cat-teasers__title">Shop the Range</h2>
          </div>
          <div className="cat-teasers__grid">
            {[
              { img: article1, label: 'Formal', cat: 'formal', desc: 'Boardroom-ready.' },
              { img: article2, label: 'Casual', cat: 'casual', desc: 'Relaxed perfection.' },
              { img: article3, label: 'Premium', cat: 'premium', desc: 'Uncompromised quality.' },
            ].map(({ img, label, cat, desc }) => (
              <div
                key={cat}
                className="cat-card"
                onClick={() => navigate(`/products?category=${cat}`)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate(`/products?category=${cat}`)}
              >
                <div className="cat-card__img-wrap">
                  <img src={img} alt={label} className="cat-card__img" />
                  <div className="cat-card__overlay" />
                </div>
                <div className="cat-card__content">
                  <p className="cat-card__desc">{desc}</p>
                  <h3 className="cat-card__label">{label}</h3>
                  <span className="cat-card__cta">
                    Shop Now 
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const homeCSS = `
  .home-featured {
    background: var(--color-bg);
  }

  /* ── Promise Banner ── */
  .promise-banner {
    position: relative;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  @media (min-width: 768px) {
    .promise-banner { min-height: 520px; }
  }
  .promise-banner__bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    transform: scale(1.05);
    transition: transform 8s ease;
  }
  .promise-banner:hover .promise-banner__bg { transform: scale(1); }
  .promise-banner__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(0,0,0,0.95) 0%,
      rgba(0,0,0,0.7) 100%
    );
  }
  .promise-banner__content {
    position: relative;
    z-index: 2;
    max-width: 640px;
    text-align: center;
    padding: 60px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .promise-banner__eyebrow {
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--color-gold);
    margin: 0;
    font-family: var(--font-body);
  }
  .promise-banner__title {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 8vw, 3.2rem);
    font-weight: 900;
    color: #ffffff;
    line-height: 1.1;
    margin: 0;
  }
  .promise-banner__sub {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
    max-width: 440px;
    margin: 0;
  }

  /* ── Category Teasers ── */
  .cat-teasers {
    background: var(--color-bg-elevated);
    padding: 80px 0;
  }
  .cat-teasers__inner {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 0 20px;
  }
  .cat-teasers__header {
    text-align: center;
    margin-bottom: 48px;
  }
  .cat-teasers__eyebrow {
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--color-gold);
    margin-bottom: 12px;
    font-family: var(--font-body);
  }
  .cat-teasers__title {
    font-family: var(--font-display);
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    font-weight: 800;
    color: #ffffff;
    margin: 0;
  }
  .cat-teasers__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }
  @media (min-width: 640px) {
    .cat-teasers__grid { grid-template-columns: repeat(3, 1fr); }
  }

  .cat-card {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    aspect-ratio: 3 / 4;
    border: 1px solid var(--color-border);
    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1),
                box-shadow 0.4s ease,
                border-color 0.3s ease;
  }
  .cat-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px var(--color-gold-glow);
    border-color: var(--color-gold-glow);
  }
  .cat-card__img-wrap {
    position: absolute;
    inset: 0;
  }
  .cat-card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.55s cubic-bezier(0.4,0,0.2,1);
  }
  .cat-card:hover .cat-card__img { transform: scale(1.06); }
  .cat-card__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0,0,0,0.9) 0%,
      rgba(0,0,0,0.2) 60%,
      transparent 100%
    );
    transition: background 0.3s ease;
  }
  .cat-card__content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 24px 20px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .cat-card__desc {
    font-size: 0.72rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--color-gold);
    opacity: 0.85;
    margin: 0;
    font-family: var(--font-body);
    font-weight: 700;
  }
  .cat-card__label {
    font-family: var(--font-display);
    font-size: 1.6rem;
    font-weight: 900;
    color: #ffffff;
    margin: 0;
    line-height: 1.1;
  }
  .cat-card__cta {
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--color-gold);
    font-family: var(--font-body);
    opacity: 0;
    transform: translateX(-6px);
    transition: opacity 0.25s ease, transform 0.25s ease;
    margin-top: 4px;
  }
  .cat-card:hover .cat-card__cta {
    opacity: 1;
    transform: translateX(0);
  }
`;

export default HomePage;