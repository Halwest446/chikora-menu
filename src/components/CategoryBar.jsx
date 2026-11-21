import React from 'react';
import { useMenu } from '../context/MenuContext';
import { 
  Flame, 
  Drumstick, 
  Sandwich, 
  Sparkles, 
  UtensilsCrossed, 
  Utensils,
  Salad, 
  Coffee,
  Layers,
  Pizza,
  Soup,
  IceCream
} from 'lucide-react';

const iconMap = {
  Flame,
  Drumstick,
  Sandwich,
  Sparkles,
  UtensilsCrossed,
  Utensils,
  Salad,
  Coffee,
  Layers,
  Pizza,
  Soup,
  IceCream
};

export const CategoryBar = () => {
  const { categories, activeCategory, setActiveCategory, items, lang } = useMenu();
  const isKu = lang === 'ku';
  const isAr = lang === 'ar';

  return (
    <nav className="sticky top-16 sm:top-20 z-30 bg-[#0e0708]/95 backdrop-blur-xl border-b border-[#291318] py-2.5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const IconComponent = iconMap[cat.icon] || Flame;
            
            // Count items in category
            const count = cat.id === 'all'
              ? items.length
              : items.filter((i) => i.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border flex-shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ba181b] to-[#c2410c] text-white border-[#f5a623] shadow-md scale-102'
                    : 'bg-[#1b0d10] hover:bg-[#2a141a] text-gray-300 hover:text-white border-[#3b1920]'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-[#ffd043]' : 'text-[#f5a623]'}`} />
                <span>
                  {isAr ? (cat.nameAr || cat.nameEn) : isKu ? (cat.nameKu || cat.nameEn) : cat.nameEn}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isActive ? 'bg-black/40 text-[#ffd043]' : 'bg-[#2b1419] text-gray-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
