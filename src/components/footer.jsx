import React from 'react';
import { Link } from 'react-router-dom';
import '../css/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-pattern"></div>
      <div className="containerFooter">
        <div className="footer-grid">
          {/* About Column */}
          <div className="footer-about">
            <div className="logo-container">
              <img 
                src="https://img.freepik.com/free-vector/golden-scales-justice-emblem_1308-169438.jpg" 
                alt="LegalEase AI Logo" 
                className="footer-logo"
              />
              <h3>LegalEase AI</h3>
            </div>
            <p className="about-text">Making legal document review accessible, efficient, and reliable through AI technology.</p>
            <div className="social-links">
              {['twitter', 'linkedin', 'github'].map((social) => (
                <a 
                  key={social}
                  href={`#${social}`} 
                  className={`social-link ${social}`}
                  aria-label={social}
                >
                  <span className="social-icon">{social === 'twitter' ? '𝕏' : social === 'linkedin' ? 'in' : '⎘'}</span>
                  <span className="hover-effect"></span>
                </a>
              ))}
            </div>
          </div>
          
          {/* Links Columns */}
          {[
            { 
              title: 'Product', 
              links: ['Features', 'Pricing', 'Demo', 'Updates'] 
            },
            { 
              title: 'Resources', 
              links: ['Blog', 'Guides', 'Templates', 'Help Center'] 
            },
            { 
              title: 'Company', 
              links: ['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'] 
            }
          ].map((column, index) => (
            <div key={index} className="footer-links">
              <h4 className="links-title">{column.title}</h4>
              <ul>
                {column.links.map((link, i) => (
                  <li key={i}>
                    <Link 
                      to={`/${link.toLowerCase().replace(' ', '-')}`} 
                      className="footer-link"
                    >
                      <span className="link-text">{link}</span>
                      <span className="link-underline"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Contact Column */}
          <div className="footer-contact">
            <h4 className="contact-title">Contact Us</h4>
            <div className="contact-info">
              <a href="mailto:hello@legaleaseai.com" className="contact-link">
                <span className="contact-icon">✉</span>
                hello@legaleaseai.com
              </a>
              <a href="tel:+15551234567" className="contact-link">
                <span className="contact-icon">📞</span>
                +1 (555) 123-4567
              </a>
            </div>
            <button className="demo-btn">
              <span>Schedule a Demo</span>
              <div className="btn-underline"></div>
            </button>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} LegalEase AI. All rights reserved.
          </p>
          <div className="legal-links">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link, i) => (
              <React.Fragment key={i}>
                <Link 
                  to={`/${link.toLowerCase().replace(' ', '-')}`} 
                  className="legal-link"
                >
                  {link}
                </Link>
                {i < 2 && <span className="separator">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;