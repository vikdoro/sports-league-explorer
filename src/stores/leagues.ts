import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchAllLeagues } from '../api/sportsDb'
import type { League } from '../types/league'

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

// Most popular sports surface first, in this order; everything else
// follows alphabetically.
const SPORT_PRIORITY = [
  'Soccer',
  'Tennis',
  'Basketball',
  'Ice Hockey',
  'Baseball',
  'Handball',
  'Volleyball',
  'Motorsport',
]

function sportRank(sport: string): number {
  const index = SPORT_PRIORITY.indexOf(sport)
  return index === -1 ? SPORT_PRIORITY.length : index
}

export const useLeaguesStore = defineStore('leagues', () => {
  const leagues = ref<League[]>([])
  const status = ref<LoadStatus>('idle')
  const error = ref<string | null>(null)

  // Loads once per session; subsequent calls are no-ops unless the
  // previous attempt failed.
  async function load() {
    if (status.value === 'loading' || status.value === 'ready') return

    status.value = 'loading'
    error.value = null
    try {
      const all = await fetchAllLeagues()
      leagues.value = all
        .filter((league) => !league.strLeague.startsWith('_'))
        .sort(
        (a, b) =>
          sportRank(a.strSport) - sportRank(b.strSport) ||
          a.strSport.localeCompare(b.strSport) ||
          a.strLeague.localeCompare(b.strLeague),
        )
      status.value = 'ready'
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unexpected error'
      status.value = 'error'
    }
  }

  return { leagues, status, error, load }
})
