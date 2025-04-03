import React from 'react';
import '../css/howItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      title: 'Upload Your Document',
      description: 'Simply drag and drop your contract, agreement, or policy document into our secure portal.',
      icon: '📄',
      color: '#4361ee'
    },
    {
      number: '2',
      title: 'AI Analysis',
      description: 'Our advanced algorithms scan the document for risks, ambiguities, and compliance issues.',
      icon: '🤖',
      color: '#7209b7'
    },
    {
      number: '3',
      title: 'Receive Insights',
      description: 'Get a detailed report highlighting potential problems with suggested improvements.',
      icon: '🔍',
      color: '#f72585'
    },
    {
      number: '4',
      title: 'Implement Changes',
      description: 'Download the annotated document or use our editor to make revisions.',
      icon: '✅',
      color: '#4cc9f0'
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works">
      <div className="legal-pattern"></div>
      <div className="container">
        <div className="section-header">
          <h2>How Clarity Council Works</h2>
          <p className="subtitle">Four simple steps to legal document clarity</p>
          <div className="divider"></div>
        </div>
        
        <div className="steps-container">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="step-card"
              style={{ '--accent-color': step.color }}
            >
              <div className="step-header">
                <div className="step-number">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
              </div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              <div className="step-arrow"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;