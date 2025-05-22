
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
import { Player } from '../types/models';
import PlayerCard from '../components/PlayerCard';
import { Search, Plus, ChevronDown } from 'lucide-react';

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
  {
    Id: '5',
    name: 'David Wilson',
    nickname: 'Speedster',
    department: 'Sales',
    photoUrl: '',
    skillLevel: 3,
    preferredPartnerId: null,
    currentStreak: 2,
    winStreak: 2,
    lossStreak: 0,
    totalGames: 18,
    totalWins: 10,
    totalGoals: 15,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    Id: '6',
    name: 'Jessica Brown',
    nickname: 'The Tactician',
    department: 'Finance',
    photoUrl: '',
    skillLevel: 4,
    preferredPartnerId: null,
    currentStreak: -1,
    winStreak: 0,
    lossStreak: 1,
    totalGames: 12,
    totalWins: 7,
    totalGoals: 9,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

const PlayersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [sortBy, setSortBy] = useState<string>('name');
  
  const sortedPlayers = [...players].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'skill':
        return b.skillLevel - a.skillLevel;
      case 'wins':
        return b.totalWins - a.totalWins;
      case 'games':
        return b.totalGames - a.totalGames;
      case 'streak':
        return b.currentStreak - a.currentStreak;
      default:
        return 0;
    }
  });
  
  const filteredPlayers = sortedPlayers.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    player.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Players</h1>
        <Link to="/players/new">
          <Button className="bg-tableblue hover:bg-blue-600 text-white">
            <Plus className="mr-1 h-4 w-4" />
            Add Player
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search players..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="sm:w-auto w-full">
              Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortBy('name')}>Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('skill')}>Skill Level</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('wins')}>Total Wins</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('games')}>Total Games</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('streak')}>Current Streak</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPlayers.map(player => (
            <PlayerCard key={player.Id} player={player} />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">No players found</p>
        </div>
      )}
    </div>
  );
};

export default PlayersPage;
