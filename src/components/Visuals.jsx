import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Trophy, TrendingUp } from 'lucide-react';

const Visuals = () => {
  return (
    <section className="pt-24 pb-12 px-6 bg-dessert-cream overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        {/* Floating Badge */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end">
          {/* Card 1: Spin the Wheel */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="clay-card-light p-6 md:p-10 relative overflow-hidden group min-h-[450px] border-4 flex flex-col"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-dessert-pink/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 clay-btn-pink flex items-center justify-center text-white mb-10 shadow-xl">
                <Trophy size={32} />
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-4 text-dessert-chocolate tracking-tighter uppercase italic">Spin & Win</h3>
              <p className="text-dessert-chocolate/40 font-bold uppercase tracking-widest text-[10px] leading-relaxed mb-12">Gamified rewards that build excitement with every scan.</p>
              
              <div className="mt-auto relative aspect-square w-full max-w-[220px] mx-auto scale-110">
                <div className="absolute inset-0 rounded-full clay-indent border-0 shadow-inner" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 rounded-full border-dashed border-2 border-dessert-pink/40"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 clay-btn-white rounded-full shadow-2xl flex items-center justify-center border-0">
                    <Star className="text-dessert-pink fill-dessert-pink animate-pulse" size={40} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Main Stamp Card (Center) */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1.05, opacity: 1 }}
            className="z-10 clay-card-light p-6 md:p-12 border-4 relative"
          >
            
            <div className="flex justify-between items-center mb-12">
              <div>
                <p className="text-[10px] uppercase font-black tracking-[0.4em] text-dessert-pink mb-2">Member ID: 8821</p>
                <h3 className="text-3xl md:text-4xl font-black text-dessert-chocolate tracking-tighter uppercase italic">My Card</h3>
              </div>
              <div className="w-16 h-16 clay-indent flex items-center justify-center">
                <span className="font-black text-dessert-pink text-xl text-center leading-none">4<br/><span className="text-[9px] uppercase tracking-tighter">slots</span></span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-12">
              {[...Array(4)].map((_, i) => (
                <motion.div 
                  key={i} 
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`aspect-square flex items-center justify-center transition-all duration-500 ${
                    i < 2 
                      ? 'clay-btn-pink border-0 text-white' 
                      : 'clay-indent border-0 shadow-inner text-dessert-chocolate/10'
                  }`}
                >
                  {i < 2 ? <Check size={32} strokeWidth={5} /> : <span className="font-black text-2xl">{i + 1}</span>}
                </motion.div>
              ))}
            </div>

            <div className="clay-indent p-8 rounded-[2.5rem] border-0">
              <div className="flex justify-between items-end mb-4 px-2">
                <p className="text-[10px] font-black text-dessert-chocolate/30 uppercase tracking-widest">Progress</p>
                <p className="text-[10px] font-black text-dessert-pink uppercase tracking-widest">50% Completed</p>
              </div>
              <div className="h-6 w-full clay-card-light border-0 shadow-inner bg-white/50 rounded-full overflow-hidden p-1.5 shadow-sm">
                <motion.div 
                   initial={{ width: 0 }}
                   whileInView={{ width: '50%' }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-dessert-pink rounded-full shadow-lg shadow-pink-200" 
                />
              </div>
              <p className="text-center text-[9px] font-black text-dessert-chocolate/10 mt-6 uppercase tracking-[0.3em]">Next Reward: Free Donut Box</p>
            </div>
          </motion.div>

          {/* Card 3: Check-in */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="clay-card-light p-6 md:p-10 relative overflow-hidden min-h-[450px] flex flex-col border-4"
          >
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-dessert-peach/20 rounded-full -ml-20 -mb-20 blur-3xl opacity-50" />
            <div className="relative z-10">
              <div className="w-16 h-16 clay-btn-white flex items-center justify-center text-dessert-chocolate mb-10 shadow-xl border-2">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-4 text-dessert-chocolate tracking-tighter uppercase italic">Fast Login</h3>
              <p className="text-dessert-chocolate/40 font-bold uppercase tracking-widest text-[10px] leading-relaxed mb-12">Frictionless entry. Just one tap and you're earning.</p>
              
              <div className="clay-indent p-6 rounded-[3rem] mt-auto shadow-inner">
                <div className="w-full aspect-square clay-card-light bg-dessert-chocolate border-0 rounded-[2rem] p-8 relative flex items-center justify-center group-hover:scale-95 transition-transform duration-500 overflow-hidden shadow-2xl">
                  {/* QR Code Mock */}
                  <div className="grid grid-cols-6 gap-1.5 h-full w-full opacity-40">
                    {[...Array(36)].map((_, i) => (
                      <div key={i} className={`rounded-[2px] ${Math.random() > 0.3 ? 'bg-white' : 'bg-transparent'}`} />
                    ))}
                  </div>
                  <div className="absolute w-16 h-16 clay-btn-white flex items-center justify-center border-0 shadow-2xl">
                    <div className="w-8 h-8 clay-btn-pink border-0" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Visuals;
