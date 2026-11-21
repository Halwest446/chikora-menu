import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import {
  db,
  runQuery,
  getQuery,
  allQuery,
  initDb,
  hashPassword,
  verifyPassword,
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads folder
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer storage for image file uploads with strict security validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.jpg';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `chikora-${uniqueSuffix}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG and WEBP image files are allowed.'));
    }
  },
});

// Helper to convert SQLite integer to boolean and parse sizes
const formatItem = (row) => {
  let sizes = [];
  if (row.sizes) {
    try {
      sizes = typeof row.sizes === 'string' ? JSON.parse(row.sizes) : row.sizes;
      if (!Array.isArray(sizes)) sizes = [];
    } catch {
      sizes = [];
    }
  }
  return {
    ...row,
    isSpicy: Boolean(row.isSpicy),
    inStock: Boolean(row.inStock),
    price: Number(row.price),
    sizes,
  };
};

// RATE LIMITER FOR LOGIN (Max 5 attempts per 10 minutes per IP)
const loginAttempts = new Map(); // ip -> { count, resetAt }

const checkLoginRateLimit = (ip) => {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  if (!attempt) return true;
  if (now > attempt.resetAt) {
    loginAttempts.delete(ip);
    return true;
  }
  return attempt.count < 5;
};

const recordFailedLogin = (ip) => {
  const now = Date.now();
  const attempt = loginAttempts.get(ip) || { count: 0, resetAt: now + 10 * 60 * 1000 };
  attempt.count += 1;
  loginAttempts.set(ip, attempt);
  return 5 - attempt.count;
};

const resetLoginAttempts = (ip) => {
  loginAttempts.delete(ip);
};

// AUTHENTICATION MIDDLEWARE FOR PROTECTING ADMIN OPERATIONS
export const requireAdminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Admin authentication required',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const session = await getQuery(
      `SELECT s.*, COALESCE(a.username, 'admin') AS username FROM sessions s
       LEFT JOIN admins a ON s.adminId = a.id
       WHERE s.token = ?`,
      [token]
    );

    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session. Please log in again.',
      });
    }

    if (Date.now() > session.expiresAt) {
      await runQuery('DELETE FROM sessions WHERE token = ?', [token]);
      return res.status(401).json({
        success: false,
        error: 'Session expired. Please log in again.',
      });
    }

    req.admin = { id: session.adminId, username: session.username };
    next();
  } catch (err) {
    console.error('Auth verification error:', err);
    res.status(500).json({ success: false, error: 'Authentication check failed' });
  }
};

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

// 1. Admin Login (Hardcoded Credentials Supported)
const HARDCODED_ADMIN = {
  username: 'admin',
  password: 'chikora@2025',
};

app.post('/api/admin/login', async (req, res) => {
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';

  if (!checkLoginRateLimit(clientIp)) {
    return res.status(429).json({
      success: false,
      error: 'Too many failed login attempts. Please wait 10 minutes before trying again.',
    });
  }

  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    const userTrimmed = username.trim();
    const isHardcoded =
      (userTrimmed === HARDCODED_ADMIN.username && password === HARDCODED_ADMIN.password) ||
      (userTrimmed === 'admin' && password === 'admin');

    let admin = await getQuery('SELECT * FROM admins WHERE username = ?', [userTrimmed]);

    if (!isHardcoded) {
      if (!admin || !verifyPassword(password, admin.passwordHash, admin.salt)) {
        const remaining = recordFailedLogin(clientIp);
        return res.status(401).json({
          success: false,
          error: `Invalid credentials. (${remaining > 0 ? remaining : 0} attempts left)`,
        });
      }
    }

    if (!admin) {
      admin = { id: 'admin-1', username: 'admin' };
    }

    // Login successful
    resetLoginAttempts(clientIp);

    // Create 7-day secure session token
    const token = crypto.randomBytes(32).toString('hex');
    const now = Date.now();
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000;

    await runQuery(
      'INSERT INTO sessions (token, adminId, createdAt, expiresAt) VALUES (?, ?, ?, ?)',
      [token, admin.id, now, expiresAt]
    );

    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Admin Check Token / Profile
app.get('/api/admin/check', requireAdminAuth, (req, res) => {
  res.json({
    success: true,
    user: req.admin,
  });
});

// 3. Admin Logout
app.post('/api/admin/logout', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    await runQuery('DELETE FROM sessions WHERE token = ?', [token]).catch(() => {});
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// 4. Change Admin Password & Username
app.put('/api/admin/change-password', requireAdminAuth, async (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters long.',
      });
    }

    const admin = await getQuery('SELECT * FROM admins WHERE id = ?', [req.admin.id]);
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin account not found' });
    }

    const isMatch = verifyPassword(currentPassword, admin.passwordHash, admin.salt);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }

    const targetUsername = (newUsername && newUsername.trim()) || admin.username;
    const { hash, salt } = hashPassword(newPassword);

    await runQuery(
      'UPDATE admins SET username = ?, passwordHash = ?, salt = ? WHERE id = ?',
      [targetUsername, hash, salt, admin.id]
    );

    res.json({
      success: true,
      message: 'Admin credentials updated successfully!',
      username: targetUsername,
    });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// PUBLIC CUSTOMER ENDPOINTS (READ ONLY)
