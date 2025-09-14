import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { DollarSign, BookOpen, BarChart3, Brain, ArrowRight, CheckCircle, Users, TrendingUp } from 'lucide-react'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const features = [
    {
      icon: DollarSign,
      title: 'Smart Budgeting',
      description: 'Track income and expenses with AI-powered insights and recommendations.'
    },
    {
      icon: BookOpen,
      title: 'Interactive Lessons',
      description: 'Learn financial literacy through engaging, adaptive lessons and quizzes.'
    },
    {
      icon: BarChart3,
      title: 'Visual Analytics',
      description: 'See your financial progress with beautiful charts and visualizations.'
    },
    {
      icon: Brain,
      title: 'AI Guidance',
      description: 'Get personalized financial advice powered by advanced AI technology.'
    }
  ]

  const stats = [
    { label: 'Active Users', value: '10,000+' },
    { label: 'Lessons Completed', value: '50,000+' },
    { label: 'Money Saved', value: '$2.5M+' },
    { label: 'Success Rate', value: '94%' }
  ]

  return (
    <div>
      <Head>
        <title>Budgetly - Financial Literacy Made Simple</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Learn money management, budgeting, and investing with AI-powered guidance and interactive lessons." />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master Your Money with
              <span className="block text-yellow-300">Budgetly</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              The financial literacy app that makes budgeting simple, learning engaging, and success achievable for everyday Americans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href="/login"
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Build Financial Confidence
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From budgeting basics to advanced investment strategies, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in minutes and see results in weeks
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Create Your Account
              </h3>
              <p className="text-gray-600">
                Sign up in seconds and set up your financial profile with our guided setup.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Track & Learn
              </h3>
              <p className="text-gray-600">
                Input your income and expenses, then dive into interactive lessons tailored to your needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Achieve Your Goals
              </h3>
              <p className="text-gray-600">
                Watch your financial health improve with AI-powered insights and personalized recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of Americans who are building better financial futures with Budgetly.
          </p>
          {!isLoggedIn && (
            <Link
              href="/register"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Start Your Journey Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
