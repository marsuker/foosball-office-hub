
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Search, Plus, Trophy, CalendarDays, Users } from 'lucide-react';
import { Tournament } from '../types/models';
import { format, isFuture, isPast } from 'date-fns';

// Mock data
const mockTournaments: Tournament[] = [
  {
    id: '1',
    name: 'Summer Championship',
    description: 'The ultimate summer table football championship!',
    startDate: Date.now() + 1000000,  // Future date
    endDate: Date.now() + 5000000,
    numberOfTeams: 8,
    isActive: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '2',
    name: 'Department Challenge',
    description: 'Department vs Department - Who will win the office crown?',
    startDate: Date.now() - 5000000, // Past date
    endDate: Date.now() + 1000000,
    numberOfTeams: 4,
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '3',
    name: 'Winter Cup',
    description: 'Celebrate the holiday season with our winter tournament',
    startDate: Date.now() - 10000000, // Past date
    endDate: Date.now() - 5000000,
    numberOfTeams: 8,
    isActive: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

const TournamentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tournaments, setTournaments] = useState<Tournament[]>(mockTournaments);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'upcoming' | 'past'>('all');
  
  // Filter tournaments
  const filteredTournaments = tournaments
    .filter(tournament => 
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (tournament.description && tournament.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(tournament => {
      switch (activeTab) {
        case 'active':
          return tournament.isActive;
        case 'upcoming':
          return !tournament.isActive && isFuture(new Date(tournament.startDate));
        case 'past':
          return !tournament.isActive && isPast(new Date(tournament.endDate));
        default:
          return true;
      }
    });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Tournaments</h1>
        <Link to="/tournaments/new">
          <Button className="bg-tableblue hover:bg-blue-600 text-white">
            <Plus className="mr-1 h-4 w-4" />
            Create Tournament
          </Button>
        </Link>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search tournaments..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Tabs 
        defaultValue="all" 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
      >
        <TabsList className="grid w-full sm:w-[600px] grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">In Progress</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderTournamentCards(filteredTournaments)}
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderTournamentCards(filteredTournaments)}
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderTournamentCards(filteredTournaments)}
          </div>
        </TabsContent>
        
        <TabsContent value="past" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderTournamentCards(filteredTournaments)}
          </div>
        </TabsContent>
      </Tabs>
      
      {filteredTournaments.length === 0 && (
        <div className="text-center p-8 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">No tournaments found</p>
        </div>
      )}
    </div>
  );
  
  function renderTournamentCards(tournaments: Tournament[]) {
    return tournaments.map(tournament => {
      const isUpcoming = !tournament.isActive && isFuture(new Date(tournament.startDate));
      const isActive = tournament.isActive;
      const isPastTournament = !tournament.isActive && isPast(new Date(tournament.endDate));
      
      return (
        <Card key={tournament.id} className="overflow-hidden">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{tournament.name}</CardTitle>
                {tournament.description && (
                  <CardDescription className="mt-1">{tournament.description}</CardDescription>
                )}
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                <Trophy className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {format(new Date(tournament.startDate), 'MMM d')} - {format(new Date(tournament.endDate), 'MMM d, yyyy')}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{tournament.numberOfTeams} Teams</span>
              </div>
              
              <div>
                {isActive && (
                  <Badge className="bg-highlight text-white">In Progress</Badge>
                )}
                
                {isUpcoming && (
                  <Badge className="bg-tableblue text-white">Upcoming</Badge>
                )}
                
                {isPastTournament && (
                  <Badge variant="outline">Completed</Badge>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="bg-muted/50 flex justify-between">
            <span className="text-sm text-muted-foreground">
              {isUpcoming ? 'Starting Soon' : isActive ? 'Join Now' : 'View Results'}
            </span>
            
            <Link to={`/tournaments/${tournament.id}`}>
              <Button variant="ghost" className="text-tableblue">
                {isUpcoming ? 'Sign Up' : 'View Details'}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      );
    });
  }
};

export default TournamentsPage;
