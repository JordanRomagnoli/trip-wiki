import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Supabase features will be disabled.')
    return null as any // Return null or a mock if needed
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
