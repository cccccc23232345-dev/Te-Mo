// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig =
  typeof supabaseUrl === 'string' &&
  /^https?:\/\//.test(supabaseUrl) &&
  typeof supabaseAnonKey === 'string' &&
  supabaseAnonKey.length > 0;

export const supabaseConfigWarning =
  'Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to TeMoApp/.env';

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;