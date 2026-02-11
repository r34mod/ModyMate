// ================================================
// SUPABASE CLIENT — GlicoHack v3
// ================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Faltan las variables de entorno de Supabase. ' +
    'Copia .env.example → .env y rellena VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,   // No cachear sesión — siempre arranca en login
      detectSessionInUrl: true,
    },
  }
);
