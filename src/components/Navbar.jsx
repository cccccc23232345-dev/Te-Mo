import React from 'react';
import './Navbar.css';
import logoImage from '../assets/images/temo-logo.jpg';

export default function Navbar({ cartCount, user, onOpenAuth, onLogout, onOpenCart, searchQuery, onSearchChange }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <a className="logo" href="#main-content" aria-label="TeMo home">
          <span className="logo-mark">
            <img src={logoImage} alt="" />
          </span>
        </a>

        <form className="search-box" role="search" onSubmit={(event) => { event.preventDefault(); document.querySelector('.product-grid')?.scrollIntoView({ behavior: 'smooth' }); }}>
          <input type="search" value={searchQuery} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search products, deals, categories..." aria-label="Search products" />
          <button className="search-btn" type="submit">Search</button>
        </form>

        {/* User Actions */}
        <div className="nav-actions">
          <div className="nav-item">
            {user ? (
              <div className="user-profile-menu">
                <span>Hi, {user.email.split('@')[0]}</span>
                <button className="logout-btn" type="button" onClick={onLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <button className="auth-btn" onClick={onOpenAuth}>
                Sign In / Register
              </button>
            )}
          </div>
          <button className="nav-item cart-icon" onClick={onOpenCart} aria-label={`Open cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}>
            <span aria-hidden="true">🛒</span> <span className="cart-badge" aria-hidden="true">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
