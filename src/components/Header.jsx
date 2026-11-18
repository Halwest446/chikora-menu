import React, { useState, useRef, useEffect } from 'react';
import { useMenu } from '../context/MenuContext';
import { 
  Globe, 
  Search, 
  X, 
  Flame, 
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Check
} from 'lucide-react';

export const Header = () => {
  const {
    lang,
    setLang,
    searchQuery,
    setSearchQuery,
    isAdminRoute,
    navigate,
    openLanguageGate
  } = useMenu();

  const isKu = lang === 'ku';
  const isAr = lang === 'ar';
  const isRtl = isKu || isAr;

  const currentLangLabel = lang === 'ar' ? 'العربية' : lang === 'ku' ? 'کوردی' : 'English';

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#12080a]/95 backdrop-blur-md border-b border-[#2e151a] shadow-xl">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-[#ba181b] via-[#f5a623] to-[#ba181b] text-black text-xs font-bold py-1 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Flame className="w-3.5 h-3.5 fill-black animate-bounce" />
        <span>
          {isAr
            ? '🔥 أهلاً بكم في تشيكورا هولير - أشهى وأقرمش دجاج مقلي في أربيل!'
            : isKu
            ? '🔥 بەخێربێن بۆ چیکۆرا هه‌ولێر - باشترین مریشکی کریسپی و برژاو لە هەولێر!'
            : '🔥 Welcome to Chikora Hawler - The Crispiest Golden Fried Chicken in Town!'}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3.5 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ba181b] to-[#f5a623] rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <img
                src="/chikora-logo.jpeg"
                alt="Chikora Hawler Logo"
                className="relative w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-[#f5a623] shadow-md transform group-hover:scale-105 transition duration-300"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-[#f5a623] transition-colors flex items-center gap-1">
                  CHIKORA
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#ba181b]/30 text-[#f5a623] border border-[#ba181b]/60">
                    HAWLER
                  </span>
                </span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#f5a623] font-kurdish tracking-wider">
                {isAr ? 'تشيكورا هولير' : 'چیکۆرا هه‌ولێر'}
              </span>
            </div>
          </div>

          {/* Desktop Search (Only on public menu) */}
          {!isAdminRoute && (
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={
                    isAr
                      ? 'البحث في منيو تشيكورا...'
                      : isKu
                      ? 'گەڕان لە مێنیوی چیکۆرا...'
                      : 'Search crispy chicken, burgers, sides...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1e0e12] text-white text-sm pl-10 pr-9 py-2.5 rounded-xl border border-[#3b1c22] focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/20 focus:outline-none transition-all placeholder:text-gray-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* If on admin route, show Back to Menu link */}
            {isAdminRoute && (
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#241116] hover:bg-[#341820] text-[#f5a623] border border-[#4a222a] text-xs sm:text-sm font-bold transition-all"
              >
                {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>
                  {isAr ? 'العودة إلى القائمة' : isKu ? 'گەڕانەوە بۆ مێنیو' : 'Back to Menu'}
                </span>
              </button>
            )}

            {/* Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#241116] hover:bg-[#341820] text-gray-200 hover:text-white text-xs font-bold border border-[#3d1d24] transition-all shadow-sm"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#f5a623]" />
                <span className={isRtl ? 'font-kurdish' : ''}>
                  {currentLangLabel}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                    isLangDropdownOpen ? 'rotate-180 text-[#f5a623]' : ''
                  }`}
                />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-36 bg-[#1b0d10] border border-[#3e1b23] rounded-2xl shadow-2xl py-1.5 z-50 backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => {
                      setLang('en');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold transition-colors ${
                      lang === 'en'
                        ? 'bg-[#ba181b]/30 text-[#f5a623]'
                        : 'text-gray-300 hover:bg-[#281318] hover:text-white'
                    }`}
                  >
                    <span>English</span>
                    {lang === 'en' && <Check className="w-3.5 h-3.5 text-[#f5a623]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLang('ku');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold font-kurdish transition-colors ${
                      lang === 'ku'
                        ? 'bg-[#ba181b]/30 text-[#f5a623]'
                        : 'text-gray-300 hover:bg-[#281318] hover:text-white'
                    }`}
                  >
                    <span>کوردی</span>
                    {lang === 'ku' && <Check className="w-3.5 h-3.5 text-[#f5a623]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLang('ar');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold font-kurdish transition-colors ${
                      lang === 'ar'
                        ? 'bg-[#ba181b]/30 text-[#f5a623]'
                        : 'text-gray-300 hover:bg-[#281318] hover:text-white'
                    }`}
                  >
                    <span>العربية</span>
                    {lang === 'ar' && <Check className="w-3.5 h-3.5 text-[#f5a623]" />}
                  </button>

                  <div className="pt-1 mt-1 border-t border-[#311318]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLangDropdownOpen(false);
                        openLanguageGate();
                      }}
                      className="w-full flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-[#f5a623] hover:bg-[#281318] hover:text-white transition-colors"
                    >
                      <span>🌐</span>
                      <span>{isAr ? 'شاشة اختيار اللغة' : isKu ? 'شاشەی هەڵبژاردنی زمان' : 'Language Welcome'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Only on public menu) */}
        {!isAdminRoute && (
          <div className="md:hidden pb-3">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={
                  isAr
                    ? 'البحث في منيو تشيكورا...'
                    : isKu
                    ? 'گەڕان لە مێنیوی چیکۆرا...'
                    : 'Search chicken, burgers, meals...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1e0e12] text-white text-sm pl-10 pr-9 py-2.5 rounded-xl border border-[#3b1c22] focus:border-[#f5a623] focus:outline-none placeholder:text-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
