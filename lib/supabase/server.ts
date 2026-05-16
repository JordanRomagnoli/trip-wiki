import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing on server. Supabase features will be disabled.')
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => ({ data: null, error: { message: 'Missing env vars' } }),
            then: () => Promise.resolve({ data: null, error: { message: 'Missing env vars' } })
          }),
          then: () => Promise.resolve({ data: null, error: { message: 'Missing env vars' } })
        }),
        update: () => ({
          eq: () => Promise.resolve({ error: { message: 'Missing env vars' } })
        })
      })
    } as any
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have proxy refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
