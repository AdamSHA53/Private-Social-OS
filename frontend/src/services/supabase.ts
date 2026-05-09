import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured = supabaseUrl && supabaseUrl.startsWith('http')

export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
)

if (!isConfigured) {
  console.error('🔴 Supabase is NOT configured. Please add your credentials to .env.local')
}

