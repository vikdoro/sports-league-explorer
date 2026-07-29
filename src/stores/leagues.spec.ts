import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useLeaguesStore } from './leagues';
import type { League } from '../types/league';

// Mock the API module so the store's load() is deterministic.
const { fetchAllLeagues } = vi.hoisted(() => ({
  fetchAllLeagues: vi.fn(),
}));
vi.mock('../api/sportsDb', () => ({ fetchAllLeagues }));

function league(partial: Partial<League> & { idLeague: string }): League {
  return {
    strLeague: 'League',
    strSport: 'Soccer',
    strLeagueAlternate: null,
    ...partial,
  };
}

const SAMPLE: League[] = [
  league({
    idLeague: '1',
    strLeague: 'English Premier League',
    strSport: 'Soccer',
  }),
  league({
    idLeague: '2',
    strLeague: 'La Liga',
    strSport: 'Soccer',
    strLeagueAlternate: 'Primera Division',
  }),
  league({ idLeague: '3', strLeague: 'NBA', strSport: 'Basketball' }),
  league({ idLeague: '4', strLeague: 'Formula 1', strSport: 'Motorsport' }),
];

beforeEach(() => {
  setActivePinia(createPinia());
  fetchAllLeagues.mockReset();
});

describe('useLeaguesStore.load', () => {
  it('loads leagues and marks status ready', async () => {
    fetchAllLeagues.mockResolvedValue(SAMPLE);
    const store = useLeaguesStore();

    await store.load();

    expect(store.status).toBe('ready');
    expect(store.leagues).toHaveLength(4);
  });

  it('records an error message and status on failure', async () => {
    fetchAllLeagues.mockRejectedValue(new Error('network down'));
    const store = useLeaguesStore();

    await store.load();

    expect(store.status).toBe('error');
    expect(store.error).toBe('network down');
  });

  it('does not refetch once loaded', async () => {
    fetchAllLeagues.mockResolvedValue(SAMPLE);
    const store = useLeaguesStore();

    await store.load();
    await store.load();

    expect(fetchAllLeagues).toHaveBeenCalledTimes(1);
  });
});

describe('useLeaguesStore filtering', () => {
  async function loadedStore() {
    fetchAllLeagues.mockResolvedValue(SAMPLE);
    const store = useLeaguesStore();
    await store.load();
    return store;
  }

  it('returns all leagues when no filters are set', async () => {
    const store = await loadedStore();
    expect(store.filteredLeagues).toHaveLength(4);
  });

  it('filters by name, case-insensitively', async () => {
    const store = await loadedStore();
    store.query = 'premier';
    expect(store.filteredLeagues.map((l) => l.idLeague)).toEqual(['1']);
  });

  it('matches on the alternate name', async () => {
    const store = await loadedStore();
    store.query = 'primera';
    expect(store.filteredLeagues.map((l) => l.idLeague)).toEqual(['2']);
  });

  it('filters by sport', async () => {
    const store = await loadedStore();
    store.sport = 'Soccer';
    expect(store.filteredLeagues.map((l) => l.idLeague)).toEqual(['1', '2']);
  });

  it('combines the name and sport filters', async () => {
    const store = await loadedStore();
    store.sport = 'Soccer';
    store.query = 'liga';
    expect(store.filteredLeagues.map((l) => l.idLeague)).toEqual(['2']);
  });

  it('returns an empty list when nothing matches', async () => {
    const store = await loadedStore();
    store.query = 'cricket world cup';
    expect(store.filteredLeagues).toEqual([]);
  });
});
