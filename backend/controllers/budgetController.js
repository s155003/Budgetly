const Budget = require('../models/Budget');
const { getDatabase } = require('../models/database');

const createBudget = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { monthly_income } = req.body;

    if (!monthly_income || monthly_income <= 0) {
      return res.status(400).json({ error: 'Monthly income must be a positive number' });
    }

    const budget = await Budget.create(userId, monthly_income);
    res.status(201).json({ message: 'Budget created successfully', budget });
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getBudget = async (req, res) => {
  try {
    const userId = req.user.userId;
    const budget = await Budget.findByUserId(userId);
    
    if (!budget) {
      return res.status(404).json({ error: 'No budget found' });
    }

    res.json({ budget });
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateBudget = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { monthly_income } = req.body;

    if (!monthly_income || monthly_income <= 0) {
      return res.status(400).json({ error: 'Monthly income must be a positive number' });
    }

    const result = await Budget.update(userId, monthly_income);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'No budget found to update' });
    }

    res.json({ message: 'Budget updated successfully' });
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month are required' });
    }

    const summary = await Budget.getMonthlySummary(userId, year, month);
    res.json({ summary });
  } catch (error) {
    console.error('Get monthly summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { category_id, amount, description, date } = req.body;

    if (!category_id || !amount || !date) {
      return res.status(400).json({ error: 'Category, amount, and date are required' });
    }

    const db = getDatabase();
    const sql = `
      INSERT INTO transactions (user_id, category_id, amount, description, date)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(sql, [userId, category_id, amount, description, date], function(err) {
      if (err) {
        console.error('Add transaction error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.status(201).json({ 
        message: 'Transaction added successfully',
        transaction_id: this.lastID
      });
    });
  } catch (error) {
    console.error('Add transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 50, offset = 0, category_id, start_date, end_date } = req.query;

    const db = getDatabase();
    let sql = `
      SELECT t.*, c.name as category_name, c.type as category_type
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
    `;
    const params = [userId];

    if (category_id) {
      sql += ' AND t.category_id = ?';
      params.push(category_id);
    }

    if (start_date) {
      sql += ' AND t.date >= ?';
      params.push(start_date);
    }

    if (end_date) {
      sql += ' AND t.date <= ?';
      params.push(end_date);
    }

    sql += ' ORDER BY t.date DESC, t.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Get transactions error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json({ transactions: rows });
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createSavingsGoal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, target_amount, target_date } = req.body;

    if (!name || !target_amount || target_amount <= 0) {
      return res.status(400).json({ error: 'Name and target amount are required' });
    }

    const db = getDatabase();
    const sql = `
      INSERT INTO savings_goals (user_id, name, target_amount, target_date)
      VALUES (?, ?, ?, ?)
    `;

    db.run(sql, [userId, name, target_amount, target_date], function(err) {
      if (err) {
        console.error('Create savings goal error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.status(201).json({ 
        message: 'Savings goal created successfully',
        goal_id: this.lastID
      });
    });
  } catch (error) {
    console.error('Create savings goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSavingsGoals = async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = getDatabase();
    
    const sql = 'SELECT * FROM savings_goals WHERE user_id = ? ORDER BY created_at DESC';
    
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        console.error('Get savings goals error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json({ goals: rows });
    });
  } catch (error) {
    console.error('Get savings goals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCategories = async (req, res) => {
  try {
    const db = getDatabase();
    
    const sql = 'SELECT * FROM categories WHERE user_id IS NULL ORDER BY type, name';
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Get categories error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json({ categories: rows });
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createBudget,
  getBudget,
  updateBudget,
  getMonthlySummary,
  addTransaction,
  getTransactions,
  createSavingsGoal,
  getSavingsGoals,
  getCategories
};
