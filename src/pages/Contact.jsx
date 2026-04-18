import React from 'react';

// import Navbar from '../components/Navbar2';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';


const Contact = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-dessert-cream">

      <main className="flex-1 flex items-center justify-center px-2 py-8">
        <div className="w-full max-w-xl clay-card-light p-8 md:p-12 border-4 rounded-3xl shadow-xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 text-dessert-pink hover:text-dessert-chocolate font-bold text-xs uppercase tracking-widest clay-btn-white px-4 py-2 rounded-full border border-dessert-pink/20 shadow"
          >
            <span className="text-lg">←</span> Back
          </button>
          <h1 className="text-3xl md:text-4xl font-black text-dessert-chocolate mb-8 uppercase tracking-tight text-center">Contact Us</h1>
          <div className="space-y-8">
            <div className="flex items-center gap-4 text-dessert-chocolate/80">
              <i className="fa-light fa-phone text-dessert-pink text-lg"></i>
              <a href="tel:6355019552" className="underline hover:text-dessert-pink">6355019552</a>
            </div>
            <div className="flex items-center gap-4 text-dessert-chocolate/80">
              <i className="fa-brands fa-instagram text-dessert-pink text-lg"></i>
              <a href="https://www.instagram.com/the_dessert__bar?igsh=bXIweHh6MTJybWpo" target="_blank" rel="noopener noreferrer" className="underline hover:text-dessert-pink">@the_dessert__bar</a>
            </div>
          </div>
          <div className="mt-12 flex gap-6 justify-center">
            <a href="https://wa.me/916355019552" className="clay-btn-pink p-4 rounded-full" title="WhatsApp" target="_blank" rel="noopener noreferrer"><i className="fa-light fa-phone text-white text-lg"></i></a>
            <a href="https://www.instagram.com/the_dessert__bar?igsh=bXIweHh6MTJybWpo" className="clay-btn-pink p-4 rounded-full" title="Instagram" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram text-white text-lg"></i></a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
