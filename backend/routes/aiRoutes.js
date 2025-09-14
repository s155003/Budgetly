const express = require('express');
const {
  getBudgetAdvice,
  getLessonHint,
  generateQuizQuestions
} = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All AI routes require authentication
router.use(authenticateToken);

// AI advice and hints
router.post('/advice', getBudgetAdvice);
router.post('/lesson-hint', getLessonHint);
router.post('/quiz-questions', generateQuizQuestions);

module.exports = router;

