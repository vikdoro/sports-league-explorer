import { apiGet } from './client';
import type {
  AllLeaguesResponse,
  AllSeasonsResponse,
  League,
  Season,
} from '../types/league';

export async function fetchAllLeagues(): Promise<League[]> {
  const data = await apiGet<AllLeaguesResponse>('all_leagues.php');
  return data.leagues ?? [];
}

// Per-league cache of badge lookups. Caching the in-flight promise (not just
// the resolved value) means concurrent calls for the same league share one
// request. Failed lookups are evicted so they can be retried.
const badgeCache = new Map<string, Promise<Season | null>>();

// Returns the first season that actually has a badge image. Early seasons
// often come back with strBadge: null, so we skip those. Returns null when
// the league has no badge for any season. Cached per league id.
export function fetchLeagueBadge(idLeague: string): Promise<Season | null> {
  const cached = badgeCache.get(idLeague);
  if (cached) {
    return cached;
  }

  const request = apiGet<AllSeasonsResponse>('search_all_seasons.php', {
    badge: '1',
    id: idLeague,
  })
    .then((data) => data.seasons?.find((season) => season.strBadge) ?? null)
    .catch((err) => {
      badgeCache.delete(idLeague);
      throw err;
    });

  badgeCache.set(idLeague, request);
  return request;
}
