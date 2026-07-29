import { reactive } from 'vue';
import { fetchLeagueBadge } from '../api/sportsDb';

export type BadgeStatus = 'loading' | 'ready' | 'error';

export interface BadgeState {
  status: BadgeStatus;
  // The resolved badge image URL, or null when the league has no badge for
  // any season. Only meaningful once status is 'ready'.
  badgeUrl: string | null;
  season: string | null;
}

// Owns per-league season-badge fetching, keyed by league id. Results are
// cached so re-requesting a league is a no-op. Keeps the network concern
// out of the presentational LeagueCard.
export function useLeagueBadges() {
  const badges = reactive(new Map<string, BadgeState>());

  async function load(idLeague: string) {
    // Already fetched (or in flight) — reuse the cached result.
    if (badges.has(idLeague)) {
      return;
    }

    badges.set(idLeague, { status: 'loading', badgeUrl: null, season: null });
    try {
      const season = await fetchLeagueBadge(idLeague);
      badges.set(idLeague, {
        status: 'ready',
        badgeUrl: season?.strBadge ?? null,
        season: season?.strSeason ?? null,
      });
    } catch {
      badges.set(idLeague, { status: 'error', badgeUrl: null, season: null });
    }
  }

  // The fetch succeeded but the badge image itself failed to load — surface
  // it as an error so the card shows the failure state instead of a blank.
  function markError(idLeague: string) {
    badges.set(idLeague, { status: 'error', badgeUrl: null, season: null });
  }

  return { badges, load, markError };
}
