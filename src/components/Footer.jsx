import React from 'react';
import { useMenu } from '../context/MenuContext';
import { MapPin, Phone, Clock, Heart } from 'lucide-react';

export const Footer = () => {
  const { lang, restaurantInfo } = useMenu();
  const isKu = lang === 'ku';
  const isAr = lang === 'ar';

  return (
    <footer className="bg-[#0b0506] border-t border-[#230f13] text-gray-400 text-xs py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src="/chikora-logo.jpeg"
                alt="Chikora Hawler"
                className="w-10 h-10 rounded-full border border-[#f5a623]"
              />
              <div>
                <span className="text-white font-black text-base tracking-wide">
                  CHIKORA HAWLER
                </span>
                <p className="text-[#f5a623] text-xs font-semibold font-kurdish">
                  {isAr ? 'تشيكورا هولير' : 'چیکۆرا هه‌ولێر'}
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              {isAr
                ? 'أعلى معايير الجودة وألذ دجاج كرسبي مقرمش بالخلطة السرية الحصرية في مدينة أربيل.'
                : isKu
                ? 'باشترین کوالێتی و ناسکترین مریشکی کریسپی بە بەهاراتی نهێنی چیکۆرا لە شاری هەولێری خۆشەویست.'
                : 'Premium secret-marinated ultra-crispy fried chicken, signature craft burgers, and loaded fries in Erbil, Kurdistan.'}
            </p>
          </div>

          {/* Col 2: Location & Contact */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm tracking-wide">
              {isAr ? 'الموقع والتواصل' : isKu ? 'ناونیشان و پەیوەندی' : 'Location & Orders'}
            </h4>
            <div className="flex items-start gap-2 text-xs">
              <MapPin className="w-4 h-4 text-[#ba181b] flex-shrink-0 mt-0.5" />
              <span>{isAr ? restaurantInfo.addressAr : isKu ? restaurantInfo.addressKu : restaurantInfo.address}</span>
            </div>
            <div className="flex items-center gap-2 text-xs" dir="ltr">
              <Phone className="w-4 h-4 text-[#f5a623] flex-shrink-0" />
              <a href={`tel:${restaurantInfo.phone}`} className="hover:text-white font-sans">
                <bdi dir="ltr">{restaurantInfo.phone}</bdi>
              </a>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <svg className="w-4 h-4 text-pink-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="text-gray-300">{restaurantInfo.instagram}</span>
            </div>
          </div>

          {/* Col 3: Hours */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm tracking-wide">
              {isAr ? 'ساعات العمل' : isKu ? 'کاتی کارکردن' : 'Opening Hours'}
            </h4>
            <div className="flex items-start gap-2 text-xs">
              <Clock className="w-4 h-4 text-[#f5a623] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-200 font-semibold">
                  {isAr ? restaurantInfo.openingHoursAr : isKu ? restaurantInfo.openingHoursKu : restaurantInfo.openingHours}
                </p>
                <p className="text-emerald-400 font-bold text-[11px] mt-0.5">
                  {isAr ? 'خدمة التوصيل يومياً' : isKu ? 'خزمەتگوزاری گەیاندنی بەردەوام' : 'Delivery Service Daily'}
                </p>
              </div>
            </div>
          </div>

          {/* Col 4: Quality Commitment */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">
              {isAr ? 'معايير تشيكورا' : isKu ? 'تایبەتمەندی چیکۆرا' : 'The Chikora Standard'}
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              {isAr
                ? 'دجاج طازج 100% مقلي بقرمشة ذهبية مثالية بخلطتنا السرية المميزة.'
                : isKu
                ? 'مریشکی ١٠٠٪ فرێش بە تێکەڵەی بەهاراتی نهێنی، برژاوی زێڕین و کریسپی بێ وێنە لە هەولێر.'
                : '100% fresh chicken fried to crispy golden perfection with our proprietary secret spice recipe.'}
            </p>
          </div>

        </div>

        <div className="pt-8 border-t border-[#1d0d10] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} Chikora Hawler ({isAr ? 'تشيكورا هولير' : 'چیکۆرا هه‌ولێر'}). All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-[#ba181b] fill-[#ba181b]" />
            <span>for the foodies of Hawler</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
