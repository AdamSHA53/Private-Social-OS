import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Image, Camera, Ghost, Archive, User } from 'lucide-react'
import { cn } from '@/utils/cn'

const NAV_ITEMS = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Image, label: 'Stories', path: '/stories' },
  { icon: Camera, label: 'Snaps', path: '/snaps' },
  { icon: Ghost, label: 'Status', path: '/status' },
  { icon: Archive, label: 'Archive', path: '/archive' },
  { icon: User, label: 'Profile', path: '/profile' },
]

export const MainLayout = () => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800/50 p-6 fixed h-full bg-[#0a0a0c]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-xl shadow-lg shadow-blue-600/10" />
          <span className="font-bold text-xl tracking-tight">Private Social</span>
        </div>

        <nav className="space-y-2 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group',
                  isActive 
                    ? 'bg-blue-600/10 text-blue-500' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                )}
              >
                <item.icon className={cn('w-5 h-5 transition-transform group-hover:scale-110', isActive && 'text-blue-500')} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" 
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800/50">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">User Name</p>
              <p className="text-xs text-slate-500 truncate">My Sanctuary</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-6">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0c]/80 backdrop-blur-2xl border-t border-slate-800/50 px-6 py-3 z-50">
        <div className="flex items-center justify-between">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center gap-1 transition-all',
                  isActive ? 'text-blue-500' : 'text-slate-500'
                )}
              >
                <div className="relative">
                  <item.icon className={cn('w-6 h-6', isActive && 'scale-110')} />
                  {isActive && (
                    <motion.div 
                      layoutId="active-dot-mobile"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500"
                    />
                  )}
                </div>
              </Link>
            )
          })}
          <Link to="/profile">
            <div className={cn(
              'w-7 h-7 rounded-full border-2 transition-all',
              location.pathname === '/profile' ? 'border-blue-500 scale-110' : 'border-slate-800'
            )}>
              <div className="w-full h-full rounded-full bg-slate-800" />
            </div>
          </Link>
        </div>
      </nav>
    </div>
  )
}
