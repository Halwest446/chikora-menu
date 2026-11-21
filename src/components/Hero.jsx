import React from 'react';
import { useMenu } from '../context/MenuContext';
import { Clock, Sparkles, Award, Flame } from 'lucide-react';

export const Hero = () => {
  const { lang, restaurantInfo } = useMenu();
  const isKu = lang === 'ku';
  const isAr = lang === 'ar';

  return (
    <section className="relative overflow-hidden bg-zinc-950 border-b border-white/[0.08]">
      {/* Subtle background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-b from-amber-500/[0.07] via-red-500/[0.03] to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 text-center space-y-4">
        
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
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            {isAr ? (
              <>
                أهلاً بكم في <span className="text-gradient-gold">تشيكورا هولير</span>
              </>
            ) : isKu ? (
              <>
                بەخێربێن بۆ <span className="text-gradient-gold">چیکۆرا</span>
              </>
            ) : (
              <>
                Taste The Legendary <br className="hidden sm:inline" />
                <span className="text-gradient-gold">Chikora Crunch</span>
              </>
            )}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
            {isAr ? restaurantInfo.sloganAr : isKu ? restaurantInfo.sloganKu : restaurantInfo.slogan}
          </p>
        </div>

        {/* Value Highlights Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
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

      </div>
    </section>
  );
};
