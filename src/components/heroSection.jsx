import React from 'react';
import '../css/heroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      {/* Animated background elements */}
      <div className="legal-pattern"></div>
      <div className="floating-documents">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="document" style={{
            animationDelay: `${i * 3}s`,
            left: `${10 + (i * 20)}%`
          }}></div>
        ))}
      </div>
      
      <div className="container">
        <div className="hero-content">
          <h1>
            <span className="title-line">AI-Powered</span>
            <span className="title-line">Legal Document Analysis</span>
          </h1>
          <p className="hero-subtext">
            Upload contracts, agreements, or policies and get instant analysis of risks, 
            <span className="highlight"> ambiguities</span>, and <span className="highlight">ethical concerns</span>.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary">
              <span>Try For Free</span>
              <div className="ink-trail"></div>
            </button>
            
          </div>
          
          <div className="trust-badges">
            <div className="badge">
              <div className="scale-icon">⚖️</div>
              <span>Law Society Certified</span>
            </div>
            <div className="badge">
              <div className="lock-icon">🔒</div>
              <span>256-bit Encryption</span>
            </div>
          </div>
        </div>
        
        <div className="hero-image">
          <img 
            src="https://img.freepik.com/free-photo/business-people-studying-contract-terms_74855-1166.jpg" 
            alt="Legal professionals reviewing documents" 
            className="main-image"
          />
          <div className="image-overlay"></div>
          <div className="floating-annotation annotation-1">
            <div className="annotation-marker"></div>
            <div className="annotation-text">Ambiguity Detection</div>
          </div>
          <div className="floating-annotation annotation-2">
            <div className="annotation-marker"></div>
            <div className="annotation-text">Risk Assessment</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;