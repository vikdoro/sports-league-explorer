import { apiGet } from './client'
import type { AllLeaguesResponse, League } from '../types/league'

export async function fetchAllLeagues(): Promise<League[]> {
  const data = await apiGet<AllLeaguesResponse>('all_leagues.php')
  return data.leagues ?? []
}
