import { motion } from 'framer-motion'
import { Camera, Zap, Ghost, History } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const Snaps = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-12 py-10">
      <div className="relative">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-32 h-32 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-yellow-500/20"
        >
          <Ghost className="w-16 h-16 text-white" />
        </motion.div>
        <div className="absolute -top-4 -right-4 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full border-4 border-[#0a0a0c]">
          LIVE
        </div>
      </div>

      <div className="text-center space-y-4 max-w-sm">
        <h1 className="text-3xl font-bold tracking-tight">Temporary Snaps</h1>
        <p className="text-slate-500 leading-relaxed font-medium">
          Quick moments that disappear after viewing. Perfect for raw, unfiltered expression.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <Button className="h-40 rounded-[2rem] flex flex-col gap-3 bg-yellow-600/10 border border-yellow-500/20 text-yellow-500 hover:bg-yellow-600 hover:text-white transition-all">
          <Camera className="w-8 h-8" />
          <span className="font-bold">Take Snap</span>
        </Button>
        <Button variant="secondary" className="h-40 rounded-[2rem] flex flex-col gap-3 border-slate-800 bg-slate-900/30">
          <History className="w-8 h-8 text-slate-600" />
          <span className="font-bold text-slate-400">Memories</span>
        </Button>
      </div>

      <div className="w-full bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600/10 rounded-2xl">
            <Zap className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="font-bold text-slate-200">Ephemeral Mode</p>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">Active by default</p>
          </div>
        </div>
        <div className="w-12 h-6 bg-blue-600 rounded-full relative p-1">
          <div className="w-4 h-4 bg-white rounded-full ml-auto" />
        </div>
      </div>
    </div>
  )
}
