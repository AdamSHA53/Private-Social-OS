import { useEffect, useState, useCallback } from 'react'
import { User, Settings, LogOut, Shield, Heart, Archive, Camera } from 'lucide-react'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { Button } from '@/components/ui/Button'

interface Profile {
  full_name: string
  avatar_url?: string
  bio?: string
}

export const Profile = () => {
  const { user, signOut } = useAuthStore()
  const [profile, setProfile] = useState<Profile | null>(null)

  const fetchProfile = useCallback(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single()
    
    if (data) setProfile(data)
  }, [user?.id])

  useEffect(() => {
    if (user) fetchProfile()
  }, [user, fetchProfile])

  return (
    <div className="py-10 space-y-12">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 p-1 shadow-2xl shadow-blue-600/20">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden border-4 border-slate-900">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
              ) : (
                <User className="w-12 h-12 text-slate-700" />
              )}
            </div>
          </div>
          <button className="absolute bottom-0 right-0 p-2.5 bg-blue-600 rounded-full border-4 border-slate-950 text-white shadow-lg hover:scale-110 transition-transform">
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {profile?.full_name || 'Your Sanctuary'}
          </h1>
          <p className="text-slate-500 max-w-sm mx-auto italic font-medium">
            {profile?.bio || 'No bio yet. This space is just for you.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" className="rounded-full px-6 border-slate-800">
            Edit Profile
          </Button>
          <Button variant="secondary" size="sm" className="rounded-full w-10 h-10 p-0 border-slate-800">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats/Grid */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Heart, label: 'Posts', value: '24' },
          { icon: Archive, label: 'Stories', value: '152' },
          { icon: Shield, label: 'Days', value: '12' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 text-center group hover:bg-slate-900/60 transition-all">
            <stat.icon className="w-5 h-5 text-slate-600 mx-auto mb-2 group-hover:text-blue-500 transition-colors" />
            <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Security Banner */}
      <div className="bg-gradient-to-r from-blue-600/10 to-emerald-500/10 border border-blue-500/20 rounded-3xl p-6 flex items-start gap-4">
        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-100 mb-1">Your Privacy is Sacred</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Everything you post here is encrypted and visible only to you. No one else, not even us, can see your sanctuary.
          </p>
        </div>
      </div>

      {/* Logout */}
      <Button 
        variant="danger" 
        className="w-full rounded-2xl gap-3 py-4 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white border border-rose-500/20"
        onClick={signOut}
      >
        <LogOut className="w-5 h-5" />
        Secure Sign Out
      </Button>
    </div>
  )
}
