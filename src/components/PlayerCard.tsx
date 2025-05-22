
import { Link } from 'react-router-dom';
import { Player } from '../types/models';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PlayerCardProps {
  player: Player;
  compact?: boolean;
}

const PlayerCard = ({ player, compact = false }: PlayerCardProps) => {
  const skillStars = Array.from({ length: 5 }, (_, i) => i < player.skillLevel);
  
  return (
    <Card className="player-card h-full flex flex-col">
      <CardContent className={`flex flex-col items-center ${compact ? 'p-3' : 'p-5'}`}>
        <div className="w-20 h-20 mb-3 rounded-full bg-gray-200 overflow-hidden">
          {player.photoUrl ? (
            <img 
              src={player.photoUrl} 
              alt={player.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xl font-bold">
              {player.name.charAt(0)}
            </div>
          )}
        </div>
        
        <h3 className="font-semibold text-center">{player.name}</h3>
        
        {player.nickname && (
          <p className="text-sm text-muted-foreground mb-1">"{player.nickname}"</p>
        )}
        
        <p className="text-xs text-muted-foreground mb-3">{player.department}</p>
        
        <div className="skill-level mb-3">
          {skillStars.map((filled, i) => (
            <span key={i} className={filled ? 'text-highlight' : 'text-muted-foreground'}>
              ★
            </span>
          ))}
        </div>
        
        {!compact && (
          <>
            <div className="w-full flex justify-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                Games: {player.totalGames}
              </Badge>
              <Badge variant="outline" className="text-xs bg-victory text-white">
                Wins: {player.totalWins}
              </Badge>
            </div>
            
            {player.currentStreak !== 0 && (
              <Badge 
                variant="outline" 
                className={`
                  ${player.currentStreak > 0 ? 'bg-victory text-white' : 'bg-defeat text-white'}
                `}
              >
                {player.currentStreak > 0 ? `${player.currentStreak} Win Streak` : `${Math.abs(player.currentStreak)} Loss Streak`}
              </Badge>
            )}
          </>
        )}
      </CardContent>
      
      {!compact && (
        <CardFooter className="mt-auto border-t p-3 pt-3">
          <Link 
            to={`/players/${player.Id}`}
            className="text-sm text-tableblue hover:underline w-full text-center"
          >
            View Profile
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

export default PlayerCard;
