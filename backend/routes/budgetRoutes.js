const express = require('express');
const {
  createBudget,
  getBudget,
  updateBudget,
  getMonthlySummary,
  addTransaction,
  getTransactions,
  createSavingsGoal,
  getSavingsGoals,
  getCategories
} = require('../controllers/budgetController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All budget routes require authentication
router.use(authenticateToken);

// Budget management
router.post('/', createBudget);
router.get('/', getBudget);
router.put('/', updateBudget);

// Transactions
router.post('/transactions', addTransaction);
router.get('/transactions', getTransactions);

// Monthly summary
router.get('/summary', getMonthlySummary);

// Savings goals
router.post('/goals', createSavingsGoal);
router.get('/goals', getSavingsGoals);

// Categories
router.get('/categories', getCategories);

module.exports = router;
