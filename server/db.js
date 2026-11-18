import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

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
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

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
    const seedCats = [
      { id: 'all', nameEn: 'All Items', nameKu: 'هەموو خواردنەکان', nameAr: 'جميع الأصناف', icon: 'Flame', sortOrder: 0 },
      { id: 'chikora', nameEn: 'Chikora', nameKu: 'چیکۆرا', nameAr: 'تشيكورا', icon: 'Drumstick', sortOrder: 1 },
      { id: 'drinks', nameEn: 'Beverages', nameKu: 'خواردنەوە', nameAr: 'مشروبات', icon: 'Coffee', sortOrder: 2 },
    ];
    for (const c of seedCats) {
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
    const seedItems = [
      {
        id: 'chik-01',
        name: 'Roasted chikora',
        nameKu: 'چیکۆرا برژاو',
        nameAr: 'تشيكورا مشوي',
        category: 'chikora',
        price: 15000,
        tag: 'Best Seller',
        isSpicy: 0,
        inStock: 1,
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80',
        description: 'Roasted chicken feast served with 2 types of stew/soup, 3 types of rice, 3 special sauces, and bread.',
        descriptionKu: 'پێکهاتووە لە مریشکێکی برژاو، ۲ جۆر شلە، ۳ جۆر برنج، ۳ جۆر سۆسی تایبەت، نان',
        descriptionAr: 'وجبة دجاج مشوي مع نوعين مرق، 3 أنواع أرز، 3 صلصات خاصة، وخبز.'
      },
      {
        id: 'chik-02',
        name: 'Mandi Chikora',
        nameKu: 'چیکۆرا ماندی',
        nameAr: 'تشيكورا مندي',
        category: 'chikora',
        price: 15000,
        tag: 'Best Seller',
        isSpicy: 0,
        inStock: 1,
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
        description: 'Tender mandi chicken meal with 2 stews, authentic mandi rice, 3 signature dips, and warm bread.',
        descriptionKu: 'پێکهاتووە لە مریشکێکی مەندی، ۲ جۆر شلە، برنجی مەندی، ۳ جۆر سۆسی تایبەت، نان',
        descriptionAr: 'وجبة دجاج مندي مع نوعين مرق، رز مندي أصيل، 3 صلصات، وخبز.'
      },
      {
        id: 'chik-03',
        name: 'Vegetable Chikora',
        nameKu: 'چیکۆرا بە سەوزە',
        nameAr: 'تشيكورا بالخضار',
        category: 'chikora',
        price: 180000,
        tag: 'Best Seller',
        isSpicy: 0,
        inStock: 1,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        description: 'Whole chicken with steamed seasonal vegetables, 3 rice varieties, 3 special dips, and fresh bread.',
        descriptionKu: 'پێکهاتووە لە مریشکێک، سەوزەی کوڵاو، ۳ جۆر برنج، ۳ جۆر سۆسی تایبەت، نان',
        descriptionAr: 'دجاج كامل مع خضار مسلوقة، 3 أنواع أرز، 3 صلصات مميزة، وخبز طازج.'
      },
      {
        id: 'chik-04',
        name: 'Spicy Chikora',
        nameKu: 'چیکۆراى تیژ',
        nameAr: 'تشيكورا حار',
        category: 'chikora',
        price: 18000,
        tag: 'Spicy',
        isSpicy: 1,
        inStock: 1,
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
        description: 'Fiery marinated spicy whole chicken served with cooked vegetables, 3 types of rice, and special spicy dips.',
        descriptionKu: 'پێکهاتووە لە مریشکێک بە سۆسی تیژ، سەوزەی کوڵاو، ۳ جۆر برنج، ۳ جۆر سۆسی تایبەت',
        descriptionAr: 'دجاج متبل بصلصة حارة مع خضار، 3 أنواع أرز، وصلصات حارة خاصة.'
      },
      {
        id: 'drink-01',
        name: 'Water',
        nameKu: 'ئاو',
        nameAr: 'ماء',
        category: 'drinks',
        price: 500,
        tag: '',
        isSpicy: 0,
        inStock: 1,
        image: 'https://images.unsplash.com/photo-1559839914-ba2ac5a7c6a0?auto=format&fit=crop&w=800&q=80',
        description: 'Pure cold mineral water.',
        descriptionKu: 'ئاوی پاکی کانزایی سارد.',
        descriptionAr: 'مياه معدنية نقية وباردة.'
      },
      {
        id: 'drink-02',
        name: 'Coca Cola',
        nameKu: 'كۆلا',
        nameAr: 'كوكاكولا',
        category: 'drinks',
        price: 1000,
        tag: '',
        isSpicy: 0,
        inStock: 1,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
        description: 'Ice-cold refreshing Coca-Cola can.',
        descriptionKu: 'قوتووی کۆلای سارد و بەتام.',
        descriptionAr: 'علبة كوكاكولا مثلجة ومنعشة.'
      },
      {
        id: 'drink-03',
        name: 'Pepsi',
        nameKu: 'بیپسی',
        nameAr: 'بيبسي',
        category: 'drinks',
        price: 1000,
        tag: '',
        isSpicy: 0,
        inStock: 1,
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
        description: 'Cold carbonated Pepsi can.',
        descriptionKu: 'قوتووی بیپسی سارد.',
        descriptionAr: 'علبة بيبسي غازية وباردة.'
      }
    ];

    for (const item of seedItems) {
      await runQuery(
        `INSERT INTO items (
          id, name, nameKu, nameAr, category, price, image, description, descriptionKu, descriptionAr, tag, isSpicy, inStock
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.name,
          item.nameKu,
          item.nameAr,
          item.category,
          item.price,
          item.image,
          item.description,
          item.descriptionKu,
          item.descriptionAr,
          item.tag,
          item.isSpicy,
          item.inStock
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
