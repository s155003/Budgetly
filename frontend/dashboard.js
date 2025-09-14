import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import ChartWidget from './components/ChartWidget'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertCircle,
  Plus,
  Eye
} from 'lucide-react'
import { api } from './utils/api'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [budget, setBudget] = useState(null)
  const [summary, setSummary] = useState(null)
  const [goals, setGoals] = useState([])
  const [aiAdvice, setAiAdvice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
    loadDashboardData()
  }, [router])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load budget data
      const budgetResponse = await api.budget.get()
      setBudget(budgetResponse.data.budget)

      // Load monthly summary
      const currentDate = new Date()
      const summaryResponse = await api.budget.getSummary(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      )
      setSummary(summaryResponse.data.summary)

      // Load savings goals
      const goalsResponse = await api.budget.getGoals()
      setGoals(goalsResponse.data.goals)

      // Get AI advice
      if (budgetResponse.data.budget && summaryResponse.data.summary) {
        const adviceResponse = await api.ai.getAdvice({
          budget_data: budgetResponse.data.budget,
          spending_data: summaryResponse.data.summary,
          goals: goalsResponse.data.goals
        })
        setAiAdvice(adviceResponse.data.advice)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
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

  const getNetIncome = () => {
    return getTotalIncome() - getTotalExpenses()
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

  const getMonthlyTrendData = () => {
    // Mock data for now - in real app, this would come from API
    return [
      { name: 'Jan', value: 3200 },
      { name: 'Feb', value: 2800 },
      { name: 'Mar', value: 3500 },
      { name: 'Apr', value: 3100 },
      { name: 'May', value: 4200 },
      { name: 'Jun', value: 3800 }
    ]
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>Dashboard - Budgetly</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your financial overview for this month
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
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
              <div className={`p-2 rounded-lg ${getNetIncome() >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <TrendingUp className={`h-6 w-6 ${getNetIncome() >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Net Income</p>
                <p className={`text-2xl font-bold ${getNetIncome() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${getNetIncome().toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Savings Goals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {goals.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and AI Advice */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Expense Breakdown */}
          <ChartWidget
            type="pie"
            data={getExpenseChartData()}
            title="Expense Breakdown"
          />

          {/* Monthly Trend */}
          <ChartWidget
            type="line"
            data={getMonthlyTrendData()}
            title="Monthly Net Income Trend"
          />
        </div>

        {/* AI Advice and Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Advice */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-primary-600 mr-2" />
              AI Financial Advice
            </h3>
            {aiAdvice ? (
              <div className="space-y-4">
                {aiAdvice.tips && aiAdvice.tips.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">💡 Tips</h4>
                    <ul className="space-y-1">
                      {aiAdvice.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-primary-600 mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {aiAdvice.encouragement && (
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <p className="text-sm text-primary-800">{aiAdvice.encouragement}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No advice available. Add some transactions to get personalized tips!</p>
            )}
          </div>

          {/* Savings Goals */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Savings Goals</h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                Add Goal
              </button>
            </div>
            {goals.length > 0 ? (
              <div className="space-y-4">
                {goals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{goal.name}</h4>
                      <span className="text-sm text-gray-500">
                        ${goal.current_amount?.toLocaleString() || '0'} / ${goal.target_amount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((goal.current_amount / goal.target_amount) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((goal.current_amount / goal.target_amount) * 100)}% complete
                    </p>
                  </div>
                ))}
                {goals.length > 3 && (
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    View all {goals.length} goals
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No savings goals yet</p>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Create your first goal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

