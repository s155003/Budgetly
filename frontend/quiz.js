import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { CheckCircle, XCircle, RotateCcw, ArrowRight, Brain } from 'lucide-react'
import { api } from './utils/api'

export default function Quiz() {
  const router = useRouter()
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const [topic, setTopic] = useState('budgeting')
  const [difficulty, setDifficulty] = useState('beginner')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    generateQuiz()
  }, [router])

  const generateQuiz = async () => {
    try {
      setLoading(true)
      const response = await api.ai.generateQuiz({
        topic,
        difficulty_level: difficulty,
        num_questions: 5
      })
      setQuestions(response.data.questions)
    } catch (error) {
      console.error('Error generating quiz:', error)
      // Fallback to mock questions
      setQuestions(getMockQuestions())
    } finally {
      setLoading(false)
    }
  }

  const getMockQuestions = () => [
    {
      question: "What is the recommended percentage of your income to save?",
      options: ["A) 5-10%", "B) 10-20%", "C) 20-30%", "D) 30-50%"],
      correct_answer: "B",
      explanation: "Financial experts recommend saving 10-20% of your income for long-term financial health."
    },
    {
      question: "What is an emergency fund?",
      options: ["A) Money for vacations", "B) 3-6 months of expenses saved", "C) Investment money", "D) Credit card limit"],
      correct_answer: "B",
      explanation: "An emergency fund is 3-6 months of living expenses saved for unexpected situations."
    },
    {
      question: "What is compound interest?",
      options: ["A) Interest on loans only", "B) Interest earned on both principal and accumulated interest", "C) Fixed interest rate", "D) Interest paid monthly"],
      correct_answer: "B",
      explanation: "Compound interest is interest calculated on the initial principal and accumulated interest from previous periods."
    },
    {
      question: "What is the 50/30/20 rule?",
      options: ["A) 50% needs, 30% wants, 20% savings", "B) 50% savings, 30% needs, 20% wants", "C) 50% wants, 30% savings, 20% needs", "D) 50% debt, 30% savings, 20% needs"],
      correct_answer: "A",
      explanation: "The 50/30/20 rule suggests allocating 50% to needs, 30% to wants, and 20% to savings and debt repayment."
    },
    {
      question: "What is a credit score range?",
      options: ["A) 0-100", "B) 100-500", "C) 300-850", "D) 500-1000"],
      correct_answer: "C",
      explanation: "Credit scores typically range from 300 to 850, with higher scores indicating better creditworthiness."
    }
  ]

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return

    const isCorrect = selectedAnswer === questions[currentQuestion].correct_answer
    if (isCorrect) {
      setScore(score + 1)
    }

    setShowResult(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer('')
      setShowResult(false)
    } else {
      setQuizComplete(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer('')
    setShowResult(false)
    setScore(0)
    setQuizComplete(false)
    generateQuiz()
  }

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100
    if (percentage >= 80) return "Excellent! You're a financial whiz! 🎉"
    if (percentage >= 60) return "Good job! You're on the right track! 👍"
    if (percentage >= 40) return "Not bad! Keep learning! 📚"
    return "Keep studying! You'll get there! 💪"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating quiz questions...</p>
        </div>
      </div>
    )
  }

  if (quizComplete) {
    return (
      <div>
        <Head>
          <title>Quiz Complete - Budgetly</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-10 w-10 text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
              <p className="text-gray-600">Here's how you did</p>
            </div>

            <div className="mb-8">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {score}/{questions.length}
              </div>
              <div className="text-lg text-gray-600 mb-4">
                {Math.round((score / questions.length) * 100)}% Correct
              </div>
              <p className="text-gray-700">{getScoreMessage()}</p>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={handleRestart}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 flex items-center"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </button>
              <button
                onClick={() => router.push('/lessons')}
                className="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300 flex items-center"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Back to Lessons
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>Financial Quiz - Budgetly</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {questions[currentQuestion]?.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {questions[currentQuestion]?.options.map((option, index) => {
              const optionLetter = option.split(')')[0]
              const optionText = option.split(') ')[1]
              const isSelected = selectedAnswer === optionLetter
              const isCorrect = optionLetter === questions[currentQuestion].correct_answer
              
              let optionClass = "w-full p-4 text-left border rounded-lg transition-colors cursor-pointer "
              
              if (showResult) {
                if (isCorrect) {
                  optionClass += "border-green-500 bg-green-50 text-green-900"
                } else if (isSelected && !isCorrect) {
                  optionClass += "border-red-500 bg-red-50 text-red-900"
                } else {
                  optionClass += "border-gray-200 bg-gray-50 text-gray-500"
                }
              } else {
                optionClass += isSelected 
                  ? "border-primary-500 bg-primary-50 text-primary-900"
                  : "border-gray-200 hover:border-primary-300 hover:bg-primary-50"
              }

              return (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswerSelect(optionLetter)}
                  disabled={showResult}
                  className={optionClass}
                >
                  <div className="flex items-center">
                    {showResult && isCorrect && (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="h-5 w-5 text-red-600 mr-3" />
                    )}
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Explanation:</h3>
              <p className="text-blue-800">{questions[currentQuestion].explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            <div className="text-sm text-gray-600">
              Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
            </div>
            <div className="flex space-x-3">
              {!showResult ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 flex items-center"
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

