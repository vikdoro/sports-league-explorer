// Public TheSportsDB defaults so the app runs without any .env file.
// Override via VITE_SPORTSDB_* env vars for a different endpoint or key.
const DEFAULT_BASE_URL = 'https://www.thesportsdb.com/api/v1/json';
const DEFAULT_API_KEY = '3';

const baseUrl = import.meta.env.VITE_SPORTSDB_BASE_URL || DEFAULT_BASE_URL;
const apiKey = import.meta.env.VITE_SPORTSDB_API_KEY || DEFAULT_API_KEY;

export async function apiGet<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const url = new URL(`${baseUrl}/${apiKey}/${path}`);
  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}
