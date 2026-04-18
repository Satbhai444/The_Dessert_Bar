import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-32 px-4 md:px-6 bg-dessert-cream">
      <div className="max-w-6xl mx-auto clay-card-light p-8 md:p-32 text-center relative overflow-hidden border-4">
        {/* Clay Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-dessert-pink/10 rounded-full -mr-32 -mt-32 blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-dessert-peach/10 rounded-full -ml-32 -mb-32 blur-[80px]" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 clay-btn-pink flex items-center justify-center mx-auto mb-12 shadow-2xl"
          >
            <Sparkles size={40} />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black text-dessert-chocolate mb-10 tracking-tighter italic"
          >
            Start Your <br className="hidden md:block"/> <span className="text-dessert-pink">Sweet Circle</span>
          </motion.h2>
          
          <p className="text-dessert-chocolate/40 text-xl md:text-2xl mb-16 max-w-2xl mx-auto leading-relaxed font-black uppercase tracking-widest">
            Join the most playful 
            loyalty platform built specifically for premium sweet makers.
          </p>
          
          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-10 w-full max-w-2xl">
              <button 
                onClick={() => navigate('/admin')}
                className="w-full sm:w-auto clay-btn-pink px-8 py-5 md:px-16 md:py-8 text-lg md:text-xl font-black uppercase tracking-widest shadow-2xl group"
              >
                For Business
              </button>
              <button 
                onClick={() => navigate('/customer')}
                className="w-full sm:w-auto clay-btn-white px-8 py-5 md:px-16 md:py-8 text-lg md:text-xl font-black uppercase tracking-widest text-dessert-chocolate/40 hover:text-dessert-chocolate border-2"
              >
                For Customers
              </button>
            </div>
            
            <div className="flex items-center gap-3 py-3 px-6 clay-indent rounded-full">
               <div className="w-2 h-2 rounded-full bg-dessert-pink animate-pulse" />
               <span className="text-[10px] font-black text-dessert-chocolate/20 uppercase tracking-[0.3em]">Handcrafted royale access only</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
