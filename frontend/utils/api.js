import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth endpoints
  auth: {
    register: (userData) => apiClient.post('/auth/register', userData),
    login: (credentials) => apiClient.post('/auth/login', credentials),
    getProfile: () => apiClient.get('/auth/profile'),
    updateProfile: (userData) => apiClient.put('/auth/profile', userData),
  },

  // Budget endpoints
  budget: {
    create: (budgetData) => apiClient.post('/budget', budgetData),
    get: () => apiClient.get('/budget'),
    update: (budgetData) => apiClient.put('/budget', budgetData),
    getSummary: (year, month) => apiClient.get(`/budget/summary?year=${year}&month=${month}`),
    addTransaction: (transactionData) => apiClient.post('/budget/transactions', transactionData),
    getTransactions: (params = {}) => apiClient.get('/budget/transactions', { params }),
    createGoal: (goalData) => apiClient.post('/budget/goals', goalData),
    getGoals: () => apiClient.get('/budget/goals'),
    getCategories: () => apiClient.get('/budget/categories'),
  },

  // AI endpoints
  ai: {
    getAdvice: (data) => apiClient.post('/ai/advice', data),
    getLessonHint: (data) => apiClient.post('/ai/lesson-hint', data),
    generateQuiz: (data) => apiClient.post('/ai/quiz-questions', data),
  },

  // Health check
  health: () => apiClient.get('/health'),
};

export default apiClient;
