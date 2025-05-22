
import { Trophy, Calendar } from 'lucide-react';
import { Tournament } from '../types/models';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface TournamentBannerProps {
  tournament: Tournament;
}

const TournamentBanner = ({ tournament }: TournamentBannerProps) => {
  const startDate = new Date(tournament.startDate);
  const endDate = new Date(tournament.endDate);
  const isUpcoming = startDate > new Date();
  const isOngoing = startDate <= new Date() && endDate >= new Date();
  
  return (
    <Card className={`
      overflow-hidden border-l-4 
      ${isUpcoming ? 'border-l-tableblue' : isOngoing ? 'border-l-highlight animate-pulse-soft' : ''}
    `}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Trophy className="h-6 w-6 text-tableblue" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{tournament.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm">
              {isUpcoming ? (
                <Badge variant="outline" className="bg-tableblue text-white">Upcoming</Badge>
              ) : isOngoing ? (
                <Badge variant="outline" className="bg-highlight text-white">In Progress</Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-500 text-white">Completed</Badge>
              )}
            </div>
            <Link to={`/tournaments/${tournament.id}`}>
              <Button variant="outline" className="text-tableblue border-tableblue hover:bg-tableblue hover:text-white">
                {isUpcoming ? 'Sign Up' : 'View Details'}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentBanner;
