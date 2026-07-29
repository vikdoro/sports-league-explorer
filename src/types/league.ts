export interface League {
  idLeague: string
  strLeague: string
  strSport: string
  strLeagueAlternate: string | null
}

export interface AllLeaguesResponse {
  leagues: League[] | null
}
