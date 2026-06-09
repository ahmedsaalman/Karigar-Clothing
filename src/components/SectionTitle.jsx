// src/components/SectionTitle.jsx

function SectionTitle({
  title,
  subtitle,
  eyebrow,
  align = 'center',
  theme = 'dark',
}) {
  const isDark = theme === 'dark';
  const isCenter = align === 'center';

  return (
    <>
      <style>{sectionTitleCSS}</style>
      <div className={`section-title section-title--${align} section-title--${theme}`}>
        {eyebrow && (
          <p className="section-title__eyebrow">{eyebrow}</p>
        )}
        <div className={`section-title__bar ${isCenter ? 'section-title__bar--center' : ''}`} />
        <h2 className="section-title__heading">{title}</h2>
        {subtitle && (
          <p className="section-title__sub">{subtitle}</p>
        )}
      </div>
    </>
  );
}

const sectionTitleCSS = `
  .section-title {
    margin-bottom: 56px;
  }
  .section-title--center { text-align: center; }
  .section-title--left   { text-align: left; }

  .section-title__eyebrow {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--color-gold);
    margin-bottom: 16px;
  }
  .section-title__bar {
    width: 0;
    height: 2px;
    background: linear-gradient(to right, var(--color-gold), rgba(255,84,0,0.1));
    margin-bottom: 20px;
    animation: expandLine 0.8s 0.2s ease forwards;
    border-radius: 2px;
  }
  .section-title__bar--center {
    margin-left: auto;
    margin-right: auto;
  }
  .section-title__heading {
    font-family: var(--font-display);
    font-size: clamp(1.6rem, 3.5vw, 2.4rem);
    font-weight: 800;
    color: var(--color-text-primary);
    letter-spacing: 0.5px;
    margin-bottom: 14px;
    line-height: 1.2;
  }
  .section-title__sub {
    font-size: 0.95rem;
    color: var(--color-text-secondary);
    line-height: 1.7;
    max-width: 520px;
    margin: 0 auto;
  }
  .section-title--left .section-title__sub { margin: 0; }
`;

export default SectionTitle;