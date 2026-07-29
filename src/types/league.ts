export interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  // Absent from the free-key response, null-able elsewhere.
  strLeagueAlternate?: string | null;
}

export interface AllLeaguesResponse {
  leagues: League[] | null;
}

export interface Season {
  strSeason: string;
  strBadge: string | null;
}

export interface AllSeasonsResponse {
  seasons: Season[] | null;
}
