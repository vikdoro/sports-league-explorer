interface ImportMetaEnv {
  // Optional — the API client falls back to public defaults when unset.
  readonly VITE_SPORTSDB_BASE_URL?: string;
  readonly VITE_SPORTSDB_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
