import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, LogIn, ArrowLeft } from 'lucide-react';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Google Login Error:", err);
      setError('Login Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dessert-cream flex items-center justify-center p-6 relative overflow-hidden">
      {/* Top Left Global Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 w-12 h-12 clay-btn-white flex items-center justify-center p-0 rounded-full text-dessert-chocolate/40 hover:text-dessert-pink cursor-pointer transition-colors"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Soft Background Decor */}
      <div className="absolute top-[-20%] right-[-20%] w-[70%] h-[70%] bg-dessert-pink/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-dessert-peach/20 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="clay-card-light p-6 md:p-12 text-center relative overflow-hidden">
          {/* Accent Line */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-dessert-pink to-dessert-peach" />
          
          <div className="flex justify-center mb-10">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="w-24 h-24 clay-btn-pink flex items-center justify-center shadow-pink-500/20"
            >
              <LogIn className="text-white" size={40} />
            </motion.div>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-dessert-chocolate mb-4 tracking-tighter uppercase italic">
            Sweet <span className="text-dessert-pink">Access</span>
          </h2>
          <p className="text-dessert-chocolate/40 text-sm font-bold mb-12 px-4 leading-relaxed uppercase tracking-widest">
            Join the circle of dessert lovers. <br /> Sign in to start your journey.
          </p>

          <div className="space-y-6 max-w-md mx-auto">
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full clay-btn-white py-6 flex items-center justify-center gap-4 group/btn"
            >
              {loading ? (
                <RefreshCw className="animate-spin text-dessert-pink" size={28} />
              ) : (
                <>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-black tracking-tight uppercase">Continue with Google</span>
                </>
              )}
            </button>

            {error && (
              <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] animate-bounce">
                {error}
              </p>
            )}
          </div>

          <div className="mt-16 pt-8 border-t border-dessert-chocolate/5">
            <div className="flex items-center justify-center gap-4">
               <div className="w-2 h-2 rounded-full bg-dessert-pink/30" />
               <span className="text-[10px] font-black text-dessert-chocolate/20 uppercase tracking-[0.4em]">Handcrafted with Love</span>
               <div className="w-2 h-2 rounded-full bg-dessert-pink/30" />
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-dessert-chocolate/20 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
          <span className="w-8 h-[1px] bg-dessert-chocolate/10" />
          The Dessert Bar 
          <span className="w-8 h-[1px] bg-dessert-chocolate/10" />
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
