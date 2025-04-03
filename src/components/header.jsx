import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    closeMobileMenu();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="container">
        <div className="logo">
          <span className="logo-icon">
            <img 
              src="https://img.freepik.com/free-vector/golden-scales-justice-emblem_1308-169438.jpg" 
              alt="Scales of Justice" 
            />
          </span>
          <Link to="/" className="logo-text" onClick={() => scrollToSection('home')}>
            <h1>Clarity Council</h1>
            <span className="logo-subtitle">Legal AI Solutions</span>
          </Link>
        </div>

        <nav className="nav">
          <ul>
            <li>
              <button 
                className="nav-link"
                onClick={() => scrollToSection('home')}
              >
                <span className="link-text">Home</span>
                <span className="link-underline"></span>
              </button>
            </li>
            <li>
              <button 
                className="nav-link"
                onClick={() => scrollToSection('how-it-works')}
              >
                <span className="link-text">How It Works</span>
                <span className="link-underline"></span>
              </button>
            </li>
            <li>
              <button 
                className="nav-link"
                onClick={() => scrollToSection('upload')}
              >
                <span className="link-text">Upload</span>
                <span className="link-underline"></span>
              </button>
            </li>
            <li>
              <button 
                className="nav-link"
                onClick={() => scrollToSection('contact')}
              >
                <span className="link-text">Contact</span>
                <span className="link-underline"></span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="auth-buttons">
          <Link 
            to="/login" 
            className="btn btn-login"
            onClick={closeMobileMenu}
          >
            <span>Login</span>
            <div className="hover-bg"></div>
          </Link>
          <Link 
            to="/signUp" 
            className="btn btn-primary"
            onClick={closeMobileMenu}
          >
            <span>Sign Up</span>
            <div className="ink-trail"></div>
          </Link>
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>
    </header>
  );
};

export default Header;