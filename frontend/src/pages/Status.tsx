import { motion } from 'framer-motion'
import { Plus, Smile, Layout, Type } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const Status = () => {
  return (
    <div className="py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Daily Status</h1>
        <Button size="sm" className="rounded-full gap-2 px-6">
          <Plus className="w-4 h-4" />
          Update
        </Button>
      </div>

      {/* Current Mood Status */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="aspect-square sm:aspect-video relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 flex flex-col items-center justify-center text-center shadow-2xl shadow-purple-500/20 group cursor-pointer"
      >
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        
        <div className="relative z-10 space-y-6">
          <Smile className="w-16 h-16 text-white/40 mx-auto" />
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            "Finding peace in the digital noise."
          </h2>
          <p className="text-white/60 font-medium tracking-widest uppercase text-sm">
            Updated 2 hours ago
          </p>
        </div>

        <div className="absolute bottom-8 right-8 flex gap-2">
          <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all">
            <Type className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all">
            <Layout className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* History Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-400 ml-1">Recent Updates</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { color: 'from-emerald-500 to-teal-600', text: 'Productive morning.' },
            { color: 'from-blue-600 to-indigo-700', text: 'New goals set.' },
          ].map((status, i) => (
            <div key={i} className={cn(
              "aspect-square rounded-3xl bg-gradient-to-br p-6 flex flex-col justify-end border border-white/5",
              status.color
            )}>
              <p className="font-bold text-white leading-tight line-clamp-3">
                {status.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Utility to handle dynamic classes
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
