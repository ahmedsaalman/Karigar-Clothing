// src/components/Welcome.jsx

import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

function Welcome() {
  const navigate = useNavigate();

  const heroUrl = 'https://images.augustman.com/wp-content/uploads/sites/2/2023/09/22195652/Untitled-2023-09-22T140903.658.png';

  return (
    <>
      <style>{welcomeCSS}</style>

      {/* ── Full-Viewport Hero ── */}
      <section className="hero" id="hero">
        <img
          src={heroUrl}
          alt="Karigar Collection Hero"
          className="hero__img"
          fetchpriority="high"
        />
        <div className="hero__overlay" />

        <div className="hero__content">
          <p className="hero__eyebrow anim-slide-up">New Collection 2025</p>
          <h1 className="hero__heading anim-slide-up anim-delay-1">
            Dressed to<br />
            <em className="hero__heading--italic">Impress.</em>
          </h1>
          <p className="hero__sub anim-slide-up anim-delay-2">
            Every stitch tells a story of craftsmanship.
          </p>
          <div className="hero__actions anim-slide-up anim-delay-3">
            <button className="btn-primary" onClick={() => navigate('/products')}>
              Shop Collection
            </button>
            <button className="btn-outline" onClick={() => navigate('/about')}>
              Our Story
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll-hint">
          <div className="hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── Editorial Strip ── */}
      <section className="editorial-strip">
        <div className="editorial-strip__inner">
          {['Free shipping over Rs. 5,000', '47 Quality Checks', 'Hassle-free Returns', 'Crafted in Pakistan'].map((item, i) => (
            <div key={i} className="editorial-strip__item">
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

const welcomeCSS = `
  /* ── Hero ── */
  .hero {
    position: relative;
    height: 100vh;
    height: 100svh; /* Small Viewport Height for mobile */
    min-height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .hero__img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 15%; /* Higher vertical focus for desktop faces */
    transform: scale(1.04);
    animation: softHeroScale 8s ease-out forwards;
    z-index: 0;
  }
  @media (max-width: 900px) {
    .hero__img { object-position: center; } /* Revert to center for mobile vertical crops */
  }
  @keyframes softHeroScale {
    from { transform: scale(1.04); }
    to   { transform: scale(1); }
  }
  .hero__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      160deg,
      rgba(10,10,10,0.85) 0%,
      rgba(10,10,10,0.5) 50%,
      rgba(10,10,10,0.8) 100%
    );
  }
  .hero__content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 780px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: -40px; /* Slight offset for visual balance */
  }
  .hero__eyebrow {
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--color-gold);
    margin: 0;
    font-family: var(--font-body);
  }
  .hero__heading {
    font-family: var(--font-display);
    font-size: clamp(2.4rem, 9vw, 5.5rem);
    font-weight: 900;
    color: #ffffff;
    line-height: 1;
    margin: 0;
    text-shadow: 0 4px 32px rgba(0,0,0,0.5);
    text-transform: uppercase;
  }
  .hero__heading--italic {
    color: var(--color-gold);
    font-style: italic;
    display: block;
  }
  .hero__sub {
    font-size: clamp(0.9rem, 2vw, 1.15rem);
    color: var(--color-text-secondary);
    max-width: 440px;
    margin: 0;
    line-height: 1.6;
    font-family: var(--font-body);
    font-weight: 500;
  }
  .hero__actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 10px;
    width: 100%;
  }
  @media (max-width: 480px) {
    .hero__actions > button { width: 100%; }
  }

  /* Scroll hint */
  .hero__scroll-hint {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 2;
    animation: float 2.4s ease-in-out infinite;
  }
  .hero__scroll-line {
    width: 1px;
    height: 30px;
    background: linear-gradient(to bottom, var(--color-gold), transparent);
  }
  .hero__scroll-hint span {
    font-size: 0.58rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--color-gold);
    font-family: var(--font-body);
    font-weight: 800;
    opacity: 0.8;
  }

  /* ── Editorial Strip ── */
  .editorial-strip {
    background: var(--color-bg-elevated);
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    overflow: hidden;
  }
  .editorial-strip__inner {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 900px) {
    .editorial-strip__inner {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  .editorial-strip__item {
    padding: 24px 12px;
    text-align: center;
    border-right: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
  }
  @media (min-width: 900px) {
    .editorial-strip__item { border-bottom: none; }
  }
  .editorial-strip__item:nth-child(2n) { border-right: none; }
  @media (min-width: 900px) {
    .editorial-strip__item:nth-child(2n) { border-right: 1px solid var(--color-border); }
    .editorial-strip__item:last-child { border-right: none; }
  }
  .editorial-strip__item span {
    font-size: 0.65rem;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--color-text-muted);
    font-weight: 700;
    font-family: var(--font-body);
    display: block;
    transition: color 0.3s ease;
  }
  .editorial-strip__item:hover span {
    color: var(--color-gold);
  }

`;

export default Welcome;