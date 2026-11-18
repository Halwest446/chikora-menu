import React, { useState, useRef } from 'react';
import { useMenu } from '../context/MenuContext';
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Image as ImageIcon,
  Check,
  X,
  Search,
  Lock,
  Unlock,
  RefreshCw,
  Download,
  UploadCloud,
  Layers,
  Settings,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  ExternalLink,
  Flame,
  Star,
  CheckCircle2,
  Filter,
  User,
  Key,
  Eye,
  EyeOff,
  LogOut,
  ShieldAlert
} from 'lucide-react';

export const AdminPanel = () => {
  const {
    items,
    categories,
    restaurantInfo,
    setRestaurantInfo,
    updateRestaurantInfo,
    addItem,
    updateItem,
    deleteItem,
    toggleStock,
    addCategory,
    deleteCategory,
    resetToDefaults,
    formatPrice,
    exportData,
    importData,
    lang,
    navigate,
    isDbConnected,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    adminUser,
    loginAdmin,
    logoutAdmin,
    changeAdminPassword
  } = useMenu();

  const isKu = lang === 'ku';
  const isAr = lang === 'ar';
  const isRtl = isKu || isAr;

  // Authentication & Login State
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Security / Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityMessage, setSecurityMessage] = useState({ type: '', text: '' });

  // Active Admin Tab: 'items' | 'categories' | 'settings'
  const [adminTab, setAdminTab] = useState('items');

  // Modal State for Add / Edit Item
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null if adding new

  // Item Form Fields
  const [formName, setFormName] = useState('');
  const [formNameKu, setFormNameKu] = useState('');
  const [formNameAr, setFormNameAr] = useState('');
  const [formCategory, setFormCategory] = useState('buckets');
  const [formPrice, setFormPrice] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDescriptionKu, setFormDescriptionKu] = useState('');
  const [formDescriptionAr, setFormDescriptionAr] = useState('');
  const [formTag, setFormTag] = useState('');
  const [formIsSpicy, setFormIsSpicy] = useState(false);
  const [formInStock, setFormInStock] = useState(true);
  const [formError, setFormError] = useState('');

  // Search & Filter in Admin
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('all');

  // Category Form
  const [newCatNameEn, setNewCatNameEn] = useState('');
  const [newCatNameKu, setNewCatNameKu] = useState('');
  const [newCatNameAr, setNewCatNameAr] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Flame');

  // Delete Confirm Modal
  const [itemToDelete, setItemToDelete] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Admin Login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!usernameInput.trim() || !passwordInput) {
      setLoginError(
        isAr
          ? 'يرجى إدخال اسم المستخدم وكلمة المرور'
          : isKu
          ? 'تکایە ناوی بەکارهێنەر و وشەی نهێنی بنووسە'
          : 'Username and password required'
      );
      return;
    }
    setLoginLoading(true);
    setLoginError('');
    const res = await loginAdmin(usernameInput.trim(), passwordInput);
    setLoginLoading(false);
    if (res.success) {
      showToast(isAr ? 'تم تسجيل الدخول بنجاح!' : isKu ? 'بەخێربێیت بۆ پانێڵی بەڕێوەبردن' : 'Welcome to Admin Panel');
    } else {
      setLoginError(res.error || (isKu ? 'ناوی بەکارهێنەر یان وشەی نهێنی هەڵەیە' : 'Invalid credentials'));
    }
  };

  // Change Password handler
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setSecurityMessage({ type: '', text: '' });

    if (!currentPassword) {
      setSecurityMessage({
        type: 'error',
        text: isAr ? 'يرجى إدخال كلمة المرور الحالية' : isKu ? 'تکایە وشەی نهێنی ئێستات بنووسە' : 'Current password is required.'
      });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setSecurityMessage({
        type: 'error',
        text: isAr ? 'يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل' : isKu ? 'وشەی نهێنی نوێ دەبێت لانیکەم ٦ پیت بێت' : 'New password must be at least 6 characters.'
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityMessage({
        type: 'error',
        text: isAr ? 'كلمتا المرور غير متطابقتين!' : isKu ? 'وشە نهێنییە نوێیەکان وەک یەک نین!' : 'New passwords do not match!'
      });
      return;
    }

    setSecurityLoading(true);
    const res = await changeAdminPassword(currentPassword, newAdminUsername, newPassword);
    setSecurityLoading(false);

    if (res.success) {
      setSecurityMessage({
        type: 'success',
        text: isAr ? 'تم تحديث بيانات الدخول بنجاح!' : isKu ? 'وشەی نهێنی و ناوی بەکارهێنەر بەسەرکەوتوویی نوێکرانەوە!' : 'Credentials updated successfully!'
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast(isKu ? 'ئاسایشی ئەکاونت نوێکرایەوە' : 'Security settings updated');
    } else {
      setSecurityMessage({ type: 'error', text: res.error || 'Failed to update credentials' });
    }
  };

  // Open modal for Adding new
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormName('');
    setFormNameKu('');
    setFormNameAr('');
    setFormCategory(categories[1]?.id || 'chikora');
    setFormPrice('');
    setFormImage('');
    setFormDescription('');
    setFormDescriptionKu('');
    setFormDescriptionAr('');
    setFormTag('');
    setFormIsSpicy(false);
    setFormInStock(true);
    setFormError('');
    setIsItemModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormName(item.name || '');
    setFormNameKu(item.nameKu || '');
    setFormNameAr(item.nameAr || '');
    setFormCategory(item.category || 'buckets');
    setFormPrice(item.price || '');
    setFormImage(item.image || '');
    setFormDescription(item.description || '');
    setFormDescriptionKu(item.descriptionKu || '');
    setFormDescriptionAr(item.descriptionAr || '');
    setFormTag(item.tag || '');
    setFormIsSpicy(!!item.isSpicy);
    setFormInStock(item.inStock !== false);
    setFormError('');
    setIsItemModalOpen(true);
  };

  // Compress and resize image client-side to prevent localStorage quota issues & handle any file size
  const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.82) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Handle local image file upload (auto-compressed to high-quality web format)
  const handleImageFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError(
        isAr
          ? 'يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP).'
          : isKu
          ? 'تکایە وێنەیەکی دروست هەڵبژێرە (PNG, JPG, WEBP).'
          : 'Please select a valid image file (PNG, JPG, WEBP).'
      );
      return;
    }

    try {
      setFormError('');
      const compressedBase64 = await compressImage(file, 1200, 1200, 0.82);
      setFormImage(compressedBase64);
    } catch (err) {
      console.error(err);
      setFormError(
        isAr
          ? 'فشل في معالجة الصورة، يرجى تجربة صورة أخرى.'
          : isKu
          ? 'کێشەیەک ڕوویدا لە بارکردنی وێنە، تکایە دانەیەکی تر تاقیبکەرەوە.'
          : 'Failed to process image, please try another image.'
      );
    }
  };

  // Save Item (Add or Update)
  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError(isKu ? 'تکایە ناوی خواردنەکە بنووسە' : 'Item name is required.');
      return;
    }
    if (!formPrice || Number(formPrice) <= 0) {
      setFormError(isKu ? 'تکایە نرخێکی دروست بنووسە' : 'Please enter a valid price.');
      return;
    }

    const finalImage = formImage || '/chikora-logo.jpeg';

    const itemPayload = {
      name: formName.trim(),
      nameKu: formNameKu.trim() || formName.trim(),
      nameAr: formNameAr.trim() || formNameKu.trim() || formName.trim(),
      category: formCategory,
      price: Number(formPrice),
      image: finalImage,
      description: formDescription.trim(),
      descriptionKu: formDescriptionKu.trim() || formDescription.trim(),
      descriptionAr: formDescriptionAr.trim() || formDescriptionKu.trim() || formDescription.trim(),
      tag: formTag,
      isSpicy: formIsSpicy,
      inStock: formInStock,
    };

    if (editingItem) {
      updateItem(editingItem.id, itemPayload);
      showToast(isAr ? 'تم تحديث الوجبة بنجاح!' : isKu ? 'خواردنەکە بە سەرکەوتوویی نوێکرایەوە!' : 'Item updated successfully!');
    } else {
      addItem(itemPayload);
      showToast(isAr ? 'تمت إضافة الوجبة الجديدة بنجاح!' : isKu ? 'خواردنی نوێ بە سەرکەوتوویی زیادکرا!' : 'New item uploaded successfully!');
    }

    setIsItemModalOpen(false);
  };

  // Handle Category Add
  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCatNameEn.trim()) return;
    addCategory({
      id: newCatNameEn.toLowerCase().replace(/\s+/g, '-'),
      nameEn: newCatNameEn.trim(),
      nameKu: newCatNameKu.trim() || newCatNameEn.trim(),
      nameAr: newCatNameAr.trim() || newCatNameKu.trim() || newCatNameEn.trim(),
      icon: newCatIcon,
    });
    setNewCatNameEn('');
    setNewCatNameKu('');
    setNewCatNameAr('');
    showToast(isAr ? 'تمت إضافة القسم بنجاح!' : isKu ? 'پۆلی نوێ زیادکرا!' : 'Category added successfully!');
  };

  // Filtered items in admin
  const filteredAdminItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
      (item.nameKu && item.nameKu.includes(adminSearch)) ||
      (item.nameAr && item.nameAr.includes(adminSearch)) ||
      (item.description && item.description.toLowerCase().includes(adminSearch.toLowerCase())) ||
      (item.descriptionKu && item.descriptionKu.includes(adminSearch)) ||
      (item.descriptionAr && item.descriptionAr.includes(adminSearch));
    const matchesCat = adminCategoryFilter === 'all' || item.category === adminCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // If not authenticated, render Login Screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#180b0e] border border-[#3a1820] rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#f5a623]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#ba181b]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#ba181b] to-[#f5a623] p-0.5 shadow-glow-gold flex items-center justify-center">
              <div className="w-full h-full bg-[#160a0d] rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-[#f5a623]" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">
                {isAr ? 'تسجيل دخول لوحة الإدارة' : isKu ? 'چوونەژوورەوەی بەڕێوەبەری چیکۆرا' : 'Chikora Admin Login'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {isAr
                  ? 'أدخل اسم المستخدم وكلمة المرور المشفرة للوصول'
                  : isKu
                  ? 'ناوی بەکارهێنەر و وشەی نهێنی بنووسە بۆ بەڕێوەبردنی مێنیو'
                  : 'Enter verified credentials to manage dishes, prices, and settings'}
              </p>
            </div>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#f5a623]" />
                <span>{isAr ? 'اسم المستخدم:' : isKu ? 'ناوی بەکارهێنەر:' : 'Username:'}</span>
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => {
                  setUsernameInput(e.target.value);
                  setLoginError('');
                }}
                placeholder="admin"
                autoComplete="username"
                className="w-full bg-[#230f14] border border-[#441a24] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#f5a623] transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#f5a623]" />
                <span>{isAr ? 'كلمة المرور:' : isKu ? 'وشەی نهێنی:' : 'Password:'}</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setLoginError('');
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-[#230f14] border border-[#441a24] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#f5a623] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ba181b] to-[#990012] hover:from-[#c4151c] hover:to-[#ba181b] text-white font-black text-sm shadow-glow-red transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isKu ? 'پشکنینی زانیارییەکان...' : 'Authenticating...'}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{isAr ? 'تسجيل الدخول' : isKu ? 'چوونەژوورەوەی پارێزراو' : 'Secure Login'}</span>
                </>
              )}
            </button>

            {/* Quick autofill for default admin */}
            <div className="pt-2 text-center border-t border-[#311318]">
              <button
                type="button"
                onClick={() => {
                  setUsernameInput('admin');
                  setPasswordInput('chikora@2025');
                  setLoginError('');
                }}
                className="text-[11px] text-gray-400 hover:text-[#f5a623] transition-colors"
              >
                {isKu ? '⚡ داخڵکردنی خێرای سەرەتایی: admin / chikora@2025' : '⚡ Default Credentials: admin / chikora@2025'}
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                ← {isKu ? 'گەڕانەوە بۆ مێنیوی سەرەکی' : 'Back to Public Menu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-2xl animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Header & Overview Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1a0c0f] border border-[#3b1820] rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ba181b] to-[#f5a623] p-0.5 shadow-glow-gold flex-shrink-0">
            <img
              src="/chikora-logo.jpeg"
              alt="Chikora Logo"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">
                {isKu ? 'پانێڵی بەڕێوەبردنی چیکۆرا هه‌ولێر' : 'Chikora Hawler Management'}
              </h1>
              <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full border flex items-center gap-1 ${
                isDbConnected
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isDbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>{isDbConnected ? 'SQLITE DATABASE LIVE' : 'LOCAL CACHE'}</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {isKu
                ? 'لێرە دەتوانیت خواردنی نوێ زیاد بکەیت، وێنە و نرخ بگۆڕیت، و بەڕێوەی ببەیت.'
                : 'Upload items, update prices, manage categories, and customize restaurant settings.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Active Admin Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#230f14] border border-[#441a24] text-xs font-bold text-amber-300">
            <User className="w-3.5 h-3.5 text-[#f5a623]" />
            <span>{adminUser?.username || 'admin'}</span>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ba181b] via-[#c2410c] to-[#f5a623] text-white font-black text-xs sm:text-sm shadow-glow-red hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{isKu ? 'زیادکردنی خواردنی نوێ' : 'Upload New Item'}</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#281217] hover:bg-[#381820] text-gray-300 hover:text-white border border-[#481e27] text-xs font-bold transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-[#f5a623]" />
            <span>{isKu ? 'بینینی مێنیو' : 'Live Menu'}</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-200 border border-red-800/40 text-xs font-bold transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span>{isAr ? 'خروج' : isKu ? 'دەرچوون' : 'Log Out'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#170b0e] border border-[#34161c] rounded-2xl p-4">
          <span className="text-xs text-gray-400 font-semibold uppercase">
            {isKu ? 'کۆی گشتی خواردنەکان' : 'Total Items'}
          </span>
          <p className="text-2xl font-black text-white mt-1">{items.length}</p>
        </div>
        <div className="bg-[#170b0e] border border-[#34161c] rounded-2xl p-4">
          <span className="text-xs text-gray-400 font-semibold uppercase">
            {isKu ? 'پۆلەکان (Categories)' : 'Categories'}
          </span>
          <p className="text-2xl font-black text-[#f5a623] mt-1">{categories.length - 1}</p>
        </div>
        <div className="bg-[#170b0e] border border-[#34161c] rounded-2xl p-4">
          <span className="text-xs text-gray-400 font-semibold uppercase">
            {isKu ? 'بەردەست لە کۆگا' : 'In Stock'}
          </span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {items.filter((i) => i.inStock !== false).length}
          </p>
        </div>
        <div className="bg-[#170b0e] border border-[#34161c] rounded-2xl p-4">
          <span className="text-xs text-gray-400 font-semibold uppercase">
            {isKu ? 'تەواوبوو (Sold Out)' : 'Sold Out'}
          </span>
          <p className="text-2xl font-black text-red-400 mt-1">
            {items.filter((i) => i.inStock === false).length}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2d1419] pb-2">
        <button
          onClick={() => setAdminTab('items')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
            adminTab === 'items'
              ? 'bg-[#ba181b] text-white shadow-glow-red'
              : 'text-gray-400 hover:text-white hover:bg-[#200f13]'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>{isKu ? 'بەڕێوەبردنی خواردنەکان' : 'Manage Items'} ({items.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
            adminTab === 'categories'
              ? 'bg-[#ba181b] text-white shadow-glow-red'
              : 'text-gray-400 hover:text-white hover:bg-[#200f13]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{isKu ? 'پۆلەکان (Categories)' : 'Categories'}</span>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
            adminTab === 'settings'
              ? 'bg-[#ba181b] text-white shadow-glow-red'
              : 'text-gray-400 hover:text-white hover:bg-[#200f13]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{isKu ? 'ڕێکخستنەکان و باکئەپ' : 'Settings & Backup'}</span>
        </button>
      </div>

      {/* TAB 1: ITEMS MANAGEMENT */}
      {adminTab === 'items' && (
        <div className="space-y-4">
          
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#180b0e] border border-[#34161c] p-3 rounded-2xl">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder={isKu ? 'گەڕان لە خواردنەکان...' : 'Filter items by name...'}
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="w-full bg-[#200f13] text-white text-xs pl-9 pr-3 py-2 rounded-xl border border-[#3d1a21] focus:outline-none focus:border-[#f5a623]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <select
                value={adminCategoryFilter}
                onChange={(e) => setAdminCategoryFilter(e.target.value)}
                className="bg-[#200f13] text-white text-xs border border-[#3d1a21] rounded-xl px-3 py-2 focus:outline-none focus:border-[#f5a623]"
              >
                <option value="all">{isKu ? 'هەموو پۆلەکان' : 'All Categories'}</option>
                {categories.filter(c => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>
                    {isKu ? c.nameKu : c.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Items Table / Cards */}
          <div className="bg-[#180b0e] border border-[#34161c] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right text-xs">
                <thead className="bg-[#241014] text-gray-400 font-bold uppercase tracking-wider border-b border-[#3b1820]">
                  <tr>
                    <th className="py-3 px-4">{isKu ? 'وێنە و ناو' : 'Item & Photo'}</th>
                    <th className="py-3 px-4">{isKu ? 'پۆل' : 'Category'}</th>
                    <th className="py-3 px-4">{isKu ? 'نرخ' : 'Price'}</th>
                    <th className="py-3 px-4">{isKu ? 'تایبەتمەندی' : 'Badge'}</th>
                    <th className="py-3 px-4">{isKu ? 'دۆخ' : 'Status'}</th>
                    <th className="py-3 px-4 text-right rtl:text-left">{isKu ? 'کردارەکان' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a1318]">
                  {filteredAdminItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500 font-semibold">
                        {isKu ? 'هیچ خواردنێک نەدۆزرایەوە!' : 'No items match your criteria.'}
                      </td>
                    </tr>
                  ) : (
                    filteredAdminItems.map((item) => {
                      const catObj = categories.find((c) => c.id === item.category);
                      const isOutOfStock = item.inStock === false;

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-[#200f13] transition-colors"
                        >
                          {/* Image & Title */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-xl object-cover bg-[#2a1218] flex-shrink-0 border border-[#3d1820]"
                              />
                              <div>
                                <p className="font-bold text-white text-sm">
                                  {item.name}
                                </p>
                                {(isAr ? item.nameAr || item.nameKu : item.nameKu) && (
                                  <p className="text-[11px] text-[#f5a623] font-kurdish">
                                    {isAr ? item.nameAr || item.nameKu : item.nameKu}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-lg bg-[#271217] text-gray-300 font-semibold border border-[#3b1820]">
                              {isAr ? catObj?.nameAr || catObj?.nameEn || item.category : isKu ? catObj?.nameKu || item.category : catObj?.nameEn || item.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4 font-black text-[#f5a623] text-sm">
                            {formatPrice(item.price)}
                          </td>

                          {/* Tag */}
                          <td className="py-3 px-4">
                            {item.tag ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#ba181b]/30 text-[#f5a623] border border-[#ba181b]">
                                {item.tag}
                              </span>
                            ) : (
                              <span className="text-gray-600">—</span>
                            )}
                          </td>

                          {/* Stock Toggle */}
                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleStock(item.id)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                                !isOutOfStock
                                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/50 hover:bg-emerald-900/60'
                                  : 'bg-red-950/60 text-red-400 border-red-500/50 hover:bg-red-900/60'
                              }`}
                            >
                              {!isOutOfStock ? (isKu ? 'بەردەستە' : 'In Stock') : (isKu ? 'تەواوبووە' : 'Sold Out')}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right rtl:text-left">
                            <div className="flex items-center justify-end rtl:justify-start gap-1.5">
                              <button
                                onClick={() => handleOpenEdit(item)}
                                className="p-2 rounded-lg bg-[#2b1319] hover:bg-[#3d1b23] text-blue-400 hover:text-white transition-colors"
                                title="Edit Item"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setItemToDelete(item)}
                                className="p-2 rounded-lg bg-[#2b1319] hover:bg-red-950/80 text-red-400 hover:text-red-200 transition-colors"
                                title="Delete Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORY MANAGEMENT */}
      {adminTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Add Category Form */}
          <div className="md:col-span-5 bg-[#180b0e] border border-[#34161c] rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#f5a623]" />
              <span>{isKu ? 'زیادکردنی پۆلی نوێ' : 'Add New Category'}</span>
            </h3>

            <form onSubmit={handleAddCategorySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Category Name (English):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Desserts, Sandwiches..."
                  value={newCatNameEn}
                  onChange={(e) => setNewCatNameEn(e.target.value)}
                  className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1 font-kurdish">
                  ناوی پۆل (کوردی):
                </label>
                <input
                  type="text"
                  placeholder="بۆ نموونە: شیرینی، لەفاف..."
                  value={newCatNameKu}
                  onChange={(e) => setNewCatNameKu(e.target.value)}
                  className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1 font-kurdish">
                  اسم القسم (العربية):
                </label>
                <input
                  type="text"
                  placeholder="مثال: حلويات، ساندويتشات..."
                  value={newCatNameAr}
                  onChange={(e) => setNewCatNameAr(e.target.value)}
                  className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Category Icon:
                </label>
                <select
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                >
                  <option value="Flame">Flame (ئاگر)</option>
                  <option value="Drumstick">Drumstick (ڕانی مریشک)</option>
                  <option value="Sandwich">Burger / Sandwich (بەرگەر)</option>
                  <option value="Sparkles">Sparkles (تایبەت)</option>
                  <option value="UtensilsCrossed">Loaded Fries (پەتاتە)</option>
                  <option value="Salad">Sauces / Salad (سۆس)</option>
                  <option value="Coffee">Beverage / Drinks (خواردنەوە)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ba181b] to-[#990012] hover:from-[#c4151c] hover:to-[#ba181b] text-white font-bold text-xs shadow-md transition-all active:scale-98"
              >
                {isKu ? 'پاشەکەوتکردنی پۆل' : 'Save Category'}
              </button>
            </form>
          </div>

          {/* Existing Categories List */}
          <div className="md:col-span-7 bg-[#180b0e] border border-[#34161c] rounded-2xl p-5 space-y-3">
            <h3 className="text-base font-black text-white">
              {isKu ? 'پۆلە بەردەستەکان' : 'Active Categories'}
            </h3>

            <div className="space-y-2">
              {categories.map((c) => {
                const count = items.filter((i) => i.category === c.id).length;
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#200f13] border border-[#3b1920]"
                  >
                    <div>
                      <p className="font-bold text-white text-xs sm:text-sm">
                        {c.nameEn}
                        <span className="text-xs text-[#f5a623] ml-2 font-kurdish">
                          ({c.nameKu})
                        </span>
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        ID: {c.id} • {count} {isKu ? 'خواردن' : 'items'}
                      </p>
                    </div>

                    {c.id !== 'all' && (
                      <button
                        onClick={() => deleteCategory(c.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SETTINGS & BACKUP */}
      {adminTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Restaurant Details Form */}
          <div className="md:col-span-7 bg-[#180b0e] border border-[#34161c] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-black text-white">
              {isKu ? 'زانیارییەکانی ڕێستۆرانت' : 'Restaurant & Order Information'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Restaurant Name (EN):
                </label>
                <input
                  type="text"
                  value={restaurantInfo.name}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
                  className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1 font-kurdish">
                  ناوی ڕێستۆرانت (کوردی):
                </label>
                <input
                  type="text"
                  value={restaurantInfo.nameKu}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, nameKu: e.target.value })}
                  className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1 font-kurdish">
                  اسم المطعم (العربية):
                </label>
                <input
                  type="text"
                  value={restaurantInfo.nameAr || ''}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, nameAr: e.target.value })}
                  className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  WhatsApp Number (with country code):
                </label>
                <input
                  type="text"
                  value={restaurantInfo.whatsapp}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, whatsapp: e.target.value })}
                  placeholder="9647506008620"
                  className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Phone Display:
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={restaurantInfo.phone}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
                  className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Currency Symbol:
                </label>
                <input
                  type="text"
                  value={restaurantInfo.currency}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, currency: e.target.value })}
                  placeholder="IQD or $"
                  className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Hawler Address:
                </label>
                <input
                  type="text"
                  value={restaurantInfo.address}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, address: e.target.value })}
                  className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                />
              </div>
            </div>

            <button
              onClick={() => {
                updateRestaurantInfo(restaurantInfo);
                showToast(isAr ? 'تم حفظ معلومات المطعم في قاعدة البيانات!' : isKu ? 'زانیارییەکان لە داتابەیس پاشەکەوتکران!' : 'Restaurant info saved to database!');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-xs"
            >
              {isKu ? 'پاشەکەوتکردنی گۆڕانکارییەکان' : 'Save Details'}
            </button>
          </div>

          {/* Backup, Export & Reset */}
          <div className="md:col-span-5 bg-[#180b0e] border border-[#34161c] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-black text-white">
              {isKu ? 'پاراستن و هەناردەکردنی داتا' : 'Data Backup & Reset'}
            </h3>

            <div className="space-y-3">
              <button
                onClick={exportData}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#230f14] hover:bg-[#34161c] text-white border border-[#441a24] text-xs font-bold transition-all"
              >
                <Download className="w-4 h-4 text-[#f5a623]" />
                <span>{isKu ? 'داگرتنی باکئەپی مێنیو (JSON)' : 'Export Backup File (JSON)'}</span>
              </button>

              <div>
                <label className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#230f14] hover:bg-[#34161c] text-white border border-[#441a24] text-xs font-bold cursor-pointer transition-all">
                  <UploadCloud className="w-4 h-4 text-emerald-400" />
                  <span>{isKu ? 'هاوردەکردنی باکئەپ (Import JSON)' : 'Import Menu Backup'}</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const ok = importData(event.target.result);
                        if (ok) showToast(isKu ? 'داتاکە بە سەرکەوتوویی هاوردەکرا!' : 'Menu data restored!');
                      };
                      reader.readAsText(file);
                    }}
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-[#311318]">
                <button
                  onClick={() => {
                    if (window.confirm(isKu ? 'دڵنیایت لە گەڕانەوە بۆ مێنیوی سەرەتایی چیکۆرا؟' : 'Are you sure you want to restore default items?')) {
                      resetToDefaults();
                      showToast(isKu ? 'مێنیو گەڕایەوە بۆ باری سەرەتایی' : 'Restored to default Chikora menu!');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 text-xs font-bold transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{isKu ? 'گەڕانەوە بۆ مێنیوی سەرەتایی (Reset Defaults)' : 'Reset To Original Factory Menu'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Admin Security & Password Change */}
          <div className="md:col-span-12 bg-[#180b0e] border border-[#3b1820] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#311318] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#f5a623]" />
                <h3 className="text-base font-black text-white">
                  {isAr ? 'أمان الحساب وتغيير كلمة المرور' : isKu ? 'ئاسایشی ئەکاونت و گۆڕینی وشەی نهێنی' : 'Account Security & Password Management'}
                </h3>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
                ✓ {isKu ? 'پارێزراوە لە هاک' : 'Protected'}
              </span>
            </div>

            {securityMessage.text && (
              <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                securityMessage.type === 'success'
                  ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
                  : 'bg-red-950/60 border-red-800/60 text-red-300'
              }`}>
                {securityMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
                <span>{securityMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  {isAr ? 'كلمة المرور الحالية:' : isKu ? 'وشەی نهێنی ئێستا:' : 'Current Password:'}
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  {isAr ? 'اسم المستخدم الجديد:' : isKu ? 'ناوی نوێی بەکارهێنەر:' : 'New Username (Optional):'}
                </label>
                <input
                  type="text"
                  value={newAdminUsername}
                  onChange={(e) => setNewAdminUsername(e.target.value)}
                  placeholder={adminUser?.username || 'admin'}
                  className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  {isAr ? 'كلمة المرور الجديدة (6 أحرف+):' : isKu ? 'وشەی نهێنی نوێ (٦ پیت+):' : 'New Password (6+ chars):'}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  {isAr ? 'تأكيد كلمة المرور الجديدة:' : isKu ? 'دووبارەکردنەوەی وشەی نهێنی نوێ:' : 'Confirm New Password:'}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                />
              </div>

              <div className="lg:col-span-4 flex justify-end">
                <button
                  type="submit"
                  disabled={securityLoading}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#ba181b] via-[#c2410c] to-[#f5a623] hover:brightness-110 text-white font-bold text-xs shadow-glow-red disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {securityLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{isKu ? 'نوێکردنەوە...' : 'Updating...'}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isAr ? 'تحديث كلمة المرور والحساب' : isKu ? 'نوێکردنەوەی وشەی نهێنی و ئەکاونت' : 'Update Admin Credentials'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT MENU ITEM */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#180b0e] border border-[#3d1920] rounded-3xl overflow-hidden shadow-2xl flex flex-col my-8"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-[#311318] flex items-center justify-between bg-[#220e13]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#ba181b]/30 text-[#f5a623] border border-[#ba181b]/60">
                  {editingItem ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {editingItem
                      ? (isKu ? 'دەستکاریکردنی خواردن' : 'Edit Menu Dish')
                      : (isKu ? 'زیادکردنی خواردنی نوێ بۆ چیکۆرا' : 'Upload New Chikora Dish')}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {isKu ? 'ناوەڕۆک، وێنە و نرخ دیاریبکە' : 'Provide food title, photo upload, category and pricing'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsItemModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#2c1318] hover:bg-[#3d1a21] text-gray-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveItem} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              {formError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/80 border border-red-600/50 text-red-300 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {isAr ? 'اسم الوجبة (الإنجليزية) *' : isKu ? 'ناوی خواردن (ئینگلیزی) *' : 'Dish Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Crispy Tenders 8 Pcs"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 font-kurdish">
                    {isAr ? 'اسم الوجبة (الكردية):' : isKu ? 'ناوی خواردن (کوردی):' : 'Dish Name (Kurdish):'}
                  </label>
                  <input
                    type="text"
                    placeholder="بۆ نموونە: تەندەرزی کریسپی ٨ پارچە"
                    value={formNameKu}
                    onChange={(e) => setFormNameKu(e.target.value)}
                    className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 font-kurdish">
                    {isAr ? 'اسم الوجبة (العربية):' : isKu ? 'ناوی خواردن (عەرەبی):' : 'Dish Name (Arabic):'}
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: تندرز الدجاج المقرمش 8 قطع"
                    value={formNameAr}
                    onChange={(e) => setFormNameAr(e.target.value)}
                    className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                  />
                </div>
              </div>

              {/* Category, Price, Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {isAr ? 'القسم *' : isKu ? 'پۆل *' : 'Category *'}
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                  >
                    {categories.filter(c => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {isAr ? (c.nameAr || c.nameEn) : isKu ? (c.nameKu || c.nameEn) : c.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {isAr ? `السعر (${restaurantInfo.currency}) *` : isKu ? `نرخ (${restaurantInfo.currency}) *` : `Price (${restaurantInfo.currency}) *`}
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    dir="ltr"
                    placeholder="e.g. 7500"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {isAr ? 'العلامة المميزة:' : isKu ? 'تایبەتمەندی (Badge):' : 'Badge / Tag:'}
                  </label>
                  <select
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                  >
                    <option value="">{isAr ? 'بدون (عادي)' : isKu ? 'None (ئاسایی)' : 'None'}</option>
                    <option value="Best Seller">⭐ {isAr ? 'الأكثر طلباً' : isKu ? 'پڕفرۆشترین' : 'Best Seller'}</option>
                    <option value="Spicy">🌶️ {isAr ? 'حار' : isKu ? 'تیژ' : 'Spicy'}</option>
                    <option value="Chef Special">👑 {isAr ? 'توقيع الشيف' : isKu ? 'تایبەتی شێف' : 'Chef Special'}</option>
                    <option value="New">🔥 {isAr ? 'جديد' : isKu ? 'نوێ' : 'New'}</option>
                  </select>
                </div>
              </div>

              {/* IMAGE UPLOAD SECTION */}
              <div className="bg-[#200f13] border border-[#3b1820] rounded-2xl p-4 space-y-3">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#f5a623]" />
                  <span>{isAr ? 'صورة الوجبة (تحميل ملف)' : isKu ? 'وێنەی خواردن (بارکردنی فایل)' : 'Food Image Upload'}</span>
                </label>

                {/* File Upload Box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#4a1f28] hover:border-[#f5a623] rounded-2xl p-5 text-center cursor-pointer transition-colors bg-[#180b0e] group"
                >
                  <Upload className="w-8 h-8 mx-auto text-[#f5a623] mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-gray-200">
                    {isAr
                      ? 'اضغط هنا لاختيار صورة من جهازك'
                      : isKu
                      ? 'کرتە بکە بۆ هەڵبژاردنی وێنە لە کۆمپیوتەرەکەت'
                      : 'Click to browse and upload photo from device'}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {isAr
                      ? 'يدعم جميع أحجام الصور (يتم ضغطها وتجهيزها تلقائياً)'
                      : isKu
                      ? 'هەموو وێنەیەک دەبێت (PNG, JPG, WEBP) - خۆکارانە ڕێکدەخرێت'
                      : 'Supports PNG, JPG, WEBP (automatically optimized)'}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFileUpload}
                  />
                </div>

                {/* Current Preview */}
                {formImage && (
                  <div className="flex items-center justify-between pt-2 border-t border-[#311318]">
                    <div className="flex items-center gap-3">
                      <img
                        src={formImage}
                        alt="Preview"
                        className="w-14 h-14 rounded-xl object-cover border border-[#f5a623]"
                      />
                      <div className="text-[11px] text-gray-400">
                        <span className="text-emerald-400 font-bold">✓ {isAr ? 'تم اختيار الصورة' : isKu ? 'وێنە دیاریکراوە' : 'Image ready'}</span>
                        <p className="truncate max-w-xs">{formImage.slice(0, 40)}...</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormImage('')}
                      className="px-2.5 py-1 text-xs rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/40 transition-colors"
                    >
                      {isAr ? 'حذف الصورة' : isKu ? 'سڕینەوە' : 'Remove'}
                    </button>
                  </div>
                )}
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {isAr ? 'الوصف (الإنجليزية):' : isKu ? 'وەسف (ئینگلیزی):' : 'Description (English):'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Crunchy chicken breast, cheddar, pickles..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 font-kurdish">
                    وەسف (کوردی):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="سنگی مریشکی کریسپی بە پەنیر و سۆس..."
                    value={formDescriptionKu}
                    onChange={(e) => setFormDescriptionKu(e.target.value)}
                    className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 font-kurdish">
                    الوصف (العربية):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="صدر دجاج مقرمش مع جبنة شيدر ومخلل..."
                    value={formDescriptionAr}
                    onChange={(e) => setFormDescriptionAr(e.target.value)}
                    className="w-full bg-[#200f13] border border-[#3d1a21] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f5a623]"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formIsSpicy}
                    onChange={(e) => setFormIsSpicy(e.target.checked)}
                    className="w-4 h-4 rounded text-[#ba181b] bg-[#200f13] border-[#3d1a21]"
                  />
                  <span className="text-xs font-bold text-gray-300">
                    🌶️ {isKu ? 'خواردنی تیژە (Spicy)' : 'Spicy Item'}
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formInStock}
                    onChange={(e) => setFormInStock(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 bg-[#200f13] border-[#3d1a21]"
                  />
                  <span className="text-xs font-bold text-gray-300">
                    ✓ {isKu ? 'بەردەستە لە چێشتخانە' : 'In Stock & Available'}
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#311318] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#251015] hover:bg-[#34161c] text-gray-300 text-xs font-bold"
                >
                  {isKu ? 'پاشگەزبوونەوە' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ba181b] to-[#990012] hover:from-[#c4151c] hover:to-[#ba181b] text-white text-xs font-black shadow-glow-red transition-all"
                >
                  {editingItem ? (isKu ? 'نوێکردنەوەی خواردن' : 'Update Dish') : (isKu ? 'زیادکردنی خواردن' : 'Upload Item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#1a0b0e] border border-red-900/50 rounded-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-950 flex items-center justify-center text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">
              {isKu ? 'دڵنیایت لە سڕینەوەی ئەم خواردنە؟' : 'Delete this item?'}
            </h4>
            <p className="text-xs text-gray-400">
              "{itemToDelete.name}" {isKu ? 'بەتەواوی لە مێنیو دەسڕدرێتەوە.' : 'will be removed from the active menu.'}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl bg-[#2a1318] text-gray-300 text-xs font-bold"
              >
                {isKu ? 'نەخێر' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  deleteItem(itemToDelete.id);
                  setItemToDelete(null);
                  showToast(isKu ? 'خواردنەکە سڕدرایەوە!' : 'Item deleted!');
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black"
              >
                {isKu ? 'بەڵێ، بسڕەوە' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
