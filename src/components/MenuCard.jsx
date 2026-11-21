import React from 'react';
import { useMenu } from '../context/MenuContext';
import { Eye, Layers } from 'lucide-react';

export const MenuCard = ({ item }) => {
  const { lang, formatPrice, setSelectedItemForModal } = useMenu();
  const isKu = lang === 'ku';
  const isAr = lang === 'ar';

  const name = isAr ? (item.nameAr || item.name) : isKu ? (item.nameKu || item.name) : item.name;
  const secondaryName = isAr ? item.name : isKu ? item.name : (item.nameAr || item.nameKu);
  const description = isAr ? (item.descriptionAr || item.description) : isKu ? (item.descriptionKu || item.description) : item.description;

  const isOutOfStock = item.inStock === false;
  const hasSizes = Array.isArray(item.sizes) && item.sizes.length > 0;
  const displayPrice = hasSizes ? Math.min(...item.sizes.map((s) => Number(s.price))) : item.price;

  return (
    <article className="group relative bg-[#180b0e] hover:bg-[#1f0e12] border border-[#2e151a] hover:border-[#f5a623]/60 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-0.5">
      
      {/* Food Image Container */}
      <div 
        onClick={() => setSelectedItemForModal(item)}
        className="relative aspect-[16/11] w-full overflow-hidden cursor-pointer bg-[#241014]"
      >
        <img
          src={item.image || '/chikora-logo.jpeg'}
          alt={item.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isOutOfStock ? 'grayscale opacity-50' : ''
          }`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/chikora-logo.jpeg';
          }}
        />

        {/* Subtle dark gradient overlay at base of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#180b0e] via-transparent to-black/25 pointer-events-none" />

        {/* Multiple Sizes Indicator */}
        {hasSizes && (
          <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/80 backdrop-blur-md text-[#f5a623] border border-[#f5a623]/40 shadow-md">
              <Layers className="w-3 h-3 text-[#f5a623]" />
              <span>{item.sizes.map((s) => s.name).join(' / ')}</span>
            </span>
          </div>
        )}

        {/* Out of Stock Notice */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="px-3.5 py-1 rounded-lg bg-red-600/90 text-white text-xs font-black tracking-wider uppercase border border-red-400">
              {isAr ? 'نفذت الكمية' : isKu ? 'تەواوبووە' : 'Sold Out'}
            </span>
          </div>
        )}

        {/* Quick View Hover Hint */}
        <div className="absolute bottom-2.5 right-2.5 rtl:right-auto rtl:left-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[11px] font-bold text-gray-200 border border-white/15">
            <Eye className="w-3.5 h-3.5 text-[#f5a623]" />
            <span>{isAr ? 'التفاصيل' : isKu ? 'وردەکاری' : 'Details'}</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 
            onClick={() => setSelectedItemForModal(item)}
            className="font-black text-white text-base sm:text-lg group-hover:text-[#f5a623] transition-colors cursor-pointer line-clamp-1"
          >
            {name}
          </h3>
          {secondaryName && (
            <p className="text-xs text-[#f5a623] font-semibold mt-0.5 line-clamp-1">
              {secondaryName}
            </p>
          )}

          {description && (
            <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Footer: Price in Bold Gold & Detail Action */}
        <div className="pt-3 border-t border-[#291318] flex items-center justify-between gap-2">
          {hasSizes ? (
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black text-[#f5a623] leading-snug">
                {isAr
                  ? 'السعر يحدد حسب الحجم'
                  : isKu
                  ? 'نرخ بە پێ قەبارە دیاری دەکرێت'
                  : 'Price based on size'}
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                {isAr ? 'السعر' : isKu ? 'نرخ' : 'Price'}
              </span>
              <span className="text-base sm:text-lg font-black text-[#f5a623] tabular-nums tracking-tight">
                {formatPrice(item.price)}
              </span>
            </div>
          )}

          <button
            onClick={() => setSelectedItemForModal(item)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#241014] hover:bg-[#34161c] text-[#f5a623] border border-[#441c24] hover:border-[#f5a623]/60 transition-all duration-200 flex-shrink-0"
          >
            <Eye className="w-3.5 h-3.5 text-[#f5a623]" />
            <span>{isAr ? 'التفاصيل' : isKu ? 'وردەکاری' : 'Details'}</span>
          </button>
        </div>

      </div>
    </article>
  );
};
