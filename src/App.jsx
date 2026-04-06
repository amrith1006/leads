import React, { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import PublicUpload from './pages/PublicUpload'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  // Listen for navigation changes
  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Check login state on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('ceo_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsLoggedIn(true)
    }
    setInitializing(false)
  }, [])

  const handleLogin = (userData) => {
    setIsLoggedIn(true)
    setUser(userData)
    localStorage.setItem('ceo_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    localStorage.removeItem('ceo_user')
  }

  if (initializing) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400">Loading Dashboard...</div>
  }

  // Standalone Public Upload Route
  if (currentPath === '/upload') {
    return <PublicUpload />
  }

  return (
    <div className="min-h-screen">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App
