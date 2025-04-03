import React from "react";
import Header from "./header";
import HeroSection from "./heroSection";
import HowItWorks from "./howItWorks";
import Testimonials from "./testimonials";
import Footer from "./footer";
import DocumentUpload from "./documentUpload";
import ContactPage from './contactPage';

function Landing(){
    return (
        <>
            <Header/>
            <section id="home">
                <HeroSection/>
            </section>
            <Testimonials/>
            <section id="upload">
                <DocumentUpload/>
            </section>
            <section id="how-it-works">
                <HowItWorks/>
            </section>
            <section id="contact">
                <ContactPage/>
            </section>
            <Footer/>
        </>
    );
}
export default Landing;