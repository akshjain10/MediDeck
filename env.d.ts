/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_SUPABASE_URL: string;
  readonly VITE_PUBLIC_SUPABASE_ANON_KEY: string;
  raedonly VITE_SUPABASE_SERVICE_ROLE_KEY:string;
  // Add other VITE_ prefixed variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}