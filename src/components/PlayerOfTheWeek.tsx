
import { Player } from '../types/models';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Award, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface PlayerOfTheWeekProps {
  player: Player;
  stats: {
    gamesPlayed: number;
    goalsScored: number;
    winRate: number;
  };
}

const PlayerOfTheWeek = ({ player, stats }: PlayerOfTheWeekProps) => {
  return (
    <Card className="overflow-hidden border-2 border-highlight">
      <div className="bg-highlight text-white p-3 flex items-center justify-center gap-2">
        <Trophy className="h-5 w-5" />
        <h3 className="font-bold text-lg">Player of the Week</h3>
      </div>
      
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-highlight">
                {player.photoUrl ? (
                  <img 
                    src={player.photoUrl} 
                    alt={player.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-3xl font-bold">
                    {player.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute -right-2 -bottom-2 bg-highlight text-white rounded-full p-1">
                <Award className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-xl font-bold mb-1">{player.name}</h2>
            {player.nickname && (
              <p className="text-sm text-muted-foreground">"{player.nickname}"</p>
            )}
            <p className="text-sm text-muted-foreground mb-3">{player.department}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
              <div className="flex flex-col items-center bg-muted/50 px-3 py-2 rounded">
                <span className="text-lg font-bold text-tableblue">{stats.gamesPlayed}</span>
                <span className="text-xs text-muted-foreground">Games</span>
              </div>
              
              <div className="flex flex-col items-center bg-muted/50 px-3 py-2 rounded">
                <span className="text-lg font-bold text-tableblue">{stats.goalsScored}</span>
                <span className="text-xs text-muted-foreground">Goals</span>
              </div>
              
              <div className="flex flex-col items-center bg-muted/50 px-3 py-2 rounded">
                <span className="text-lg font-bold text-tableblue">{stats.winRate}%</span>
                <span className="text-xs text-muted-foreground">Win Rate</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center md:justify-start gap-1 mb-3">
              <Star className="h-4 w-4 text-highlight" />
              <span className="text-sm">Currently on a {player.currentStreak} win streak!</span>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <Link to={`/players/${player.Id}`}>
              <Button className="bg-tableblue hover:bg-blue-600 text-white">
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerOfTheWeek;
