import React from 'react';
import { useMenu } from '../context/MenuContext';
import { MapPin, Clock, Phone, Sparkles, Flame, Award } from 'lucide-react';

export const Hero = () => {
  const { lang, restaurantInfo, tagFilter, setTagFilter } = useMenu();
  const isKu = lang === 'ku';
  const isAr = lang === 'ar';
  const isRtl = isKu || isAr;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#180a0d] via-[#14080a] to-[#0e0708] border-b border-[#2d151a]">
      {/* Background ambient decorative glow & patterns */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#ba181b]/15 via-[#f5a623]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#f5a623]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-32 -left-24 w-80 h-80 rounded-full bg-[#ba181b]/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Info */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left rtl:lg:text-right">
            
            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#241115] border border-[#482029] text-xs font-semibold text-[#f5a623]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-emerald-400 font-bold">
                {isAr ? 'مفتوح الآن' : isKu ? 'ئێستا کراوەیە' : 'Open Now'}
              </span>
              <span className="text-gray-400">•</span>
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-300">
                {isAr ? restaurantInfo.openingHoursAr : isKu ? restaurantInfo.openingHoursKu : restaurantInfo.openingHours}
              </span>
            </div>

            {/* Slogan & Title */}
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                {isAr ? (
                  <>
                    أهلاً بكم في <span className="gold-text-gradient">تشيكورا هولير</span>
                  </>
                ) : isKu ? (
                  <>
                    بەخێربێن بۆ <span className="gold-text-gradient">چیکۆرا هه‌ولێر</span>
                  </>
                ) : (
                  <>
                    Taste The Legendary <br className="hidden sm:inline" />
                    <span className="gold-text-gradient">Chikora Crunch</span>
                  </>
                )}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {isAr ? restaurantInfo.sloganAr : isKu ? restaurantInfo.sloganKu : restaurantInfo.slogan}
              </p>
            </div>

            {/* Badges / Highlights */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start rtl:lg:justify-start gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-[#221014] text-amber-300 border border-[#421d25]">
                <Flame className="w-3.5 h-3.5 text-[#ba181b]" />
                {isAr ? 'دجاج طازج يومياً 100%' : isKu ? 'مریشکی تازەی ڕۆژانە' : '100% Fresh Daily Chicken'}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-[#221014] text-amber-300 border border-[#421d25]">
                <Sparkles className="w-3.5 h-3.5 text-[#f5a623]" />
                {isAr ? 'صلصة جديدة بنكهة تشيكورا' : isKu ? 'سۆسی نوێ بە تامی چیکۆرا' : 'New Signature Chikora Sauce'}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-[#221014] text-amber-300 border border-[#421d25]">
                <Award className="w-3.5 h-3.5 text-yellow-400" />
                {isAr ? 'خدمة توصيل سريعة في أربيل' : isKu ? 'خزمەتگوزاری گەیاندنی خێرا' : 'Fast Hawler Delivery'}
              </span>
            </div>

            {/* Action Bar (Address & Call) */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start rtl:lg:justify-start gap-3">
              <a
                href={`tel:${restaurantInfo.phone}`}
                dir="ltr"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#231216] hover:bg-[#341b21] text-gray-200 border border-[#431f28] font-bold text-xs sm:text-sm transition-all"
              >
                <Phone className="w-4 h-4 text-[#f5a623] flex-shrink-0" />
                <bdi dir="ltr" className="font-sans font-bold tracking-wide">{restaurantInfo.phone}</bdi>
              </a>

              <div className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-[#1c0d10] px-3 py-2 rounded-xl border border-[#38161d]">
                <MapPin className="w-3.5 h-3.5 text-[#ba181b]" />
                <span>{isAr ? restaurantInfo.addressAr : isKu ? restaurantInfo.addressKu : restaurantInfo.address}</span>
              </div>
            </div>

            {/* Tag Quick Filters */}
            <div className="pt-3 border-t border-[#291318] flex items-center justify-center lg:justify-start rtl:lg:justify-start gap-2 text-xs">
              <span className="text-gray-400 font-medium">
                {isAr ? 'تصفية سريعة:' : isKu ? 'فلتەرکردنی خێرا:' : 'Quick Filters:'}
              </span>
              <button
                onClick={() => setTagFilter('all')}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  tagFilter === 'all'
                    ? 'bg-[#f5a623] text-black shadow-glow-gold'
                    : 'bg-[#1e0e12] text-gray-400 hover:text-white'
                }`}
              >
                {isAr ? 'الكل' : isKu ? 'هەموو' : 'All'}
              </button>
              <button
                onClick={() => setTagFilter(tagFilter === 'bestseller' ? 'all' : 'bestseller')}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  tagFilter === 'bestseller'
                    ? 'bg-[#f5a623] text-black shadow-glow-gold'
                    : 'bg-[#1e0e12] text-gray-400 hover:text-white'
                }`}
              >
                ⭐ {isAr ? 'الأكثر طلباً' : isKu ? 'پڕفرۆشترینەکان' : 'Best Sellers'}
              </button>
              <button
                onClick={() => setTagFilter(tagFilter === 'spicy' ? 'all' : 'spicy')}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  tagFilter === 'spicy'
                    ? 'bg-[#ba181b] text-white shadow-glow-red'
                    : 'bg-[#1e0e12] text-gray-400 hover:text-white'
                }`}
              >
                🌶️ {isAr ? 'الحار' : isKu ? 'تیژەکان' : 'Spicy Items'}
              </button>
            </div>
          </div>

          {/* Large Hero Visual / Crest */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group">
              {/* Outer Golden Aura */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#ba181b] via-[#f5a623] to-[#ffd043] opacity-40 blur-2xl group-hover:opacity-70 transition duration-700 animate-pulse"></div>
              
              <div className="relative p-2 rounded-3xl bg-gradient-to-b from-[#2b1419] to-[#120709] border-2 border-[#f5a623]/60 shadow-2xl">
                <img
                  src="/chikora-logo.jpeg"
                  alt="Chikora Hawler Rooster"
                  className="w-56 h-56 sm:w-72 sm:h-72 object-contain rounded-2xl drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] transform group-hover:scale-102 transition duration-500"
                />

                {/* Floating mini badge */}
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-[#ba181b] to-[#800f13] border-2 border-[#f5a623] text-white px-3.5 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 text-xs font-black">
                  <Flame className="w-4 h-4 text-[#ffd043] fill-[#ffd043]" />
                  <span>ORIGINAL CRUNCH</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
