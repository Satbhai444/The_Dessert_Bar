import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import confetti from 'canvas-confetti';

const SpinWheel = ({ onWin, isEnabled, wheelRewards }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const controls = useAnimation();

  // Helper to split text into multiple lines for SVG
  const formatText = (text) => {
    const words = text.toUpperCase().split(' ');
    if (words.length === 1) return [words[0]];
    if (words.length === 2) return [words[0], words[1]];
    // For 3+ words, try to balance them
    if (words.length > 2) return [words.slice(0, 1).join(' '), words.slice(1).join(' ')];
    return words;
  };

  const getWinningIndex = () => {
    const activeRewards = wheelRewards.filter(r => r.active);
    const totalWeight = activeRewards.reduce((sum, r) => sum + r.probability, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < activeRewards.length; i++) {
      if (random < activeRewards[i].probability) {
        return i;
      }
      random -= activeRewards[i].probability;
    }
    return activeRewards.length - 1;
  };

  const spin = async () => {
    const activeRewards = wheelRewards.filter(r => r.active);
    if (isSpinning || !isEnabled || activeRewards.length === 0) return;

    setIsSpinning(true);
    
    const winningIndex = getWinningIndex();
    const degreesPerSegment = 360 / activeRewards.length;
    const extraRotations = 10 * 360;
    const targetDegree = extraRotations + (360 - (winningIndex * degreesPerSegment + (degreesPerSegment / 2)));

    await controls.start({
      rotate: targetDegree,
      transition: { duration: 5, ease: [0.13, 0, 0, 1] }
    });

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });

    onWin(activeRewards[winningIndex].name);
    setIsSpinning(false);
  };

  const activeRewards = wheelRewards.filter(r => r.active);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-72 h-72 md:w-[420px] md:h-[420px] mb-8 group">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 z-20">
          <div className="w-8 h-12 bg-dessert-chocolate rounded-b-full shadow-lg border-2 border-white" />
        </div>

        {/* Wheel container */}
        <motion.div 
          animate={controls}
          className="w-full h-full rounded-full border-[12px] border-dessert-chocolate shadow-2xl relative overflow-hidden bg-white"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {activeRewards.length === 0 ? (
              <circle cx="50" cy="50" r="50" fill="#f3f4f6" />
            ) : (
              activeRewards.map((reward, i) => {
                const degrees = (360 / activeRewards.length);
                const startAngle = i * degrees;
                const endAngle = (i + 1) * degrees;
                
                const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
                
                const lines = formatText(reward.name);

                return (
                  <g key={reward.id}>
                    <path d={pathData} fill={reward.color} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                    <text 
                      x="72" y="50" 
                      fill="white"
                      fontSize={activeRewards.length > 8 ? "2.5" : activeRewards.length > 5 ? "3" : "3.5"} 
                      fontWeight="900" 
                      textAnchor="middle"
                      transform={`rotate(${startAngle + degrees/2}, 50, 50)`}
                      className="select-none tracking-tight"
                    >
                      {lines.map((line, lineIndex) => (
                        <tspan 
                          key={lineIndex} 
                          x="72" 
                          dy={lineIndex === 0 ? `-${(lines.length - 1) * 1.2}` : "3.5"}
                        >
                          {line}
                        </tspan>
                      ))}
                    </text>
                  </g>
                );
              })
            )}
          </svg>
          
          {/* Inner circle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 bg-white rounded-full shadow-lg border-4 border-dessert-chocolate flex items-center justify-center z-10">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-black transition-transform ${isEnabled ? 'bg-dessert-pink group-hover:scale-110' : 'bg-gray-200'}`}>
                {isEnabled ? 'GO' : '🔒'}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <button
        onClick={spin}
        disabled={!isEnabled || isSpinning || activeRewards.length === 0}
        className={`px-12 py-5 rounded-3xl font-black text-xl transition-all shadow-xl hover:-translate-y-1 active:scale-95 ${
          isEnabled && !isSpinning && activeRewards.length > 0
          ? 'bg-dessert-chocolate text-white hover:bg-dessert-pink' 
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isSpinning ? 'GOOD LUCK!' : 'SPIN THE WHEEL'}
      </button>
      
      {!isEnabled && (
        <p className="mt-4 text-[10px] font-black text-dessert-pink uppercase tracking-[0.3em] animate-pulse">
          Reach 4 stamps to unlock
        </p>
      )}
    </div>
  );
};

export default SpinWheel;
