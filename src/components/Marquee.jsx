import React from 'react';
import './Marquee.css';


const marqueeText =
  '🎉 Collect 4 stamps, get a FREE spin on the wheel for your 5th item! | Spin the Wheel & Win FREE item from the menu! 🎁  ';


const Marquee = () => (
  <div className="w-full bg-dessert-pink border-b-4 border-dessert-chocolate py-3 md:py-4 overflow-hidden shadow-lg">
    <div className="marquee-track">
      <span className="marquee-text text-white font-extrabold text-xl md:text-3xl tracking-widest uppercase drop-shadow-lg">
        {Array(8).fill(marqueeText).join(' ')}
      </span>
    </div>
  </div>
);

export default Marquee;
