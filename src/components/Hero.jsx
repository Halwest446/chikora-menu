import React from 'react';
import { useMenu } from '../context/MenuContext';
import { MapPin, Clock, Phone, Sparkles, Flame, Award, Star } from 'lucide-react';

export const Hero = () => {
  const { lang, restaurantInfo, tagFilter, setTagFilter } = useMenu();
  const isKu = lang === 'ku';
  const isAr = lang === 'ar';

  return (
    <section className="relative overflow-hidden bg-zinc-950 border-b border-white/[0.08]">
      {/* Subtle background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-b from-amber-500/[0.07] via-red-500/[0.03] to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-5 text-center lg:text-left rtl:lg:text-right">
            
            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/[0.08] text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-emerald-400 font-semibold">
                {isAr ? 'مفتوح الآن' : isKu ? 'ئێستا کراوەیە' : 'Open Now'}
              </span>
              <span className="text-zinc-600">•</span>
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-300">
                {isAr ? restaurantInfo.openingHoursAr : isKu ? restaurantInfo.openingHoursKu : restaurantInfo.openingHours}
              </span>
            </div>

            {/* Slogan & Title */}
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                {isAr ? (
                  <>
                    أهلاً بكم في <span className="text-gradient-gold">تشيكورا هولير</span>
                  </>
                ) : isKu ? (
                  <>
                    بەخێربێن بۆ <span className="text-gradient-gold">چیکۆرا هه‌ولێر</span>
                  </>
                ) : (
                  <>
                    Taste The Legendary <br className="hidden sm:inline" />
                    <span className="text-gradient-gold">Chikora Crunch</span>
                  </>
                )}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {isAr ? restaurantInfo.sloganAr : isKu ? restaurantInfo.sloganKu : restaurantInfo.slogan}
              </p>
            </div>

            {/* Value Highlights Chips */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start rtl:lg:justify-start gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-300 border border-white/[0.06]">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span>{isAr ? 'دجاج طازج يومياً 100%' : isKu ? 'مریشکی تازەی ڕۆژانە' : '100% Fresh Daily Chicken'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-300 border border-white/[0.06]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'صلصات تشيكورا السرية' : isKu ? 'سۆسی تایبەتی چیکۆرا' : 'Signature Secret Sauces'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-300 border border-white/[0.06]">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'توصيل سريع لكافة أربيل' : isKu ? 'گەیاندنی خێرا لە هەولێر' : 'Fast Delivery Across Erbil'}</span>
              </span>
            </div>

            {/* Contact & Location Strip */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start rtl:lg:justify-start gap-3">
              <a
                href={`tel:${restaurantInfo.phone}`}
                dir="ltr"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/[0.08] text-xs sm:text-sm font-semibold transition-all group"
              >
                <Phone className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                <bdi dir="ltr" className="font-sans tracking-wide">{restaurantInfo.phone}</bdi>
              </a>

              <div className="inline-flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/50 px-3 py-2 rounded-lg border border-white/[0.05]">
                <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span>{isAr ? restaurantInfo.addressAr : isKu ? restaurantInfo.addressKu : restaurantInfo.address}</span>
              </div>
            </div>

            {/* Segmented Quick Filters */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-center lg:justify-start rtl:lg:justify-start gap-2 text-xs">
              <span className="text-zinc-500 font-medium">
                {isAr ? 'تصفية سريعة:' : isKu ? 'فلتەرکردنی خێرا:' : 'Filter:'}
              </span>

              <div className="inline-flex p-1 rounded-xl bg-[#1e0e12] border border-[#38161e] gap-1">
                <button
                  onClick={() => setTagFilter('all')}
                  className={`px-3.5 py-1 rounded-lg font-bold text-xs transition-all ${
                    tagFilter === 'all'
                      ? 'bg-[#2a1318] text-white border border-[#4a1f28]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {isAr ? 'الكل' : isKu ? 'هەموو' : 'All'}
                </button>
                <button
                  onClick={() => setTagFilter(tagFilter === 'bestseller' ? 'all' : 'bestseller')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
                    tagFilter === 'bestseller'
                      ? 'bg-[#f5a623] text-black shadow-md'
                      : 'text-gray-400 hover:text-[#f5a623]'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${tagFilter === 'bestseller' ? 'fill-black text-black' : 'text-[#f5a623] fill-[#f5a623]'}`} />
                  <span>{isAr ? 'الأكثر طلباً' : isKu ? 'پڕفرۆشترین' : 'Best Sellers'}</span>
                </button>
                <button
                  onClick={() => setTagFilter(tagFilter === 'spicy' ? 'all' : 'spicy')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
                    tagFilter === 'spicy'
                      ? 'bg-[#ba181b] text-white shadow-md'
                      : 'text-gray-400 hover:text-red-400'
                  }`}
                >
                  <Flame className={`w-3.5 h-3.5 ${tagFilter === 'spicy' ? 'fill-white text-white' : 'text-red-500 fill-red-500'}`} />
                  <span>{isAr ? 'الحار' : isKu ? 'تیژەکان' : 'Spicy Items'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Clean Brand Showcase Box */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group max-w-xs w-full">
              {/* Subtle ambient backplate */}
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-white/[0.1] to-white/[0.02] opacity-75 group-hover:opacity-100 transition duration-300" />
              
              <div className="relative p-5 rounded-2xl bg-zinc-900/90 border border-white/[0.08] shadow-card flex flex-col items-center text-center">
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-xl overflow-hidden bg-zinc-950 p-2 border border-white/[0.06] mb-4">
                  <img
                    src="/chikora-logo.jpeg"
                    alt="Chikora Hawler Rooster Crest"
                    className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>Original Recipe</span>
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    CHIKORA HAWLER
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    {isAr ? 'أقرمش دجاج على الإطلاق' : isKu ? 'کریسپیترین و بەتامترین مریشک' : 'Erbil\'s Favorite Crispy Chicken'}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
