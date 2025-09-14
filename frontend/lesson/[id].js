import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ArrowLeft, ArrowRight, CheckCircle, Lightbulb, BookOpen } from 'lucide-react'
import { api } from '../utils/api'

export default function Lesson() {
  const router = useRouter()
  const { id } = router.query
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showHint, setShowHint] = useState(false)
  const [hint, setHint] = useState('')
  const [userQuestion, setUserQuestion] = useState('')
  const [loadingHint, setLoadingHint] = useState(false)

  // Mock lesson data - in real app, this would come from API
  const mockLessons = {
    1: {
      id: 1,
      title: 'Budgeting Basics',
      content: `
        <h2>What is a Budget?</h2>
        <p>A budget is a plan for your money. It helps you track how much money you earn and how much you spend. Think of it as a roadmap for your finances.</p>
        
        <h3>Why is Budgeting Important?</h3>
        <ul>
          <li><strong>Control your spending:</strong> Know where every dollar goes</li>
          <li><strong>Save for goals:</strong> Set aside money for things you want</li>
          <li><strong>Avoid debt:</strong> Don't spend more than you earn</li>
          <li><strong>Reduce stress:</strong> Feel confident about your finances</li>
        </ul>
        
        <h3>The 50/30/20 Rule</h3>
        <p>This is a simple way to divide your income:</p>
        <ul>
          <li><strong>50% for Needs:</strong> Housing, food, utilities, transportation</li>
          <li><strong>30% for Wants:</strong> Entertainment, dining out, hobbies</li>
          <li><strong>20% for Savings:</strong> Emergency fund, retirement, goals</li>
        </ul>
        
        <h3>Getting Started</h3>
        <p>1. List all your income sources</p>
        <p>2. Track your expenses for a month</p>
        <p>3. Categorize your spending</p>
        <p>4. Create your budget plan</p>
        <p>5. Review and adjust monthly</p>
      `,
      category: 'budgeting',
      difficulty_level: 'beginner',
      order_index: 1
    },
    2: {
      id: 2,
      title: 'Emergency Fund Essentials',
      content: `
        <h2>What is an Emergency Fund?</h2>
        <p>An emergency fund is money set aside specifically for unexpected expenses. It's your financial safety net when life throws you a curveball.</p>
        
        <h3>Why You Need One</h3>
        <ul>
          <li><strong>Job loss:</strong> Cover expenses while looking for work</li>
          <li><strong>Medical emergencies:</strong> Unexpected health costs</li>
          <li><strong>Car repairs:</strong> Keep you mobile for work</li>
          <li><strong>Home repairs:</strong> Fix urgent problems</li>
        </ul>
        
        <h3>How Much to Save</h3>
        <p><strong>Beginner:</strong> $1,000 (starter emergency fund)</p>
        <p><strong>Intermediate:</strong> 3 months of expenses</p>
        <p><strong>Advanced:</strong> 6 months of expenses</p>
        
        <h3>Where to Keep It</h3>
        <ul>
          <li><strong>High-yield savings account:</strong> Easy access, earns interest</li>
          <li><strong>Money market account:</strong> Slightly higher interest</li>
          <li><strong>Separate checking account:</strong> Keep it separate from daily spending</li>
        </ul>
        
        <h3>Building Your Fund</h3>
        <p>1. Start small - even $25 per week adds up</p>
        <p>2. Automate your savings</p>
        <p>3. Use windfalls (tax refunds, bonuses)</p>
        <p>4. Cut one expense and save the difference</p>
      `,
      category: 'saving',
      difficulty_level: 'beginner',
      order_index: 2
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    if (id) {
      loadLesson()
    }
  }, [id, router])

  const loadLesson = async () => {
    try {
      setLoading(true)
      // In real app, fetch from API
      setLesson(mockLessons[id])
    } catch (error) {
      console.error('Error loading lesson:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGetHint = async () => {
    if (!userQuestion.trim()) return

    try {
      setLoadingHint(true)
      const response = await api.ai.getLessonHint({
        lesson_content: lesson.content,
        user_question: userQuestion,
        difficulty_level: lesson.difficulty_level
      })
      setHint(response.data.hint)
      setShowHint(true)
    } catch (error) {
      console.error('Error getting hint:', error)
      setHint("I'm sorry, I couldn't generate a hint right now. Try asking a specific question about the lesson content.")
      setShowHint(true)
    } finally {
      setLoadingHint(false)
    }
  }

  const handleCompleteLesson = () => {
    // In real app, mark lesson as completed
    alert('Lesson completed! Great job!')
    router.push('/lessons')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
          <p className="text-gray-600 mb-4">The lesson you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/lessons')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>{lesson.title} - Budgetly</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/lessons')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Lessons
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                  {lesson.category}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  {lesson.difficulty_level}
                </span>
              </div>
            </div>
            <button
              onClick={handleCompleteLesson}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Lesson
            </button>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        </div>

        {/* AI Help Section */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Lightbulb className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-blue-900">Need Help?</h3>
          </div>
          <p className="text-blue-800 mb-4">
            Ask a question about this lesson and get personalized help from our AI tutor.
          </p>
          
          <div className="space-y-4">
            <div>
              <textarea
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="What would you like to know about this lesson?"
                className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
            
            <button
              onClick={handleGetHint}
              disabled={!userQuestion.trim() || loadingHint}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loadingHint ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Getting Hint...
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Get AI Hint
                </>
              )}
            </button>
          </div>

          {showHint && hint && (
            <div className="mt-4 p-4 bg-white border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">AI Tutor Response:</h4>
              <p className="text-blue-800">{hint}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => router.push('/lessons')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Lessons
          </button>
          
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/quiz')}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 flex items-center"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Take Quiz
            </button>
            <button
              onClick={handleCompleteLesson}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

