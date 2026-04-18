import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dessert-cream flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="clay-card-light p-12 text-center border-4"
        >
          <div className="w-24 h-24 clay-btn-pink rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl">
            <ShieldAlert size={48} />
          </div>

          <h1 className="text-4xl font-black text-dessert-chocolate mb-6 tracking-tighter uppercase italic">
            Access <span className="text-dessert-pink">Denied</span>
          </h1>
          
          <p className="text-dessert-chocolate/40 font-black uppercase tracking-widest text-xs leading-relaxed mb-12">
            You can't access the admin panel.<br/>
            This area is reserved for <span className="text-dessert-chocolate font-black">admins only</span>.<br/>
            If you believe this is a mistake, please contact support.
          </p>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => navigate('/admin')}
              className={`w-full py-6 font-black uppercase tracking-widest flex items-center justify-center gap-4 transition-all ${
                localStorage.getItem('react_state_role') === 'admin' 
                  ? 'clay-btn-pink text-white hover:scale-105' 
                  : 'hidden'
              }`}
            >
              Enter Admin Portal <ArrowRight size={20} />
            </button>

            <button 
              onClick={() => navigate('/')}
              className="w-full clay-btn-white py-6 font-black uppercase tracking-widest text-dessert-chocolate/30 hover:text-dessert-chocolate flex items-center justify-center gap-4 transition-all"
            >
              <ArrowLeft size={20} />
              Return Main Menu
            </button>
          </div>
        </motion.div>
        
        <p className="text-center mt-12 text-[10px] font-black text-dessert-chocolate/10 uppercase tracking-[0.4em]">
          The Dessert Bar Security Protocol
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
