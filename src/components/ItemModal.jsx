import React from 'react';
import { useMenu } from '../context/MenuContext';
import { X, Check, Flame } from 'lucide-react';

export const ItemModal = () => {
  const { selectedItemForModal, setSelectedItemForModal, lang, formatPrice } = useMenu();

  if (!selectedItemForModal) return null;

  const item = selectedItemForModal;
  const isKu = lang === 'ku';
  const isAr = lang === 'ar';

  const name = isAr ? (item.nameAr || item.name) : isKu ? (item.nameKu || item.name) : item.name;
  const secondaryName = isAr ? item.name : isKu ? item.name : (item.nameAr || item.nameKu);
  const description = isAr ? (item.descriptionAr || item.description) : isKu ? (item.descriptionKu || item.description) : item.description;

  const getTagLabel = (tag) => {
    if (tag === 'Best Seller') return isAr ? 'الأكثر طلباً' : isKu ? 'پڕفرۆشترین' : 'Best Seller';
    if (tag === 'Spicy') return isAr ? 'حار' : isKu ? 'تیژ' : 'Spicy';
    if (tag === 'Chef Special') return isAr ? 'توقيع الشيف' : isKu ? 'تایبەتی شێف' : 'Chef Special';
    if (tag === 'New') return isAr ? 'جديد' : isKu ? 'نوێ' : 'New';
    return tag;
  };

  return (
    <div 
      onClick={() => setSelectedItemForModal(null)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-zinc-900 border border-white/[0.1] rounded-2xl overflow-hidden shadow-dialog flex flex-col max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedItemForModal(null)}
          className="absolute top-3.5 right-3.5 rtl:right-auto rtl:left-3.5 z-20 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all backdrop-blur-md border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header Image */}
        <div className="relative aspect-[16/10] w-full bg-zinc-950 flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/30" />
          
          {item.tag && (
            <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-950/80 backdrop-blur-md text-white border border-white/15">
                {getTagLabel(item.tag)}
              </span>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {name}
              </h2>
              <span className="text-lg font-bold text-amber-400 tabular-nums flex-shrink-0">
                {formatPrice(item.price)}
              </span>
            </div>

            {secondaryName && (
              <p className="text-xs text-zinc-400 font-normal mt-0.5">
                {secondaryName}
              </p>
            )}
          </div>

          {description && (
            <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-white/[0.06]">
              <h4 className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                {isAr ? 'الوصف والمكونات' : isKu ? 'وەسف و کەرەستەکان' : 'Description'}
              </h4>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                {description}
              </p>
            </div>
          )}

          {/* Details & Stock Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            {item.isSpicy && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/60 text-red-300 border border-red-800/40 font-medium">
                <Flame className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                <span>{isAr ? 'وجبة حارة' : isKu ? 'خواردنی تیژ' : 'Spicy Dish'}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 text-emerald-400 border border-emerald-500/30 font-medium">
              <Check className="w-3.5 h-3.5" />
              {item.inStock !== false
                ? (isAr ? 'متوفر حالياً' : isKu ? 'ئێستا بەردەستە' : 'Currently Available')
                : (isAr ? 'نفذت الكمية' : isKu ? 'تەواوبووە' : 'Sold Out')}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-950 border-t border-white/[0.08] flex items-center justify-end">
          <button
            onClick={() => setSelectedItemForModal(null)}
            className="w-full py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs sm:text-sm border border-white/[0.08] transition-all"
          >
            {isAr ? 'إغلاق' : isKu ? 'داخستن' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
