import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { MainLayout } from '@/components/layout/MainLayout'
import { Login } from '@/pages/Login'
import { Signup } from '@/pages/Signup'
import { Home } from '@/pages/Home'
import { Stories } from '@/pages/Stories'
import { Snaps } from '@/pages/Snaps'
import { Status } from '@/pages/Status'
import { Archive } from '@/pages/Archive'
import { Profile } from '@/pages/Profile'
import { motion, AnimatePresence } from 'framer-motion'

import { Toaster } from '@/components/ui/Toaster'

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-2xl"
        />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function App() {
  const { setUser } = useAuthStore()

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  return (
    <>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Home />} />
              <Route path="stories" element={<Stories />} />
              <Route path="snaps" element={<Snaps />} />
              <Route path="status" element={<Status />} />
              <Route path="archive" element={<Archive />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
      <Toaster />
    </>
  )
}

export default App
