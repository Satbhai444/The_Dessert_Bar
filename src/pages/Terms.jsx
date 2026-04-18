import React from 'react';

// import Navbar from '../components/Navbar2';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
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
          <h1 className="text-3xl md:text-4xl font-black text-dessert-chocolate mb-8 uppercase tracking-tight text-center">Terms & Conditions</h1>
          <p className="mb-6 text-dessert-chocolate/70 text-center">
            Welcome to The Dessert Bar! By using our website and services, you agree to the following terms and conditions:
          </p>
          <ul className="list-disc pl-6 mb-6 text-dessert-chocolate/70 space-y-4">
            <li><b>Services:</b> We offer sweet dishes like brownies, mojitos, and more. Menu items may change from time to time.</li>
            <li><b>Account Creation:</b> Creating an account is required to access loyalty rewards and personalized features.</li>
            <li><b>Payments & Refunds:</b> All payments are handled offline at our store. Refunds are not applicable for offline transactions.</li>
            <li><b>Age Restrictions:</b> There are no age restrictions for using our services.</li>
            <li><b>Third-Party Services:</b> We use Google and Firebase for secure login and data management.</li>
            <li><b>User Responsibilities:</b> Users must provide accurate information and not misuse the platform.</li>
            <li><b>Disclaimer:</b> We reserve the right to update these terms at any time. For any queries, contact us at <a href="mailto:Sanenaparth@gmail.com" className="text-dessert-pink underline">Sanenaparth@gmail.com</a> or call <a href="tel:6355019552" className="text-dessert-pink underline">6355019552</a>.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