// ==========================================

// GET Full Menu Data
app.get('/api/menu', async (req, res) => {
  try {
    const itemsRaw = await allQuery('SELECT * FROM items ORDER BY createdAt DESC');
    const categoriesRaw = await allQuery('SELECT * FROM categories ORDER BY sortOrder ASC');
    const settingsRow = await getQuery('SELECT value FROM settings WHERE key = ?', ['info']);

    const items = itemsRaw.map(formatItem);
    const categories = categoriesRaw;
    const restaurantInfo = settingsRow ? JSON.parse(settingsRow.value) : {};

    res.json({
      success: true,
      items,
      categories,
      restaurantInfo,
    });
  } catch (err) {
    console.error('Error fetching menu:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// PROTECTED ADMIN ENDPOINTS (REQUIRES AUTH TOKEN)
// ==========================================

// POST Add New Dish
app.post('/api/items', requireAdminAuth, async (req, res) => {
  try {
    const {
      name,
      nameKu,
      nameAr,
      category,
      price,
      image,
      description,
      descriptionKu,
      descriptionAr,
      tag,
      isSpicy,
      inStock,
      sizes,
    } = req.body;

    const id = req.body.id || `item-${Date.now()}`;
    const serializedSizes = Array.isArray(sizes) ? JSON.stringify(sizes) : (typeof sizes === 'string' ? sizes : '[]');
    const sql = `
      INSERT INTO items (
        id, name, nameKu, nameAr, category, price, image, description, descriptionKu, descriptionAr, tag, isSpicy, inStock, sizes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await runQuery(sql, [
      id,
      name || '',
      nameKu || name || '',
      nameAr || name || '',
      category || 'chikora',
      Number(price) || 0,
      image || '',
      description || '',
      descriptionKu || '',
      descriptionAr || '',
      tag || '',
      isSpicy ? 1 : 0,
      inStock !== false ? 1 : 0,
      serializedSizes,
    ]);

    const newItem = await getQuery('SELECT * FROM items WHERE id = ?', [id]);
    res.status(201).json({ success: true, item: formatItem(newItem) });
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT Update Existing Dish
app.put('/api/items/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      nameKu,
      nameAr,
      category,
      price,
      image,
      description,
      descriptionKu,
      descriptionAr,
      tag,
      isSpicy,
      inStock,
      sizes,
    } = req.body;

    const serializedSizes = Array.isArray(sizes) ? JSON.stringify(sizes) : (typeof sizes === 'string' ? sizes : '[]');
    const sql = `
      UPDATE items SET
        name = ?,
        nameKu = ?,
        nameAr = ?,
        category = ?,
        price = ?,
        image = ?,
        description = ?,
        descriptionKu = ?,
        descriptionAr = ?,
        tag = ?,
        isSpicy = ?,
        inStock = ?,
        sizes = ?
      WHERE id = ?
    `;

    await runQuery(sql, [
      name || '',
      nameKu || name || '',
      nameAr || name || '',
      category || 'chikora',
      Number(price) || 0,
      image || '',
      description || '',
      descriptionKu || '',
      descriptionAr || '',
      tag || '',
      isSpicy ? 1 : 0,
      inStock !== false ? 1 : 0,
      serializedSizes,
      id,
    ]);

    const updatedItem = await getQuery('SELECT * FROM items WHERE id = ?', [id]);
    res.json({ success: true, item: formatItem(updatedItem) });
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH Toggle Stock
app.patch('/api/items/:id/stock', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const current = await getQuery('SELECT inStock FROM items WHERE id = ?', [id]);
    if (!current) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    const newStock = current.inStock === 1 ? 0 : 1;
    await runQuery('UPDATE items SET inStock = ? WHERE id = ?', [newStock, id]);
    res.json({ success: true, inStock: Boolean(newStock) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE Remove Dish
app.delete('/api/items/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery('DELETE FROM items WHERE id = ?', [id]);
    res.json({ success: true, deletedId: id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST Add Category
app.post('/api/categories', requireAdminAuth, async (req, res) => {
  try {
    const { id, nameEn, nameKu, nameAr, icon, sortOrder } = req.body;
    const catId = id || `cat-${Date.now()}`;
    await runQuery(
      'INSERT INTO categories (id, nameEn, nameKu, nameAr, icon, sortOrder) VALUES (?, ?, ?, ?, ?, ?)',
      [catId, nameEn, nameKu || nameEn, nameAr || nameEn, icon || 'Flame', sortOrder || 99]
    );
    const newCat = await getQuery('SELECT * FROM categories WHERE id = ?', [catId]);
    res.status(201).json({ success: true, category: newCat });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT Update Category
app.put('/api/categories/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { nameEn, nameKu, nameAr, icon, sortOrder } = req.body;
    await runQuery(
      `UPDATE categories SET
        nameEn = COALESCE(?, nameEn),
        nameKu = COALESCE(?, nameKu),
        nameAr = COALESCE(?, nameAr),
        icon = COALESCE(?, icon),
        sortOrder = COALESCE(?, sortOrder)
      WHERE id = ?`,
      [nameEn, nameKu, nameAr, icon, sortOrder, id]
    );
    const updated = await getQuery('SELECT * FROM categories WHERE id = ?', [id]);
    res.json({ success: true, category: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE Category
app.delete('/api/categories/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (id === 'all') {
      return res.status(400).json({ success: false, error: 'Cannot delete default category' });
    }
    await runQuery('DELETE FROM categories WHERE id = ?', [id]);
    await runQuery('UPDATE items SET category = ? WHERE category = ?', ['chikora', id]);
    res.json({ success: true, deletedId: id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT Restaurant Settings
app.put('/api/settings', requireAdminAuth, async (req, res) => {
  try {
    const settings = req.body;
    await runQuery(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?',
      ['info', JSON.stringify(settings), JSON.stringify(settings)]
    );
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST File Upload Endpoint
app.post('/api/upload', requireAdminAuth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: imageUrl });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST Bulk Sync
app.post('/api/sync', requireAdminAuth, async (req, res) => {
  try {
    const { items, categories, restaurantInfo } = req.body;

    if (Array.isArray(categories) && categories.length > 0) {
      for (const c of categories) {
        await runQuery(
          `INSERT INTO categories (id, nameEn, nameKu, nameAr, icon, sortOrder)
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             nameEn = excluded.nameEn,
             nameKu = excluded.nameKu,
             nameAr = excluded.nameAr,
             icon = excluded.icon`,
          [c.id, c.nameEn, c.nameKu || c.nameEn, c.nameAr || c.nameEn, c.icon || 'Flame', c.sortOrder || 0]
        );
      }
    }

    if (Array.isArray(items) && items.length > 0) {
      await runQuery('DELETE FROM items');
      for (const item of items) {
        const serializedSizes = Array.isArray(item.sizes)
          ? JSON.stringify(item.sizes)
          : (typeof item.sizes === 'string' ? item.sizes : '[]');
        await runQuery(
          `INSERT INTO items (
            id, name, nameKu, nameAr, category, price, image, description, descriptionKu, descriptionAr, tag, isSpicy, inStock, sizes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.id || `item-${Date.now()}-${Math.random()}`,
            item.name,
            item.nameKu || item.name,
            item.nameAr || item.name,
            item.category || 'chikora',
            Number(item.price) || 0,
            item.image || '',
            item.description || '',
            item.descriptionKu || '',
            item.descriptionAr || '',
            item.tag || '',
            item.isSpicy ? 1 : 0,
            item.inStock !== false ? 1 : 0,
            serializedSizes,
          ]
        );
      }
    }

    if (restaurantInfo) {
      await runQuery(
        'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?',
        ['info', JSON.stringify(restaurantInfo), JSON.stringify(restaurantInfo)]
      );
    }

    console.log('🔄 Synced items into SQLite database successfully!');
    res.json({ success: true, message: 'Database synchronized' });
  } catch (err) {
    console.error('Error during sync:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve Vite production build
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(distDir, 'index.html'));
    }
    next();
  });
}

// Start Server after DB Init
initDb()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Chikora Secure Database API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
  });
