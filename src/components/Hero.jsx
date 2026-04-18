import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-48 pb-24 px-6 overflow-hidden bg-dessert-cream min-h-screen flex flex-col justify-center">
      {/* Soft Clay Decorative Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-dessert-pink/15 rounded-full blur-[100px] -z-10 animate-float" />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-dessert-peach/15 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-6 py-3 clay-card-light text-dessert-pink font-black text-[10px] uppercase tracking-[0.3em] leading-none mb-12"
        >
          <Sparkles size={14} className="animate-pulse" />
          <span>Loyalty for dessert lovers</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-8xl lg:text-[10rem] font-black text-dessert-chocolate leading-[0.85] mb-12 tracking-tighter italic"
        >
          Sweet <br />
          <span className="text-dessert-pink relative inline-block">
            Comeback
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: '100%' }}
               transition={{ delay: 0.8, duration: 1 }}
               className="absolute -bottom-2 left-0 h-4 bg-dessert-peach/30 rounded-full -z-10" 
            />
          </span>
          <br className="hidden md:block" /> <span className="text-[0.6em] md:text-[0.8em] font-black not-italic opacity-100 italic">at <span className="text-dessert-chocolate font-black uppercase">THE DESSERT BAR</span></span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-lg md:text-2xl text-dessert-chocolate/40 mb-16 max-w-2xl mx-auto leading-relaxed font-black uppercase tracking-widest"
        >
          4 Stamps • 1 Free Spin • <span className="text-dessert-pink">Unlimited Joy</span>
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full max-w-2xl mx-auto"
        >
          <button 
            onClick={() => navigate('/customer')}
            className="w-full sm:w-auto clay-btn-pink px-8 py-5 md:px-16 md:py-8 text-lg md:text-xl font-black uppercase tracking-widest flex items-center justify-center gap-4 group"
          >
            Start Rewards
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </button>
          
          <button 
            onClick={() => navigate('/admin')}
            className="w-full sm:w-auto clay-btn-white px-8 py-5 md:px-16 md:py-8 text-lg md:text-xl font-black uppercase tracking-widest text-dessert-chocolate/40 hover:text-dessert-chocolate border-2"
          >
            Admin Panel
          </button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 flex flex-col items-center gap-4"
        >
           <div className="flex gap-1.5">
             {[...Array(5)].map((_, i) => (
                <div key={i} className="w-6 h-6 clay-card-light flex items-center justify-center p-0 scale-90">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                </div>
             ))}
           </div>
           <p className="text-[10px] font-black text-dessert-chocolate/20 uppercase tracking-[0.4em]">Handcrafted Royale Experience</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
