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
      <div className="min-h-screen bg-[#0e0708] text-[#fcfaf7]">
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
    <div className="min-h-screen flex flex-col bg-[#0e0708] text-[#fcfaf7]">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8 border-b border-[#291318] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#ba181b]" />
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
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
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  {isAr
                    ? `عرض (${filteredItems.length}) من الأطباق والوجبات الشهية`
                    : isKu
                    ? `پیشاندانی (${filteredItems.length}) لە خواردنە بەتامەکان`
                    : `Showing ${filteredItems.length} delicious items`}
                </p>
              </div>

              {searchQuery && (
                <div className="text-xs text-[#f5a623] font-semibold bg-[#210f13] px-3 py-1.5 rounded-lg border border-[#3b1820]">
                  {isAr
                    ? `نتائج البحث عن: "${searchQuery}"`
                    : isKu
                    ? `ئەنجامەکانی گەڕان بۆ: "${searchQuery}"`
                    : `Filtered by: "${searchQuery}"`}
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-[#160a0d] rounded-3xl border border-[#311318] p-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#271016] border border-[#441a24] flex items-center justify-center text-gray-500">
                  <Search className="w-8 h-8 text-[#f5a623]" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {isAr ? 'لم يتم العثور على أي وجبة!' : isKu ? 'هیچ خواردنێک نەدۆزرایەوە!' : 'No dishes found'}
                </h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  {isAr
                    ? 'لا توجد وجبات تطابق بحثك حالياً. يرجى تجربة كلمات بحث أخرى أو اختيار قسم آخر.'
                    : isKu
                    ? 'هیچ خواردنێک لەگەڵ وشەی گەڕانەکەت ناگونجێت. تکایە وشەیەکی تر تاقیبکەرەوە یان فلتەرەکە لابدە.'
                    : 'We could not find any items matching your search or active filters. Try searching for chicken, burger, or select another category.'}
                </p>
              </div>
            ) : (
              /* Grid of Cards */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredItems.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

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
