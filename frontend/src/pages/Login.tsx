import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/services/supabase'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToastStore } from '@/store/useToastStore'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { addToast } = useToastStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      addToast(error.message, 'error')
      setLoading(false)
    } else {
      addToast('Welcome back to your sanctuary', 'success')
      navigate('/')
    }
  }

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to your private sanctuary"
    >
      <form onSubmit={handleLogin} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
            Create Sanctuary
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
