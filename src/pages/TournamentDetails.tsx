
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tournament, TournamentTeam, Game, Player } from '../types/models';
import { Trophy, CalendarDays, Users, PlusCircle, Check } from 'lucide-react';
import { format, isPast, isFuture } from 'date-fns';
import GameCard from '../components/GameCard';

// Mock data
const mockTournament: Tournament = {
  id: '1',
  name: 'Summer Championship',
  description: 'The ultimate summer table football championship!',
  startDate: Date.now() - 24 * 60 * 60 * 1000, // Started yesterday
  endDate: Date.now() + 4 * 24 * 60 * 60 * 1000, // Ends in 4 days
  numberOfTeams: 8,
  isActive: true,
  createdAt: Date.now(),
  updatedAt: Date.now()
};

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

const mockTeams: TournamentTeam[] = [
  {
    id: '1',
    tournamentId: '1',
    name: 'Engineering Pros',
    player1Id: '1',
    player2Id: '4'
  },
  {
    id: '2',
    tournamentId: '1',
    name: 'Design Stars',
    player1Id: '2',
    player2Id: '3'
  },
  {
    id: '3',
    tournamentId: '1',
    name: 'Sales & Marketing',
    player1Id: '3',
    player2Id: null
  },
  {
    id: '4',
    tournamentId: '1',
    name: 'HR Heroes',
    player1Id: '4',
    player2Id: '1'
  },
];

