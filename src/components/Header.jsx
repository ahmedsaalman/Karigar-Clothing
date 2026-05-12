// src/components/Header.jsx

import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlistContext } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import SearchFocusButton from './SearchFocusButton';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlistContext();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Collection', to: '/products' },
    { label: 'About', to: '/about' },
  ];

  return (
    <>
      <style>{headerCSS}</style>
      <header className={`kgr-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="kgr-header__inner">

          {/* Brand */}
          <Link to="/" className="kgr-brand">
            <span className="kgr-brand__name">Karigar</span>
            <span className="kgr-brand__co">Co.</span>
            <span className="kgr-brand__tag">Crafted for Professionals</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="kgr-nav hide-mobile show-desktop">
            {navLinks.map(link => (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `kgr-nav__link${isActive ? ' active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <NavLink to="/admin" className={({ isActive }) => `kgr-nav__link${isActive ? ' active' : ''}`}>
                    Admin
                  </NavLink>
                )}
                <button className="kgr-nav__link kgr-nav__link--btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" className={({ isActive }) => `kgr-nav__link${isActive ? ' active' : ''}`}>
                Login
              </NavLink>
            )}
          </nav>

          {/* Right side icons */}
          <div className="kgr-header__actions">
            <SearchFocusButton />

            <button
              className="kgr-icon-btn"
              onClick={() => navigate('/wishlist')}
              title="Wishlist"
              aria-label="Wishlist"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlistCount > 0 && <span className="kgr-badge-dot">{wishlistCount}</span>}
            </button>

            <button
              className="kgr-icon-btn"
              onClick={() => navigate('/cart')}
              title="Cart"
              aria-label="Cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && <span className="kgr-badge-dot">{cartCount}</span>}
            </button>

            {/* Hamburger — mobile only */}
            <button
              className={`kgr-hamburger show-mobile-only ${isMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="kgr-mobile-nav">
            {navLinks.map(link => (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `kgr-mobile-nav__link${isActive ? ' active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/wishlist"
              className={({ isActive }) => `kgr-mobile-nav__link${isActive ? ' active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) => `kgr-mobile-nav__link${isActive ? ' active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Cart {cartCount > 0 && `(${cartCount})`}
            </NavLink>
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => `kgr-mobile-nav__link${isActive ? ' active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </NavLink>
                )}
                <button
                  className="kgr-mobile-nav__link kgr-mobile-nav__link--btn"
                  onClick={async () => { await logout(); setIsMenuOpen(false); }}
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) => `kgr-mobile-nav__link${isActive ? ' active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </NavLink>
            )}
          </nav>
        )}
      </header>
    </>
  );
}

const headerCSS = `
  .kgr-header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: rgba(10, 10, 10, 0.6);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    transition: background 0.3s ease, box-shadow 0.3s ease;
  }
  .kgr-header.scrolled {
    background: rgba(10, 10, 10, 0.92);
    box-shadow: 0 4px 32px rgba(0,0,0,0.5);
  }
  .kgr-header__inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
  }

  /* Brand */
  .kgr-brand {
    display: flex;
    align-items: baseline;
    gap: 4px;
    text-decoration: none;
    position: relative;
    flex-shrink: 0;
  }
  .kgr-brand__name {
    font-family: var(--font-display);
    font-size: 1.6rem;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 1px;
    line-height: 1;
  }
  .kgr-brand__co {
    font-family: var(--font-display);
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--color-gold);
    line-height: 1;
  }
  .kgr-brand__tag {
    display: none;
    font-size: 0.6rem;
    color: #6b6055;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-left: 8px;
    white-space: nowrap;
    align-self: center;
  }
  @media (min-width: 900px) {
    .kgr-brand__tag { display: inline; }
  }

  /* Desktop Nav */
  .kgr-nav {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    justify-content: center;
  }
  .kgr-nav__link {
    position: relative;
    font-family: var(--font-body);
    font-size: 0.78rem;
    font-weight: 600;
    color: #b0a090;
    text-decoration: none;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 8px 14px;
    border-radius: 4px;
    transition: color 0.2s ease;
    background: none;
    border: none;
    cursor: pointer;
  }
  .kgr-nav__link::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 50%;
    width: 0;
    height: 1.5px;
    background: var(--color-gold);
    transform: translateX(-50%);
    transition: width 0.25s ease;
  }
  .kgr-nav__link:hover { color: #ffffff; }
  .kgr-nav__link:hover::after { width: 60%; }
  .kgr-nav__link.active { color: var(--color-gold); }
  .kgr-nav__link.active::after { width: 60%; }

  /* Show/hide desktop nav */
  .show-desktop { display: flex; }
  @media (max-width: 768px) { .show-desktop { display: none !important; } }

  /* Actions */
  .kgr-header__actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }
  .kgr-icon-btn {
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: transparent;
    border: 1px solid transparent;
    color: #b0a090;
    transition: all 0.2s ease;
  }
  .kgr-icon-btn:hover {
    color: #f5efe6;
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.08);
  }
  .kgr-badge-dot {
    position: absolute;
    top: 5px;
    right: 5px;
    background: var(--color-gold);
    color: #0a0a0a;
    font-size: 0.58rem;
    font-weight: 800;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  /* Hamburger */
  .kgr-hamburger {
    width: 40px;
    height: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 8px;
    padding: 8px;
    transition: all 0.2s ease;
  }
  .kgr-hamburger:hover {
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.08);
  }
  .kgr-hamburger span {
    display: block;
    width: 20px;
    height: 1.5px;
    background: #b0a090;
    border-radius: 2px;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    transform-origin: center;
  }
  .kgr-hamburger.open span:nth-child(1) {
    transform: translateY(6.5px) rotate(45deg);
    background: var(--color-gold);
  }
  .kgr-hamburger.open span:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
  }
  .kgr-hamburger.open span:nth-child(3) {
    transform: translateY(-6.5px) rotate(-45deg);
    background: var(--color-gold);
  }
  @media (min-width: 769px) { .kgr-hamburger { display: none !important; } }

  /* Mobile menu */
  .kgr-mobile-nav {
    background: rgba(10, 10, 10, 0.98);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-top: 1px solid rgba(255,255,255,0.05);
    padding: 8px 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    animation: menuSlideDown 0.25s ease both;
  }
  .kgr-mobile-nav__link {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    color: #b0a090;
    text-decoration: none;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 14px 4px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    transition: color 0.2s ease, padding-left 0.2s ease;
    background: none;
    border-top: none;
    border-left: none;
    border-right: none;
    text-align: left;
    width: 100%;
    cursor: pointer;
  }
  .kgr-mobile-nav__link:hover,
  .kgr-mobile-nav__link.active {
    color: var(--color-gold);
    padding-left: 8px;
  }
  .kgr-mobile-nav__link:last-child { border-bottom: none; }
`;

export default Header;