import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Gift, ArrowLeft, Trophy, Heart, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar2';
import SpinWheel from '../components/SpinWheel';

const DESSERT_ICONS = ["🍦", "🍩", "🧁", "🍰"];

const CustomerDashboard = ({ stamps, rewards, wheelRewards, updateUser, onLogout }) => {
  const navigate = useNavigate();
  const [showWinModal, setShowWinModal] = useState(false);
  const [lastWin, setLastWin] = useState("");
  
  const maxStamps = 4;
  const isComplete = stamps >= maxStamps;

  const handleWin = async (rewardText) => {
    setLastWin(rewardText);
    if (rewardText !== "TRY AGAIN") {
      const newReward = {
        text: rewardText,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        claimed: false
      };
      await updateUser({ 
        rewards: [...rewards, newReward],
        stamps: 0 
      });
    } else {
      await updateUser({ stamps: 0 });
    }
    setShowWinModal(true);
  };

  const handleClaim = async (index) => {
    const targetReward = rewards[index];
    let updatedReward = {};
    
    if (typeof targetReward === 'string') {
      updatedReward = {
        text: targetReward,
        date: "Legacy",
        time: "Legacy",
        claimed: true,
        claimDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        claimTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
    } else {
      updatedReward = {
        ...targetReward,
        claimed: true,
        claimDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        claimTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
    }

    const newRewards = [...rewards];
    newRewards[index] = updatedReward;
    await updateUser({ rewards: newRewards });
  };

  const closeWinModal = () => {
    setShowWinModal(false);
  };

  return (
    <div className="min-h-screen bg-dessert-cream font-sans pb-20">
      {/* Premium Navbar for Claymorphism */}
      <nav className="max-w-7xl mx-auto px-6 pt-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Back Arrow */}
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 clay-btn-white flex items-center justify-center p-0 rounded-full text-dessert-chocolate/40 hover:text-dessert-pink transition-colors mr-1"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="w-12 h-12 clay-btn-pink flex items-center justify-center p-0">
             <span className="text-xl">🍰</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-dessert-pink block uppercase tracking-[0.3em] leading-none">The</span>
            <span className="text-xl font-black text-dessert-chocolate uppercase tracking-tighter">Dessert Bar</span>
          </div>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={onLogout}
             className="clay-btn-white px-6 py-3 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors"
           >
             <LogOut size={14} /> Close Session
           </button>
        </div>
      </nav>
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-dessert-chocolate/40 font-black hover:text-dessert-pink transition-all group tracking-widest uppercase text-[10px]"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          <div className="clay-card-light px-6 py-2 flex items-center gap-2 border-2">
            <Heart size={14} className="text-dessert-pink fill-dessert-pink animate-pulse" />
            <span className="text-[10px] font-black text-dessert-chocolate uppercase tracking-widest">Premium Member</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-10">
            {/* Stamp Card */}
            <div className="clay-card-light p-6 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-dessert-pink">
                <Star size={120} className="rotate-12" />
              </div>

              <div className="flex justify-between items-start mb-14 relative z-10">
                <div>
                  <h3 className="text-3xl md:text-5xl font-black text-dessert-chocolate tracking-tighter uppercase mb-4 italic">
                    My <span className="text-dessert-pink">Sweet</span> Card
                  </h3>
                  <div className="flex items-center gap-4">
                    <p className="text-dessert-pink font-black text-2xl">{stamps} / {maxStamps}</p>
                    <div className="clay-indent h-4 w-48 overflow-hidden rounded-full">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(stamps/maxStamps)*100}%` }}
                        className="h-full bg-dessert-pink"
                        style={{ boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)' }}
                       />
                    </div>
                  </div>
                </div>
                <motion.div 
                  animate={isComplete ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className={`w-24 h-24 flex items-center justify-center transition-all duration-500 ${isComplete ? 'clay-btn-pink scale-110 shadow-2xl' : 'clay-indent text-dessert-rose opacity-40 grayscale'}`}
                >
                   <Trophy size={40} className={isComplete ? "text-white" : ""} />
                </motion.div>
              </div>

              <div className="grid grid-cols-4 gap-3 md:gap-6 mb-14 relative z-10">
                {DESSERT_ICONS.map((icon, i) => (
                  <motion.div 
                    key={i} 
                    className={`aspect-square flex items-center justify-center transition-all duration-300 ${
                      i < stamps 
                        ? 'clay-btn-white relative border-4 border-dessert-pink scale-105' 
                        : 'clay-indent'
                    }`}
                  >
                    <span className={`text-4xl ${i < stamps ? 'grayscale-0 bounce-sm' : 'grayscale opacity-20'}`}>{icon}</span>
                    {i < stamps && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-1.5 shadow-lg shadow-green-500/20"
                      >
                        <Check size={16} strokeWidth={4} />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className={`p-8 rounded-[2.5rem] transition-all duration-700 flex items-center justify-center gap-6 ${isComplete ? 'clay-btn-pink' : 'clay-indent border-2 border-dashed border-dessert-pink/20'}`}>
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-white/20`}>🎁</div>
                 <h4 className={`text-2xl font-black uppercase tracking-tighter ${isComplete ? 'text-white' : 'text-dessert-chocolate/30'}`}>
                   {isComplete ? "Winner's Circle Unlocked! 🎉" : "Collect 4 stamps for a sweet spin"}
                 </h4>
              </div>
            </div>
            
            {/* Rewards Vault */}
            <div className="clay-card-light p-6 md:p-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 clay-btn-pink flex items-center justify-center">
                  <Gift size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-dessert-chocolate tracking-tighter uppercase mb-0.5">My Vault</h3>
                  <p className="text-[10px] font-black text-dessert-pink tracking-widest uppercase opacity-60">Handcrafted Treats</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {rewards.map((reward, i) => {
                    const isObj = typeof reward === 'object' && reward !== null;
                    const rText = isObj ? reward.text : reward;
                    const rDate = isObj ? reward.date : null;
                    const rTime = isObj ? reward.time : null;
                    const rClaimed = isObj ? reward.claimed : false;
                    const cDate = isObj ? reward.claimDate : null;
                    const cTime = isObj ? reward.claimTime : null;

                    return (
                      <motion.div 
                        key={i}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`clay-card-light p-6 flex flex-col items-center justify-center text-center gap-4 relative ${rClaimed ? 'opacity-60' : 'group cursor-pointer hover:scale-105 transition-transform'}`}
                      >
                        {rDate && rTime && rDate !== "Legacy" && (
                           <div className="absolute top-4 right-4 text-[8px] font-black text-dessert-pink/60 uppercase tracking-widest text-right leading-tight">
                             Won:<br/>{rDate}<br/>{rTime}
                           </div>
                        )}
                        {rClaimed && cDate && cTime && (
                           <div className="absolute top-4 left-4 text-[8px] font-black text-green-500/80 uppercase tracking-widest text-left leading-tight">
                             Claimed:<br/>{cDate}<br/>{cTime}
                           </div>
                        )}
                        <div className={`w-14 h-14 flex items-center justify-center text-3xl ${rClaimed ? 'clay-btn-white grayscale border-0' : 'clay-indent'}`}>🍬</div>
                        <p className={`text-sm font-black uppercase tracking-tight ${rClaimed ? 'text-dessert-chocolate/50 line-through' : 'text-dessert-chocolate'}`}>{rText}</p>
                        
                        {!rClaimed ? (
                          <button 
                            onClick={() => handleClaim(i)}
                            className="clay-btn-pink w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] mt-2"
                          >
                            Claim Now
                          </button>
                        ) : (
                          <div className="clay-indent w-full py-3 text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mt-2 border-0 shadow-inner">
                            Claimed
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {rewards.length === 0 && (
                  <div className="col-span-2 py-16 flex flex-col items-center justify-center opacity-10 gap-4">
                    <Star size={64} />
                    <p className="text-xl font-black uppercase tracking-widest">No treats discovered yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Spin Wheel Area */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 clay-card-light p-6 md:p-12 flex flex-col items-center overflow-hidden border-4">
               <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-transparent via-dessert-pink to-transparent opacity-20" />
              <h3 className="text-4xl font-black text-dessert-chocolate tracking-tighter uppercase mb-2 italic">
                Spin <span className="text-dessert-pink">&</span> Win
              </h3>
              <p className="text-dessert-chocolate/30 font-bold text-center mb-12 max-w-xs uppercase text-[10px] tracking-widest leading-loose">
                Exclusive dessert wheel unlocked upon completion of your sweet card
              </p>
              
              <div className={!isComplete ? "grayscale opacity-50" : ""}>
                <SpinWheel 
                  isEnabled={isComplete} 
                  onWin={handleWin}
                  wheelRewards={wheelRewards}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Realistic Win Modal */}
      <AnimatePresence>
        {showWinModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dessert-cream/80 backdrop-blur-md"
              onClick={closeWinModal}
            />
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative clay-card-light w-full max-w-sm p-8 md:p-12 text-center border-4 border-dessert-pink"
            >
              <div className="w-28 h-28 clay-btn-pink flex items-center justify-center mx-auto mb-10 shadow-2xl animate-bounce">
                <Trophy size={56} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dessert-chocolate uppercase tracking-tighter mb-4 italic">Bravo!</h2>
              <div className="clay-indent p-10 mb-10">
                 <p className="text-4xl font-black text-dessert-pink tracking-tighter leading-none mb-4">{lastWin}</p>
                 <div className="h-1.5 w-full bg-white/50 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="h-full w-1/2 bg-dessert-pink"
                    />
                 </div>
              </div>
              <button 
                onClick={closeWinModal}
                className="clay-btn-pink w-full py-6 text-xl tracking-tight uppercase"
              >
                Claimed!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerDashboard;
