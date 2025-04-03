import React from 'react';
import '../css/testimonial.css';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      quote: 'This tool saved me thousands in legal fees and helped me negotiate better contract terms with my suppliers.',
      avatar: 'https://img.freepik.com/free-photo/lifestyle-people-emotions-casual-concept-confident-nice-smiling-asian-woman-cross-arms-chest-confident-ready-help-listening-coworkers-taking-part-conversation_1258-59335.jpg',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Startup Founder',
      quote: "As a non-lawyer, I was always nervous about signing contracts. Now I can understand exactly what I'm agreeing to.",
      avatar: 'https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg',
      rating: 4
    },
    {
      name: 'Emily Rodriguez',
      role: 'Legal Consultant',
      quote: 'I use this to quickly identify potential issues before doing a deep review, saving me hours of work.',
      avatar: 'https://media.istockphoto.com/id/1398385367/photo/happy-millennial-business-woman-in-glasses-posing-with-hands-folded.jpg?s=612x612&w=0&k=20&c=Wd2vTDd6tJ5SeEY-aw0WL0bew8TAkyUGVvNQRj3oJFw=',
      rating: 5
    }
  ];

  return (
    <section className="testimonials-section">
        <div className="section-header">
          <h2>Trusted by Legal Professionals</h2>
          <p className="subtitle">What our clients say about our services</p>
          <div className="divider"></div>
        </div>
      <div className="testimonials-pattern"></div>
      <div className="container">
        

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < testimonial.rating ? 'star filled' : 'star'}>★</span>
                ))}
              </div>
              <blockquote className="testimonial-quote">
                <p>"{testimonial.quote}"</p>
              </blockquote>
              <div className="testimonial-author">
                <div className="avatar-container">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="testimonial-avatar"
                  />
                </div>
                <div className="author-info">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </div>
              <div className="testimonial-decoration">
                <div className="quote-icon">”</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;