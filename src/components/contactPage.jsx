import React, { useState } from 'react';
import '../css/contactPage.css';

const AnimatedLawContactPage = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    message: false
  });

  return (
    <div className="law-container">
      {/* Animated floating legal documents in background */}
      <div className="floating-documents">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="document" style={{
            animationDelay: `${i * 2}s`,
            left: `${10 + (i * 15)}%`
          }}></div>
        ))}
      </div>

      <div className="legal-wrapper">
        {/* Animated Parchment Form */}
        <div className="parchment-form-container" onMouseEnter={() => setIsHovering(true)} 
             onMouseLeave={() => setIsHovering(false)}>
          <form className="legal-form">
            <h1 className="legal-title">
              <span className="title-text">Contact Our Legal Team</span>
              <span className="title-underline"></span>
            </h1>
            
            <div className={`form-group ${isFocused.name ? 'focused' : ''}`}>
              <input 
                type="text" 
                required 
                placeholder=" "
                className="legal-input"
                onFocus={() => setIsFocused({...isFocused, name: true})}
                onBlur={() => setIsFocused({...isFocused, name: false})}
              />
              <label className="legal-label">Full Name</label>
              <div className="animated-gavel">
                <div className="gavel-head"></div>
                <div className="gavel-handle"></div>
              </div>
            </div>
            
            <div className={`form-group ${isFocused.email ? 'focused' : ''}`}>
              <input 
                type="email" 
                required 
                placeholder=" "
                className="legal-input"
                onFocus={() => setIsFocused({...isFocused, email: true})}
                onBlur={() => setIsFocused({...isFocused, email: false})}
              />
              <label className="legal-label">Email Address</label>
              <div className="scales-animation">
                <div className="scale-left"></div>
                <div className="scale-bar"></div>
                <div className="scale-right"></div>
              </div>
            </div>
            
            <div className={`form-group ${isFocused.message ? 'focused' : ''}`}>
              <textarea 
                rows="5" 
                required 
                placeholder=" "
                className="legal-textarea"
                onFocus={() => setIsFocused({...isFocused, message: true})}
                onBlur={() => setIsFocused({...isFocused, message: false})}
              ></textarea>
              <label className="legal-label">Message</label>
              <div className="pen-animation">
                <div className="pen"></div>
                <div className="ink-drops">
                  {[...Array(3)].map((_, i) => <div key={i} className="ink-drop"></div>)}
                </div>
              </div>
            </div>
            
            <button type="submit" className="legal-button">
              <span className="button-text">Request Consultation</span>
              <div className="ink-trail"></div>
              <div className="stamp">APPROVED</div>
            </button>
          </form>
        </div>
        
        {/* Animated Legal Bookshelf */}
        <div className="legal-library">
          <div className="bookshelf">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="book"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  height: `${70 + (i * 10)}px`,
                  background: i % 2 === 0 ? 'var(--burgundy)' : 'var(--deep-navy)'
                }}
              ></div>
            ))}
          </div>
          <div className="rotating-scales">
            <div className="scale-base"></div>
            <div className="scale-beam"></div>
            <div className="scale-left-pan"></div>
            <div className="scale-right-pan"></div>
          </div>
        </div>
      </div>
      
      {/* Animated Footer */}
      <div className="legal-footer">
        <div className="signature-line">
          <div className="signature-animation"></div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedLawContactPage;