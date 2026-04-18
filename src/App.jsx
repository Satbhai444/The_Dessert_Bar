import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Marquee from './components/Marquee';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfileSetup from './pages/ProfileSetup';
import Unauthorized from './pages/Unauthorized';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import Login from './components/Login';
import confetti from 'canvas-confetti';
import { auth, db } from './firebaseConfig';
import { collection, onSnapshot, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default App;

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileIncomplete, setProfileIncomplete] = useState(false);

  // Core Auth & Role Listener
  useEffect(() => {
    // Bootstrap admins - using Google Email
    const BOOTSTRAP_ADMINS = ['darshansatbhai38@gmail.com', 'sanenaparth@gmail.com']; 

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        console.log("Auth State Changed. User:", currentUser?.email);
        setUser(currentUser);
        
        if (currentUser) {
          const email = currentUser.email;
          if (!email) {
            console.warn("Auth Warning: Email missing from user object. Waiting or redirecting.");
            setRole('customer');
            setLoading(false);
            return;
          }
          
          const cleanEmail = email.toLowerCase().trim();
          
          // Check admin status robustly
          let isAdmin = BOOTSTRAP_ADMINS.includes(cleanEmail);
          try {
            const adminSnap = await getDoc(doc(db, "admins", cleanEmail));
            if (adminSnap.exists()) isAdmin = true;
          } catch(err) {
            console.warn("Could not verify dynamic admin list (possibly an empty/restricted 'admins' collection). Relying on bootstrap array.");
          }
          console.log("Admin Status:", isAdmin, "for", cleanEmail);
          localStorage.setItem('debug_email', `Email: ${cleanEmail} | isAdmin: ${isAdmin}`);
          
          const assignedRole = isAdmin ? 'admin' : 'customer';
          localStorage.setItem('debug_role', assignedRole);
          
          // Always call handleRoleAndRegistration to ensure Admins get a profile in 'users' collection too
          await handleRoleAndRegistration(currentUser, assignedRole);
          
        } else {
          setRole(null);
          setUserData(null);
          setProfileIncomplete(false);
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth Transition Critical Error:", err);
        // Failsafe so the user isn't locked out of the app completely if DB breaks
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Updated registration logic for Google Users
  const handleRoleAndRegistration = async (authUser, assignedRole = 'customer') => {
    try {
      const userRef = doc(db, "users", authUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists() || !userSnap.data().profileComplete) {
        setProfileIncomplete(true);
        setRole(assignedRole);
        setLoading(false);
        return;
      }
      
      setProfileIncomplete(false);
      setRole(assignedRole);
      
      // Real-time listener for current customer stats
      onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setUserData(doc.data());
        }
        setLoading(false);
      }, (err) => {
        console.error("Snapshot Error:", err);
        setLoading(false);
      });
    } catch (err) {
      console.error("Auth Exception:", err);
      // Failsafe: Ensures that if database is restricted/missing, Admin still gets 'admin' role context to see the dashboard.
      setRole(assignedRole);
      setLoading(false);
    }
  };

  const [wheelRewards, setWheelRewards] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  // Global Settings Listeners
  useEffect(() => {
    const rewardsRef = doc(db, "settings", "rewards");
    const unsubRewards = onSnapshot(rewardsRef, (doc) => {
      if (doc.exists()) {
        setWheelRewards(doc.data().wheelRewards || []);
      }
    });

    const menuRef = doc(db, "settings", "menu");
    const unsubMenu = onSnapshot(menuRef, (doc) => {
      if (doc.exists()) {
        setMenuItems(doc.data().items || []);
      }
    });

    return () => {
      unsubRewards();
      unsubMenu();
    };
  }, []);

  // Stamp Celebration Effect
  useEffect(() => {
    if (userData?.stamps === 4) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti({ particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
      }, 250);
      return () => clearInterval(interval);
    }
  }, [userData?.stamps]);

  const handleLogout = () => {
    signOut(auth);
    window.location.href = '/';
  };

  const updateGlobalRewards = async (newRewards) => {
    await setDoc(doc(db, "settings", "rewards"), { wheelRewards: newRewards });
  };

  const updateMenu = async (newItems) => {
    await setDoc(doc(db, "settings", "menu"), { items: newItems });
  };

  const updateCustomerData = async (uid, updates) => {
    await updateDoc(doc(db, "users", uid), updates);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1110]">
        <div className="w-12 h-12 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Debug sync for Unauthorized page
  localStorage.setItem('react_state_role', String(role));
  localStorage.setItem('react_state_profile_incomplete', String(profileIncomplete));

  return (
    <Router>
      <div className="relative">
        <Marquee />
        <Routes>
          <Route path="/" element={<LandingPage menuItems={menuItems} />} />

          <Route 
            path="/customer" 
            element={
              !user ? <Login /> : 
              profileIncomplete ? <ProfileSetup user={user} onComplete={() => handleRoleAndRegistration(user, role)} /> :
              role === 'admin' ? (
                <div className="min-h-screen bg-dessert-cream flex items-center justify-center px-6">
                  <div className="max-w-md w-full clay-card-light p-12 text-center border-4">
                    <h2 className="text-3xl font-black text-dessert-chocolate mb-4 uppercase italic">Admin Mode <span className="text-dessert-pink">Active</span></h2>
                    <p className="text-dessert-chocolate/60 font-black uppercase tracking-widest text-[10px] leading-relaxed mb-8">
                      You cannot access the customer panel while logged into the staff account. 
                      First, you must log out from the Admin Panel.
                    </p>
                    <div className="flex flex-col gap-4">
                      <button onClick={() => window.location.href = '/admin'} className="w-full clay-btn-pink py-4 font-black uppercase tracking-widest">
                        Return to Admin
                      </button>
                      <button onClick={handleLogout} className="w-full clay-btn-white py-4 font-black text-dessert-chocolate/40 hover:text-red-500 uppercase tracking-widest border-2">
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              ) :
              role === 'customer' ? (
                <CustomerDashboard 
                  stamps={userData?.stamps || 0} 
                  rewards={userData?.rewards || []} 
                  wheelRewards={wheelRewards.filter(r => r.active)}
                  updateUser={(updates) => updateCustomerData(user.uid, updates)}
                  onLogout={handleLogout}
                />
              ) : <Navigate to="/" />
            } 
          />
          <Route 
            path="/admin" 
            element={
              !user ? <Login /> : (role === 'admin' || localStorage.getItem('debug_role') === 'admin') ? (
                <AdminDashboard 
                  wheelRewards={wheelRewards}
                  menuItems={menuItems}
                  updateGlobalRewards={updateGlobalRewards}
                  updateMenu={updateMenu}
                  updateCustomerData={updateCustomerData}
                  onLogout={handleLogout}
                />
              ) : <Navigate to="/unauthorized" replace />
            } 
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}
