import React from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';

const MenuSection = ({ menuItems = [] }) => {
  if (!menuItems || menuItems.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-6 bg-dessert-cream relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-dessert-pink/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-dessert-peach/10 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 clay-card-light text-dessert-pink font-black text-[10px] uppercase tracking-[0.3em] mb-8">
            <UtensilsCrossed size={14} />
            <span>Our Sweet Collection</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-dessert-chocolate tracking-tighter italic uppercase">
            The <span className="text-dessert-pink">Menu</span>
          </h2>
          <p className="text-dessert-chocolate/30 font-black uppercase tracking-[0.3em] text-[10px] mt-4">
            Handcrafted with love • Fresh daily
          </p>
        </motion.div>

        {/* Swiggy/Zomato Style Card Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {menuItems.filter(item => item.active !== false).map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="clay-card-light border-2 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group cursor-pointer hover:border-dessert-pink/30 transition-all hover:shadow-2xl"
            >
              {/* Photo */}
              <div className="relative w-full aspect-square bg-dessert-cream/50 overflow-hidden">
                {item.photo ? (
                  <img 
                    src={item.photo} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl md:text-7xl opacity-20 group-hover:scale-110 transition-transform duration-500">
                      {item.icon || "🍰"}
                    </span>
                  </div>
                )}
                
                {/* Price Badge */}
                {item.price && (
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                    <span className="text-xs md:text-sm font-black text-dessert-chocolate">{item.price}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3 md:p-5">
                <p className="font-black text-xs md:text-sm text-dessert-chocolate tracking-tight leading-snug mb-1 line-clamp-2">
                  {item.title}
                </p>
                {item.desc && (
                  <p className="text-[8px] md:text-[10px] text-dessert-chocolate/40 font-bold uppercase tracking-widest line-clamp-1">
                    {item.desc}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
