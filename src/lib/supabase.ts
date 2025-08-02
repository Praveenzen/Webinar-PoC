import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserProfile = {
  id: string
  first_name: string
  last_name: string
  role: 'contributor' | 'user'
  user_type: 'public' | 'paid'
  created_at: string
  updated_at: string
}

export type Webinar = {
  id: string
  title: string
  description: string
  scheduled_date: string
  duration_minutes: number
  speaker_name: string
  embed_url: string
  access_type: 'public' | 'paid_only'
  created_by: string
  created_at: string
  updated_at: string
}