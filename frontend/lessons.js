import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import LessonCard from './components/LessonCard'
import { 
  BookOpen, 
  Filter, 
  Search, 
  Trophy,
  Clock,
  CheckCircle2
} from 'lucide-react'

export default function Lessons() {
  const router = useRouter()
  const [lessons, setLessons] = useState([])
  const [filteredLessons, setFilteredLessons] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [userProgress, setUserProgress] = useState({})
  const [loading, setLoading] = useState(true)

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'budgeting', label: 'Budgeting' },
    { value: 'saving', label: 'Saving' },
    { value: 'investing', label: 'Investing' },
    { value: 'debt', label: 'Debt Management' },
    { value: 'retirement', label: 'Retirement' }
  ]

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ]

  // Mock lessons data - in real app, this would come from API
  const mockLessons = [
    {
      id: 1,
      title: 'Budgeting Basics',
      content: 'Learn the fundamentals of creating and maintaining a personal budget. Understand income vs expenses, tracking spending, and setting financial goals.',
      category: 'budgeting',
      difficulty_level: 'beginner',
      order_index: 1,
      estimated_time: 10
    },
    {
      id: 2,
      title: 'Emergency Fund Essentials',
      content: 'Discover why emergency funds are crucial and how to build one. Learn about the 3-6 month rule and where to keep your emergency savings.',
      category: 'saving',
      difficulty_level: 'beginner',
      order_index: 2,
      estimated_time: 8
    },
    {
      id: 3,
      title: 'Understanding Credit Scores',
      content: 'Master the basics of credit scores, how they work, and how to improve them. Learn about credit reports and building credit history.',
      category: 'debt',
      difficulty_level: 'intermediate',
      order_index: 3,
      estimated_time: 12
    },
    {
      id: 4,
      title: 'Introduction to Investing',
      content: 'Get started with investing basics. Learn about stocks, bonds, mutual funds, and how to begin building an investment portfolio.',
      category: 'investing',
      difficulty_level: 'intermediate',
      order_index: 4,
      estimated_time: 15
    },
    {
      id: 5,
      title: 'Retirement Planning 101',
      content: 'Plan for your future with retirement savings strategies. Learn about 401(k)s, IRAs, and compound interest.',
      category: 'retirement',
      difficulty_level: 'intermediate',
      order_index: 5,
      estimated_time: 18
    },
    {
      id: 6,
      title: 'Advanced Portfolio Management',
      content: 'Dive deep into portfolio diversification, risk management, and advanced investment strategies for experienced investors.',
      category: 'investing',
      difficulty_level: 'advanced',
      order_index: 6,
      estimated_time: 25
    }
  ]

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    loadLessons()
  }, [router])

  const loadLessons = async () => {
    try {
      setLoading(true)
      // In real app, fetch from API
      setLessons(mockLessons)
      setFilteredLessons(mockLessons)
      
      // Mock user progress
      setUserProgress({
        1: { completed: true, score: 85 },
        2: { completed: false, score: null, progress: 60 },
        3: { completed: false, score: null, progress: 0 }
      })
    } catch (error) {
      console.error('Error loading lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    filterLessons()
  }, [searchTerm, selectedCategory, selectedDifficulty, lessons])

  const filterLessons = () => {
    let filtered = lessons

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(lesson => lesson.category === selectedCategory)
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(lesson => lesson.difficulty_level === selectedDifficulty)
    }

    setFilteredLessons(filtered)
  }

  const getCompletedCount = () => {
    return Object.values(userProgress).filter(progress => progress.completed).length
  }

  const getTotalLessons = () => {
    return lessons.length
  }

  const handleStartLesson = (lesson) => {
    router.push(`/lesson/${lesson.id}`)
  }

  const handleContinueLesson = (lesson) => {
    router.push(`/lesson/${lesson.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lessons...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>Lessons - Budgetly</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Lessons</h1>
          <p className="text-gray-600">
            Learn at your own pace with interactive lessons and quizzes
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Your Learning Progress</h2>
              <p className="text-primary-100">
                {getCompletedCount()} of {getTotalLessons()} lessons completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {Math.round((getCompletedCount() / getTotalLessons()) * 100)}%
              </div>
              <div className="text-primary-100">Complete</div>
            </div>
          </div>
          <div className="mt-4 w-full bg-primary-500 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(getCompletedCount() / getTotalLessons()) * 100}%` }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => {
            const progress = userProgress[lesson.id]
            const isCompleted = progress?.completed || false
            const progressPercent = progress?.progress || 0
            const isLocked = lesson.order_index > 1 && !userProgress[lesson.order_index - 1]?.completed

            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                isCompleted={isCompleted}
                isLocked={isLocked}
                progress={progressPercent}
                onStart={handleStartLesson}
                onContinue={handleContinueLesson}
              />
            )
          })}
        </div>

        {/* No Results */}
        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

