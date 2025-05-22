
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GameCard from '../components/GameCard';
import PlayerOfTheWeek from '../components/PlayerOfTheWeek';
import TournamentBanner from '../components/TournamentBanner';
import { Game, Player, Tournament } from '../types/models';

// Mock data for initial display - would be fetched from API in a real app
const mockPlayers: Player[] = [
  {
    Id: '1',
    name: 'John Smith',
    nickname: 'The Wall',
    department: 'Engineering',
    photoUrl: '',
    skillLevel: 4,
    preferredPartnerId: '2',
    currentStreak: 3,
    winStreak: 3,
    lossStreak: 0,
    totalGames: 25,
    totalWins: 18,
    totalGoals: 42,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    Id: '2',
    name: 'Emily Johnson',
    nickname: 'Quick Hands',
    department: 'Design',
    photoUrl: '',
    skillLevel: 5,
    preferredPartnerId: null,
    currentStreak: 5,
    winStreak: 5,
    lossStreak: 0,
    totalGames: 30,
    totalWins: 24,
    totalGoals: 53,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    Id: '3',
    name: 'Michael Lee',
    nickname: 'Spin Master',
    department: 'Marketing',
    photoUrl: '',
    skillLevel: 3,
    preferredPartnerId: null,
    currentStreak: -2,
    winStreak: 0,
    lossStreak: 2,
    totalGames: 22,
    totalWins: 10,
    totalGoals: 28,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    Id: '4',
    name: 'Sarah Davis',
    nickname: 'The Defender',
    department: 'HR',
    photoUrl: '',
    skillLevel: 4,
    preferredPartnerId: null,
    currentStreak: 0,
    winStreak: 0,
    lossStreak: 0,
    totalGames: 15,
    totalWins: 8,
    totalGoals: 12,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

// Today's date for mock data
const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);
const todayTime = todayStart.getTime();

const mockGames: Game[] = [
  {
    id: '1',
    teamAPlayer1Id: '1',
    teamAPlayer2Id: '2',
    teamBPlayer1Id: '3',
    teamBPlayer2Id: '4',
    scoreTeamA: 10,
    scoreTeamB: 5,
    playerOfMatchId: '2',
    datetime: todayTime + 10 * 3600 * 1000, // Today at 10 AM
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '2',
    teamAPlayer1Id: '1',
    teamAPlayer2Id: null,
    teamBPlayer1Id: '3',
    teamBPlayer2Id: null,
    scoreTeamA: 7,
    scoreTeamB: 10,
    playerOfMatchId: '3',
    datetime: todayTime + 14 * 3600 * 1000, // Today at 2 PM
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '3',
    teamAPlayer1Id: '2',
    teamAPlayer2Id: '4',
    teamBPlayer1Id: '1',
    teamBPlayer2Id: '3',
    scoreTeamA: 10,
    scoreTeamB: 8,
    playerOfMatchId: '2',
    datetime: todayTime + 16 * 3600 * 1000, // Today at 4 PM
    tournamentId: '1',
    tournamentName: 'Summer Championship',
    tournamentRound: 1,
    teamAName: 'Design Stars',
    teamBName: 'Engineering Pros',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

const mockTournaments: Tournament[] = [
  {
    id: '1',
    name: 'Summer Championship',
    description: 'The ultimate summer table football championship!',
    startDate: todayTime - 2 * 86400 * 1000, // 2 days ago
    endDate: todayTime + 5 * 86400 * 1000, // 5 days from now
    numberOfTeams: 8,
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '2',
    name: 'Department Challenge',
    description: 'Department vs Department - Who will win the office crown?',
    startDate: todayTime + 10 * 86400 * 1000, // 10 days from now
    endDate: todayTime + 14 * 86400 * 1000, // 14 days from now
    numberOfTeams: 4,
    isActive: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

const Dashboard = () => {
  const [todaysGames, setTodaysGames] = useState<Game[]>([]);
  const [upcomingTournament, setUpcomingTournament] = useState<Tournament | null>(null);
  const [playerOfTheWeek, setPlayerOfTheWeek] = useState<Player | null>(null);
  
  // Simulated data loading
  useEffect(() => {
    // These would be API calls in a real app
    setTodaysGames(mockGames);
    setUpcomingTournament(mockTournaments.find(t => !t.isActive && new Date(t.startDate) > new Date()) || mockTournaments[0]);
    setPlayerOfTheWeek(mockPlayers.find(p => p.Id === '2') || null);
  }, []);

  // Function to get players for a game
  const getPlayersForGame = (game: Game) => {
    const teamAPlayers = [
      mockPlayers.find(p => p.Id === game.teamAPlayer1Id)!,
      ...(game.teamAPlayer2Id ? [mockPlayers.find(p => p.Id === game.teamAPlayer2Id)!] : [])
    ];
    
    const teamBPlayers = [
      mockPlayers.find(p => p.Id === game.teamBPlayer1Id)!,
      ...(game.teamBPlayer2Id ? [mockPlayers.find(p => p.Id === game.teamBPlayer2Id)!] : [])
    ];
    
    const playerOfMatch = game.playerOfMatchId
      ? mockPlayers.find(p => p.Id === game.playerOfMatchId)!
      : undefined;
      
    return { teamAPlayers, teamBPlayers, playerOfMatch };
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Table Football Dashboard</h1>
        <Link to="/games/new">
          <Button className="bg-tableblue hover:bg-blue-600 text-white">
            Create a Match
          </Button>
        </Link>
      </div>
      
      {playerOfTheWeek && (
        <PlayerOfTheWeek 
          player={playerOfTheWeek} 
          stats={{
            gamesPlayed: playerOfTheWeek.totalGames,
            goalsScored: playerOfTheWeek.totalGoals,
            winRate: Math.round((playerOfTheWeek.totalWins / playerOfTheWeek.totalGames) * 100)
          }}
        />
      )}
      
      {upcomingTournament && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Tournament Notification</h2>
          <TournamentBanner tournament={upcomingTournament} />
        </div>
      )}
      
      <div>
        <h2 className="text-xl font-semibold mb-3">Today's Games</h2>
        {todaysGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todaysGames.map(game => {
              const { teamAPlayers, teamBPlayers, playerOfMatch } = getPlayersForGame(game);
              
              return (
                <GameCard
                  key={game.id}
                  game={game}
                  teamAPlayers={teamAPlayers}
                  teamBPlayers={teamBPlayers}
                  playerOfMatch={playerOfMatch}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center p-8 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">No games scheduled for today.</p>
            <Link to="/games/new">
              <Button variant="link" className="mt-2 text-tableblue">
                Schedule a Game
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
