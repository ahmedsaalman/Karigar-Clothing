// src/components/StatsBar.jsx

import { useEffect, useRef, useState } from 'react';

function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatItem({ value, label, suffix = '', index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, 1800, visible);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{statCSS}</style>
      <div
        ref={ref}
        className="stat-item"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <p className="stat-value">
          {count.toLocaleString()}<span className="stat-suffix">{suffix}</span>
        </p>
        <p className="stat-label">{label}</p>
      </div>
    </>
  );
}

function StatsBar({
  products = 0,
  happyCustomers = 0,
  yearsOfCraft = 0,
  citiesDelivered = 0,
}) {
  const stats = [
    { label: 'Curated Products', value: products, suffix: '+' },
    { label: 'Happy Customers', value: happyCustomers, suffix: '+' },
    { label: 'Years of Craft', value: yearsOfCraft, suffix: '' },
    { label: 'Cities Delivered', value: citiesDelivered, suffix: '+' },
  ];

  return (
    <section className="statsbar">
      <div className="statsbar__inner">
        {stats.map((item, i) => (
          <StatItem
            key={item.label}
            value={item.value}
            label={item.label}
            suffix={item.suffix}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}

const statCSS = `
  .statsbar {
    background: var(--color-bg-elevated);
    border-bottom: 1px solid var(--color-border);
  }
  .statsbar__inner {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 900px) {
    .statsbar__inner { grid-template-columns: repeat(4, 1fr); }
  }
  .stat-item {
    padding: 32px 16px;
    text-align: center;
    border-right: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    animation: slideUp 0.6s ease both;
    position: relative;
  }
  @media (min-width: 900px) {
    .stat-item { border-bottom: none; padding: 48px 20px; }
  }
  .stat-item:nth-child(2n) { border-right: none; }
  @media (min-width: 900px) {
    .stat-item:nth-child(2n) { border-right: 1px solid var(--color-border); }
    .stat-item:last-child { border-right: none; }
  }
  .stat-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: var(--color-gold);
    transition: width 0.6s ease;
  }
  .stat-item:hover::after { width: 40%; }
  .stat-value {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 6vw, 2.8rem);
    font-weight: 800;
    color: var(--color-gold);
    line-height: 1;
    margin-bottom: 8px;
  }
  .stat-suffix {
    font-size: 0.6em;
    vertical-align: super;
    color: var(--color-gold);
    opacity: 0.8;
  }
  .stat-label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--color-text-muted);
    margin: 0;
    line-height: 1.4;
  }

`;

export default StatsBar;
