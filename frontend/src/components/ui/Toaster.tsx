import { useToastStore } from '@/store/useToastStore'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/utils/cn'

export const Toaster = () => {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 w-full max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={cn(
              "flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl",
              toast.type === 'success' && "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
              toast.type === 'error' && "bg-rose-500/10 border-rose-500/20 text-rose-400",
              toast.type === 'info' && "bg-blue-500/10 border-blue-500/20 text-blue-400"
            )}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 flex-shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
            
            <p className="text-sm font-semibold flex-1">{toast.message}</p>
            
            <button 
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-black/10 rounded-lg transition-all"
            >
              <X className="w-4 h-4 opacity-50" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
