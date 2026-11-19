import React from 'react';
import { useMenu } from '../context/MenuContext';
import { MapPin, Phone, Clock } from 'lucide-react';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export const Footer = () => {
  const { lang, restaurantInfo } = useMenu();
  const isKu = lang === 'ku';
  const isAr = lang === 'ar';

  return (
    <footer className="bg-zinc-950 border-t border-white/[0.08] text-zinc-400 text-xs py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src="/chikora-logo.jpeg"
                alt="Chikora Hawler"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10"
              />
              <div>
                <span className="text-white font-bold text-sm tracking-wide block">
                  CHIKORA HAWLER
                </span>
                <p className="text-amber-400 text-xs font-medium">
                  {isAr ? 'تشيكورا هولير' : 'چیکۆرا هه‌ولێر'}
                </p>
              </div>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed font-normal">
              {isAr
                ? 'أعلى معايير الجودة وألذ دجاج مقلي كرسبي بخلطتنا الحصرية في مدينة أربيل.'
                : isKu
                ? 'باشترین کوالێتی و ناسکترین مریشکی کریسپی بە بەهاراتی نهێنی چیکۆرا لە شاری هەولێر.'
                : 'Premium secret-marinated ultra-crispy fried chicken and fast food in Erbil, Kurdistan.'}
            </p>
          </div>

          {/* Col 2: Location & Contact */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">
              {isAr ? 'الموقع والتواصل' : isKu ? 'ناونیشان و پەیوەندی' : 'Location & Orders'}
            </h4>
            <div className="flex items-start gap-2 text-xs">
              <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{isAr ? restaurantInfo.addressAr : isKu ? restaurantInfo.addressKu : restaurantInfo.address}</span>
            </div>
            <div className="flex items-center gap-2 text-xs" dir="ltr">
              <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <a href={`tel:${restaurantInfo.phone}`} className="hover:text-white transition-colors font-sans">
                <bdi dir="ltr">{restaurantInfo.phone}</bdi>
              </a>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <InstagramIcon className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <span className="text-zinc-300">{restaurantInfo.instagram}</span>
            </div>
          </div>

          {/* Col 3: Hours */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">
              {isAr ? 'ساعات العمل' : isKu ? 'کاتی کارکردن' : 'Opening Hours'}
            </h4>
            <div className="flex items-start gap-2 text-xs">
              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-zinc-200 font-medium">
                  {isAr ? restaurantInfo.openingHoursAr : isKu ? restaurantInfo.openingHoursKu : restaurantInfo.openingHours}
                </p>
                <p className="text-emerald-400 font-medium text-[11px] mt-0.5">
                  {isAr ? 'خدمة التوصيل يومياً' : isKu ? 'خزمەتگوزاری گەیاندنی بەردەوام' : 'Delivery Service Daily'}
                </p>
              </div>
            </div>
          </div>

          {/* Col 4: Quality Commitment */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">
              {isAr ? 'معايير الجودة' : isKu ? 'تایبەتمەندی چیکۆرا' : 'The Chikora Standard'}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              {isAr
                ? 'دجاج طازج 100% يومياً، مقلي بعناية لقرمشة ذهبية مثالية.'
                : isKu
                ? 'مریشکی ١٠٠٪ فرێشی ڕۆژانە بە تێکەڵەی بەهاراتی نهێنی، برژاوی زێڕین و کریسپی بێ وێنە.'
                : '100% fresh chicken fried to crispy golden perfection with our proprietary secret recipe.'}
            </p>
          </div>

        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} Chikora Hawler ({isAr ? 'تشيكورا هولير' : 'چیکۆرا هه‌ولێر'}). All rights reserved.</p>
          <p className="text-zinc-500">
            Erbil, Kurdistan Region of Iraq
          </p>
        </div>
      </div>
    </footer>
  );
};
