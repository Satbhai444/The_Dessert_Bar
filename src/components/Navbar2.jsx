import React from 'react';
import { LogOut, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-6xl">
      <div className="clay-card-light px-8 py-4 flex justify-between items-center border-2 border-white/50">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 clay-btn-pink flex items-center justify-center p-0 group-hover:scale-110 transition-transform">
             <span className="text-lg">🧁</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-dessert-pink mb-0.5">The</span>
            <span className="text-lg font-black tracking-tighter text-dessert-chocolate uppercase italic">
              Dessert Bar
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
             onClick={() => navigate('/')}
             className="clay-btn-white p-3 md:px-5 md:py-3 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hidden sm:flex"
          >
            <Home size={14} /> Home
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="clay-btn-white px-6 py-3 flex items-center gap-2 text-dessert-chocolate/60 hover:text-red-500 transition-all font-black text-[10px] uppercase tracking-widest border-2"
            >
              <LogOut size={14} /> Log Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
