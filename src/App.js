import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnimatedLawContactPage from './components/contactPage';
import HeroSection from './components/heroSection';
import Header from './components/header';
import HowItWorks from './components/howItWorks';
import Testimonials from './components/testimonials';
import DocumentUpload from './components/documentUpload';
import Footer from './components/footer';
import Landing from './components/landing';
import Login from './components/login';
import SignupPage from './components/signUp';


function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroSection />
                  <HowItWorks />
                  
                  <DocumentUpload isLoading={isLoading} setIsLoading={setIsLoading} />
                  <Testimonials />
                  <AnimatedLawContactPage />
                </>
              }
            />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<AnimatedLawContactPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<div className="not-found">404 Page Not Found</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;