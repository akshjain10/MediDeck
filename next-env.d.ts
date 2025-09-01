/// <reference types="next" />
/// <reference types="next/image-types/global" />

interface ImportMetaEnv {
  readonly VITE_FORM_ACCESS_KEY: string;
  readonly VITE_PUBLIC_SUPABASE_URL: string;
  readonly VITE_PUBLIC_SUPABASE_ANON_KEY: string;
  readonly VITE_SUPABASE_SERVICE_ROLE_KEY: string;
  readonly VITE_GITHUB_TOKEN: string;
  readonly VITE_GITHUB_REPO: string;
  readonly VITE_GITHUB_OWNER: string;
  readonly VITE_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}