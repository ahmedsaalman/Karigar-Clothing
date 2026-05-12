// src/components/Welcome.jsx

import { useNavigate } from 'react-router-dom';
import modelHero from '../../photos/model_pics/model4.png';
import articleImg from '../../photos/article_01/blckwh2.png';

function Welcome() {
  const navigate = useNavigate();

  return (
    <>
      <style>{welcomeCSS}</style>

      {/* ── Full-Viewport Hero ── */}
      <section className="hero" id="hero">
        <div
          className="hero__bg"
          style={{ backgroundImage: `url(${modelHero})` }}
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
    min-height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .hero__bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center 20%;
    transform: scale(1.04);
    animation: softHeroScale 8s ease-out forwards;
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
      rgba(10,10,10,0.82) 0%,
      rgba(10,10,10,0.55) 50%,
      rgba(10,10,10,0.78) 100%
    );
  }
  .hero__content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 780px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  .hero__eyebrow {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #c9a84c;
    margin: 0;
  }
  .hero__heading {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(2.8rem, 7vw, 5.5rem);
    font-weight: 900;
    color: #f5efe6;
    line-height: 1.1;
    margin: 0;
    text-shadow: 0 4px 32px rgba(0,0,0,0.5);
  }
  .hero__heading--italic {
    color: #c9a84c;
    font-style: italic;
  }
  .hero__sub {
    font-size: clamp(0.95rem, 2vw, 1.15rem);
    color: rgba(245, 239, 230, 0.72);
    max-width: 480px;
    margin: 0;
    line-height: 1.7;
  }
  .hero__actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 8px;
  }

  /* Scroll hint */
  .hero__scroll-hint {
    position: absolute;
    bottom: 36px;
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
    height: 40px;
    background: linear-gradient(to bottom, rgba(201,168,76,0.8), transparent);
  }
  .hero__scroll-hint span {
    font-size: 0.62rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(201,168,76,0.7);
    font-family: 'Inter', sans-serif;
  }

  /* ── Editorial Strip ── */
  .editorial-strip {
    background: #141414;
    border-top: 1px solid rgba(255,255,255,0.05);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    overflow: hidden;
  }
  .editorial-strip__inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    divide-x: 1px solid rgba(255,255,255,0.06);
  }
  @media (min-width: 640px) {
    .editorial-strip__inner {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  .editorial-strip__item {
    padding: 18px 20px;
    text-align: center;
    border-right: 1px solid rgba(255,255,255,0.06);
  }
  .editorial-strip__item:last-child { border-right: none; }
  .editorial-strip__item span {
    font-size: 0.72rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #6b6055;
    font-weight: 500;
    white-space: nowrap;
  }
  .editorial-strip__item:hover span {
    color: #c9a84c;
    transition: color 0.25s ease;
  }
`;

export default Welcome;