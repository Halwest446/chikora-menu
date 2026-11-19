import React, { useState, useRef, useEffect } from 'react';
import { useMenu } from '../context/MenuContext';
import { 
  Search, 
  X, 
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Check,
  Globe
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
    <header className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      {/* Top micro announcement bar - clean & minimalist */}
      <div className="bg-zinc-900/90 border-b border-white/[0.05] text-zinc-300 text-[11px] py-1 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span className="font-medium">
          {isAr
            ? 'أهلاً بكم في تشيكورا هولير - أشهى وأقرمش دجاج مقلي في أربيل'
            : isKu
            ? 'بەخێربێن بۆ چیکۆرا هه‌ولێر - باشترین مریشکی کریسپی و برژاو لە هەولێر'
            : 'Welcome to Chikora Hawler - The Crispiest Golden Fried Chicken in Erbil'}
        </span>
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
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-1 ring-white/15 group-hover:ring-amber-500/50 transition-all duration-300"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  CHIKORA
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-white/[0.06] text-amber-400 border border-white/[0.08] tracking-wider uppercase">
                  Hawler
                </span>
              </div>
              <span className="text-[11px] font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">
                {isAr ? 'تشيكورا هولير' : isKu ? 'چیکۆرا هه‌ولێر' : 'Fast Food & Grills'}
              </span>
            </div>
          </div>

          {/* Desktop Search (Only on public menu) */}
          {!isAdminRoute && (
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={
                    isAr
                      ? 'ابحث في القائمة...'
                      : isKu
                      ? 'گەڕان لە مێنیوی چیکۆرا...'
                      : 'Search dishes, crispy chicken, burgers...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900/70 hover:bg-zinc-900 text-zinc-100 text-xs sm:text-sm pl-10 pr-16 py-2 rounded-lg border border-white/[0.08] focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 focus:outline-none transition-all placeholder:text-zinc-500"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-zinc-400 hover:text-white p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 bg-zinc-800/60 border border-zinc-700/50 rounded">
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/[0.08] text-xs font-semibold transition-all"
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
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-semibold border border-white/[0.08] transition-all"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className={isRtl ? 'font-kurdish' : ''}>
                  {currentLangLabel}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                    isLangDropdownOpen ? 'rotate-180 text-amber-400' : ''
                  }`}
                />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-44 bg-zinc-900/95 border border-white/[0.1] rounded-xl shadow-dialog py-1.5 z-50 backdrop-blur-xl animate-fade-in">
                  <button
                    type="button"
                    onClick={() => {
                      setLang('ku');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium font-kurdish transition-colors ${
                      lang === 'ku'
                        ? 'bg-white/[0.08] text-amber-400'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <span>کوردی (Kurdî)</span>
                    {lang === 'ku' && <Check className="w-3.5 h-3.5 text-amber-400 stroke-[3]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLang('ar');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium font-kurdish transition-colors ${
                      lang === 'ar'
                        ? 'bg-white/[0.08] text-amber-400'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <span>العربية (Arabic)</span>
                    {lang === 'ar' && <Check className="w-3.5 h-3.5 text-amber-400 stroke-[3]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLang('en');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                      lang === 'en'
                        ? 'bg-white/[0.08] text-amber-400'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <span>English</span>
                    {lang === 'en' && <Check className="w-3.5 h-3.5 text-amber-400 stroke-[3]" />}
                  </button>

                  <div className="pt-1 mt-1 border-t border-white/[0.08]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLangDropdownOpen(false);
                        openLanguageGate();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-zinc-400 hover:text-amber-400 hover:bg-zinc-800/60 transition-colors"
                    >
                      <Globe className="w-3 h-3 text-zinc-400" />
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder={
                  isAr
                    ? 'ابحث في القائمة...'
                    : isKu
                    ? 'گەڕان لە مێنیوی چیکۆرا...'
                    : 'Search dishes, meals...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/80 text-zinc-100 text-xs pl-9 pr-8 py-2 rounded-lg border border-white/[0.08] focus:border-amber-500/50 focus:outline-none placeholder:text-zinc-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
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
