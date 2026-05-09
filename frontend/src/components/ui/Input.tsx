import React from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-slate-400 ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all',
            error && 'border-rose-500/50 focus:ring-rose-500/40 focus:border-rose-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-rose-500 ml-1 mt-1 font-medium">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
