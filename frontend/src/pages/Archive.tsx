import { Search, Calendar, Filter, Grid, List } from 'lucide-react'
import { motion } from 'framer-motion'

export const Archive = () => {
  return (
    <div className="py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Archive</h1>
        <div className="flex gap-2">
          <button className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
            <Filter className="w-5 h-5" />
          </button>
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button className="p-1.5 bg-slate-800 text-white rounded-lg">
              <Grid className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Search your memories..."
          className="w-full bg-slate-900/50 border border-slate-800/50 rounded-2xl pl-12 pr-4 py-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
        />
      </div>

      {/* Timeline Section */}
      <div className="space-y-12">
        {[
          { month: 'May 2026', items: 12 },
          { month: 'April 2026', items: 45 },
        ].map((section, i) => (
          <div key={i} className="space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="font-bold text-slate-300 text-lg">{section.month}</h3>
              <div className="flex-1 h-px bg-slate-800/50" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                {section.items} Memories
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {Array.from({ length: 6 }).map((_, j) => (
                <motion.div
                  key={j}
                  whileHover={{ scale: 0.98 }}
                  className="aspect-square bg-slate-900/40 border border-slate-800/50 rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center group"
                >
                  <div className="w-full h-full bg-gradient-to-tr from-slate-800 to-slate-900 group-hover:from-blue-900/20 group-hover:to-indigo-900/20 transition-all flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-slate-800 group-hover:text-blue-500/40" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
