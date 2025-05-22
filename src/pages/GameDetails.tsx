
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Goal, Game, Player, Location } from '../types/models';
import { Trophy, MapPin, CalendarDays, Clock, Users, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';

// Mock data
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
  },
];

const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Main Office - 3rd Floor',
    description: 'Near the kitchen area',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '2',
    name: 'Break Room',
    description: 'Adjacent to meeting room B',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

const mockGame: Game = {
  id: '1',
  locationId: '1',
  teamAPlayer1Id: '1',
  teamAPlayer2Id: '2',
  teamBPlayer1Id: '3',
  teamBPlayer2Id: '4',
  scoreTeamA: 10,
  scoreTeamB: 5,
  playerOfMatchId: '2',
  datetime: Date.now(),
  tournamentId: null,
  tournamentName: null,
  createdAt: Date.now(),
  updatedAt: Date.now()
};

const mockGoals: Goal[] = [
  { id: '1', gameId: '1', scorerId: '1', minute: 2 },
  { id: '2', gameId: '1', scorerId: '1', minute: 8 },
  { id: '3', gameId: '1', scorerId: '2', minute: 12 },
  { id: '4', gameId: '1', scorerId: '3', minute: 15 },
  { id: '5', gameId: '1', scorerId: '2', minute: 18 },
  { id: '6', gameId: '1', scorerId: '2', minute: 21 },
  { id: '7', gameId: '1', scorerId: '1', minute: 24 },
  { id: '8', gameId: '1', scorerId: '3', minute: 27 },
  { id: '9', gameId: '1', scorerId: '2', minute: 30 },
  { id: '10', gameId: '1', scorerId: '1', minute: 34 },
  { id: '11', gameId: '1', scorerId: '2', minute: 38 },
  { id: '12', gameId: '1', scorerId: '3', minute: 42 },
  { id: '13', gameId: '1', scorerId: '2', minute: 45 },
  { id: '14', gameId: '1', scorerId: '1', minute: 48 },
  { id: '15', gameId: '1', scorerId: '2', minute: 50 }
];

const GameDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [teamAPlayers, setTeamAPlayers] = useState<Player[]>([]);
  const [teamBPlayers, setTeamBPlayers] = useState<Player[]>([]);
  const [playerOfMatch, setPlayerOfMatch] = useState<Player | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, these would be API calls
    const fetchedGame = mockGame; // Would filter by ID in a real app
    setGame(fetchedGame);
    
    if (fetchedGame) {
      // Get location
      if (fetchedGame.locationId) {
        const fetchedLocation = mockLocations.find(l => l.id === fetchedGame.locationId) || null;
        setLocation(fetchedLocation);
      }
      
      // Get players
      const aPlayers = [
        mockPlayers.find(p => p.Id === fetchedGame.teamAPlayer1Id)!,
        ...(fetchedGame.teamAPlayer2Id ? [mockPlayers.find(p => p.Id === fetchedGame.teamAPlayer2Id)!] : [])
      ];
      setTeamAPlayers(aPlayers);
      
      const bPlayers = [
        mockPlayers.find(p => p.Id === fetchedGame.teamBPlayer1Id)!,
        ...(fetchedGame.teamBPlayer2Id ? [mockPlayers.find(p => p.Id === fetchedGame.teamBPlayer2Id)!] : [])
      ];
      setTeamBPlayers(bPlayers);
      
      if (fetchedGame.playerOfMatchId) {
        const fetchedMVP = mockPlayers.find(p => p.Id === fetchedGame.playerOfMatchId) || null;
        setPlayerOfMatch(fetchedMVP);
      }
      
      // Get goals
      setGoals(mockGoals); // Would filter by game ID in a real app
    }
    
    setLoading(false);
  }, [id]);
  
  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }
  
  if (!game) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Game Not Found</h1>
        <Link to="/games">
          <Button variant="link">Back to Games</Button>
        </Link>
      </div>
    );
  }
  
  // Process goal data
  const teamAGoals = goals.filter(g => 
    teamAPlayers.some(p => p.Id === g.scorerId)
  );
  
  const teamBGoals = goals.filter(g => 
    teamBPlayers.some(p => p.Id === g.scorerId)
  );
  
  // Get goal scorers with counts
  const getGoalCountsByPlayer = (goals: Goal[]) => {
    const counts: {[key: string]: number} = {};
    
    goals.forEach(goal => {
      if (!counts[goal.scorerId]) {
        counts[goal.scorerId] = 0;
      }
      counts[goal.scorerId]++;
    });
    
    return Object.entries(counts).map(([playerId, count]) => {
      const player = mockPlayers.find(p => p.Id === playerId);
      return { player, count };
    });
  };
  
  const teamAScorers = getGoalCountsByPlayer(teamAGoals);
  const teamBScorers = getGoalCountsByPlayer(teamBGoals);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Link to="/games">
            <Button variant="ghost" size="sm">
              ← Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Game Details</h1>
        </div>
        <div className="flex gap-3">
          <Link to={`/games/${game.id}/edit`}>
            <Button variant="outline">Edit Results</Button>
          </Link>
          <Link to="/games/new">
            <Button className="flex items-center gap-1 bg-tableblue hover:bg-blue-600 text-white">
              <RefreshCcw className="h-4 w-4" />
              Rematch
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Game Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
            {/* Game details */}
            <div className="flex-shrink-0 w-full md:w-64 space-y-4">
              {game.tournamentId && (
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-highlight" />
                  <div>
                    <div className="font-semibold">{game.tournamentName}</div>
                    <div className="text-sm text-muted-foreground">
                      {game.tournamentRound ? `Round ${game.tournamentRound}` : ''}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{format(new Date(game.datetime), 'EEEE, MMMM d, yyyy')}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{format(new Date(game.datetime), 'h:mm a')}</div>
                </div>
              </div>
              
              {location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{location.name}</div>
                    {location.description && (
                      <div className="text-sm text-muted-foreground">{location.description}</div>
                    )}
                  </div>
                </div>
              )}
              
              {playerOfMatch && (
                <div className="flex items-start gap-2 pt-2">
                  <Trophy className="h-5 w-5 text-highlight mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Player of the Match</div>
                    <Link to={`/players/${playerOfMatch.Id}`} className="font-semibold hover:underline">
                      {playerOfMatch.name}
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Score and teams */}
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Team A */}
                <div className="w-full md:w-auto text-center md:text-left">
                  <div className="text-sm text-muted-foreground mb-2">Team A</div>
                  <div className="flex flex-col items-center md:items-start mb-4">
                    {teamAPlayers.map((player) => (
                      <Link 
                        key={player.Id} 
                        to={`/players/${player.Id}`} 
                        className="font-semibold hover:underline"
                      >
                        {player.name}
                      </Link>
                    ))}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${game.scoreTeamA > game.scoreTeamB ? 'bg-victory text-white' : 'bg-muted'}
                    `}
                  >
                    {game.scoreTeamA > game.scoreTeamB ? 'Winner' : 'Loser'}
                  </Badge>
                </div>
                
                {/* Score */}
                <div className="text-center">
                  <div className="score-display">
                    <span className={game.scoreTeamA > game.scoreTeamB ? 'text-victory' : ''}>
                      {game.scoreTeamA}
                    </span>
                    <span className="vs">-</span>
                    <span className={game.scoreTeamB > game.scoreTeamA ? 'text-victory' : ''}>
                      {game.scoreTeamB}
                    </span>
                  </div>
                </div>
                
                {/* Team B */}
                <div className="w-full md:w-auto text-center md:text-right">
                  <div className="text-sm text-muted-foreground mb-2">Team B</div>
                  <div className="flex flex-col items-center md:items-end mb-4">
                    {teamBPlayers.map((player) => (
                      <Link 
                        key={player.Id} 
                        to={`/players/${player.Id}`} 
                        className="font-semibold hover:underline"
                      >
                        {player.name}
                      </Link>
                    ))}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${game.scoreTeamB > game.scoreTeamA ? 'bg-victory text-white' : 'bg-muted'}
                    `}
                  >
                    {game.scoreTeamB > game.scoreTeamA ? 'Winner' : 'Loser'}
                  </Badge>
                </div>
              </div>
              
              {/* Goals breakdown */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Goals Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Team A goals */}
                  <div>
                    <h4 className="font-medium mb-2">Team A</h4>
                    {teamAScorers.length > 0 ? (
                      <ul className="space-y-2">
                        {teamAScorers.map(({ player, count }) => (
                          <li key={player!.Id} className="flex items-center justify-between">
                            <Link 
                              to={`/players/${player!.Id}`}
                              className="hover:underline flex items-center"
                            >
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs mr-2">
                                {player!.name.charAt(0)}
                              </div>
                              {player!.name}
                            </Link>
                            <span className="font-semibold">{count}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-muted-foreground">No goals</div>
                    )}
                  </div>
                  
                  {/* Team B goals */}
                  <div>
                    <h4 className="font-medium mb-2">Team B</h4>
                    {teamBScorers.length > 0 ? (
                      <ul className="space-y-2">
                        {teamBScorers.map(({ player, count }) => (
                          <li key={player!.Id} className="flex items-center justify-between">
                            <Link 
                              to={`/players/${player!.Id}`}
                              className="hover:underline flex items-center"
                            >
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs mr-2">
                                {player!.name.charAt(0)}
                              </div>
                              {player!.name}
                            </Link>
                            <span className="font-semibold">{count}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-muted-foreground">No goals</div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Timeline */}
              {goals.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Goal Timeline</h3>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute top-0 bottom-0 left-[7px] w-0.5 bg-muted"></div>
                    
                    {/* Goals */}
                    <div className="space-y-4 ml-6">
                      {goals
                        .sort((a, b) => (a.minute || 0) - (b.minute || 0))
                        .map(goal => {
                          const scorer = mockPlayers.find(p => p.Id === goal.scorerId)!;
                          const isTeamA = teamAPlayers.some(p => p.Id === goal.scorerId);
                          
                          return (
                            <div key={goal.id} className="relative">
                              {/* Time marker */}
                              <div className="absolute -left-6 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-tableblue"></div>
                              {/* Goal content */}
                              <div className="flex items-center">
                                <span className="text-sm font-medium mr-3">{goal.minute}'</span>
                                <div className={`px-3 py-1 rounded-md ${isTeamA ? 'bg-blue-50 border-l-4 border-tableblue' : 'bg-red-50 border-l-4 border-defeat'}`}>
                                  <div className="flex items-center">
                                    <Link to={`/players/${scorer.Id}`} className="font-medium hover:underline">
                                      {scorer.name}
                                    </Link>
                                    <Badge 
                                      variant="outline" 
                                      className={`ml-2 ${isTeamA ? 'border-tableblue text-tableblue' : 'border-defeat text-defeat'}`}
                                    >
                                      {isTeamA ? 'Team A' : 'Team B'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameDetails;
