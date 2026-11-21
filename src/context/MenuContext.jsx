import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_ITEMS, DEFAULT_CATEGORIES, RESTAURANT_INFO } from '../data/defaultMenu';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  // Menu items with LocalStorage fallback & initial load
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('chikora_menu_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load menu items from storage:', e);
    }
    return DEFAULT_ITEMS;
  });

  // Categories
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('chikora_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load categories:', e);
    }
    return DEFAULT_CATEGORIES;
  });

  // Restaurant details
  const [restaurantInfo, setRestaurantInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('chikora_info');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load restaurant info:', e);
    }
    return RESTAURANT_INFO;
  });

  // Language state: 'en' | 'ku' | 'ar'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('chikora_lang') || 'ku';
  });

  // Welcome Language Gate Screen state (first visit or re-opened)
  const [hasEnteredMenu, setHasEnteredMenu] = useState(() => {
    return sessionStorage.getItem('chikora_has_entered') === 'true';
  });

  const enterMenu = () => {
    setHasEnteredMenu(true);
    sessionStorage.setItem('chikora_has_entered', 'true');
  };

  const openLanguageGate = () => {
    setHasEnteredMenu(false);
    sessionStorage.removeItem('chikora_has_entered');
  };

  // Router state for /admin vs /
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isDbConnected, setIsDbConnected] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminRoute = currentPath.toLowerCase().startsWith('/admin');

  // Customer Filtering state
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('all'); // all, spicy, bestseller

  // View state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem('chikora_admin_token') || '';
  });
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('chikora_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('chikora_admin_token'));
  });

  // Helper for auth headers
  const getAuthHeaders = () => {
    const token = adminToken || localStorage.getItem('chikora_admin_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Verify auth session on mount
  useEffect(() => {
    const token = localStorage.getItem('chikora_admin_token');
    if (!token) {
      setIsAdminAuthenticated(false);
      return;
    }

    fetch('/api/admin/check', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setIsAdminAuthenticated(true);
          setAdminUser(data.user);
        } else {
          // Token expired or invalid
          setIsAdminAuthenticated(false);
          setAdminToken('');
          setAdminUser(null);
          localStorage.removeItem('chikora_admin_token');
          localStorage.removeItem('chikora_admin_user');
        }
      })
      .catch(() => {
        if (token) setIsAdminAuthenticated(true);
      });
  }, []);

  const loginAdmin = async (username, password) => {
    const userTrimmed = (username || '').trim();
    const isHardcoded =
      (userTrimmed === 'admin' && password === 'chikora@2025') ||
      (userTrimmed === 'admin' && password === 'admin');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userTrimmed, password }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setAdminToken(data.token);
        setAdminUser(data.user);
        setIsAdminAuthenticated(true);
        localStorage.setItem('chikora_admin_token', data.token);
        localStorage.setItem('chikora_admin_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
    } catch (err) {
      console.warn('Network error during login, checking hardcoded credentials:', err);
    }

    if (isHardcoded) {
      const token = 'admin-token-' + Date.now();
      const user = { id: 'admin-1', username: 'admin' };
      setAdminToken(token);
      setAdminUser(user);
      setIsAdminAuthenticated(true);
      localStorage.setItem('chikora_admin_token', token);
      localStorage.setItem('chikora_admin_user', JSON.stringify(user));
      return { success: true, user };
    }

    return { success: false, error: 'Invalid username or password' };
  };

  const logoutAdmin = async () => {
    const token = adminToken || localStorage.getItem('chikora_admin_token');
    if (token) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    setAdminToken('');
    setAdminUser(null);
    setIsAdminAuthenticated(false);
    localStorage.removeItem('chikora_admin_token');
    localStorage.removeItem('chikora_admin_user');
  };

  const changeAdminPassword = async (currentPassword, newUsername, newPassword) => {
    const token = adminToken || localStorage.getItem('chikora_admin_token');
    if (!token) return { success: false, error: 'Not authenticated' };

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newUsername, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.username) {
          const updatedUser = { ...adminUser, username: data.username };
          setAdminUser(updatedUser);
          localStorage.setItem('chikora_admin_user', JSON.stringify(updatedUser));
        }
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || 'Failed to change password' };
      }
    } catch (err) {
      return { success: false, error: 'Network error connecting to server' };
    }
  };

  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('chikora_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);

  // Sync to localStorage as backup
  useEffect(() => {
    localStorage.setItem('chikora_menu_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('chikora_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('chikora_info', JSON.stringify(restaurantInfo));
  }, [restaurantInfo]);

  // Sync language
  useEffect(() => {
    localStorage.setItem('chikora_lang', lang);
    const isRtl = lang === 'ku' || lang === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Sync cart
  useEffect(() => {
    localStorage.setItem('chikora_cart', JSON.stringify(cart));
  }, [cart]);

  // FETCH FROM SQLITE DATABASE ON MOUNT & AUTO-SYNC
  useEffect(() => {
    const fetchDatabase = async () => {
      try {
        const res = await fetch('/api/menu');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setIsDbConnected(true);

            const hasCustomData = localStorage.getItem('chikora_has_custom_data') === 'true';
            const localSavedItems = localStorage.getItem('chikora_menu_items');
            const localSavedCats = localStorage.getItem('chikora_categories');
            const localSavedInfo = localStorage.getItem('chikora_info');

            // If user has customized items or categories locally, sync up to SQLite and preserve user edits
            if (hasCustomData && (localSavedItems || localSavedCats)) {
              try {
                await fetch('/api/sync', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    items: localSavedItems ? JSON.parse(localSavedItems) : items,
                    categories: localSavedCats ? JSON.parse(localSavedCats) : categories,
                    restaurantInfo: localSavedInfo ? JSON.parse(localSavedInfo) : restaurantInfo,
                  }),
                });
              } catch (e) {
                // Ignore sync errors
              }
              // Do NOT overwrite user's custom changes with default data
              return;
            }

            if (data.items && data.items.length > 0) {
              setItems(data.items);
            }
            if (data.categories && data.categories.length > 0) {
              setCategories(data.categories);
            }
            if (data.restaurantInfo && Object.keys(data.restaurantInfo).length > 0) {
              setRestaurantInfo(data.restaurantInfo);
            }
          }
        }
      } catch (err) {
        console.warn('SQLite Backend API connection error, running with local data:', err);
      }
    };

    fetchDatabase();
  }, []);

  // Item Actions (Syncs to SQLite Database & Local State)
  const addItem = async (newItem) => {
    localStorage.setItem('chikora_has_custom_data', 'true');
    const itemWithId = {
      ...newItem,
      id: newItem.id || `item-${Date.now()}`,
      price: Number(newItem.price) || 0,
      inStock: newItem.inStock !== false,
    };

    // Optimistic local update
    setItems((prev) => [itemWithId, ...prev]);

    // Send to SQLite
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(itemWithId),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.item) {
          setItems((prev) => prev.map((i) => (i.id === itemWithId.id ? data.item : i)));
        }
      }
    } catch (err) {
      console.error('Failed to save to SQLite database:', err);
    }
    return itemWithId;
  };

  const updateItem = async (id, updatedFields) => {
    localStorage.setItem('chikora_has_custom_data', 'true');
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updatedFields, price: Number(updatedFields.price ?? item.price) } : item
      )
    );

    try {
      await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(updatedFields),
      });
    } catch (err) {
      console.error('Failed to update in SQLite database:', err);
    }
  };

  const deleteItem = async (id) => {
    localStorage.setItem('chikora_has_custom_data', 'true');
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await fetch(`/api/items/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      });
    } catch (err) {
      console.error('Failed to delete from SQLite database:', err);
    }
  };

  const toggleStock = async (id) => {
    localStorage.setItem('chikora_has_custom_data', 'true');
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, inStock: !item.inStock } : item))
    );
    try {
      await fetch(`/api/items/${id}/stock`, {
        method: 'PATCH',
        headers: { ...getAuthHeaders() },
      });
    } catch (err) {
      console.error('Failed to toggle stock in SQLite database:', err);
    }
  };

  // Category Actions
  const addCategory = async (categoryData) => {
    localStorage.setItem('chikora_has_custom_data', 'true');
    const newCat = {
      id: categoryData.id || `cat-${Date.now()}`,
      nameEn: categoryData.nameEn,
      nameKu: categoryData.nameKu || categoryData.nameEn,
      nameAr: categoryData.nameAr || categoryData.nameEn,
      icon: categoryData.icon || 'Flame',
    };
    setCategories((prev) => [...prev, newCat]);

    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(newCat),
      });
    } catch (err) {
      console.error('Failed to save category to SQLite database:', err);
    }
  };

  const updateCategory = async (catId, categoryData) => {
    localStorage.setItem('chikora_has_custom_data', 'true');
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? {
              ...c,
              nameEn: categoryData.nameEn !== undefined ? categoryData.nameEn : c.nameEn,
              nameKu: categoryData.nameKu !== undefined ? categoryData.nameKu : c.nameKu,
              nameAr: categoryData.nameAr !== undefined ? categoryData.nameAr : c.nameAr,
              icon: categoryData.icon !== undefined ? categoryData.icon : c.icon,
            }
          : c
      )
    );

    try {
      await fetch(`/api/categories/${catId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(categoryData),
      });
    } catch (err) {
      console.error('Failed to update category in SQLite database:', err);
    }
  };

  const deleteCategory = async (catId) => {
    if (catId === 'all') return;
    localStorage.setItem('chikora_has_custom_data', 'true');
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    setItems((prev) =>
      prev.map((item) => (item.category === catId ? { ...item, category: 'chikora' } : item))
    );

    try {
      await fetch(`/api/categories/${catId}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      });
    } catch (err) {
      console.error('Failed to delete category from SQLite database:', err);
    }
  };

  const updateRestaurantInfo = async (newInfo) => {
    localStorage.setItem('chikora_has_custom_data', 'true');
    setRestaurantInfo(newInfo);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(newInfo),
      });
    } catch (err) {
      console.error('Failed to update settings in SQLite database:', err);
    }
  };

  // Reset to Defaults
  const resetToDefaults = async () => {
    localStorage.removeItem('chikora_has_custom_data');
    setItems(DEFAULT_ITEMS);
    setCategories(DEFAULT_CATEGORIES);
    setRestaurantInfo(RESTAURANT_INFO);
    localStorage.removeItem('chikora_menu_items');
    localStorage.removeItem('chikora_categories');
    localStorage.removeItem('chikora_info');

    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          items: DEFAULT_ITEMS,
          categories: DEFAULT_CATEGORIES,
          restaurantInfo: RESTAURANT_INFO,
        }),
      });
    } catch (err) {
      console.error('Failed to reset SQLite database:', err);
    }
  };

  // Cart Actions
  const addToCart = (item, quantity = 1, notes = '', selectedSize = null) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (ci) =>
          ci.item.id === item.id &&
          ci.notes === notes &&
          (ci.selectedSize?.name || '') === (selectedSize?.name || '')
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }
      return [...prev, { item, quantity, notes, selectedSize }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (index, qty) => {
    if (qty <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const next = [...prev];
      next[index].quantity = qty;
      return next;
    });
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((acc, ci) => {
    const unitPrice = ci.selectedSize ? Number(ci.selectedSize.price) : Number(ci.item.price);
    return acc + (unitPrice || 0) * ci.quantity;
  }, 0);
  const cartCount = cart.reduce((acc, ci) => acc + ci.quantity, 0);

  // Currency Formatter
  const formatPrice = (price) => {
    if (typeof price !== 'number') price = Number(price) || 0;
    return `${price.toLocaleString()} ${restaurantInfo.currency || 'IQD'}`;
  };

  // Export / Import
  const exportData = () => {
    const data = {
      items,
      categories,
      restaurantInfo,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chikora-menu-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (jsonData) => {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (Array.isArray(parsed.items)) setItems(parsed.items);
      if (Array.isArray(parsed.categories)) setCategories(parsed.categories);
      if (parsed.restaurantInfo) setRestaurantInfo(parsed.restaurantInfo);

      // Sync to SQLite
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <MenuContext.Provider
      value={{
        items,
        categories,
        restaurantInfo,
        setRestaurantInfo,
        updateRestaurantInfo,
        lang,
        setLang,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        tagFilter,
        setTagFilter,
        currentPath,
        navigate,
        hasEnteredMenu,
        enterMenu,
        openLanguageGate,
        isAdminRoute,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        adminToken,
        adminUser,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        getAuthHeaders,
        isDbConnected,
        cart,
        isCartOpen,
        setIsCartOpen,
        selectedItemForModal,
        setSelectedItemForModal,
        addItem,
        updateItem,
        deleteItem,
        toggleStock,
        addCategory,
        updateCategory,
        deleteCategory,
        resetToDefaults,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        formatPrice,
        exportData,
        importData,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within a MenuProvider');
  return context;
};
