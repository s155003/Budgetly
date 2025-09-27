import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import GameificationBadge from './components/GameificationBadge'
import { Trophy, Award, Target, Star } from 'lucide-react'

export default function Achievements() {
  const router = useRouter()
  const [achievements, setAchievements] = useState([])
  const [userStats, setUserStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    loadAchievements()
  }, [router])

  const loadAchievements = async () => {
    try {
      setLoading(true)
      
      // Mock achievements data - in real app, this would come from API
      const mockAchievements = [
        {
          id: 1,
          type: 'first_lesson',
          title: 'First Steps',
          description: 'Complete your first lesson',
          earned: true,
          earnedAt: '2024-01-15'
        },
        {
          id: 2,
          type: 'quiz_master',
          title: 'Quiz Master',
          description: 'Score 100% on any quiz',
          earned: false,
          progress: 75
        },
        {
          id: 3,
          type: 'saver',
          title: 'Smart Saver',
          description: 'Create your first savings goal',
          earned: true,
          earnedAt: '2024-01-20'
        },
        {
          id: 4,
          type: 'streak',
          title: 'Learning Streak',
          description: 'Complete lessons 7 days in a row',
          earned: false,
          progress: 40
        },
        {
          id: 5,
          type: 'completion',
          title: 'Course Complete',
          description: 'Complete all beginner lessons',
          earned: false,
          progress: 60
        }
      ]

      setAchievements(mockAchievements)
      setUserStats({
        totalXp: 450,
        level: 3,
        completedLessons: 6,
        completedQuizzes: 3,
        earnedBadges: mockAchievements.filter(a => a.earned).length
      })
    } catch (error) {
      console.error('Error loading achievements:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading achievements...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>Achievements - Budgetly</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Achievements</h1>
          <p className="text-gray-600">
            Track your progress and unlock badges as you learn
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{userStats.level}</div>
            <div className="text-sm text-gray-600">Current Level</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{userStats.totalXp}</div>
            <div className="text-sm text-gray-600">Total XP</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{userStats.earnedBadges}</div>
            <div className="text-sm text-gray-600">Badges Earned</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{userStats.completedLessons}</div>
            <div className="text-sm text-gray-600">Lessons Complete</div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Achievement Badges</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <GameificationBadge
                key={achievement.id}
                type={achievement.type}
                title={achievement.title}
                description={achievement.description}
                earned={achievement.earned}
                progress={achievement.progress}
              />
            ))}
          </div>
        </div>

        {/* Next Goals */}
        <div className="mt-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">Next Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Complete 3 More Lessons</h3>
              <p className="text-primary-100 text-sm">Unlock the "Dedicated Learner" badge</p>
              <div className="mt-2 w-full bg-primary-500 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Score 100% on a Quiz</h3>
              <p className="text-primary-100 text-sm">Unlock the "Quiz Master" badge</p>
              <div className="mt-2 w-full bg-primary-500 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}