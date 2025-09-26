import { ENV } from '@/modules/config';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  ENV.VITE_SUPABASE_URL,
  ENV.VITE_SUPABASE_ANON_KEY,
);
