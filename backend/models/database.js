const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    const dbPath = process.env.DATABASE_URL?.replace('sqlite://', '') || './budgetly.db';
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
      } else {
        console.log('Connected to SQLite database');
        createTables().then(resolve).catch(reject);
      }
    });
  });
};

const createTables = () => {
  return new Promise((resolve, reject) => {
    const tables = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Budgets table
      `CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        monthly_income DECIMAL(10,2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )`,
      
      // Categories table
      `CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )`,
      
      // Transactions table
      `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
      )`,
      
      // Savings goals table
      `CREATE TABLE IF NOT EXISTS savings_goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        target_amount DECIMAL(10,2) NOT NULL,
        current_amount DECIMAL(10,2) DEFAULT 0,
        target_date DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )`,
      
      // Lessons table
      `CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
        category TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // User progress table
      `CREATE TABLE IF NOT EXISTS user_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        lesson_id INTEGER NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        score INTEGER,
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE CASCADE,
        UNIQUE(user_id, lesson_id)
      )`
    ];

    let completed = 0;
    tables.forEach((sql, index) => {
      db.run(sql, (err) => {
        if (err) {
          console.error(`Error creating table ${index + 1}:`, err);
          reject(err);
        } else {
          completed++;
          if (completed === tables.length) {
            console.log('All tables created successfully');
            insertDefaultData().then(resolve).catch(reject);
          }
        }
      });
    });
  });
};

const insertDefaultData = () => {
  return new Promise((resolve, reject) => {
    // Insert default categories
    const defaultCategories = [
      // Income categories
      { name: 'Salary', type: 'income', user_id: null },
      { name: 'Freelance', type: 'income', user_id: null },
      { name: 'Investment', type: 'income', user_id: null },
      { name: 'Other Income', type: 'income', user_id: null },
      
      // Expense categories
      { name: 'Housing', type: 'expense', user_id: null },
      { name: 'Food & Dining', type: 'expense', user_id: null },
      { name: 'Transportation', type: 'expense', user_id: null },
      { name: 'Healthcare', type: 'expense', user_id: null },
      { name: 'Entertainment', type: 'expense', user_id: null },
      { name: 'Shopping', type: 'expense', user_id: null },
      { name: 'Utilities', type: 'expense', user_id: null },
      { name: 'Insurance', type: 'expense', user_id: null },
      { name: 'Education', type: 'expense', user_id: null },
      { name: 'Other Expenses', type: 'expense', user_id: null }
    ];

    const insertCategory = (category) => {
      return new Promise((resolve, reject) => {
        db.run(
          'INSERT OR IGNORE INTO categories (name, type, user_id) VALUES (?, ?, ?)',
          [category.name, category.type, category.user_id],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    };

    // Insert all default categories
    Promise.all(defaultCategories.map(insertCategory))
      .then(() => {
        console.log('Default categories inserted successfully');
        resolve();
      })
      .catch(reject);
  });
};

const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

module.exports = {
  initializeDatabase,
  getDatabase
};
