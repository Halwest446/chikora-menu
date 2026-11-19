import React, { useState, useRef, useEffect } from 'react';
import { useMenu } from '../context/MenuContext';
import { 
  Search, 
  X, 
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Check,
  Globe,
  Flame
} from 'lucide-react';

export const Header = () => {
  const {
    lang,
    setLang,
    searchQuery,
    setSearchQuery,
    isAdminRoute,
    navigate,
    openLanguageGate,
    restaurantInfo
  } = useMenu();

  const isKu = lang === 'ku';
  const isAr = lang === 'ar';
  const isRtl = isKu || isAr;

  const currentLangLabel = lang === 'ar' ? 'العربية' : lang === 'ku' ? 'کوردی' : 'English';

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const searchInputRef = useRef(null);

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

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#12080a]/95 backdrop-blur-xl border-b border-[#2e151a] shadow-lg transition-all">
      {/* Top announcement bar - rich Chikora fire gradient */}
      <div className="bg-gradient-to-r from-[#ba181b] via-[#ea580c] to-[#ba181b] text-white text-xs font-bold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-sm">
        <Flame className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 flex-shrink-0" />
        <span>
          {isAr
            ? 'أهلاً بكم في تشيكورا هولير - أشهى وأقرمش دجاج مقلي في أربيل!'
            : isKu
            ? 'بەخێربێن بۆ چیکۆرا هه‌ولێر - باشترین مریشکی کریسپی و برژاو لە هەولێر!'
            : 'Welcome to Chikora Hawler - The Crispiest Golden Fried Chicken in Erbil!'}
        </span>
        <Flame className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 flex-shrink-0" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="relative">
              <img
                src="/chikora-logo.jpeg"
                alt="Chikora Hawler"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#f5a623] shadow-md group-hover:scale-105 transition-all duration-300"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-[#f5a623] transition-colors">
                  CHIKORA
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#ba181b]/30 text-[#f5a623] border border-[#ba181b]/60 tracking-wider uppercase">
                  Hawler
                </span>
              </div>
              <span className="text-xs font-semibold text-[#f5a623] tracking-wide">
                {isAr ? 'تشيكورا هولير' : 'چیکۆرا هه‌ولێر'}
              </span>
            </div>
          </div>

          {/* Desktop Search (Only on public menu) */}
          {!isAdminRoute && (
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={
                    isAr
                      ? 'البحث في منيو تشيكورا...'
                      : isKu
                      ? 'گەڕان لە مێنیوی چیکۆرا...'
                      : 'Search dishes, crispy chicken, burgers...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1e0e12] hover:bg-[#251117] text-white text-xs sm:text-sm pl-10 pr-16 py-2.5 rounded-xl border border-[#3b1c22] focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]/30 focus:outline-none transition-all placeholder:text-gray-500"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-gray-400 hover:text-white p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-[#281318] border border-[#3d1920] rounded">
                      <span>⌘</span>K
                    </kbd>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* If on admin route, show Back to Menu link */}
            {isAdminRoute && (
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#241116] hover:bg-[#341820] text-[#f5a623] border border-[#4a222a] text-xs font-bold transition-all"
              >
                {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                <span>
                  {isAr ? 'العودة للمنيو' : isKu ? 'گەڕانەوە بۆ مێنیو' : 'Back to Menu'}
                </span>
              </button>
            )}

            {/* Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#241116] hover:bg-[#341820] text-gray-200 hover:text-white text-xs font-bold border border-[#3d1d24] transition-all"
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
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-44 bg-[#1b0d10] border border-[#3e1b23] rounded-xl shadow-2xl py-1.5 z-50 backdrop-blur-xl animate-fade-in">
                  <button
                    type="button"
                    onClick={() => {
                      setLang('ku');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold font-kurdish transition-colors ${
                      lang === 'ku'
                        ? 'bg-[#ba181b]/30 text-[#f5a623]'
                        : 'text-gray-300 hover:bg-[#281318] hover:text-white'
                    }`}
                  >
                    <span>کوردی (Kurdî)</span>
                    {lang === 'ku' && <Check className="w-3.5 h-3.5 text-[#f5a623] stroke-[3]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLang('ar');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold font-kurdish transition-colors ${
                      lang === 'ar'
                        ? 'bg-[#ba181b]/30 text-[#f5a623]'
                        : 'text-gray-300 hover:bg-[#281318] hover:text-white'
                    }`}
                  >
                    <span>العربية (Arabic)</span>
                    {lang === 'ar' && <Check className="w-3.5 h-3.5 text-[#f5a623] stroke-[3]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLang('en');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold transition-colors ${
                      lang === 'en'
                        ? 'bg-[#ba181b]/30 text-[#f5a623]'
                        : 'text-gray-300 hover:bg-[#281318] hover:text-white'
                    }`}
                  >
                    <span>English</span>
                    {lang === 'en' && <Check className="w-3.5 h-3.5 text-[#f5a623] stroke-[3]" />}
                  </button>

                  <div className="pt-1 mt-1 border-t border-[#311318]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLangDropdownOpen(false);
                        openLanguageGate();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-gray-400 hover:text-[#f5a623] hover:bg-[#281318] transition-colors"
                    >
                      <Globe className="w-3 h-3 text-[#f5a623]" />
                      <span>{isAr ? 'شاشة الترحيب واختيار اللغة' : isKu ? 'شاشەی دەستپێک و زمانەکان' : 'Welcome Screen'}</span>
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder={
                  isAr
                    ? 'البحث في منيو تشيكورا...'
                    : isKu
                    ? 'گەڕان لە مێنیوی چیکۆرا...'
                    : 'Search chicken, burgers...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1e0e12] text-white text-xs pl-9 pr-8 py-2 rounded-xl border border-[#3b1c22] focus:border-[#f5a623] focus:outline-none placeholder:text-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
