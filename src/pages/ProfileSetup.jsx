import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, ArrowRight, Camera, RefreshCcw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const ProfileSetup = ({ user, onComplete }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || phone.length < 10) {
      setError('Please provide your name and a valid phone number.');
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: name.trim(),
        phone: phone.trim().startsWith('+') ? phone.trim() : `+91${phone.trim()}`,
        photoURL: user.photoURL,
        stamps: 0,
        rewards: [],
        visitCount: 0,
        profileComplete: true,
        createdAt: new Date()
      }, { merge: true });

      onComplete();
    } catch (err) {
      console.error("Profile Setup Error:", err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dessert-cream flex items-center justify-center p-6 relative overflow-hidden">
      {/* Top Left Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 w-12 h-12 clay-btn-white flex items-center justify-center p-0 rounded-full text-dessert-chocolate/40 hover:text-dessert-pink cursor-pointer transition-colors"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-dessert-pink/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-dessert-peach/15 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="clay-card-light p-12 relative">
          <div className="flex flex-col items-center mb-10">
            <div className="relative group mb-8">
              <div className="w-32 h-32 rounded-[2.5rem] p-1 border-4 border-white bg-white clay-card-light overflow-hidden shadow-2xl transition-transform group-hover:scale-105 duration-500">
                <img 
                  src={user?.photoURL || 'https://via.placeholder.com/150'} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-[2rem]"
                />
              </div>
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -bottom-2 -right-2 w-12 h-12 clay-btn-pink flex items-center justify-center text-white border-4 border-white"
              >
                <Camera size={20} />
              </motion.div>
            </div>
            
            <h2 className="text-4xl font-black text-dessert-chocolate text-center mb-2 tracking-tighter uppercase italic">
              Level <span className="text-dessert-pink">Up</span>
            </h2>
            <p className="text-dessert-chocolate/40 text-center text-[10px] font-black uppercase tracking-[0.2em] px-4 max-w-xs leading-relaxed">
              Complete your profile to unlock exclusive sweet loyalty rewards.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-5">
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-dessert-pink/50 group-focus-within:text-dessert-pink transition-colors">
                  <User size={24} />
                </div>
                <input 
                  type="text"
                  placeholder="Your Sweet Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full clay-indent py-6 pl-16 pr-8 text-dessert-chocolate font-black text-lg outline-none placeholder:text-dessert-chocolate/10 border-2 border-transparent focus:border-dessert-pink/20 transition-all rounded-[2rem]"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-dessert-pink/50 group-focus-within:text-dessert-pink transition-colors">
                  <Phone size={24} />
                </div>
                <input 
                  type="tel"
                  placeholder="Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full clay-indent py-6 pl-16 pr-8 text-dessert-chocolate font-black text-lg outline-none placeholder:text-dessert-chocolate/10 border-2 border-transparent focus:border-dessert-pink/20 transition-all rounded-[2rem]"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest leading-relaxed">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full clay-btn-pink py-7 flex items-center justify-center gap-4 text-xl font-black tracking-tight uppercase"
            >
              {loading ? (
                <RefreshCcw className="animate-spin" size={28} />
              ) : (
                <>
                  <span>Save Profile</span>
                  <ArrowRight size={24} />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSetup;
