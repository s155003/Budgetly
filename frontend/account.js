import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { User, Settings, Key, LogOut, Save } from 'lucide-react'
import { api } from './utils/api'

export default function Account() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  })
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setProfileData({
      first_name: parsedUser.first_name || '',
      last_name: parsedUser.last_name || '',
      email: parsedUser.email || ''
    })
    setLoading(false)
  }, [router])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      await api.auth.updateProfile(profileData)
      setMessage('Profile updated successfully!')
      
      // Update local storage
      const updatedUser = { ...user, ...profileData }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading account...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>Account - Budgetly</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <User className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              </div>

              {message && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                  <p className="text-sm text-green-800">{message}</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      value={profileData.first_name}
                      onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      value={profileData.last_name}
                      onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="form-input bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Account Actions */}
          <div className="space-y-6">
            {/* Account Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member since</span>
                  <span className="font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account status</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last updated</span>
                  <span className="font-medium">
                    {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Preferences</p>
                      <p className="text-sm text-gray-500">Notification and display settings</p>
                    </div>
                  </div>
                </button>

                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Key className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Change Password</p>
                      <p className="text-sm text-gray-500">Update your password</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left p-3 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 text-red-400 mr-3" />
                    <div>
                      <p className="font-medium text-red-900">Sign Out</p>
                      <p className="text-sm text-red-500">Sign out of your account</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-primary-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Need Help?</h3>
              <p className="text-primary-700 text-sm mb-4">
                Have questions about your account or need assistance?
              </p>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

