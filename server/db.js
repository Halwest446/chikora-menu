import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { DEFAULT_ITEMS, DEFAULT_CATEGORIES } from '../src/data/defaultMenu.js';

const require = createRequire(import.meta.url);
const sqlite3 = require('sqlite3').verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'chikora.db');

export const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
  } else {
    console.log('✅ SQLite database connected at:', DB_PATH);
  }
});

// Password Hashing & Timing-Safe Verification (PBKDF2 SHA-512 with 100,000 iterations)
export const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
};

export const verifyPassword = (password, hash, salt) => {
  try {
    const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    const hashBuffer = Buffer.from(hash, 'hex');
    const verifyBuffer = Buffer.from(verifyHash, 'hex');
    if (hashBuffer.length !== verifyBuffer.length) return false;
    return crypto.timingSafeEqual(hashBuffer, verifyBuffer);
  } catch {
    return false;
  }
};

// Helper for promise-based queries
export const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

export const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize schema and initial seed data
export const initDb = async () => {
  // Create tables
  await runQuery(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      nameEn TEXT NOT NULL,
      nameKu TEXT,
      nameAr TEXT,
      icon TEXT DEFAULT 'Flame',
      sortOrder INTEGER DEFAULT 0
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      nameKu TEXT,
      nameAr TEXT,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT,
      description TEXT,
      descriptionKu TEXT,
      descriptionAr TEXT,
      tag TEXT,
      isSpicy INTEGER DEFAULT 0,
      inStock INTEGER DEFAULT 1,
      sizes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migration: Ensure 'sizes' column exists for existing databases
  try {
    await runQuery('ALTER TABLE items ADD COLUMN sizes TEXT');
  } catch (e) {
    // Column already exists, safe to ignore
  }

  await runQuery(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Check if categories table is empty, if so, seed default categories
  const catCount = await getQuery('SELECT COUNT(*) as count FROM categories');
  if (catCount.count === 0) {
    console.log('🌱 Seeding initial categories into SQLite...');
    for (const c of DEFAULT_CATEGORIES) {
      await runQuery(
        'INSERT INTO categories (id, nameEn, nameKu, nameAr, icon, sortOrder) VALUES (?, ?, ?, ?, ?, ?)',
        [c.id, c.nameEn, c.nameKu, c.nameAr, c.icon, c.sortOrder]
      );
    }
  }

  // Check if items table is empty, if so, seed initial authentic items
  const itemCount = await getQuery('SELECT COUNT(*) as count FROM items');
  if (itemCount.count === 0) {
    console.log('🌱 Seeding authentic Chikora dishes into SQLite...');
    for (const item of DEFAULT_ITEMS) {
      await runQuery(
        `INSERT INTO items (
          id, name, nameKu, nameAr, category, price, image, description, descriptionKu, descriptionAr, tag, isSpicy, inStock, sizes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.name,
          item.nameKu,
          item.nameAr,
          item.category,
          Number(item.price) || 0,
          item.image || '',
          item.description || '',
          item.descriptionKu || '',
          item.descriptionAr || '',
          item.tag || '',
          item.isSpicy ? 1 : 0,
          item.inStock !== false ? 1 : 0,
          JSON.stringify(item.sizes || []),
        ]
      );
    }
  }

  // Check settings
  const settingsCount = await getQuery('SELECT COUNT(*) as count FROM settings');
  if (settingsCount.count === 0) {
    const defaultSettings = {
      name: 'Chikora Hawler',
      nameKu: 'چیکۆرا هه‌ولێر',
      nameAr: 'تشيكورا هولير',
      slogan: 'Chikora is Now in Erbil',
      sloganKu: 'چیکۆرا ئێستا لە هەولێرە',
      sloganAr: 'تشيكورا الآن في أربيل',
      city: 'Hawler (Erbil), Kurdistan Region',
      address: 'Near University Hospital, Zanko, Hawler',
      addressKu: 'نزیک نەخۆشخانەی زانکۆ،گەڕەکی زانکۆ،هەولێر',
      addressAr: 'بالقرب من مستشفى الجامعة، حي الجامعة، أربيل',
      phone: '+964 750 600 8620',
      whatsapp: '9647506008620',
      instagram: '@chikora.hawler',
      openingHours: '11:30 AM - 02:00 AM Daily',
      openingHoursKu: '١١:٣٠ ی بەیانی تا ٠٢:٠٠ ی شەو هەموو ڕۆژێک',
      openingHoursAr: '11:30 صباحاً - 02:00 ليلاً يومياً',
      currency: 'IQD',
    };
    await runQuery('INSERT INTO settings (key, value) VALUES (?, ?)', ['info', JSON.stringify(defaultSettings)]);
  }

  // Create admins & sessions tables
  await runQuery(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      salt TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      adminId INTEGER NOT NULL,
      createdAt INTEGER NOT NULL,
      expiresAt INTEGER NOT NULL
    )
  `);

  // Check if admin exists, if not seed default
  const adminCount = await getQuery('SELECT COUNT(*) as count FROM admins');
  if (adminCount.count === 0) {
    console.log('🛡️ Creating initial secure Admin credentials...');
    const { hash, salt } = hashPassword('chikora@2025');
    await runQuery(
      'INSERT INTO admins (username, passwordHash, salt) VALUES (?, ?, ?)',
      ['admin', hash, salt]
    );
    console.log('✅ Default Admin created: Username="admin", Password="chikora@2025"');
  }

  console.log('✅ SQLite Schema initialized.');
};
