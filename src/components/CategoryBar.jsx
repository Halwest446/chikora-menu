import React from 'react';
import { useMenu } from '../context/MenuContext';
import { 
  Flame, 
  Drumstick, 
  Sandwich, 
  Sparkles, 
  UtensilsCrossed, 
  Salad, 
  Coffee,
  Layers
} from 'lucide-react';

const iconMap = {
  Flame: Flame,
  Drumstick: Drumstick,
  Sandwich: Sandwich,
  Sparkles: Sparkles,
  UtensilsCrossed: UtensilsCrossed,
  Salad: Salad,
  Coffee: Coffee,
  Layers: Layers
};

export const CategoryBar = () => {
  const { categories, activeCategory, setActiveCategory, items, lang } = useMenu();
  const isKu = lang === 'ku';
  const isAr = lang === 'ar';

  return (
    <nav className="sticky top-16 sm:top-20 z-30 bg-zinc-950/85 backdrop-blur-xl border-b border-white/[0.08] py-2.5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
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
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 border flex-shrink-0 ${
                  isActive
                    ? 'bg-zinc-800 text-white border-white/[0.18] shadow-subtle'
                    : 'bg-zinc-900/50 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-white/[0.05]'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                <span>
                  {isAr ? (cat.nameAr || cat.nameEn) : isKu ? (cat.nameKu || cat.nameEn) : cat.nameEn}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                    isActive ? 'bg-zinc-700/80 text-zinc-200' : 'bg-zinc-800/60 text-zinc-500'
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
