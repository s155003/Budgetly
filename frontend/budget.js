import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import ChartWidget from './components/ChartWidget'
import { 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Target,
  Calendar,
  Filter
} from 'lucide-react'
import { api } from './utils/api'

export default function Budget() {
  const router = useRouter()
  const [budget, setBudget] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [goals, setGoals] = useState([])
  const [summary, setSummary] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    category_id: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [newGoal, setNewGoal] = useState({
    name: '',
    target_amount: '',
    target_date: ''
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    loadBudgetData()
  }, [router])

  const loadBudgetData = async () => {
    try {
      setLoading(true)
      
      // Load budget
      const budgetResponse = await api.budget.get()
      setBudget(budgetResponse.data.budget)

      // Load transactions
      const transactionsResponse = await api.budget.getTransactions({ limit: 20 })
      setTransactions(transactionsResponse.data.transactions)

      // Load goals
      const goalsResponse = await api.budget.getGoals()
      setGoals(goalsResponse.data.goals)

      // Load categories
      const categoriesResponse = await api.budget.getCategories()
      setCategories(categoriesResponse.data.categories)

      // Load monthly summary
      const currentDate = new Date()
      const summaryResponse = await api.budget.getSummary(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      )
      setSummary(summaryResponse.data.summary)
    } catch (error) {
      console.error('Error loading budget data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTransaction = async (e) => {
    e.preventDefault()
    try {
      await api.budget.addTransaction(newTransaction)
      setNewTransaction({
        category_id: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      })
      setShowAddTransaction(false)
      loadBudgetData()
    } catch (error) {
      console.error('Error adding transaction:', error)
    }
  }

  const handleAddGoal = async (e) => {
    e.preventDefault()
    try {
      await api.budget.createGoal(newGoal)
      setNewGoal({
        name: '',
        target_amount: '',
        target_date: ''
      })
      setShowAddGoal(false)
      loadBudgetData()
    } catch (error) {
      console.error('Error adding goal:', error)
    }
  }

  const getTotalExpenses = () => {
    if (!summary) return 0
    return summary
      .filter(item => item.type === 'expense')
      .reduce((total, item) => total + parseFloat(item.total_amount), 0)
  }

  const getTotalIncome = () => {
    if (!summary) return 0
    return summary
      .filter(item => item.type === 'income')
      .reduce((total, item) => total + parseFloat(item.total_amount), 0)
  }

  const getExpenseChartData = () => {
    if (!summary) return []
    return summary
      .filter(item => item.type === 'expense')
      .map(item => ({
        name: item.category_name,
        value: parseFloat(item.total_amount)
      }))
  }

  const getIncomeChartData = () => {
    if (!summary) return []
    return summary
      .filter(item => item.type === 'income')
      .map(item => ({
        name: item.category_name,
        value: parseFloat(item.total_amount)
      }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading budget data...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>Budget - Budgetly</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budget Management</h1>
            <p className="text-gray-600 mt-2">Track your income, expenses, and savings goals</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddTransaction(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </button>
            <button
              onClick={() => setShowAddGoal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Target className="h-4 w-4 mr-2" />
              Add Goal
            </button>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Income</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${budget?.monthly_income?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${getTotalExpenses().toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Net Income</p>
                <p className={`text-2xl font-bold ${getTotalIncome() - getTotalExpenses() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${(getTotalIncome() - getTotalExpenses()).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartWidget
            type="pie"
            data={getExpenseChartData()}
            title="Expense Breakdown"
          />
          <ChartWidget
            type="pie"
            data={getIncomeChartData()}
            title="Income Sources"
          />
        </div>

        {/* Recent Transactions and Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${transaction.category_type === 'income' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description || transaction.category_name}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.category_type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.category_type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.category_name}</p>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No transactions yet</p>
                  <button
                    onClick={() => setShowAddTransaction(true)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
                  >
                    Add your first transaction
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Savings Goals */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Savings Goals</h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {goals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{goal.name}</h4>
                    <span className="text-sm text-gray-500">
                      ${goal.current_amount?.toLocaleString() || '0'} / ${goal.target_amount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((goal.current_amount / goal.target_amount) * 100, 100)}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{Math.round((goal.current_amount / goal.target_amount) * 100)}% complete</span>
                    {goal.target_date && (
                      <span>Target: {new Date(goal.target_date).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
              {goals.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No savings goals yet</p>
                  <button
                    onClick={() => setShowAddGoal(true)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
                  >
                    Create your first goal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Transaction Modal */}
        {showAddTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Transaction</h3>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    className="form-input"
                    placeholder="What was this for?"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select
                    value={newTransaction.category_id}
                    onChange={(e) => setNewTransaction({...newTransaction, category_id: e.target.value})}
                    className="form-input"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    className="form-input"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddTransaction(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Add Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Goal Modal */}
        {showAddGoal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Savings Goal</h3>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <label className="form-label">Goal Name</label>
                  <input
                    type="text"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                    className="form-input"
                    placeholder="e.g., Emergency Fund"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Target Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newGoal.target_amount}
                    onChange={(e) => setNewGoal({...newGoal, target_amount: e.target.value})}
                    className="form-input"
                    placeholder="1000.00"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Target Date (Optional)</label>
                  <input
                    type="date"
                    value={newGoal.target_date}
                    onChange={(e) => setNewGoal({...newGoal, target_date: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddGoal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Create Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
