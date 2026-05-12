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
                <span className="footer__brand-name">Karigar</span>
                <span className="footer__brand-co">Co.</span>
              </div>
              <p className="footer__brand-desc">
                Premium shirts crafted for the modern professional.
                Quality that speaks before you do.
              </p>
              {/* Social icons */}
              <div className="footer__social">
                {[
                  { label: 'Instagram', href: '#', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/></svg> },
                  { label: 'Facebook', href: '#', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
                  { label: 'X/Twitter', href: '#', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l16 16M20 4L4 20"/></svg> },
                ].map(s => (
                  <a key={s.label} href={s.href} className="footer__social-link" title={s.label} aria-label={s.label}>
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
                    text: 'hello@karigar.co' 
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
              © {currentYear} Karigar Co. All rights reserved.
            </p>
            <p className="footer__made">
              Crafted with 
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#e87b7b" style={{ margin: '0 4px', verticalAlign: 'middle' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              in Pakistan
            </p>
          </div>
        </div>

      </footer>
    </>
  );
}

const footerCSS = `
  .footer {
    background: #080808;
    margin-top: 0;
  }
  .footer__divider {
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent);
  }
  .footer__main {
    padding: 72px 20px 56px;
  }
  .footer__inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 48px;
  }
  @media (min-width: 640px) {
    .footer__inner { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 1000px) {
    .footer__inner { grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 40px; }
  }

  /* Brand */
  .footer__brand {
    display: flex;
    align-items: baseline;
    gap: 3px;
    margin-bottom: 16px;
  }
  .footer__brand-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #f5efe6;
    letter-spacing: 1px;
  }
  .footer__brand-co {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #c9a84c;
  }
  .footer__brand-desc {
    font-size: 0.85rem;
    color: #4a3f35;
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
    border: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4a3f35;
    transition: all 0.2s ease;
  }
  .footer__social-link:hover {
    color: #c9a84c;
    border-color: rgba(201,168,76,0.35);
    background: rgba(201,168,76,0.06);
    transform: translateY(-2px);
  }

  /* Links */
  .footer__col-title {
    font-family: 'Inter', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #f5efe6;
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
    color: #4a3f35;
    text-decoration: none;
    transition: all 0.2s ease;
    display: inline-block;
  }
  .footer__link:hover {
    color: #c9a84c;
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
    color: #4a3f35;
  }
  .footer__contact-icon { font-size: 0.9rem; opacity: 0.7; }

  /* Newsletter */
  .footer__nl-desc {
    font-size: 0.82rem;
    color: #4a3f35;
    line-height: 1.7;
    margin-bottom: 16px;
  }
  .footer__nl-form {
    display: flex;
    gap: 0;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 4px;
    overflow: hidden;
    transition: border-color 0.2s ease;
  }
  .footer__nl-form:focus-within {
    border-color: rgba(201,168,76,0.4);
  }
  .footer__nl-input {
    flex: 1;
    padding: 11px 14px;
    background: rgba(255,255,255,0.03);
    border: none;
    font-size: 0.84rem;
    color: #b0a090;
    font-family: 'Inter', sans-serif;
    min-width: 0;
  }
  .footer__nl-input::placeholder { color: #3a3028; }
  .footer__nl-btn {
    padding: 11px 18px;
    background: #c9a84c;
    color: #0a0a0a;
    border: none;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s ease;
    flex-shrink: 0;
  }
  .footer__nl-btn:hover { background: #e0c06e; }

  /* Bottom */
  .footer__bottom {
    border-top: 1px solid rgba(255,255,255,0.04);
    padding: 20px;
  }
  .footer__bottom-inner {
    max-width: 1200px;
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
    color: #2a2218;
    margin: 0;
    font-family: 'Inter', sans-serif;
  }
  .footer__made { color: #3a3028; }
`;

export default Footer;