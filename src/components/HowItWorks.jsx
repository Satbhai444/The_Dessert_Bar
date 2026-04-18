import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: "01",
    title: "Scan QR",
    description: "Scan the clay-etched QR code at the checkout counter.",
    image: "📱"
  },
  {
    number: "02",
    title: "Earn Stamps",
    description: "Collect 4 digital stamps with each purchase of sweets.",
    image: "🍰"
  },
  {
    number: "03",
    title: "The Spin",
    description: "Unlock the probability engine for your free reward!",
    image: "🎡"
  }
];

const HowItWorks = () => {
  return (
    <section className="pt-12 pb-32 px-6 bg-dessert-cream overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-10 text-center md:text-left">
          <div className="max-w-xl">
            <span className="text-dessert-pink font-black uppercase tracking-[0.4em] text-[10px] mb-6 block leading-none">The Mechanism</span>
            <h2 className="text-5xl md:text-7xl font-black text-dessert-chocolate tracking-tighter uppercase italic leading-[0.9]">How it works for your <span className="text-dessert-pink">Fans</span></h2>
          </div>
          <div className="max-w-sm clay-indent p-8 rounded-[2.5rem]">
             <p className="text-dessert-chocolate/40 font-black uppercase tracking-widest text-[9px] leading-loose">No legacy app downloads. No account friction. Just pure, high-fidelity sweet engagement in seconds.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-10 left-0 w-full h-1 clay-indent -z-10" />
          
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative group flex flex-col items-center md:items-start"
            >
              <div className="mb-10 relative">
                <div className="w-24 h-24 clay-btn-white flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500 border-0 shadow-2xl">
                  {step.image}
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 clay-btn-pink flex items-center justify-center text-white font-black text-xs border-4 border-dessert-cream">
                  {step.number}
                </div>
              </div>
              <h3 className="text-3xl font-black text-dessert-chocolate mb-4 tracking-tighter uppercase italic">{step.title}</h3>
              <p className="text-dessert-chocolate/40 font-bold uppercase tracking-widest text-[10px] leading-relaxed">{step.description}</p>
              
              <div className="mt-8 flex gap-1">
                 {[...Array(3)].map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === index ? 'bg-dessert-pink w-6 shadow-sm shadow-pink-200' : 'clay-indent'}`} />
                 ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
