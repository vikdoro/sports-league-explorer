import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLeagueBadges } from './useLeagueBadges';

const { fetchLeagueBadge } = vi.hoisted(() => ({
  fetchLeagueBadge: vi.fn(),
}));
vi.mock('../api/sportsDb', () => ({ fetchLeagueBadge }));

beforeEach(() => {
  fetchLeagueBadge.mockReset();
});

describe('useLeagueBadges.load', () => {
  it('resolves a badge into ready state with url and season', async () => {
    fetchLeagueBadge.mockResolvedValue({
      strSeason: '2019-2020',
      strBadge: 'https://example.test/badge.png',
    });
    const { badges, load } = useLeagueBadges();

    await load('4496');

    expect(badges.get('4496')).toEqual({
      status: 'ready',
      badgeUrl: 'https://example.test/badge.png',
      season: '2019-2020',
    });
  });

  it('treats a league with no badge as ready with a null url', async () => {
    fetchLeagueBadge.mockResolvedValue(null);
    const { badges, load } = useLeagueBadges();

    await load('123');

    expect(badges.get('123')).toEqual({
      status: 'ready',
      badgeUrl: null,
      season: null,
    });
  });

  it('maps a rejected fetch to error state', async () => {
    fetchLeagueBadge.mockRejectedValue(new Error('boom'));
    const { badges, load } = useLeagueBadges();

    await load('123');

    expect(badges.get('123')?.status).toBe('error');
  });

  it('caches results and does not refetch the same league', async () => {
    fetchLeagueBadge.mockResolvedValue({ strSeason: 'x', strBadge: 'y' });
    const { load } = useLeagueBadges();

    await load('1');
    await load('1');

    expect(fetchLeagueBadge).toHaveBeenCalledTimes(1);
  });
});

describe('useLeagueBadges.markError', () => {
  it('forces a league into error state', () => {
    const { badges, markError } = useLeagueBadges();

    markError('1');

    expect(badges.get('1')).toEqual({
      status: 'error',
      badgeUrl: null,
      season: null,
    });
  });
});
