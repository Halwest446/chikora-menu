import React, { useState, useEffect } from 'react';
import { useMenu } from '../context/MenuContext';
import { X, Check, Flame, Star, Sparkles, Layers, ShoppingBag } from 'lucide-react';

export const ItemModal = () => {
  const { selectedItemForModal, setSelectedItemForModal, lang, formatPrice, addToCart } = useMenu();
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  // Reset selected size whenever a different item is opened
  useEffect(() => {
    setSelectedSizeIndex(0);
  }, [selectedItemForModal?.id]);

  if (!selectedItemForModal) return null;

  const item = selectedItemForModal;
  const isKu = lang === 'ku';
  const isAr = lang === 'ar';

  const name = isAr ? (item.nameAr || item.name) : isKu ? (item.nameKu || item.name) : item.name;
  const secondaryName = isAr ? item.name : isKu ? item.name : (item.nameAr || item.nameKu);
  const description = isAr ? (item.descriptionAr || item.description) : isKu ? (item.descriptionKu || item.description) : item.description;

  const hasSizes = Array.isArray(item.sizes) && item.sizes.length > 0;
  const selectedSize = hasSizes ? item.sizes[selectedSizeIndex] || item.sizes[0] : null;
  const activePrice = selectedSize ? Number(selectedSize.price) : Number(item.price);

  const getTagLabel = (tag) => {
    if (tag === 'Best Seller') return isAr ? 'الأكثر طلباً' : isKu ? 'پڕفرۆشترین' : 'Best Seller';
    if (tag === 'Spicy') return isAr ? 'حار' : isKu ? 'تیژ' : 'Spicy';
    if (tag === 'Chef Special') return isAr ? 'توقيع الشيف' : isKu ? 'تایبەتی شێف' : 'Chef Special';
    if (tag === 'New') return isAr ? 'جديد' : isKu ? 'نوێ' : 'New';
    return tag;
  };

  const handleAddCurrentToCart = () => {
    addToCart(item, 1, '', selectedSize);
    setSelectedItemForModal(null);
  };

  return (
    <div 
      onClick={() => setSelectedItemForModal(null)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#190c0f] border border-[#3d1920] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedItemForModal(null)}
          className="absolute top-3.5 right-3.5 rtl:right-auto rtl:left-3.5 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all backdrop-blur-md border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header Image */}
        <div className="relative aspect-[16/10] w-full bg-[#241014] flex-shrink-0">
          <img
            src={item.image || '/chikora-logo.jpeg'}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/chikora-logo.jpeg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#190c0f] via-transparent to-black/30" />
          
          {item.tag && (
            <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-lg bg-gradient-to-r from-[#ba181b] to-[#c2410c] text-white border border-[#f5a623]/50">
                {item.tag === 'Best Seller' && <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />}
                {item.tag === 'Spicy' && <Flame className="w-3.5 h-3.5 text-white fill-white" />}
                {item.tag === 'Chef Special' && <Sparkles className="w-3.5 h-3.5 text-yellow-300" />}
                <span>{getTagLabel(item.tag)}</span>
              </span>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-xl font-black text-white tracking-tight">
                {name}
              </h2>
              <span className="text-xl font-black text-[#f5a623] tabular-nums flex-shrink-0">
                {formatPrice(activePrice)}
              </span>
            </div>

            {secondaryName && (
              <p className="text-xs text-[#f5a623] font-semibold font-kurdish mt-1">
                {secondaryName}
              </p>
            )}
          </div>

          {/* SIZES SELECTION SECTION (if item has sizes) */}
          {hasSizes && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-300">
                <Layers className="w-3.5 h-3.5 text-[#f5a623]" />
                <span>{isAr ? 'اختر الحجم المطلوب:' : isKu ? 'قەبارەی دڵخواز هەڵبژێرە:' : 'Select Size:'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {item.sizes.map((s, idx) => {
                  const isSelected = selectedSizeIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`p-3 rounded-xl border text-left rtl:text-right transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#2d1217] border-[#f5a623] text-white shadow-md ring-1 ring-[#f5a623]'
                          : 'bg-[#220f13] border-[#3d1820] text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 w-full">
                        <span className="text-xs font-bold">{s.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#f5a623]" />}
                      </div>
                      <span className="text-xs font-black text-[#f5a623] mt-1.5 tabular-nums">
                        {formatPrice(s.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {description && (
            <div className="bg-[#220f13] p-3.5 rounded-xl border border-[#3d1820]">
              <h4 className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                {isAr ? 'الوصف والمكونات' : isKu ? 'وەسف و کەرەستەکان' : 'Description'}
              </h4>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
                {description}
              </p>
            </div>
          )}

          {/* Details & Stock Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            {item.isSpicy && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/60 text-red-300 border border-red-800/40 font-bold">
                <Flame className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                <span>{isAr ? 'وجبة حارة' : isKu ? 'خواردنی تیژ' : 'Spicy Dish'}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#241014] text-emerald-400 border border-emerald-500/30 font-bold">
              <Check className="w-3.5 h-3.5" />
              {item.inStock !== false
                ? (isAr ? 'متوفر حالياً' : isKu ? 'ئێستا بەردەستە' : 'Currently Available')
                : (isAr ? 'نفذت الكمية' : isKu ? 'تەواوبووە' : 'Sold Out')}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#14080a] border-t border-[#311318] flex items-center gap-2.5">
          <button
            onClick={() => setSelectedItemForModal(null)}
            className="py-2.5 px-4 rounded-xl bg-[#261116] hover:bg-[#35171e] text-zinc-300 font-bold text-xs sm:text-sm border border-[#441a24] transition-all"
          >
            {isAr ? 'إغلاق' : isKu ? 'داخستن' : 'Close'}
          </button>

          {item.inStock !== false && (
            <button
              onClick={handleAddCurrentToCart}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#ba181b] to-[#c2410c] hover:from-[#d90429] hover:to-[#ea580c] text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {isAr
                  ? `إضافة إلى السلة (${formatPrice(activePrice)})`
                  : isKu
                  ? `خستنە ناو سەبەتە (${formatPrice(activePrice)})`
                  : `Add to Bag (${formatPrice(activePrice)})`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
