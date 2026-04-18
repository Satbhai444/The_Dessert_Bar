import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-20 px-6 bg-dessert-cream">
      <div className="max-w-7xl mx-auto clay-card-light p-10 flex flex-col md:flex-row justify-between items-center gap-10 border-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 clay-btn-pink flex items-center justify-center shadow-lg">
             <span className="text-white font-black text-xl">D</span>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-dessert-pink block leading-none mb-1">Authentic</span>
            <span className="text-xl font-black text-dessert-chocolate tracking-tighter uppercase italic">The Dessert Bar</span>
          </div>
        </div>
        
        <div className="flex gap-10 text-[10px] font-black text-dessert-chocolate/30 uppercase tracking-[0.2em]">
          <Link to="/privacy" className="hover:text-dessert-pink transition-all">Privacy</Link>
          <Link to="/terms" className="hover:text-dessert-pink transition-all">Terms</Link>
          <Link to="/contact" className="hover:text-dessert-pink transition-all">Contact</Link>
        </div>
        
          <div className="flex flex-col items-center md:items-end gap-2">
             <p className="text-[10px] text-dessert-chocolate/20 font-black uppercase tracking-[0.3em]">
               © {new Date().getFullYear()} Crafted for Sweet Customers.<br />
               Made with <span className="text-dessert-pink">❤️</span> in Ahmedabad
             </p>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
               <div key={i} className="w-1 h-1 rounded-full bg-dessert-pink/20" />
              ))}
            </div>
          </div>
      </div>
      
      <div className="mt-12 flex justify-center">
         <div className="px-6 py-2 clay-indent rounded-full">
            <span className="text-[8px] font-black text-dessert-chocolate/10 uppercase tracking-[0.5em]">Global Loyalty Infrastructure Protocol</span>
         </div>
      </div>
      {/* Developer Credit */}
      <div className="w-full flex justify-center mt-2">
        <div className="text-[11px] md:text-sm font-bold text-black transition-all text-center">
          Designed & Developed by <a href="https://www.daarshannexaa.in/" target="_blank" rel="noopener noreferrer" className="underline font-bold">Darshan Satbhai</a><br />
          <span className="font-normal">Visit my </span><a href="https://www.daarshannexaa.in/" target="_blank" rel="noopener noreferrer" className="underline font-bold">portfolio</a><span className="font-normal"> or </span><a href="mailto:darshansatbhai38@gmail.com" className="underline font-bold">email me</a><span className="font-normal"> for a website like this.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
