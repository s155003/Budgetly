const { getDatabase } = require('./database');

class Budget {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.monthly_income = data.monthly_income;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async create(userId, monthlyIncome) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO budgets (user_id, monthly_income)
        VALUES (?, ?)
      `;
      
      db.run(sql, [userId, monthlyIncome], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(new Budget({
            id: this.lastID,
            user_id: userId,
            monthly_income: monthlyIncome,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));
        }
      });
    });
  }

  static async findByUserId(userId) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM budgets WHERE user_id = ? ORDER BY created_at DESC LIMIT 1';
      
      db.get(sql, [userId], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(new Budget(row));
        } else {
          resolve(null);
        }
      });
    });
  }

  static async update(userId, monthlyIncome) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE budgets 
        SET monthly_income = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `;
      
      db.run(sql, [monthlyIncome, userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }

  static async getMonthlySummary(userId, year, month) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          c.type,
          c.name as category_name,
          SUM(t.amount) as total_amount,
          COUNT(t.id) as transaction_count
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = ? 
          AND strftime('%Y', t.date) = ? 
          AND strftime('%m', t.date) = ?
        GROUP BY c.type, c.name
        ORDER BY c.type, total_amount DESC
      `;
      
      db.all(sql, [userId, year.toString(), month.toString().padStart(2, '0')], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = Budget;

