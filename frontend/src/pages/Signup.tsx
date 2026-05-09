import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/services/supabase'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToastStore } from '@/store/useToastStore'

export const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { addToast } = useToastStore()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      addToast(error.message, 'error')
      setLoading(false)
    } else {
      addToast('Your sanctuary has been created', 'success')
      navigate('/')
    }
  }

  return (
    <AuthLayout 
      title="Create Sanctuary" 
      subtitle="Begin your private journey of expression"
    >
      <form onSubmit={handleSignup} className="space-y-5">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
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
          {loading ? 'Creating...' : 'Begin Journey'}
        </Button>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have a sanctuary?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
