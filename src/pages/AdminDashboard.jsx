import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, QrCode, Trash2, ArrowLeft, RefreshCcw, Settings, 
  ToggleLeft, ToggleRight, AlertCircle, User, Phone, Gift, Mail,
  LayoutDashboard, Menu as MenuIcon, PieChart, Users, ChevronRight, X,
  ShieldCheck, Command, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar2';
import { doc, getDoc, setDoc, deleteDoc, collection, onSnapshot, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';

const AdminDashboard = ({ 
  wheelRewards, 
  menuItems,
  updateGlobalRewards,
  updateMenu,
  updateCustomerData,
  onLogout
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customers'); // 'customers', 'menu', 'wheel'
  
  // Customer State
  const [searchQuery, setSearchQuery] = useState("");
  const [customer, setCustomer] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  
  // Custom Long Press Menu State
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, user: null });
  const touchTimer = React.useRef(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  // Helper to show error for a few seconds
  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 6000);
  };

  // Menu State
  const [newMenuTitle, setNewMenuTitle] = useState("");
  const [newMenuDesc, setNewMenuDesc] = useState("");
  const [newMenuIcon, setNewMenuIcon] = useState("🍰");
  const [newMenuPrice, setNewMenuPrice] = useState("");
  const [newMenuPhoto, setNewMenuPhoto] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  // Wheel State
  const [newReward, setNewReward] = useState("");
  const [newProb, setNewProb] = useState(10);

  // Fetch all users
  useEffect(() => {
    const usersCol = collection(db, "users");
    const unsubscribe = onSnapshot(usersCol, (snapshot) => {
      setAllUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setUsersLoading(false);
    });
    return unsubscribe;
  }, []);

  // Handlers
  // Long Press Handlers
  const handlePointerDown = (e, u) => {
    // If it's a right click, don't start the timer since contextMenu event handles it instantly
    if (e.button === 2) return;
    
    // Normalize coordinates for both mouse and touch
    const x = e.clientX || (e.touches && e.touches[0].clientX) || e.pageX;
    const y = e.clientY || (e.touches && e.touches[0].clientY) || e.pageY;
    
    touchTimer.current = setTimeout(() => {
      setContextMenu({ visible: true, x, y, user: u });
      if (navigator.vibrate) navigator.vibrate(50);
    }, 600);
  };

  const clearTouchTimer = () => {
    if (touchTimer.current) clearTimeout(touchTimer.current);
  };

  const handleContextMenu = (e, u) => {
    e.preventDefault();
    clearTouchTimer();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, user: u });
  };

  const handleMenuAction = async (action) => {
    const u = contextMenu.user;
    setContextMenu({ ...contextMenu, visible: false });
    if (!u) return;
    try {
      if (action === 'edit_name') {
        // Allow editing if the name is empty, "UNNAMED", or missing
        const isUnnamed = !u.name || u.name.trim() === '' || u.name.trim().toUpperCase() === 'UNNAMED';
        if (!isUnnamed) {
          showError("You can't change the name. This customer has already set their profile name.");
          return;
        }
        const newName = window.prompt("Enter a name for this hidden customer profile:");
        if (newName && newName.trim() !== '') {
          await updateCustomerData(u.id, { name: newName.trim() });
        }
      } else if (action === 'see_profile') {
        handleSelectCustomer(u);
      } else if (action === 'delete') {
        if (window.confirm(`Are you sure you want to completely erase ${u.name || 'UNNAMED'} from the registry?`)) {
          await deleteDoc(doc(db, "users", u.id));
          if (customer?.id === u.id) setCustomer(null);
        }
      }
    } catch (err) {
      showError("Action failed: " + (err?.message || err));
    }
  };

  const handleSelectCustomer = (selected) => {
    setCustomer(selected);
    setSearchQuery(selected.phone || "");
  };

  const handleAddStamp = async () => {
    if (customer && customer.stamps < 4) {
      const newStamps = customer.stamps + 1;
      const newVisitCount = (customer.visitCount || 0) + 1;
      setCustomer({ ...customer, stamps: newStamps, visitCount: newVisitCount });
      try {
        await updateCustomerData(customer.uid || customer.id, {
          stamps: newStamps,
          visitCount: newVisitCount
        });
      } catch (err) {
        setCustomer({ ...customer, stamps: customer.stamps, visitCount: customer.visitCount });
        showError("Failed to add stamp: " + (err?.message || err));
      }
    }
  };

  const handleRemoveStamp = async () => {
    if (customer && customer.stamps > 0) {
      const newStamps = customer.stamps - 1;
      const newVisitCount = Math.max(0, (customer.visitCount || 0) - 1);
      setCustomer({ ...customer, stamps: newStamps, visitCount: newVisitCount });
      try {
        await updateCustomerData(customer.uid || customer.id, {
          stamps: newStamps,
          visitCount: newVisitCount
        });
      } catch (err) {
        setCustomer({ ...customer, stamps: customer.stamps, visitCount: customer.visitCount });
        showError("Failed to remove stamp: " + (err?.message || err));
      }
    }
  };

  const resetStamps = async () => {
    if (customer && window.confirm("Reset all stamps for this user?")) {
      const oldStamps = customer.stamps;
      setCustomer({ ...customer, stamps: 0 });
      try {
        await updateCustomerData(customer.uid || customer.id, { stamps: 0 });
      } catch (err) {
        setCustomer({ ...customer, stamps: oldStamps });
        showError("Failed to reset stamps: " + (err?.message || err));
      }
    }
  };

  // Compress image before upload
  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ratio = Math.min(maxWidth / img.width, maxWidth / img.height, 1);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Photo Upload Handler
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      // Compress the image first
      const compressed = await compressImage(file);
      const fileName = `menu/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const storageRef = ref(storage, fileName);
      const metadata = { contentType: 'image/jpeg' };
      await uploadBytes(storageRef, compressed, metadata);
      const downloadURL = await getDownloadURL(storageRef);
      setNewMenuPhoto(downloadURL);
    } catch (err) {
      console.error("Upload Error:", err);
      // Fallback: convert to base64 data URL and use that directly
      try {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setNewMenuPhoto(ev.target.result);
        };
        reader.readAsDataURL(file);
        showError("Cloud upload failed. Using local preview. The image will be saved as data.");
      } catch (e2) {
        showError("Photo upload failed: " + (err?.message || err));
      }
    } finally {
      setUploading(false);
      // Reset file input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (newMenuTitle.trim()) {
      const newItem = {
        id: Date.now().toString(),
        title: newMenuTitle,
        desc: newMenuDesc,
        icon: newMenuIcon,
        price: newMenuPrice,
        photo: newMenuPhoto,
        active: true
      };
      try {
        await updateMenu([...menuItems, newItem]);
        setNewMenuTitle("");
        setNewMenuDesc("");
        setNewMenuPrice("");
        setNewMenuPhoto("");
      } catch (err) {
        showError("Failed to add menu item: " + (err?.message || err));
      }
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if(window.confirm("Delete this menu item?")) {
      try {
        await updateMenu(menuItems.filter(item => item.id !== id));
      } catch (err) {
        showError("Failed to delete menu item: " + (err?.message || err));
      }
    }
  };

  const handleAddWheelReward = async (e) => {
    e.preventDefault();
    if (newReward.trim()) {
      const colors = ["#FF8FA3", "#FFB5A7", "#F9A8D4", "#EC4899", "#5C4033", "#FCD5CE"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const updated = [...wheelRewards, {
        id: Date.now().toString(),
        name: newReward,
        probability: Number(newProb),
        active: true,
        color: randomColor
      }];
      try {
        await updateGlobalRewards(updated);
        setNewReward("");
        setNewProb(10);
      } catch (err) {
        showError("Failed to add reward: " + (err?.message || err));
      }
    }
  };

  const toggleReward = async (id) => {
    const updated = wheelRewards.map(r => r.id === id ? { ...r, active: !r.active } : r);
    try {
      await updateGlobalRewards(updated);
    } catch (err) {
      showError("Failed to toggle reward: " + (err?.message || err));
    }
  };

  const deleteReward = async (id) => {
    if(window.confirm("Delete this reward option?")) {
      try {
        await updateGlobalRewards(wheelRewards.filter(r => r.id !== id));
      } catch (err) {
        showError("Failed to delete reward: " + (err?.message || err));
      }
    }
  };

  const totalProb = wheelRewards.reduce((sum, r) => sum + (r.active ? Number(r.probability) : 0), 0);

  const filteredUsers = allUsers.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.phone?.includes(searchQuery) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-dessert-chocolate flex flex-col md:flex-row p-2 md:p-6 gap-4 md:gap-6">
      {/* Error Banner */}
      {error && (
        <div className="fixed top-0 left-0 w-full z-[9999] bg-red-500 text-white text-center py-3 font-bold animate-pulse shadow-lg">
          {error}
        </div>
      )}
      {/* Global Back Arrow - Top Left */}
      <button 
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-[200] w-10 h-10 clay-btn-white flex items-center justify-center p-0 rounded-full text-dessert-chocolate/40 hover:text-dessert-pink transition-colors shadow-lg"
      >
        <ArrowLeft size={18} />
      </button>
      {/* Premium Studio Sidebar -> Top Nav on Mobile */}
      <aside className="w-full md:w-72 clay-card-light flex flex-row md:flex-col p-4 md:pt-12 md:pb-8 overflow-hidden relative border-2 md:border-4 shrink-0">
        <div className="px-8 mb-16 hidden md:block">
           <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="text-dessert-pink" size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-dessert-pink opacity-60">Admin Terminal</span>
           </div>
           <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">
             AD<span className="text-dessert-pink">MIN</span>
           </h1>
        </div>

        <nav className="flex-1 flex flex-row md:flex-col gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {[
            { id: 'customers', label: 'Guest Loyalty', icon: Users },
            { id: 'menu', label: 'Menu Factory', icon: MenuIcon },
            { id: 'wheel', label: 'Win Algorithm', icon: PieChart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap flex-shrink-0 flex items-center justify-center md:justify-start gap-4 px-4 py-3 md:px-6 md:py-5 transition-all md:w-full rounded-2xl md:rounded-[2rem] ${
                activeTab === tab.id ? 'clay-btn-pink shadow-lg' : 'text-dessert-chocolate/40 hover:text-dessert-chocolate bg-white/50 border border-transparent'
              }`}
            >
              <tab.icon size={20} className="md:w-[22px] md:h-[22px]" />
              <span className="font-black uppercase text-[9px] md:text-[10px] tracking-widest">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="hidden md:block px-6 mt-auto">
          <button 
            onClick={onLogout}
            className="w-full py-5 clay-btn-white text-dessert-chocolate/40 hover:text-red-500 transition-all text-[10px] font-black uppercase tracking-widest border-2"
          >
            Sign Out
          </button>
        </div>
        <div className="md:hidden flex items-center ml-4">
           <button onClick={onLogout} className="p-3 clay-btn-white text-dessert-chocolate/60 hover:text-red-500">
             <LogOut size={18} />
           </button>
        </div>
      </aside>

      {/* Main Studio Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 md:h-24 clay-card-light mb-4 md:mb-6 flex items-center justify-between px-4 md:px-10 border-2 md:border-4">
           <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 clay-indent flex items-center justify-center text-dessert-pink opacity-40">
                <Command size={18} className="md:w-5 md:h-5" />
              </div>
              <h2 className="text-sm md:text-xl font-black uppercase tracking-[0.1em] opacity-40 italic">
                {activeTab === 'customers' ? 'Loyalty Ledger' : activeTab === 'menu' ? 'Design Studio' : 'Probability Engine'}
              </h2>
           </div>
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 px-5 py-2.5 clay-indent rounded-full">
               <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600/60">System Online</span>
             </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto min-h-0">
          <AnimatePresence mode="wait">
            {activeTab === 'customers' && (
              <motion.div 
                key="customers"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col lg:flex-row gap-6 lg:gap-8 h-full min-h-[600px]"
              >
                {/* User List Sidebar */}
                <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 max-h-[400px] lg:max-h-none">
                   <div className="relative group">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-dessert-pink/40" size={18} />
                     <input 
                       type="text" 
                       placeholder="Find user..." 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full clay-indent border-2 border-transparent focus:border-dessert-pink/20 rounded-[2rem] py-5 pl-14 pr-6 text-xs font-black outline-none transition-all placeholder:text-dessert-chocolate/10"
                     />
                   </div>
                   
                   <div className="flex-1 overflow-y-auto clay-indent p-4 space-y-3">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-dessert-chocolate/20 mb-6 px-4">Registry Database</p>
                     {usersLoading ? (
                       <div className="text-center py-20 opacity-20 italic">Initializing...</div>
                     ) : filteredUsers.map(u => (
                       <button
                         key={u.id}
                         onClick={() => {
                           if (!contextMenu.visible) handleSelectCustomer(u);
                         }}
                         onPointerDown={(e) => handlePointerDown(e, u)}
                         onPointerUp={clearTouchTimer}
                         onPointerLeave={clearTouchTimer}
                         onContextMenu={(e) => handleContextMenu(e, u)}
                         className={`w-full flex items-center gap-4 p-5 rounded-3xl transition-all text-left select-none relative ${
                           customer?.id === u.id ? 'clay-btn-pink' : 'bg-white/40 hover:bg-white/80'
                         }`}
                       >
                         <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 clay-indent p-0.5">
                            {u.photoURL ? <img src={u.photoURL} alt="" className="w-full h-full object-cover rounded-[1.2rem]" /> : <User size={24} className="m-auto opacity-10" />}
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-xs font-black tracking-tighter truncate leading-none mb-1.5">{u.name || "UNNAMED"}</p>
                            <p className={`text-[9px] font-black truncate uppercase tracking-widest ${customer?.id === u.id ? 'text-white/60' : 'text-dessert-pink'}`}>
                              {u.phone || "MISSING"}
                            </p>
                         </div>
                         <div className={`w-8 h-8 flex items-center justify-center rounded-full text-[10px] font-black ${customer?.id === u.id ? 'bg-white/20' : 'clay-indent'}`}>
                            {u.stamps}
                         </div>
                       </button>
                     ))}
                   </div>
                </div>

                {/* Profile Detail */}
                <div className="flex-1 clay-card-light p-6 md:p-16 flex flex-col justify-center relative overflow-hidden border-2 md:border-4">
                   <div className="absolute top-0 right-0 w-80 h-80 bg-dessert-pink/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                   
                   {customer ? (
                     <div className="relative z-10 max-w-2xl mx-auto w-full">
                        <div className="flex flex-col items-center text-center mb-16">
                           <div className="w-40 h-40 rounded-[3.5rem] p-1 border-8 border-white bg-white clay-card-light mb-8 overflow-hidden shadow-2xl">
                              {customer.photoURL ? (
                                <img src={customer.photoURL} alt={customer.name} className="w-full h-full object-cover rounded-[2.8rem]" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-7xl">🧁</div>
                              )}
                           </div>
                           <h3 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 italic leading-tight text-dessert-chocolate">{customer.name || "GUEST"}</h3>
                           <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center">
                              <div className="flex items-center gap-2.5 clay-indent px-5 py-2.5 text-dessert-pink font-black text-[10px] uppercase tracking-[0.2em]">
                                 <Phone size={14} /> {customer.phone}
                              </div>
                              <div className="flex items-center gap-2.5 clay-indent px-5 py-2.5 text-dessert-chocolate/40 font-black text-[10px] uppercase tracking-[0.2em]">
                                 <Mail size={14} /> {customer.email || "NO EMAIL"}
                              </div>
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-16">
                           <div className="clay-indent p-10 flex flex-col items-center">
                             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-dessert-chocolate/30 mb-4">Stamp Progression</p>
                             <div className="flex items-baseline gap-2">
                                <p className="text-6xl font-black">{customer.stamps}</p>
                                <p className="text-2xl font-black opacity-20">/ 4</p>
                             </div>
                             <div className="mt-8 flex gap-2">
                                {[...Array(4)].map((_, i) => (
                                  <div key={i} className={`w-3 h-3 rounded-full ${i < customer.stamps ? 'bg-dessert-pink clay-btn-pink border-0' : 'clay-indent'}`} />
                                ))}
                             </div>
                           </div>
                           <div className="clay-indent p-10 flex flex-col items-center">
                             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-dessert-chocolate/30 mb-4">Total Engagement</p>
                             <div className="flex items-baseline gap-2">
                                <p className="text-6xl font-black">{customer.visitCount || 0}</p>
                                <p className="text-xl font-black opacity-20 uppercase tracking-widest">Visits</p>
                             </div>
                             <div className="mt-8 px-4 py-1.5 bg-green-500/10 text-green-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-green-500/20">Active Member</div>
                           </div>
                        </div>

                        <div className="flex justify-center gap-6 max-w-md mx-auto">
                           <button onClick={handleAddStamp} className="flex-1 clay-btn-pink py-8 text-sm font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-transform duration-75">Gift Stamp</button>
                           <button onClick={handleRemoveStamp} className="flex-1 clay-btn-white py-8 text-sm font-black uppercase tracking-[0.2em] border-2 active:scale-95 transition-transform duration-75">- Revoke</button>
                           <button onClick={resetStamps} className="px-8 clay-btn-white text-red-500 hover:bg-red-50/50 border-2 active:scale-95 transition-transform duration-75">
                              <RefreshCcw size={20} />
                           </button>
                        </div>

                        {customer.rewards && customer.rewards.length > 0 && (
                          <div className="mt-16 pt-16 border-t-[3px] border-dessert-pink/10">
                            <div className="flex items-center gap-4 mb-8">
                               <div className="w-12 h-12 clay-card-light shadow-inner flex items-center justify-center text-dessert-pink border-2">
                                  <Gift size={20} />
                               </div>
                               <div>
                                 <h4 className="text-2xl font-black uppercase tracking-tighter italic">Vault History</h4>
                                 <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Complete track record of sweet rewards</p>
                               </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto pr-4">
                              {[...customer.rewards].reverse().map((reward, i) => {
                                const isObj = typeof reward === 'object' && reward !== null;
                                const rText = isObj ? reward.text : reward;
                                const rDate = isObj ? reward.date : null;
                                const rTime = isObj ? reward.time : null;
                                const rClaimed = isObj ? reward.claimed : false;
                                const cDate = isObj ? reward.claimDate : null;
                                const cTime = isObj ? reward.claimTime : null;

                                return (
                                  <div key={i} className={`p-6 clay-indent rounded-3xl flex items-center justify-between ${rClaimed ? 'opacity-60 grayscale' : 'border border-dessert-pink/20 bg-white/30'}`}>
                                     <div className="flex flex-col">
                                        <span className={`font-black uppercase tracking-tight text-xs ${rClaimed ? 'line-through opacity-50 text-dessert-chocolate/50' : 'text-dessert-chocolate'}`}>{rText}</span>
                                        <div className="flex gap-4 mt-2">
                                           {rDate && rDate !== "Legacy" && (
                                             <span className="text-[8px] font-black text-dessert-pink/80 uppercase tracking-[0.1em]">
                                               Won: {rDate} {rTime}
                                             </span>
                                           )}
                                           {rClaimed && cDate && (
                                             <span className="text-[8px] font-black text-green-600/80 uppercase tracking-[0.1em]">
                                               Claimed: {cDate} {cTime}
                                             </span>
                                           )}
                                        </div>
                                     </div>
                                     <div className="flex-shrink-0 pl-4">
                                       {rClaimed ? (
                                         <span className="px-3 py-1.5 bg-green-500/10 text-green-600 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-green-500/20">Claimed</span>
                                       ) : (
                                         <span className="px-3 py-1.5 bg-dessert-pink/10 text-dessert-pink rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-dessert-pink/20">Available</span>
                                       )}
                                     </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                   ) : (
                     <div className="text-center opacity-10 py-40">
                        <Users size={120} className="mx-auto mb-8" />
                        <p className="text-3xl font-black uppercase tracking-tighter italic">Registry Awaiting Selection</p>
                     </div>
                   )}
                </div>
              </motion.div>
            )}

            {activeTab === 'menu' && (
              <motion.div 
                key="menu"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="max-w-5xl mx-auto w-full"
              >
                <div className="clay-card-light p-8 md:p-16 mb-10 border-4 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Plus size={100} />
                   </div>
                   <h3 className="text-2xl md:text-4xl font-black tracking-tighter mb-10 italic uppercase">
                     Draft <span className="text-dessert-pink">New</span> Item
                   </h3>
                   <form onSubmit={handleAddMenuItem} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dessert-chocolate/30 ml-4">Product Name *</label>
                        <input type="text" value={newMenuTitle} onChange={e => setNewMenuTitle(e.target.value)} placeholder="e.g. Lavender Macaron" className="w-full clay-indent rounded-3xl p-5 md:p-6 text-sm font-black outline-none border-2 border-transparent focus:border-dessert-pink/20 transition-all" required />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dessert-chocolate/30 ml-4">Price (₹)</label>
                        <input type="text" value={newMenuPrice} onChange={e => setNewMenuPrice(e.target.value)} placeholder="e.g. ₹249" className="w-full clay-indent rounded-3xl p-5 md:p-6 text-sm font-black outline-none border-2 border-transparent focus:border-dessert-pink/20 transition-all" />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dessert-chocolate/30 ml-4">Description</label>
                        <input type="text" value={newMenuDesc} onChange={e => setNewMenuDesc(e.target.value)} placeholder="e.g. Infused with organic honey" className="w-full clay-indent rounded-3xl p-5 md:p-6 text-sm font-black outline-none border-2 border-transparent focus:border-dessert-pink/20 transition-all" />
                      </div>
                      <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dessert-chocolate/30 ml-4">Photo</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* URL Input */}
                          <input 
                            type="text" 
                            value={newMenuPhoto} 
                            onChange={e => setNewMenuPhoto(e.target.value)} 
                            placeholder="Paste image URL here..." 
                            className="flex-1 clay-indent rounded-3xl p-5 md:p-6 text-sm font-black outline-none border-2 border-transparent focus:border-dessert-pink/20 transition-all" 
                          />
                          
                          {/* OR Divider */}
                          <div className="flex items-center justify-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-dessert-chocolate/20">or</span>
                          </div>

                          {/* Device Upload Button */}
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="clay-btn-white px-6 py-5 md:py-6 text-xs font-black uppercase tracking-widest border-2 hover:border-dessert-pink/30 transition-all flex items-center justify-center gap-3 whitespace-nowrap"
                          >
                            {uploading ? (
                              <><RefreshCcw size={16} className="animate-spin" /> Uploading...</>
                            ) : (
                              <>📷 Upload from Device</>
                            )}
                          </button>
                        </div>

                        {/* Photo Preview */}
                        {newMenuPhoto && (
                          <div className="relative w-32 h-24 rounded-2xl overflow-hidden clay-indent mt-2">
                            <img src={newMenuPhoto} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => setNewMenuPhoto("")} 
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-black"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-2 flex justify-end mt-4">
                        <button type="submit" className="clay-btn-pink px-10 md:px-16 py-5 md:py-6 text-xs font-black uppercase tracking-widest shadow-xl">Deploy to Menu</button>
                      </div>
                   </form>
                </div>

                {/* Swiggy/Zomato Style Menu Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                   {menuItems.map(item => (
                     <div key={item.id} className="clay-card-light border-2 rounded-[2rem] overflow-hidden group hover:border-dessert-pink/30 transition-all hover:shadow-xl relative">
                        {/* Photo Area */}
                        <div className="relative w-full aspect-[4/3] bg-dessert-cream overflow-hidden">
                          {item.photo ? (
                            <img src={item.photo} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-7xl opacity-30">
                              {item.icon || "🍰"}
                            </div>
                          )}
                          {item.price && (
                            <div className="absolute top-4 right-4 clay-btn-pink px-4 py-2 text-[11px] font-black uppercase tracking-wider shadow-xl">
                              {item.price}
                            </div>
                          )}
                        </div>
                        
                        {/* Card Info */}
                        <div className="p-6">
                          <p className="font-black text-sm uppercase tracking-tight mb-1 text-dessert-chocolate">{item.title}</p>
                          {item.desc && <p className="text-[10px] text-dessert-chocolate/40 font-bold uppercase tracking-widest">{item.desc}</p>}
                        </div>
                        
                        {/* Delete Button */}
                        <button 
                          onClick={() => handleDeleteMenuItem(item.id)} 
                          className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-dessert-chocolate/20 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'wheel' && (
              <motion.div 
                key="wheel"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="max-w-5xl mx-auto w-full"
              >
                 <div className="clay-card-light p-16 mb-10 border-4">
                   <h3 className="text-4xl font-black tracking-tighter mb-10 italic uppercase">
                     Modify <span className="text-dessert-pink">RNG</span> Weights
                   </h3>
                   <form onSubmit={handleAddWheelReward} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="md:col-span-1 space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dessert-chocolate/30 ml-4">Loot Name</label>
                        <input type="text" value={newReward} onChange={e => setNewReward(e.target.value)} placeholder="Free Cupcake" className="w-full clay-indent rounded-3xl p-6 text-sm font-black outline-none" />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dessert-chocolate/30 ml-4">Odds %</label>
                        <input type="number" value={newProb} onChange={e => setNewProb(e.target.value)} className="w-full clay-indent rounded-3xl p-6 text-sm font-black outline-none" />
                      </div>
                      <div className="flex items-end">
                        <button type="submit" className="w-full clay-btn-pink py-6 text-xs font-black uppercase tracking-widest shadow-xl">Update Algorithm</button>
                      </div>
                   </form>
                </div>

                <div className="space-y-4 pb-20">
                   {wheelRewards.map(reward => (
                     <div key={reward.id} className={`flex items-center justify-between p-8 clay-card-light border-2 transition-all ${reward.active ? '' : 'opacity-40 grayscale'}`}>
                        <div className="flex items-center gap-8">
                           <div className="w-14 h-14 rounded-3xl shadow-xl clay-card-light" style={{ backgroundColor: reward.color, border: 'none' }} />
                           <div>
                              <p className="font-black text-sm uppercase tracking-tight mb-1">{reward.name}</p>
                              <p className="text-[10px] font-black text-dessert-chocolate/30 uppercase tracking-[0.2em]">Theoretical Logic: {reward.probability}%</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-6">
                           <button onClick={() => toggleReward(reward.id)} className="transition-all active:scale-95">
                              {reward.active ? <ToggleRight size={56} className="text-green-500" /> : <ToggleLeft size={56} className="text-dessert-chocolate/10" />}
                           </button>
                           <button onClick={() => deleteReward(reward.id)} className="w-14 h-14 clay-btn-white flex items-center justify-center text-dessert-chocolate/20 hover:text-red-500 border-2 transition-all">
                              <Trash2 size={24} />
                           </button>
                        </div>
                     </div>
                   ))}
                </div>

                <div className={`p-8 clay-card-light border-4 flex items-center gap-6 ${totalProb === 100 ? 'text-green-600 bg-green-50/30 border-green-200' : 'text-orange-500 bg-orange-50/30 border-orange-200'}`}>
                   <AlertCircle size={28} />
                   <div>
                     <p className="text-lg font-black uppercase tracking-tighter">Mathematical Integrity: {totalProb}%</p>
                     <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{totalProb === 100 ? 'System optimized for fairness' : 'Warning: Probabilities do not sum to 100%'}</p>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Custom Long Press Menu Overlay */}
      {contextMenu.visible && (
        <div 
          className="fixed inset-0 z-[100]" 
          onClick={() => setContextMenu({ ...contextMenu, visible: false })}
          onContextMenu={(e) => { e.preventDefault(); setContextMenu({ ...contextMenu, visible: false }); }}
        >
          <div 
            className="absolute bg-white shadow-2xl rounded-2xl border-4 border-dessert-pink/20 overflow-hidden flex flex-col min-w-[200px] animate-in zoom-in-95 duration-100"
            style={{ 
              left: Math.min(contextMenu.x, window.innerWidth - 220), 
              top: Math.min(contextMenu.y, window.innerHeight - 180) 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-dessert-cream/50 px-4 py-3 border-b-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-dessert-chocolate/40">Action Menu</p>
              <p className="text-sm font-black truncate">{contextMenu.user?.name || "UNNAMED"}</p>
            </div>
            
            <button 
              onClick={() => handleMenuAction('edit_name')} 
              className="px-4 py-4 text-left font-black uppercase text-xs tracking-widest hover:bg-dessert-pink/10 hover:text-dessert-pink transition-colors border-b-2 flex items-center justify-between group"
            >
              Edit Name <Settings size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
              onClick={() => handleMenuAction('see_profile')} 
              className="px-4 py-4 text-left font-black uppercase text-xs tracking-widest hover:bg-dessert-pink/10 hover:text-dessert-pink transition-colors border-b-2 flex items-center justify-between group"
            >
              See Profile <User size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
              onClick={() => handleMenuAction('delete')} 
              className="px-4 py-4 text-left font-black uppercase text-xs tracking-widest text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-between group"
            >
              Delete <Trash2 size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
