import React, { useState, useRef } from 'react';
import { useMenu } from '../context/MenuContext';
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Image as ImageIcon,
  Search,
  Lock,
  RefreshCw,
  Download,
  UploadCloud,
  Layers,
  Settings,
  AlertCircle,
  ShieldCheck,
  ExternalLink,
  Flame,
  CheckCircle2,
  Filter,
  User,
  Key,
  Eye,
  EyeOff,
  LogOut,
  X,
  Check
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
    adminUser,
    loginAdmin,
    logoutAdmin,
    changeAdminPassword
  } = useMenu();

  const isKu = lang === 'ku';
  const isAr = lang === 'ar';

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
  const [editingItem, setEditingItem] = useState(null);

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

  // Handle local image file upload
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

  // If not authenticated, render Clean Modern Login Screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm bg-zinc-900 border border-white/[0.1] rounded-2xl p-7 shadow-dialog space-y-6 relative">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {isAr ? 'تسجيل دخول الإدارة' : isKu ? 'چوونەژوورەوەی بەڕێوەبەر' : 'Admin Portal'}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {isAr
                  ? 'أدخل بيانات الدخول لإدارة منيو تشيكورا'
                  : isKu
                  ? 'زانیارییەکان بنووسە بۆ بەڕێوەبردنی مێنیو'
                  : 'Manage dishes, prices, and restaurant settings'}
              </p>
            </div>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-400" />
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
                className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-zinc-400" />
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
                  className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isKu ? 'پشکنین...' : 'Authenticating...'}</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تسجيل الدخول' : isKu ? 'چوونەژوورەوە' : 'Sign In'}</span>
                </>
              )}
            </button>

            {/* Quick autofill hint */}
            <div className="pt-2 text-center border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => {
                  setUsernameInput('admin');
                  setPasswordInput('chikora@2025');
                  setLoginError('');
                }}
                className="inline-flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-amber-400 transition-colors"
              >
                <Key className="w-3 h-3 text-amber-400" />
                <span>{isKu ? 'بەکارهێنەری سەرەتایی: admin / chikora@2025' : 'Default Login: admin / chikora@2025'}</span>
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                ← {isKu ? 'گەڕانەوە بۆ مێنیو' : 'Back to Public Menu'}
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
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-emerald-500/40 text-emerald-300 font-semibold text-xs shadow-dialog animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Header & Overview Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/60 border border-white/[0.08] rounded-xl p-5 shadow-card">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-zinc-950 p-1 border border-white/10 flex-shrink-0">
            <img
              src="/chikora-logo.jpeg"
              alt="Chikora Logo"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {isKu ? 'پانێڵی بەڕێوەبردنی چیکۆرا' : 'Chikora Management'}
              </h1>
              <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border flex items-center gap-1 ${
                isDbConnected
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isDbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>{isDbConnected ? 'SQLITE LIVE' : 'LOCAL CACHE'}</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isKu
                ? 'بەڕێوەبردنی تەواوی خواردنەکان، پۆلەکان و ڕێکخستنی نرخ'
                : 'Upload items, update prices, manage categories, and customize menu.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Active Admin Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-800 text-xs font-medium text-zinc-300 border border-white/[0.06]">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>{adminUser?.username || 'admin'}</span>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-subtle active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>{isKu ? 'خواردنی نوێ' : 'Add Item'}</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/[0.06] text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>{isKu ? 'بینینی مێنیو' : 'Live Menu'}</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-red-950/40 text-zinc-400 hover:text-red-300 border border-white/[0.06] text-xs font-semibold transition-colors"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isAr ? 'خروج' : isKu ? 'دەرچوون' : 'Log Out'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-zinc-900/60 border border-white/[0.08] rounded-xl p-4">
          <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
            {isKu ? 'کۆی خواردنەکان' : 'Total Items'}
          </span>
          <p className="text-2xl font-bold text-white mt-1 tabular-nums">{items.length}</p>
        </div>
        <div className="bg-zinc-900/60 border border-white/[0.08] rounded-xl p-4">
          <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
            {isKu ? 'پۆلەکان' : 'Categories'}
          </span>
          <p className="text-2xl font-bold text-amber-400 mt-1 tabular-nums">{categories.length - 1}</p>
        </div>
        <div className="bg-zinc-900/60 border border-white/[0.08] rounded-xl p-4">
          <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
            {isKu ? 'بەردەست' : 'In Stock'}
          </span>
          <p className="text-2xl font-bold text-emerald-400 mt-1 tabular-nums">
            {items.filter((i) => i.inStock !== false).length}
          </p>
        </div>
        <div className="bg-zinc-900/60 border border-white/[0.08] rounded-xl p-4">
          <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
            {isKu ? 'تەواوبوو' : 'Sold Out'}
          </span>
          <p className="text-2xl font-bold text-red-400 mt-1 tabular-nums">
            {items.filter((i) => i.inStock === false).length}
          </p>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-white/[0.08] pb-2">
        <button
          onClick={() => setAdminTab('items')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            adminTab === 'items'
              ? 'bg-zinc-800 text-white border border-white/[0.12] shadow-subtle'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>{isKu ? 'خواردنەکان' : 'Dishes'} ({items.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('categories')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            adminTab === 'categories'
              ? 'bg-zinc-800 text-white border border-white/[0.12] shadow-subtle'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isKu ? 'پۆلەکان' : 'Categories'}</span>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            adminTab === 'settings'
              ? 'bg-zinc-800 text-white border border-white/[0.12] shadow-subtle'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>{isKu ? 'ڕێکخستن و ئاسایش' : 'Settings & Security'}</span>
        </button>
      </div>

      {/* TAB 1: ITEMS MANAGEMENT */}
      {adminTab === 'items' && (
        <div className="space-y-4">
          
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/50 border border-white/[0.08] p-3 rounded-xl">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder={isKu ? 'گەڕان بەپێی ناو...' : 'Filter items by name...'}
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="w-full bg-zinc-950 text-white text-xs pl-8 pr-3 py-1.5 rounded-lg border border-white/[0.08] focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
              <select
                value={adminCategoryFilter}
                onChange={(e) => setAdminCategoryFilter(e.target.value)}
                className="bg-zinc-950 text-white text-xs border border-white/[0.08] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500/50"
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

          {/* Items Table */}
          <div className="bg-zinc-900/60 border border-white/[0.08] rounded-xl overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right text-xs">
                <thead className="bg-zinc-950 text-zinc-400 font-semibold uppercase tracking-wider border-b border-white/[0.06]">
                  <tr>
                    <th className="py-3 px-4">{isKu ? 'وێنە و ناو' : 'Item & Photo'}</th>
                    <th className="py-3 px-4">{isKu ? 'پۆل' : 'Category'}</th>
                    <th className="py-3 px-4">{isKu ? 'نرخ' : 'Price'}</th>
                    <th className="py-3 px-4">{isKu ? 'تایبەتمەندی' : 'Badge'}</th>
                    <th className="py-3 px-4">{isKu ? 'دۆخ' : 'Status'}</th>
                    <th className="py-3 px-4 text-right rtl:text-left">{isKu ? 'کردارەکان' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredAdminItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-zinc-500">
                        {isKu ? 'هیچ خواردنێک نەدۆزرایەوە' : 'No items match your criteria.'}
                      </td>
                    </tr>
                  ) : (
                    filteredAdminItems.map((item) => {
                      const catObj = categories.find((c) => c.id === item.category);
                      const isOutOfStock = item.inStock === false;

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-zinc-800/40 transition-colors"
                        >
                          {/* Image & Title */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover bg-zinc-950 flex-shrink-0 border border-white/10"
                              />
                              <div>
                                <p className="font-semibold text-white text-xs sm:text-sm">
                                  {item.name}
                                </p>
                                {(isAr ? item.nameAr || item.nameKu : item.nameKu) && (
                                  <p className="text-[11px] text-zinc-400 font-normal">
                                    {isAr ? item.nameAr || item.nameKu : item.nameKu}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-medium text-[11px] border border-white/[0.05]">
                              {isAr ? catObj?.nameAr || catObj?.nameEn || item.category : isKu ? catObj?.nameKu || item.category : catObj?.nameEn || item.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4 font-bold text-white tabular-nums">
                            {formatPrice(item.price)}
                          </td>

                          {/* Tag */}
                          <td className="py-3 px-4">
                            {item.tag ? (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-800 text-amber-400 border border-amber-500/20">
                                {item.tag}
                              </span>
                            ) : (
                              <span className="text-zinc-600">—</span>
                            )}
                          </td>

                          {/* Stock Toggle */}
                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleStock(item.id)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                                !isOutOfStock
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                  : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
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
                                className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                                title="Edit Item"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setItemToDelete(item)}
                                className="p-1.5 rounded-md bg-zinc-800 hover:bg-red-950/60 text-zinc-400 hover:text-red-300 transition-colors"
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
          <div className="md:col-span-5 bg-zinc-900/60 border border-white/[0.08] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>{isKu ? 'زیادکردنی پۆلی نوێ' : 'Add New Category'}</span>
            </h3>

            <form onSubmit={handleAddCategorySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Category Name (English):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Desserts, Sandwiches..."
                  value={newCatNameEn}
                  onChange={(e) => setNewCatNameEn(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 font-kurdish">
                  ناوی پۆل (کوردی):
                </label>
                <input
                  type="text"
                  placeholder="بۆ نموونە: شیرینی، لەفاف..."
                  value={newCatNameKu}
                  onChange={(e) => setNewCatNameKu(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 font-kurdish">
                  اسم القسم (العربية):
                </label>
                <input
                  type="text"
                  placeholder="مثال: حلويات، ساندويتشات..."
                  value={newCatNameAr}
                  onChange={(e) => setNewCatNameAr(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Category Icon:
                </label>
                <select
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
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
                className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all active:scale-98"
              >
                {isKu ? 'پاشەکەوتکردن' : 'Save Category'}
              </button>
            </form>
          </div>

          {/* Existing Categories List */}
          <div className="md:col-span-7 bg-zinc-900/60 border border-white/[0.08] rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white">
              {isKu ? 'پۆلە بەردەستەکان' : 'Active Categories'}
            </h3>

            <div className="space-y-2">
              {categories.map((c) => {
                const count = items.filter((i) => i.category === c.id).length;
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-white/[0.06]"
                  >
                    <div>
                      <p className="font-semibold text-white text-xs sm:text-sm">
                        {c.nameEn}
                        <span className="text-xs text-amber-400 ml-2 font-normal">
                          ({c.nameKu})
                        </span>
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        ID: {c.id} • {count} {isKu ? 'خواردن' : 'items'}
                      </p>
                    </div>

                    {c.id !== 'all' && (
                      <button
                        onClick={() => deleteCategory(c.id)}
                        className="p-1 rounded-md text-zinc-500 hover:text-red-400 hover:bg-zinc-900 transition-colors"
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
          <div className="md:col-span-7 bg-zinc-900/60 border border-white/[0.08] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">
              {isKu ? 'زانیارییەکانی ڕێستۆرانت' : 'Restaurant & Order Information'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Restaurant Name (EN):
                </label>
                <input
                  type="text"
                  value={restaurantInfo.name}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 font-kurdish">
                  ناوی ڕێستۆرانت (کوردی):
                </label>
                <input
                  type="text"
                  value={restaurantInfo.nameKu}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, nameKu: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1 font-kurdish">
                  اسم المطعم (العربية):
                </label>
                <input
                  type="text"
                  value={restaurantInfo.nameAr || ''}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, nameAr: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  WhatsApp Number:
                </label>
                <input
                  type="text"
                  value={restaurantInfo.whatsapp}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, whatsapp: e.target.value })}
                  placeholder="9647506008620"
                  className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Phone Display:
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={restaurantInfo.phone}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Currency Symbol:
                </label>
                <input
                  type="text"
                  value={restaurantInfo.currency}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, currency: e.target.value })}
                  placeholder="IQD or $"
                  className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Hawler Address:
                </label>
                <input
                  type="text"
                  value={restaurantInfo.address}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, address: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <button
              onClick={() => {
                updateRestaurantInfo(restaurantInfo);
                showToast(isAr ? 'تم حفظ التعديلات!' : isKu ? 'گۆڕانکارییەکان پاشەکەوتکران' : 'Settings saved to database!');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
            >
              {isKu ? 'پاشەکەوتکردن' : 'Save Details'}
            </button>
          </div>

          {/* Backup & Export */}
          <div className="md:col-span-5 bg-zinc-900/60 border border-white/[0.08] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">
              {isKu ? 'پاراستن و باکئەپی داتا' : 'Data Backup & Reset'}
            </h3>

            <div className="space-y-3">
              <button
                onClick={exportData}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-200 border border-white/[0.08] text-xs font-semibold transition-all"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>{isKu ? 'داگرتنی باکئەپ (JSON)' : 'Export Backup File (JSON)'}</span>
              </button>

              <div>
                <label className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-200 border border-white/[0.08] text-xs font-semibold cursor-pointer transition-all">
                  <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isKu ? 'هاوردەکردنی باکئەپ' : 'Import Menu Backup'}</span>
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
                        if (ok) showToast(isKu ? 'داتاکە هاوردەکرا!' : 'Menu data restored!');
                      };
                      reader.readAsText(file);
                    }}
                  />
                </label>
              </div>

              <div className="pt-3 border-t border-white/[0.06]">
                <button
                  onClick={() => {
                    if (window.confirm(isKu ? 'دڵنیایت لە گەڕانەوە بۆ مێنیوی سەرەتایی چیکۆرا؟' : 'Are you sure you want to restore default items?')) {
                      resetToDefaults();
                      showToast(isKu ? 'مێنیو گەڕایەوە باری سەرەتایی' : 'Restored to default Chikora menu!');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-950 hover:bg-red-950/60 text-zinc-400 hover:text-red-300 border border-white/[0.08] text-xs font-semibold transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isKu ? 'گەڕانەوە بۆ باری سەرەتایی' : 'Reset To Original Factory Menu'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Admin Security & Password Change */}
          <div className="md:col-span-12 bg-zinc-900/60 border border-white/[0.08] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  {isAr ? 'أمان الحساب وتغيير كلمة المرور' : isKu ? 'ئاسایشی ئەکاونت و گۆڕینی وشەی نهێنی' : 'Account Security & Password Management'}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-semibold">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>{isKu ? 'پارێزراوە لە هاک' : 'Protected'}</span>
              </span>
            </div>

            {securityMessage.text && (
              <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                securityMessage.type === 'success'
                  ? 'bg-emerald-950/60 border-emerald-800/40 text-emerald-300'
                  : 'bg-red-950/60 border-red-800/40 text-red-300'
              }`}>
                {securityMessage.type === 'success' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                )}
                <span>{securityMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  {isAr ? 'كلمة المرور الحالية:' : isKu ? 'وشەی نهێنی ئێستا:' : 'Current Password:'}
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  {isAr ? 'اسم المستخدم الجديد:' : isKu ? 'ناوی نوێ:' : 'New Username (Optional):'}
                </label>
                <input
                  type="text"
                  value={newAdminUsername}
                  onChange={(e) => setNewAdminUsername(e.target.value)}
                  placeholder={adminUser?.username || 'admin'}
                  className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  {isAr ? 'كلمة المرور الجديدة (6+):' : isKu ? 'وشەی نهێنی نوێ (٦+):' : 'New Password (6+ chars):'}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  {isAr ? 'تأكيد كلمة المرور:' : isKu ? 'دووبارەکردنەوە:' : 'Confirm New Password:'}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="lg:col-span-4 flex justify-end">
                <button
                  type="submit"
                  disabled={securityLoading}
                  className="py-2 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-white/[0.1] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
                >
                  {securityLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{isKu ? 'نوێکردنەوە...' : 'Updating...'}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isAr ? 'تحديث بيانات الحساب' : isKu ? 'نوێکردنەوەی ئەکاونت' : 'Update Credentials'}</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-zinc-900 border border-white/[0.1] rounded-2xl overflow-hidden shadow-dialog flex flex-col my-8"
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-zinc-800 text-amber-400 border border-white/10">
                  {editingItem ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {editingItem
                      ? (isKu ? 'دەستکاریکردنی خواردن' : 'Edit Menu Item')
                      : (isKu ? 'زیادکردنی خواردنی نوێ' : 'Add Menu Item')}
                  </h3>
                  <span className="text-[11px] text-zinc-400">
                    {isKu ? 'ناوەڕۆک، وێنە و نرخ دیاریبکە' : 'Item details, photo, category, and pricing'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsItemModalOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveItem} className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
              {formError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/80 border border-red-800/40 text-red-300 text-xs font-medium">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    {isAr ? 'اسم الوجبة (EN) *' : isKu ? 'ناو (ئینگلیزی) *' : 'Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Crispy Tenders 8 Pcs"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1 font-kurdish">
                    {isAr ? 'اسم الوجبة (كردي):' : isKu ? 'ناو (کوردی):' : 'Name (Kurdish):'}
                  </label>
                  <input
                    type="text"
                    placeholder="بۆ نموونە: تەندەرزی کریسپی"
                    value={formNameKu}
                    onChange={(e) => setFormNameKu(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1 font-kurdish">
                    {isAr ? 'اسم الوجبة (عربي):' : isKu ? 'ناو (عەرەبی):' : 'Name (Arabic):'}
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: تندرز الدجاج المقرمش"
                    value={formNameAr}
                    onChange={(e) => setFormNameAr(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              {/* Category, Price, Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    {isAr ? 'القسم *' : isKu ? 'پۆل *' : 'Category *'}
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  >
                    {categories.filter(c => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {isAr ? (c.nameAr || c.nameEn) : isKu ? (c.nameKu || c.nameEn) : c.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
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
                    className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    {isAr ? 'العلامة:' : isKu ? 'تایبەتمەندی:' : 'Badge / Tag:'}
                  </label>
                  <select
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="">None</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="Spicy">Spicy</option>
                    <option value="Chef Special">Chef Special</option>
                    <option value="New">New</option>
                  </select>
                </div>
              </div>

              {/* IMAGE UPLOAD SECTION */}
              <div className="bg-zinc-950/60 border border-white/[0.06] rounded-xl p-3.5 space-y-2.5">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'صورة الوجبة' : isKu ? 'وێنەی خواردن' : 'Food Image Upload'}</span>
                </label>

                {/* File Upload Box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-white/15 hover:border-amber-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-zinc-950 group"
                >
                  <Upload className="w-6 h-6 mx-auto text-zinc-400 group-hover:text-amber-400 mb-1.5 group-hover:scale-105 transition-all" />
                  <p className="text-xs font-semibold text-zinc-200">
                    {isAr
                      ? 'اختر صورة من جهازك'
                      : isKu
                      ? 'کرتە بکە بۆ هەڵبژاردنی وێنە'
                      : 'Click to upload image from device'}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    Supports PNG, JPG, WEBP (auto-optimized)
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
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={formImage}
                        alt="Preview"
                        className="w-10 h-10 rounded-lg object-cover border border-white/10"
                      />
                      <div className="text-[11px] text-zinc-400 flex flex-col">
                        <span className="text-emerald-400 font-medium inline-flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Image ready</span>
                        </span>
                        <p className="truncate max-w-xs">{formImage.slice(0, 30)}...</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormImage('')}
                      className="px-2 py-0.5 text-[11px] rounded-md bg-zinc-800 hover:bg-red-950/60 text-zinc-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    {isAr ? 'الوصف (EN):' : isKu ? 'وەسف (ئینگلیزی):' : 'Description (English):'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Crispy chicken, signature sauce..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1 font-kurdish">
                    وەسف (کوردی):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="سنگی مریشکی کریسپی بە پەنیر و سۆس..."
                    value={formDescriptionKu}
                    onChange={(e) => setFormDescriptionKu(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1 font-kurdish">
                    الوصف (العربية):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="صدر دجاج مقرمش مع صلصة خاصة..."
                    value={formDescriptionAr}
                    onChange={(e) => setFormDescriptionAr(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
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
                    className="w-3.5 h-3.5 rounded text-red-500 bg-zinc-950 border-zinc-700"
                  />
                  <span className="text-xs font-medium text-zinc-300 inline-flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                    <span>{isKu ? 'خواردنی تیژە (Spicy)' : 'Spicy Item'}</span>
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formInStock}
                    onChange={(e) => setFormInStock(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-emerald-500 bg-zinc-950 border-zinc-700"
                  />
                  <span className="text-xs font-medium text-zinc-300 inline-flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isKu ? 'بەردەستە (In Stock)' : 'In Stock'}</span>
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                >
                  {isKu ? 'پاشگەزبوونەوە' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all"
                >
                  {editingItem ? (isKu ? 'نوێکردنەوە' : 'Update') : (isKu ? 'زیادکردن' : 'Add Item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-white/[0.1] rounded-xl p-5 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-red-950/80 border border-red-800/40 flex items-center justify-center text-red-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">
              {isKu ? 'دڵنیایت لە سڕینەوەی ئەم خواردنە؟' : 'Delete this item?'}
            </h4>
            <p className="text-xs text-zinc-400">
              "{itemToDelete.name}" {isKu ? 'لە مێنیو دەسڕدرێتەوە.' : 'will be removed from the menu.'}
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700"
              >
                {isKu ? 'نەخێر' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  deleteItem(itemToDelete.id);
                  setItemToDelete(null);
                  showToast(isKu ? 'خواردنەکە سڕدرایەوە' : 'Item deleted');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                {isKu ? 'بەڵێ، بسڕەوە' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
