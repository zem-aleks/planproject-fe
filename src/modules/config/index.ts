import { z } from 'zod';

const envSchema = z.object({
  VITE_ENVIRONMENT: z.enum(['development', 'staging', 'production']),
  VITE_BACKEND_URL: z.string().url(),
  VITE_FRONTEND_URL: z.string().url(),
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string(),
});

export const ENV = envSchema.parse({
  VITE_ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
  VITE_FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL,
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
});
