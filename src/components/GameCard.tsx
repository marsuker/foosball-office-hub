
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Game, Player } from '../types/models';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface GameCardProps {
  game: Game;
  teamAPlayers: Player[];
  teamBPlayers: Player[];
  playerOfMatch?: Player;
  compact?: boolean;
}

const GameCard = ({ 
  game, 
  teamAPlayers, 
  teamBPlayers, 
  playerOfMatch,
  compact = false 
}: GameCardProps) => {
  const teamAWon = game.scoreTeamA > game.scoreTeamB;
  const isToday = new Date(game.datetime).toDateString() === new Date().toDateString();
  
  return (
    <Card className={`game-card overflow-hidden ${isToday ? 'border-tableblue border-2' : ''}`}>
      <CardContent className={compact ? "p-3" : "p-5"}>
        {isToday && (
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-tableblue text-white">Today</Badge>
          </div>
        )}
        
        {game.tournamentId && (
          <div className="mb-2 flex items-center gap-1">
            <Trophy size={16} className="text-highlight" />
            <span className="text-xs text-muted-foreground">{game.tournamentName}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            {format(new Date(game.datetime), 'MMM d, h:mm a')}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          {/* Team A */}
          <div className="flex flex-col items-center text-center">
            <div className="flex flex-col gap-1">
              {teamAPlayers.map((player) => (
                <Link to={`/players/${player.Id}`} key={player.Id} className="hover:underline">
                  {player.name}
                </Link>
              ))}
            </div>
            <div className={`text-2xl font-bold mt-2 ${teamAWon ? 'text-victory' : ''}`}>
              {game.scoreTeamA}
            </div>
          </div>
          
          {/* VS */}
          <div className="text-lg font-semibold text-muted-foreground mx-4">VS</div>
          
          {/* Team B */}
          <div className="flex flex-col items-center text-center">
            <div className="flex flex-col gap-1">
              {teamBPlayers.map((player) => (
                <Link to={`/players/${player.Id}`} key={player.Id} className="hover:underline">
                  {player.name}
                </Link>
              ))}
            </div>
            <div className={`text-2xl font-bold mt-2 ${!teamAWon ? 'text-victory' : ''}`}>
              {game.scoreTeamB}
            </div>
          </div>
        </div>
      </CardContent>
      
      {!compact && (
        <CardFooter className="bg-muted/50 px-5 py-3 flex justify-between">
          {playerOfMatch ? (
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-highlight" />
              <span className="text-sm">MVP: {playerOfMatch.name}</span>
            </div>
          ) : (
            <div></div>
          )}
          <Link 
            to={`/games/${game.id}`}
            className="text-sm text-tableblue hover:underline"
          >
            Match Details
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

export default GameCard;
