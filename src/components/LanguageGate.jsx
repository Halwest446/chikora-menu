import React from 'react';
import { useMenu } from '../context/MenuContext';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

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

  const languages = [
    {
      code: 'ku',
      name: 'کوردی',
      subtitle: 'Kurdî',
      flag: <KurdistanFlag className="w-7 h-4.5 rounded shadow-sm object-cover" />,
    },
    {
      code: 'ar',
      name: 'العربية',
      subtitle: 'Arabic',
      flag: <IraqFlag className="w-7 h-4.5 rounded shadow-sm object-cover" />,
    },
    {
      code: 'en',
      name: 'English',
      subtitle: 'English',
      flag: <UKFlag className="w-7 h-4.5 rounded shadow-sm object-cover" />,
    },
  ];

  const getButtonText = () => {
    if (isAr) return 'عرض القائمة';
    if (isKu) return 'بینینی مێنیو';
    return 'View Menu';
  };

  const getSubTitle = () => {
    if (isAr) return 'اختر لغتك المفضلة لتصفح قائمة الطعام';
    if (isKu) return 'تکایە زمانەکەت هەڵبژێرە بۆ بینینی مێنیوی خواردنەکان';
    return 'Select your preferred language to explore the menu';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden select-none">
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=1920&q=80"
          className="w-full h-full object-cover scale-105"
        >
          <source src="/chikora-bg.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Dark frosted vignette overlays */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/70" />

      {/* Main Glassmorphic Container matching Reference Image */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center text-center space-y-6 animate-fade-in">
        
        {/* Circular Chikora Logo with Fine Border */}
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-white/10 backdrop-blur-xl border border-white/20 shadow-dialog">
            <img
              src="/chikora-logo.jpeg"
              alt="Chikora Hawler"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Restaurant Header */}
        <div className="space-y-1.5 px-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
            {isAr ? restaurantInfo.nameAr : isKu ? restaurantInfo.nameKu : restaurantInfo.name}
          </h1>
          <p className="text-xs sm:text-sm text-amber-400 font-semibold drop-shadow">
            {isAr ? restaurantInfo.sloganAr : isKu ? restaurantInfo.sloganKu : restaurantInfo.slogan}
          </p>
          <p className="text-[11px] text-zinc-300 font-normal pt-0.5">
            {getSubTitle()}
          </p>
        </div>

        {/* 3 Frosted Glass Language Selection Cards */}
        <div className="w-full grid grid-cols-3 gap-2.5 sm:gap-3 px-2">
          {languages.map((l) => {
            const isSelected = lang === l.code;
            return (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                type="button"
                className={`relative flex flex-col items-center justify-center py-4 px-2 rounded-xl transition-all duration-150 ${
                  isSelected
                    ? 'bg-amber-500/20 border-2 border-amber-400/80 text-white backdrop-blur-xl shadow-card scale-102'
                    : 'bg-black/40 hover:bg-black/60 border border-white/15 text-zinc-300 hover:text-white backdrop-blur-xl'
                }`}
              >
                {/* Active Checkmark Indicator */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}

                <div className="mb-2 transition-transform duration-150">
                  {l.flag}
                </div>
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  {l.name}
                </span>
                <span className="text-[10px] text-zinc-400 mt-0.5 font-normal">
                  {l.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Clean Amber CTA Button (Reference Style) */}
        <div className="w-full px-2 pt-1">
          <button
            onClick={onEnter}
            type="button"
            className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-sm sm:text-base shadow-card hover:shadow-card-hover active:scale-98 transition-all duration-150 flex items-center justify-center gap-2 group"
          >
            <span>{getButtonText()}</span>
            {isKu || isAr ? (
              <ArrowLeft className="w-4 h-4 stroke-[2.5] group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </div>

        {/* Subtle Erbil Address Hint */}
        <div className="text-[11px] text-zinc-400 flex items-center justify-center gap-1.5 font-normal">
          <span>📍</span>
          <span>
            {isAr ? restaurantInfo.addressAr : isKu ? restaurantInfo.addressKu : restaurantInfo.address}
          </span>
        </div>

      </div>
    </div>
  );
};
