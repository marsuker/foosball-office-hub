
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Game, Player } from '../types/models';
import GameCard from '../components/GameCard';
import { Search, Plus, ChevronDown, CalendarDays } from 'lucide-react';
import { format, isToday, isPast, isFuture } from 'date-fns';

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

const now = Date.now();
const yesterday = now - 24 * 60 * 60 * 1000;
const tomorrow = now + 24 * 60 * 60 * 1000;

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
    datetime: now,
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
    datetime: yesterday,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '3',
    teamAPlayer1Id: '2',
    teamAPlayer2Id: '4',
    teamBPlayer1Id: '1',
    teamBPlayer2Id: '3',
    scoreTeamA: 0,
    scoreTeamB: 0,
    playerOfMatchId: null,
    datetime: tomorrow,
    tournamentId: '1',
    tournamentName: 'Summer Championship',
    tournamentRound: 1,
    teamAName: 'Design Stars',
    teamBName: 'Engineering Pros',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

const GamesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState<Game[]>(mockGames);
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');
  
  // Filter games based on search and time filter
  const filteredGames = games
    .filter(game => {
      // Player search filter
      if (searchTerm) {
        const teamAPlayer1 = mockPlayers.find(p => p.Id === game.teamAPlayer1Id);
        const teamAPlayer2 = game.teamAPlayer2Id ? mockPlayers.find(p => p.Id === game.teamAPlayer2Id) : null;
        const teamBPlayer1 = mockPlayers.find(p => p.Id === game.teamBPlayer1Id);
        const teamBPlayer2 = game.teamBPlayer2Id ? mockPlayers.find(p => p.Id === game.teamBPlayer2Id) : null;
        
        const playerNames = [
          teamAPlayer1?.name || '',
          teamAPlayer2?.name || '',
          teamBPlayer1?.name || '',
          teamBPlayer2?.name || '',
          game.tournamentName || ''
        ].map(name => name.toLowerCase());
        
        return playerNames.some(name => name.includes(searchTerm.toLowerCase()));
      }
      return true;
    })
    .filter(game => {
      // Time filter
      const gameDate = new Date(game.datetime);
      
      switch (filter) {
        case 'today':
          return isToday(gameDate);
        case 'upcoming':
          return isFuture(gameDate);
        case 'past':
          return isPast(gameDate) && !isToday(gameDate);
        default:
          return true;
      }
    })
    // Sort games by date, most recent first for past games and soonest first for upcoming
    .sort((a, b) => {
      if (filter === 'past') {
        return b.datetime - a.datetime;
      }
      return a.datetime - b.datetime;
    });
  
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
  
  // Group games by date for better display
  const groupedGames: {[key: string]: Game[]} = {};
  
  filteredGames.forEach(game => {
    const dateString = format(new Date(game.datetime), 'yyyy-MM-dd');
    if (!groupedGames[dateString]) {
      groupedGames[dateString] = [];
    }
    groupedGames[dateString].push(game);
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Games</h1>
        <Link to="/games/new">
          <Button className="bg-tableblue hover:bg-blue-600 text-white">
            <Plus className="mr-1 h-4 w-4" />
            Create a Match
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search games..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="sm:w-auto w-full">
              {filter === 'all' ? 'All Games' : 
               filter === 'today' ? 'Today' : 
               filter === 'upcoming' ? 'Upcoming' : 'Past Games'}
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilter('all')}>All Games</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('today')}>Today</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('upcoming')}>Upcoming</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('past')}>Past Games</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {Object.keys(groupedGames).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedGames).map(([dateString, dateGames]) => {
            const displayDate = isToday(new Date(dateString))
              ? 'Today'
              : format(new Date(dateString), 'EEEE, MMMM d, yyyy');
              
            return (
              <div key={dateString}>
                <div className="flex items-center mb-3">
                  <CalendarDays className="mr-2 h-5 w-5 text-muted-foreground" />
                  <h2 className="text-xl font-semibold">{displayDate}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dateGames.map(game => {
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
            );
          })}
        </div>
      ) : (
        <div className="text-center p-8 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">No games found</p>
          <Link to="/games/new">
            <Button variant="link" className="mt-2 text-tableblue">
              Create a Match
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default GamesPage;
