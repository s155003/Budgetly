import { useState, useEffect } from 'react';
import { Brain, Lightbulb, TrendingUp, CircleAlert as AlertCircle, RefreshCw } from 'lucide-react';

const AITipsWidget = ({ budgetData, spendingData, goals, onRefresh }) => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateSmartTips = () => {
    // Smart fallback tips based on actual data
    const smartTips = [];
    
    if (budgetData && spendingData) {
      const totalExpenses = spendingData
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + parseFloat(item.total_amount), 0);
      
      const monthlyIncome = budgetData.monthly_income || 0;
      const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - totalExpenses) / monthlyIncome) * 100 : 0;
      
      if (savingsRate < 10) {
        smartTips.push({
          icon: '💰',
          title: 'Boost Your Savings Rate',
          tip: `You're currently saving ${savingsRate.toFixed(1)}% of your income. Try to reach at least 10% by reducing one discretionary expense.`
        });
      }
      
      if (totalExpenses > monthlyIncome) {
        smartTips.push({
          icon: '⚠️',
          title: 'Spending Alert',
          tip: 'Your expenses exceed your income this month. Review your largest expense categories and identify areas to cut back.'
        });
      }
      
      // Find highest expense category
      const highestExpense = spendingData
        .filter(item => item.type === 'expense')
        .sort((a, b) => parseFloat(b.total_amount) - parseFloat(a.total_amount))[0];
      
      if (highestExpense) {
        smartTips.push({
          icon: '📊',
          title: 'Top Spending Category',
          tip: `${highestExpense.category_name} is your largest expense at $${parseFloat(highestExpense.total_amount).toFixed(2)}. Look for ways to optimize this category.`
        });
      }
    }
    
    // Add general tips if no specific data
    if (smartTips.length === 0) {
      smartTips.push(
        {
          icon: '🎯',
          title: 'Start with the 50/30/20 Rule',
          tip: 'Allocate 50% of income to needs, 30% to wants, and 20% to savings and debt repayment.'
        },
        {
          icon: '🏦',
          title: 'Build an Emergency Fund',
          tip: 'Start with $1,000 as a starter emergency fund, then work toward 3-6 months of expenses.'
        }
      );
    }
    
    return smartTips;
  };

  useEffect(() => {
    setTips(generateSmartTips());
  }, [budgetData, spendingData, goals]);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (onRefresh) {
        await onRefresh();
      }
      setTips(generateSmartTips());
    } catch (err) {
      setError('Failed to refresh tips');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Financial Tips</h3>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-primary-50 rounded-lg">
            <div className="text-2xl">{tip.icon}</div>
            <div className="flex-1">
              <h4 className="font-medium text-primary-900 mb-1">{tip.title}</h4>
              <p className="text-sm text-primary-700">{tip.tip}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 flex items-center">
          <Lightbulb className="h-3 w-3 mr-1" />
          Tips are personalized based on your spending patterns and goals
        </p>
      </div>
    </div>
  );
};

export default AITipsWidget;