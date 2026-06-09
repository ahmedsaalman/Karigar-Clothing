// src/components/Footer.jsx

import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{footerCSS}</style>
      <footer className="footer">

        {/* Top gradient divider */}
        <div className="footer__divider" />

        <div className="footer__main">
          <div className="footer__inner">

            {/* Brand column */}
            <div className="footer__col footer__col--brand">
              <div className="footer__brand">
                <span className="footer__brand-name">Aam</span>
                <span className="footer__brand-co">Admii</span>
              </div>
              <p className="footer__brand-desc">
                Premium shirts crafted for everyone.
                Quality that speaks before you do.
              </p>
              <p className="footer__owner" style={{ fontSize: '0.8rem', color: 'var(--color-gold)', marginBottom: '16px', fontWeight: '700' }}>
                Owner: Ahmed Salman
              </p>
              {/* Social icons */}
              <div className="footer__social">
                {[
                  { label: 'Instagram', href: 'https://www.instagram.com/_1hmed_', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/></svg> },
                  { label: 'GitHub', href: 'https://github.com/ahmedsaalman', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg> },
                  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ahmed-salman-891716295/', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="footer__social-link" title={s.label} aria-label={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="footer__col">
              <h4 className="footer__col-title">Quick Links</h4>
              <ul className="footer__links">
                {[
                  { label: 'Home', to: '/' },
                  { label: 'Collection', to: '/products' },
                  { label: 'About Us', to: '/about' },
                  { label: 'FAQs', to: '/faq' },
                ].map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="footer__link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="footer__col">
              <h4 className="footer__col-title">Contact</h4>
              <ul className="footer__contact-list">
                {[
                  { 
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, 
                    text: 'Karachi, Pakistan' 
                  },
                  { 
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, 
                    text: '+92 300 1234567' 
                  },
                  { 
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, 
                    text: 'hello@aamadmii.com' 
                  },
                ].map(({ icon, text }) => (
                  <li key={text} className="footer__contact-item">
                    <span className="footer__contact-icon">{icon}</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="footer__col">
              <h4 className="footer__col-title">Newsletter</h4>
              <p className="footer__nl-desc">
                Stay updated with new arrivals and exclusive offers.
              </p>
              <form className="footer__nl-form" onSubmit={e => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="footer__nl-input"
                  aria-label="Email address"
                />
                <button type="submit" className="footer__nl-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <div className="footer__bottom-inner">
            <p className="footer__copy">
              © {currentYear} Aam Admii. All rights reserved.
            </p>
            <p className="footer__made">
              Crafted by Ahmed Salman in Pakistan
            </p>
          </div>
        </div>

      </footer>
    </>
  );
}

const footerCSS = `
  .footer {
    background-color: var(--color-bg-elevated);
    border-top: 1px solid var(--color-border);
    padding: 100px 20px 40px;
    color: var(--color-text-secondary);
  }
  .footer__divider {
    height: 1px;
    background: linear-gradient(to right, transparent, var(--color-gold), transparent);
  }
  .footer__main {
    padding: 72px 20px 56px;
  }
  .footer__inner {
    max-width: var(--container-max);
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 60px;
  }
  @media (min-width: 900px) {
    .footer__inner { grid-template-columns: 1.5fr 1fr 1fr 1.2fr; gap: 40px; }
  }

  /* Brand */
  .footer__brand {
    display: flex;
    align-items: baseline;
    gap: 3px;
    margin-bottom: 16px;
  }
  .footer__brand-name {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 800;
    color: #111111;
    letter-spacing: 1px;
  }
  .footer__brand-co {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--color-gold);
  }
  .footer__brand-desc {
    font-size: 0.85rem;
    color: var(--color-text-muted);
    line-height: 1.8;
    max-width: 260px;
    margin-bottom: 24px;
  }
  .footer__social {
    display: flex;
    gap: 10px;
  }
  .footer__social-link {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-muted);
    transition: all 0.2s ease;
  }
  .footer__social-link:hover {
    color: var(--color-gold);
    border-color: var(--color-border-hover);
    background: var(--color-gold-dim);
    transform: translateY(-2px);
  }

  /* Links */
  .footer__col-title {
    font-family: var(--font-body);
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #111111;
    margin-bottom: 20px;
  }
  .footer__links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .footer__link {
    font-size: 0.85rem;
    color: var(--color-text-muted);
    text-decoration: none;
    transition: all 0.2s ease;
    display: inline-block;
  }
  .footer__link:hover {
    color: var(--color-gold);
    transform: translateX(4px);
  }

  /* Contact */
  .footer__contact-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .footer__contact-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.84rem;
    color: var(--color-text-muted);
  }
  .footer__contact-icon { font-size: 0.9rem; color: var(--color-gold); opacity: 0.8; }

  /* Newsletter */
  .footer__nl-desc {
    font-size: 0.82rem;
    color: var(--color-text-muted);
    line-height: 1.7;
    margin-bottom: 16px;
  }
  .footer__nl-form {
    display: flex;
    gap: 0;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    overflow: hidden;
    transition: border-color 0.2s ease;
  }
  .footer__nl-form:focus-within {
    border-color: var(--color-gold);
  }
  .footer__nl-input {
    flex: 1;
    padding: 11px 14px;
    background: rgba(0,0,0,0.02);
    border: none;
    font-size: 0.84rem;
    color: #111111;
    font-family: var(--font-body);
    min-width: 0;
  }
  .footer__nl-input::placeholder { color: var(--color-text-muted); }
  .footer__nl-btn {
    padding: 11px 18px;
    background: var(--color-gold);
    color: #ffffff;
    border: none;
    font-size: 1rem;
    font-weight: 800;
    cursor: pointer;
    transition: background 0.2s ease;
    flex-shrink: 0;
  }
  .footer__nl-btn:hover { background: var(--color-gold-light); }

  /* Bottom */
  .footer__bottom {
    border-top: 1px solid var(--color-border);
    padding: 20px;
  }
  .footer__bottom-inner {
    max-width: var(--container-max);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }
  .footer__copy,
  .footer__made {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    margin: 0;
    font-family: var(--font-body);
  }
  .footer__made { color: var(--color-text-muted); }
`;

export default Footer;