// Simulated tournament games
const mockGames: Game[] = [
  {
    id: '1',
    teamAPlayer1Id: '1',
    teamAPlayer2Id: '4',
    teamBPlayer1Id: '3',
    teamBPlayer2Id: null,
    scoreTeamA: 10,
    scoreTeamB: 5,
    playerOfMatchId: '1',
    datetime: Date.now() - 12 * 60 * 60 * 1000, // 12 hours ago
    tournamentId: '1',
    tournamentName: 'Summer Championship',
    tournamentRound: 1,
    teamAName: 'Engineering Pros',
    teamBName: 'Sales & Marketing',
    winnerTeam: 'A',
    matchOrder: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '2',
    teamAPlayer1Id: '2',
    teamAPlayer2Id: '3',
    teamBPlayer1Id: '4',
    teamBPlayer2Id: '1',
    scoreTeamA: 7,
    scoreTeamB: 10,
    playerOfMatchId: '4',
    datetime: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
    tournamentId: '1',
    tournamentName: 'Summer Championship',
    tournamentRound: 1,
    teamAName: 'Design Stars',
    teamBName: 'HR Heroes',
    winnerTeam: 'B',
    matchOrder: 2,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '3',
    teamAPlayer1Id: '1',
    teamAPlayer2Id: '4',
    teamBPlayer1Id: '4',
    teamBPlayer2Id: '1',
    scoreTeamA: 0,
    scoreTeamB: 0,
    datetime: Date.now() + 24 * 60 * 60 * 1000, // 1 day in future
    tournamentId: '1',
    tournamentName: 'Summer Championship',
    tournamentRound: 2,
    teamAName: 'Engineering Pros',
    teamBName: 'HR Heroes',
    matchOrder: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
];

const TournamentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<TournamentTeam[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, these would be API calls
    setTournament(mockTournament);
    setTeams(mockTeams);
    setGames(mockGames);
    setLoading(false);
  }, [id]);
  
  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }
  
  if (!tournament) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Tournament Not Found</h1>
        <Link to="/tournaments">
          <Button variant="link">Back to Tournaments</Button>
        </Link>
      </div>
    );
  }
  
  const isUpcoming = isFuture(new Date(tournament.startDate));
  const isInProgress = tournament.isActive;
  const isCompleted = !tournament.isActive && isPast(new Date(tournament.endDate));
  
  // Group games by round for the bracket view
  const gamesByRound: { [key: number]: Game[] } = {};
  
  games.forEach(game => {
    if (game.tournamentRound) {
      if (!gamesByRound[game.tournamentRound]) {
        gamesByRound[game.tournamentRound] = [];
      }
      gamesByRound[game.tournamentRound].push(game);
    }
  });
  
  // Sort rounds in ascending order
  const sortedRounds = Object.keys(gamesByRound).map(Number).sort((a, b) => a - b);

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
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Link to="/tournaments">
            <Button variant="ghost" size="sm">
              ← Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Tournament Details</h1>
        </div>
        {isInProgress && (
          <div>
            <Button className="bg-tableblue hover:bg-blue-600 text-white">
              Generate Bracket
            </Button>
          </div>
        )}
      </div>
      
      {/* Tournament Info */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{tournament.name}</CardTitle>
              <p className="text-muted-foreground mt-1">{tournament.description}</p>
            </div>
            <div>
              {isUpcoming && (
                <Badge className="bg-tableblue text-white">Upcoming</Badge>
              )}
              
              {isInProgress && (
                <Badge className="bg-highlight text-white animate-pulse-soft">In Progress</Badge>
              )}
              
              {isCompleted && (
                <Badge variant="outline">Completed</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Tournament Dates</div>
                <div className="font-medium">
                  {format(new Date(tournament.startDate), 'MMM d')} - {format(new Date(tournament.endDate), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Team Capacity</div>
                <div className="font-medium">{teams.length} / {tournament.numberOfTeams} Teams</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="font-medium">
                  {isUpcoming ? 'Registration Open' : isInProgress ? 'Tournament in Progress' : 'Tournament Completed'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="bracket" className="w-full">
        <TabsList className="grid w-full sm:w-[400px] grid-cols-3">
          <TabsTrigger value="bracket">Bracket</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="games">Games</TabsTrigger>
        </TabsList>
        
        {/* Bracket View */}
        <TabsContent value="bracket" className="mt-6">
          {sortedRounds.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="min-w-[800px] p-4">
                <div className="flex gap-8">
                  {sortedRounds.map(round => (
                    <div key={round} className="flex-1">
                      <h3 className="text-lg font-semibold mb-4 text-center">
                        {round === 1 ? 'First Round' : 
                         round === 2 ? 'Semi Finals' : 
                         round === 3 ? 'Final' : `Round ${round}`}
                      </h3>
                      
                      <div className="space-y-6">
                        {gamesByRound[round]
                          .sort((a, b) => (a.matchOrder || 0) - (b.matchOrder || 0))
                          .map(game => {
                            const gameCompleted = game.scoreTeamA > 0 || game.scoreTeamB > 0;
                            const { teamAPlayers, teamBPlayers, playerOfMatch } = getPlayersForGame(game);
                            
                            return (
                              <div key={game.id} className="relative">
                                <Link to={`/games/${game.id}`}>
                                  <Card className={`
                                    hover:shadow-md transition-shadow
                                    ${gameCompleted ? 'border-tableblue' : 'border-dashed'}
                                  `}>
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-center mb-2">
                                        <div className="text-sm text-muted-foreground">
                                          {format(new Date(game.datetime), 'MMM d, h:mm a')}
                                        </div>
                                        {gameCompleted ? (
                                          <Badge variant="outline" className="bg-muted">Completed</Badge>
                                        ) : (
                                          <Badge variant="outline" className="bg-tableblue text-white">Upcoming</Badge>
                                        )}
                                      </div>
                                      
                                      {/* Team A */}
                                      <div className={`
                                        flex justify-between items-center p-2 rounded-t-sm
                                        ${game.winnerTeam === 'A' ? 'bg-victory/10 border-l-4 border-victory' : 'bg-muted/30'}
                                      `}>
                                        <div className="font-medium">
                                          {game.teamAName || 'Team A'}
                                        </div>
                                        <div className="font-bold text-lg">{game.scoreTeamA}</div>
                                      </div>
                                      
                                      {/* Team B */}
                                      <div className={`
                                        flex justify-between items-center p-2 rounded-b-sm
                                        ${game.winnerTeam === 'B' ? 'bg-victory/10 border-l-4 border-victory' : 'bg-muted/30'}
                                      `}>
                                        <div className="font-medium">
                                          {game.teamBName || 'Team B'}
                                        </div>
                                        <div className="font-bold text-lg">{game.scoreTeamB}</div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </Link>
                                
                                {/* Draw connection lines for bracket visualization */}
                                {round < sortedRounds[sortedRounds.length-1] && (
                                  <div className="absolute top-1/2 right-0 w-8 h-px bg-muted-foreground"></div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">Tournament bracket not available yet</p>
              {isInProgress && (
                <Button 
                  onClick={() => {/* Generate bracket */}} 
                  variant="link" 
                  className="mt-2 text-tableblue"
                >
                  Generate Bracket
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        {/* Teams View */}
        <TabsContent value="teams" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.map(team => {
              const player1 = team.player1Id ? mockPlayers.find(p => p.Id === team.player1Id) : null;
              const player2 = team.player2Id ? mockPlayers.find(p => p.Id === team.player2Id) : null;
              
              return (
                <Card key={team.id}>
                  <CardHeader>
                    <CardTitle className="text-xl">{team.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold">
                        {player1 ? player1.name.charAt(0) : '?'}
                      </div>
                      <div>
                        {player1 ? (
                          <>
                            <Link to={`/players/${player1.Id}`} className="font-medium hover:underline">
                              {player1.name}
                            </Link>
                            <div className="text-sm text-muted-foreground">{player1.department}</div>
                          </>
                        ) : (
                          <div className="text-muted-foreground">Player 1 (Not assigned)</div>
                        )}
                      </div>
                    </div>
                    
                    {(player2 || tournament.numberOfTeams <= teams.length * 2) && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold">
                          {player2 ? player2.name.charAt(0) : '?'}
                        </div>
                        <div>
                          {player2 ? (
                            <>
                              <Link to={`/players/${player2.Id}`} className="font-medium hover:underline">
                                {player2.name}
                              </Link>
                              <div className="text-sm text-muted-foreground">{player2.department}</div>
                            </>
                          ) : (
                            <div className="text-muted-foreground">Player 2 (Not assigned)</div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            
            {isUpcoming && teams.length < tournament.numberOfTeams && (
              <Card className="border-dashed">
                <CardContent className="flex items-center justify-center h-full p-8">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <PlusCircle className="h-5 w-5" />
                    <span>Register New Team</span>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        {/* Games View */}
        <TabsContent value="games" className="mt-6">
          <div className="space-y-6">
            {sortedRounds.map(round => (
              <div key={round}>
                <h3 className="text-lg font-semibold mb-4">
                  {round === 1 ? 'First Round' : 
                   round === 2 ? 'Semi Finals' : 
                   round === 3 ? 'Final' : `Round ${round}`}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gamesByRound[round]
                    .sort((a, b) => (a.matchOrder || 0) - (b.matchOrder || 0))
                    .map(game => {
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
              </div>
            ))}
            
            {games.length === 0 && (
              <div className="text-center p-8 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">No games scheduled yet</p>
                {isInProgress && (
                  <Button 
                    onClick={() => {/* Generate bracket */}} 
                    variant="link" 
                    className="mt-2 text-tableblue"
                  >
                    Generate Games
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TournamentDetails;
