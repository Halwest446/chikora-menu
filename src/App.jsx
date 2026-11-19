import React from 'react';
import { MenuProvider, useMenu } from './context/MenuContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryBar } from './components/CategoryBar';
import { MenuCard } from './components/MenuCard';
import { ItemModal } from './components/ItemModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { LanguageGate } from './components/LanguageGate';
import { Search, Flame } from 'lucide-react';

const MainContent = () => {
  const {
    items,
    activeCategory,
    categories,
    searchQuery,
    tagFilter,
    isAdminRoute,
    lang,
    hasEnteredMenu,
    enterMenu,
  } = useMenu();

  const isKu = lang === 'ku';
  const isAr = lang === 'ar';

  // If user opens public menu and hasn't clicked "View Menu", show Language Selection Gateway
  if (!isAdminRoute && !hasEnteredMenu) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <LanguageGate onEnter={enterMenu} />
      </div>
    );
  }

  // Filter items based on activeCategory, searchQuery, and tagFilter
  const filteredItems = items.filter((item) => {
    // Category match
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;

    // Search query match
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      (item.nameKu && item.nameKu.includes(query)) ||
      (item.nameAr && item.nameAr.includes(query)) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      (item.descriptionKu && item.descriptionKu.includes(query)) ||
      (item.descriptionAr && item.descriptionAr.includes(query));

    // Tag filter match
    let matchesTag = true;
    if (tagFilter === 'bestseller') {
      matchesTag = item.tag === 'Best Seller';
    } else if (tagFilter === 'spicy') {
      matchesTag = item.isSpicy || item.tag?.includes('Spicy');
    }

    return matchesCategory && matchesSearch && matchesTag;
  });

  const activeCategoryObj = categories.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Header />

      {isAdminRoute ? (
        <main className="flex-1">
          <AdminPanel />
        </main>
      ) : (
        <main className="flex-1">
          <Hero />
          <CategoryBar />

          {/* Menu Items Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 border-b border-[#291318] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#ba181b]" />
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {isAr
                      ? activeCategory === 'all'
                        ? 'قائمة تشيكورا الكاملة'
                        : activeCategoryObj?.nameAr || activeCategoryObj?.nameEn || activeCategory
                      : isKu
                      ? activeCategory === 'all'
                        ? 'مێنیوی تەواوی چیکۆرا'
                        : activeCategoryObj?.nameKu || activeCategory
                      : activeCategory === 'all'
                        ? 'Full Chikora Menu'
                        : activeCategoryObj?.nameEn || activeCategory}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-normal">
                  {isAr
                    ? `عرض ${filteredItems.length} من الوجبات والأطباق`
                    : isKu
                    ? `پیشاندانی ${filteredItems.length} خواردن`
                    : `Showing ${filteredItems.length} dishes`}
                </p>
              </div>

              {searchQuery && (
                <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 font-medium">
                  <span>{isAr ? 'بحث عن:' : isKu ? 'گەڕان بۆ:' : 'Query:'}</span>
                  <span className="font-semibold text-white">"{searchQuery}"</span>
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-zinc-900/40 rounded-xl border border-white/[0.08] p-8 max-w-xl mx-auto">
                <div className="w-12 h-12 mx-auto rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-400">
                  <Search className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'لم يتم العثور على أي وجبة' : isKu ? 'هیچ خواردنێک نەدۆزرایەوە' : 'No items match your criteria'}
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  {isAr
                    ? 'جرب البحث بكلمات أخرى أو اختر قسماً آخر من القائمة أعلاه.'
                    : isKu
                    ? 'تکایە وشەیەکی تر تاقیبکەرەوە یان فلتەری پۆلەکان بگۆڕە.'
                    : 'Try checking your spelling or selecting another category from the bar above.'}
                </p>
              </div>
            ) : (
              /* Grid of Cards */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {filteredItems.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>

          <Footer />

          {/* Item details popup */}
          <ItemModal />
        </main>
      )}
    </div>
  );
};

export default function App() {
  return (
    <MenuProvider>
      <MainContent />
    </MenuProvider>
  );
}
