
export type Player = {
  Id: string;
  name: string;
  nickname: string;
  department: string;
  photoUrl: string;
  skillLevel: number;
  preferredPartnerId?: string | null;
  currentStreak: number;
  winStreak: number;
  lossStreak: number;
  totalGames: number;
  totalWins: number;
  totalGoals: number;
  createdAt: number;
  updatedAt: number;
};

export type Location = {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
};

export type Schedule = {
  id: string;
  locationId: string;
  scheduledDate: string; // ISO date string: "YYYY-MM-DD"
  startTime: string;     // "HH:mm"
  endTime: string;       // "HH:mm"
};

export type Game = {
  id: string;
  locationId?: string;
  teamAPlayer1Id: string;
  teamAPlayer2Id?: string | null;
  teamBPlayer1Id: string;
  teamBPlayer2Id?: string | null;
  scoreTeamA: number;
  scoreTeamB: number;
  playerOfMatchId?: string | null;
  datetime: number;

  // Tournament context
  tournamentId?: string | null;
  tournamentName?: string | null
  tournamentRound?: number;          // e.g., 1 = Round of 16, 2 = Quarterfinal
  teamAName?: string;
  teamBName?: string;
  winnerTeam?: 'A' | 'B' | null;
  matchOrder?: number;

  createdAt: number;
  updatedAt: number;
};

export type Goal = {
  id: string;
  gameId: string;
  scorerId: string;
  minute?: number;
};

export type Tournament = {
  id: string;
  name: string;
  description?: string;
  startDate: number;
  endDate: number;
  numberOfTeams: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
};

export type TournamentTeam = {
  id: string;
  tournamentId: string;
  name: string;
  player1Id?: string;
  player2Id?: string;
};
