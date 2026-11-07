import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check whether real, valid-looking Supabase credentials are provided
export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  !rawUrl.includes('your_supabase_project_url') &&
  !rawUrl.includes('your-project-id') &&
  rawUrl.startsWith('https://')
);

const supabaseUrl: string = (isSupabaseConfigured && rawUrl)
  ? rawUrl
  : 'https://placeholder-vella.supabase.co';

const supabaseAnonKey: string = (isSupabaseConfigured && rawKey)
  ? rawKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

if (!isSupabaseConfigured) {
  console.info(
    '[VELLA] Supabase credentials not detected or using placeholders. Running in hybrid offline preview mode with local mock store.'
  );
}
