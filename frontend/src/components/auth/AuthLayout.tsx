import { motion } from 'framer-motion'

export const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-2xl mx-auto mb-6 shadow-2xl shadow-blue-600/20" />
          <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
          <p className="text-slate-400">{subtitle}</p>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 p-8 rounded-3xl shadow-2xl">
          {children}
        </div>
      </motion.div>
    </div>
  )
}
