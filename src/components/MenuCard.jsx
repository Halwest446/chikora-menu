import React from 'react';
import { useMenu } from '../context/MenuContext';
import { Flame, Star, Sparkles, ChevronRight, Eye } from 'lucide-react';

export const MenuCard = ({ item }) => {
  const { lang, formatPrice, setSelectedItemForModal } = useMenu();
  const isKu = lang === 'ku';
  const isAr = lang === 'ar';

  const name = isAr ? (item.nameAr || item.name) : isKu ? (item.nameKu || item.name) : item.name;
  const secondaryName = isAr ? item.name : isKu ? item.name : (item.nameAr || item.nameKu);
  const description = isAr ? (item.descriptionAr || item.description) : isKu ? (item.descriptionKu || item.description) : item.description;

  const isOutOfStock = item.inStock === false;

  const getTagLabel = (tag) => {
    if (tag === 'Best Seller') return isAr ? 'الأكثر طلباً' : isKu ? 'پڕفرۆشترین' : 'Best Seller';
    if (tag === 'Spicy') return isAr ? 'حار' : isKu ? 'تیژ' : 'Spicy';
    if (tag === 'Chef Special') return isAr ? 'توقيع الشيف' : isKu ? 'تایبەتی شێف' : 'Chef Special';
    if (tag === 'New') return isAr ? 'جديد' : isKu ? 'نوێ' : 'New';
    return tag;
  };

  return (
    <article className="group relative bg-zinc-900/60 hover:bg-zinc-900 border border-white/[0.08] hover:border-white/[0.18] rounded-xl overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-subtle hover:shadow-card-hover">
      
      {/* Food Image Container */}
      <div 
        onClick={() => setSelectedItemForModal(item)}
        className="relative aspect-[16/11] w-full overflow-hidden cursor-pointer bg-zinc-950"
      >
        <img
          src={item.image || 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80'}
          alt={item.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            isOutOfStock ? 'grayscale opacity-50' : ''
          }`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Subtle dark gradient overlay at base of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-black/20 pointer-events-none" />

        {/* Minimalist Badges */}
        <div className="absolute top-2.5 left-2.5 rtl:left-auto rtl:right-2.5 flex flex-col gap-1 z-10">
          {item.tag && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-zinc-950/80 text-white backdrop-blur-md border border-white/10 shadow-sm">
              {item.tag === 'Best Seller' && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
              {item.tag === 'Spicy' && <Flame className="w-3 h-3 text-red-500 fill-red-500" />}
              {item.tag === 'Chef Special' && <Sparkles className="w-3 h-3 text-amber-400" />}
              <span>{getTagLabel(item.tag)}</span>
            </span>
          )}

          {item.isSpicy && !item.tag?.includes('Spicy') && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-950/80 text-red-300 backdrop-blur-md border border-red-800/40">
              <Flame className="w-3 h-3 text-red-400 fill-red-400" />
              <span>{isAr ? 'حار' : isKu ? 'تیژ' : 'Spicy'}</span>
            </span>
          )}
        </div>

        {/* Out of Stock Notice */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="px-3 py-1 rounded-md bg-zinc-900/90 text-zinc-300 text-xs font-semibold tracking-wider uppercase border border-white/10">
              {isAr ? 'نفذت الكمية' : isKu ? 'تەواوبووە' : 'Sold Out'}
            </span>
          </div>
        )}

        {/* Quick View Hover Hint */}
        <div className="absolute bottom-2.5 right-2.5 rtl:right-auto rtl:left-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-950/90 backdrop-blur-md text-[11px] text-zinc-200 border border-white/10">
            <Eye className="w-3 h-3 text-amber-400" />
            <span>{isAr ? 'التفاصيل' : isKu ? 'وردەکاری' : 'Details'}</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 
            onClick={() => setSelectedItemForModal(item)}
            className="font-bold text-white text-base group-hover:text-amber-400 transition-colors cursor-pointer line-clamp-1"
          >
            {name}
          </h3>
          {secondaryName && (
            <p className="text-xs text-zinc-400 font-normal mt-0.5 line-clamp-1">
              {secondaryName}
            </p>
          )}

          {description && (
            <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Footer: Tabular Price & Action */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium block">
              {isAr ? 'السعر' : isKu ? 'نرخ' : 'Price'}
            </span>
            <span className="text-sm sm:text-base font-bold text-white tabular-nums tracking-tight">
              {formatPrice(item.price)}
            </span>
          </div>

          <button
            onClick={() => setSelectedItemForModal(item)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-white/[0.08] transition-colors"
          >
            <span>{isAr ? 'التفاصيل' : isKu ? 'بینین' : 'View'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 rtl:rotate-180" />
          </button>
        </div>

      </div>
    </article>
  );
};
