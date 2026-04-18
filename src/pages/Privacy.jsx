import React from 'react';

// import Navbar from '../components/Navbar2';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
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
          <h1 className="text-3xl md:text-4xl font-black text-dessert-chocolate mb-8 uppercase tracking-tight text-center">Privacy Policy</h1>
          <p className="mb-6 text-dessert-chocolate/70 text-center">
            We value your privacy. This page explains how we collect, use, and protect your information when you use our website and services.
          </p>
          <h2 className="text-2xl font-bold mb-4 mt-8">Information We Collect</h2>
          <ul className="list-disc pl-6 mb-6 text-dessert-chocolate/70">
            <li>Your name, email, and contact details when you sign up or interact with our services.</li>
            <li>Usage data such as pages visited, features used, and device/browser information.</li>
            <li>Any information you provide through forms or feedback.</li>
          </ul>
          <h2 className="text-2xl font-bold mb-4 mt-8">How We Use Your Information</h2>
          <ul className="list-disc pl-6 mb-6 text-dessert-chocolate/70">
            <li>To provide and improve our services.</li>
            <li>To communicate with you about updates, offers, or support.</li>
            <li>To ensure security and prevent misuse.</li>
          </ul>
          <h2 className="text-2xl font-bold mb-4 mt-8">Your Rights</h2>
          <ul className="list-disc pl-6 mb-6 text-dessert-chocolate/70">
            <li>You can request to view, update, or delete your personal information.</li>
            <li>You can opt out of marketing communications at any time.</li>
          </ul>
          <h2 className="text-2xl font-bold mb-4 mt-8">Contact Us</h2>
          <p className="text-dessert-chocolate/70">
            If you have any questions about our privacy policy, please contact us at <a href="mailto:Sanenaparth@gmail.com" className="text-dessert-pink underline">Sanenaparth@gmail.com</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
