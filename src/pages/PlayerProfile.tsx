
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Player, Game } from '../types/models';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Users, CalendarDays, Star, PlusCircle } from 'lucide-react';
import GameCard from '../components/GameCard';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

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
  // More players...
];

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const mockGames: Game[] = [
  {
    id: '1',
    teamAPlayer1Id: '1',
    teamAPlayer2Id: '2',
    teamBPlayer1Id: '3',
    teamBPlayer2Id: '4',
    scoreTeamA: 10,
    scoreTeamB: 5,
    playerOfMatchId: '1',
    datetime: today.getTime(),
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
    datetime: yesterday.getTime(),
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
];

const PlayerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [preferredPartner, setPreferredPartner] = useState<Player | null>(null);
  const [playerGames, setPlayerGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulated API call
    const fetchedPlayer = mockPlayers.find(p => p.Id === id) || null;
    setPlayer(fetchedPlayer);
    
    if (fetchedPlayer?.preferredPartnerId) {
      const partner = mockPlayers.find(p => p.Id === fetchedPlayer.preferredPartnerId);
      setPreferredPartner(partner || null);
    }
    
    // Get games for this player
    const games = mockGames.filter(g => 
      g.teamAPlayer1Id === id || 
      g.teamAPlayer2Id === id || 
      g.teamBPlayer1Id === id || 
      g.teamBPlayer2Id === id
    );
    setPlayerGames(games);
    
    setLoading(false);
  }, [id]);
  
  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }
  
  if (!player) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Player Not Found</h1>
        <Link to="/players">
          <Button variant="link">Back to Players</Button>
        </Link>
      </div>
    );
  }
  
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

  const skillStars = Array.from({ length: 5 }, (_, i) => i < player.skillLevel);
  const winRate = player.totalGames > 0 
    ? Math.round((player.totalWins / player.totalGames) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Link to="/players">
            <Button variant="ghost" size="sm">
              ← Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Player Profile</h1>
        </div>
        <div className="flex gap-3">
          <Link to={`/players/${player.Id}/edit`}>
            <Button variant="outline">Edit Profile</Button>
          </Link>
          <Link to={`/games/new?challenge=${player.Id}`}>
            <Button className="bg-tableblue hover:bg-blue-600 text-white">
              Challenge Player
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Player Info Card */}
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-primary/10 mb-4">
              {player.photoUrl ? (
                <img 
                  src={player.photoUrl} 
                  alt={player.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-bold">
                  {player.name.charAt(0)}
                </div>
              )}
            </div>
            
            <h2 className="text-2xl font-bold">{player.name}</h2>
            {player.nickname && (
              <p className="text-lg text-muted-foreground">"{player.nickname}"</p>
            )}
            
            <div className="mt-2 px-3 py-1 bg-muted/70 rounded text-sm">
              {player.department}
            </div>
            
            <div className="mt-4 skill-level">
              {skillStars.map((filled, i) => (
                <span key={i} className={filled ? 'text-highlight text-xl' : 'text-muted-foreground text-xl'}>
                  ★
                </span>
              ))}
            </div>
            
            <div className="mt-6 w-full">
              <h3 className="text-sm text-muted-foreground uppercase font-semibold">Preferred Partner</h3>
              {preferredPartner ? (
                <Link 
                  to={`/players/${preferredPartner.Id}`}
                  className="flex items-center mt-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 mr-3">
                    {preferredPartner.photoUrl ? (
                      <img 
                        src={preferredPartner.photoUrl} 
                        alt={preferredPartner.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                        {preferredPartner.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{preferredPartner.name}</div>
                    <div className="text-sm text-muted-foreground">{preferredPartner.department}</div>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center justify-center mt-2 p-3 bg-muted/50 rounded-lg">
                  <PlusCircle className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-muted-foreground">No preferred partner set</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 w-full">
              <h3 className="text-sm text-muted-foreground uppercase font-semibold mb-2">Member Since</h3>
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{format(new Date(player.createdAt), 'MMMM d, yyyy')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats and Recent Games */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-5 text-center">
                <div className="text-4xl font-bold text-tableblue">{player.totalGames}</div>
                <div className="text-sm text-muted-foreground mt-1">Games Played</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-5 text-center">
                <div className="text-4xl font-bold text-victory">{player.totalWins}</div>
                <div className="text-sm text-muted-foreground mt-1">Wins</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-5 text-center">
                <div className="text-4xl font-bold text-tableblue">{winRate}%</div>
                <div className="text-sm text-muted-foreground mt-1">Win Rate</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-5 text-center">
                <div className="text-4xl font-bold text-highlight">{player.totalGoals}</div>
                <div className="text-sm text-muted-foreground mt-1">Goals Scored</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Streaks */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center mb-3">
                <Star className="h-5 w-5 mr-2 text-highlight" />
                <h3 className="text-lg font-semibold">Streaks</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Current Streak</div>
                  <div className={`text-xl font-bold mt-1 ${player.currentStreak > 0 ? 'text-victory' : player.currentStreak < 0 ? 'text-defeat' : ''}`}>
                    {player.currentStreak > 0 ? `${player.currentStreak} Wins` : 
                     player.currentStreak < 0 ? `${Math.abs(player.currentStreak)} Losses` : 'No Streak'}
                  </div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Best Win Streak</div>
                  <div className="text-xl font-bold mt-1 text-victory">{player.winStreak} Wins</div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Worst Loss Streak</div>
                  <div className="text-xl font-bold mt-1 text-defeat">{player.lossStreak} Losses</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Games Tab */}
          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="recent">Recent Games</TabsTrigger>
              <TabsTrigger value="stats">Performance Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent" className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Matches</h3>
              
              {playerGames.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {playerGames.map(game => {
                    const { teamAPlayers, teamBPlayers, playerOfMatch } = getPlayersForGame(game);
                    
                    // Determine if this player won the game
                    const playerInTeamA = teamAPlayers.some(p => p.Id === player.Id);
                    const playerWon = playerInTeamA 
                      ? game.scoreTeamA > game.scoreTeamB 
                      : game.scoreTeamB > game.scoreTeamA;
                    
                    return (
                      <div key={game.id} className="flex items-center">
                        <Badge 
                          variant="outline" 
                          className={`mr-3 ${playerWon ? 'bg-victory text-white' : 'bg-defeat text-white'}`}
                        >
                          {playerWon ? 'W' : 'L'}
                        </Badge>
                        <div className="flex-grow">
                          <GameCard
                            game={game}
                            teamAPlayers={teamAPlayers}
                            teamBPlayers={teamBPlayers}
                            playerOfMatch={playerOfMatch}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-6 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">No recent games found</p>
                </div>
              )}
              
              <div className="flex justify-center mt-4">
                <Link to="/games">
                  <Button variant="outline">View All Games</Button>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="stats">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Performance Stats</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-tableblue" 
                          style={{ width: `${winRate}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-sm mt-1">{winRate}%</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Goals per Game</div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-highlight" 
                          style={{ width: `${player.totalGames > 0 ? Math.min((player.totalGoals / player.totalGames) * 20, 100) : 0}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-sm mt-1">
                        {player.totalGames > 0 ? (player.totalGoals / player.totalGames).toFixed(1) : 0} goals/game
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">MVP Rate</div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-victory" 
                          style={{ width: '30%' }}  // Mock data - would calculate from actual MVP count
                        ></div>
                      </div>
                      <div className="text-right text-sm mt-1">30%</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Game History</h4>
                    <div className="flex flex-wrap gap-1">
                      {Array.from({ length: Math.min(player.totalGames, 20) }).map((_, i) => {
                        // Mock game results - in a real app this would be actual game data
                        const won = i % 2 === 0 || i % 5 === 0;
                        return (
                          <div 
                            key={i} 
                            className={`w-5 h-5 rounded-sm ${won ? 'bg-victory' : 'bg-defeat'}`}
                            title={`Game ${i+1}: ${won ? 'Win' : 'Loss'}`}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
