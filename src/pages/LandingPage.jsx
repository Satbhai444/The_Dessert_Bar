import React from 'react';
// import Navbar from '../components/Navbar2';
import Hero from '../components/Hero';
import Visuals from '../components/Visuals';
import MenuSection from '../components/MenuSection';
import HowItWorks from '../components/HowItWorks';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const LandingPage = ({ menuItems }) => {
  return (
    <div className="min-h-screen">
      {/* Navbar removed as per user request */}
      <Hero />
      <MenuSection menuItems={menuItems} />
      <Visuals />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
