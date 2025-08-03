import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Navbar } from './components/Navbar'
import { HomePage } from './pages/HomePage'
import { SignUpPage } from './pages/SignUpPage'
import { LoginPage } from './pages/LoginPage'
import { Dashboard } from './pages/Dashboard'
import { CreateWebinarPage } from './pages/CreateWebinarPage'
import { EditWebinarPage } from './pages/EditWebinarPage'
import { ExplorePage } from './pages/ExplorePage'
import { WebinarDetailPage } from './pages/WebinarDetailPage'

function AppRoutes() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user exists but no profile, show error state
  if (user && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Setup Required</h2>
          <p className="text-gray-600 mb-4">There was an issue setting up your profile. Please try signing up again.</p>
          <button
            onClick={() => window.location.href = '/signup'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Sign Up
          </button>
        </div>
      </div>
    )
  }
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to={profile?.role === 'contributor' ? '/dashboard' : '/explore'} />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={profile?.role === 'contributor' ? '/dashboard' : '/explore'} />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/webinar/:id" element={<WebinarDetailPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="contributor">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-webinar"
            element={
              <ProtectedRoute requiredRole="contributor">
                <CreateWebinarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-webinar/:id"
            element={
              <ProtectedRoute requiredRole="contributor">
                <EditWebinarPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App