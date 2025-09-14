const bcrypt = require('bcryptjs');
const { getDatabase } = require('./database');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password_hash = data.password_hash;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async create(userData) {
    const db = getDatabase();
    const { email, password, first_name, last_name } = userData;
    
    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO users (email, password_hash, first_name, last_name)
        VALUES (?, ?, ?, ?)
      `;
      
      db.run(sql, [email, password_hash, first_name, last_name], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(new User({
            id: this.lastID,
            email,
            password_hash,
            first_name,
            last_name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));
        }
      });
    });
  }

  static async findByEmail(email) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';
      
      db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(new User(row));
        } else {
          resolve(null);
        }
      });
    });
  }

  static async findById(id) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE id = ?';
      
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(new User(row));
        } else {
          resolve(null);
        }
      });
    });
  }

  async validatePassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  toJSON() {
    const { password_hash, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User;

