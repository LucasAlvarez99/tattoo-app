// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// 🔹 Reemplazá con tus credenciales reales
const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co'
const SUPABASE_ANON_KEY = 'TU_ANON_KEY'

// 🚫 Importante: deshabilitamos Realtime (ws) forzando el uso de fetch
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: {
    fetch: (...args) => fetch(...args),
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
  realtime: {
    // ❌ No usar ws en Expo
    connect: false,
  },
})
