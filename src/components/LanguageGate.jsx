import React from 'react';
import { useMenu } from '../context/MenuContext';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

// Custom Crisp Flags
const KurdistanFlag = ({ className = "w-7 h-5" }) => (
  <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="66.6" fill="#EE2A35" />
    <rect y="66.6" width="300" height="66.6" fill="#FFFFFF" />
    <rect y="133.3" width="300" height="66.7" fill="#009A44" />
    <circle cx="150" cy="100" r="28" fill="#FFB81C" />
    {[...Array(21)].map((_, i) => (
      <polygon
        key={i}
        points="150,56 146,90 154,90"
        fill="#FFB81C"
        transform={`rotate(${i * (360 / 21)} 150 100)`}
      />
    ))}
  </svg>
);

const IraqFlag = ({ className = "w-7 h-5" }) => (
  <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="66.6" fill="#CE1126" />
    <rect y="66.6" width="300" height="66.6" fill="#FFFFFF" />
    <rect y="133.3" width="300" height="66.7" fill="#000000" />
    <text
      x="150"
      y="112"
      fill="#007A3D"
      fontSize="30"
      fontWeight="bold"
      fontFamily="sans-serif"
      textAnchor="middle"
    >
      الله أكبر
    </text>
  </svg>
);

const UKFlag = ({ className = "w-7 h-5" }) => (
  <svg viewBox="0 0 60 30" className={className} xmlns="http://www.w3.org/2000/svg">
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z" />
    </clipPath>
    <clipPath id="t">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
    </clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

export const LanguageGate = ({ onEnter }) => {
  const { lang, setLang, restaurantInfo } = useMenu();

  const isKu = lang === 'ku';
  const isAr = lang === 'ar';
  const isEn = lang === 'en';

  const languages = [
    {
      code: 'ku',
      name: 'کوردی',
      subtitle: 'Kurdî',
      flag: <KurdistanFlag className="w-8 h-5 rounded shadow-sm object-cover" />,
    },
    {
      code: 'ar',
      name: 'العربية',
      subtitle: 'Arabic',
      flag: <IraqFlag className="w-8 h-5 rounded shadow-sm object-cover" />,
    },
    {
      code: 'en',
      name: 'English',
      subtitle: 'English',
      flag: <UKFlag className="w-8 h-5 rounded shadow-sm object-cover" />,
    },
  ];

  // Button text based on selected language
  const getButtonText = () => {
    if (isAr) return 'عرض القائمة';
    if (isKu) return 'بینینی مێنیو';
    return 'View Menu';
  };

  const getSubTitle = () => {
    if (isAr) return 'اختر لغتك المفضلة لتصفح قائمة الطعام';
    if (isKu) return 'تکایە زمانەکەت هەڵبژێرە بۆ بینینی مێنیوی خواردنەکان';
    return 'Choose your preferred language to explore our menu';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden select-none">
      {/* Background with Dark Food Mood & Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />
      
      {/* Ambient Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0406]/85 via-[#120609]/80 to-[#0a0406]/95 backdrop-blur-[6px]" />
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-[#ba181b]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-[#f5a623]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Card matching Reference Layout */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center space-y-7 animate-fade-in">
        
        {/* Circular Chikora Hawler Logo */}
        <div className="relative group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#ba181b] via-[#f5a623] to-[#c2410c] opacity-80 blur-md group-hover:opacity-100 transition duration-500 animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-br from-[#f5a623] via-[#ba181b] to-[#780016] shadow-[0_0_40px_rgba(245,166,35,0.45)]">
            <img
              src="/chikora-logo.jpeg"
              alt="Chikora Hawler"
              className="w-full h-full object-cover rounded-full border-2 border-white/20 shadow-inner"
            />
          </div>
        </div>

        {/* Restaurant Title & Slogan */}
        <div className="space-y-1.5 px-4">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide drop-shadow-md">
            {isAr ? restaurantInfo.nameAr : isKu ? restaurantInfo.nameKu : restaurantInfo.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#f5a623] font-bold">
            {isAr ? restaurantInfo.sloganAr : isKu ? restaurantInfo.sloganKu : restaurantInfo.slogan}
          </p>
          <p className="text-[11px] text-gray-300/80 pt-1">
            {getSubTitle()}
          </p>
        </div>

        {/* 3 Language Selection Cards (Matching Reference Image) */}
        <div className="w-full grid grid-cols-3 gap-2.5 sm:gap-3 px-2">
          {languages.map((l) => {
            const isSelected = lang === l.code;
            return (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                type="button"
                className={`relative flex flex-col items-center justify-center py-3.5 sm:py-4 px-2 rounded-2xl transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#b91c1c]/70 to-[#881337]/90 border-2 border-[#f5a623] shadow-[0_0_20px_rgba(245,166,35,0.35)] scale-105'
                    : 'bg-white/10 hover:bg-white/15 border border-white/15 text-gray-300 hover:text-white backdrop-blur-md'
                }`}
              >
                {/* Active Checkmark Pill */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#f5a623] text-[#120609] flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[4]" />
                  </div>
                )}

                <div className="mb-2 transition-transform duration-200 group-hover:scale-110">
                  {l.flag}
                </div>
                <span className="text-xs sm:text-sm font-black text-white tracking-wide">
                  {l.name}
                </span>
                <span className="text-[10px] text-gray-300/70 mt-0.5">
                  {l.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Big Prominent "View Menu" Button (Exact style from reference screenshot) */}
        <div className="w-full px-2 pt-2">
          <button
            onClick={onEnter}
            type="button"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#e5a024] via-[#f5a623] to-[#d97706] hover:from-[#f5a623] hover:to-[#e5a024] text-[#140609] font-black text-base sm:text-lg shadow-[0_6px_25px_rgba(245,166,35,0.45)] hover:shadow-[0_8px_30px_rgba(245,166,35,0.6)] active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <span>{getButtonText()}</span>
            {isKu || isAr ? (
              <ArrowLeft className="w-5 h-5 stroke-[2.5] group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </div>

        {/* Small Footer Address hint */}
        <div className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
          <span>📍</span>
          <span>
            {isAr ? restaurantInfo.addressAr : isKu ? restaurantInfo.addressKu : restaurantInfo.address}
          </span>
        </div>

      </div>
    </div>
  );
};
