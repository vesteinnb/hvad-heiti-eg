import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { GameSummary } from '../../types/database';

interface GameCardProps {
  game: GameSummary;
  onCopyLink?: (gameCode: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onCopyLink }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getGameStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'draft': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'completed': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'expired': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleCopyLink = () => {
    if (onCopyLink) {
      onCopyLink(game.game_code);
    } else {
      const url = `${window.location.origin}/game/${game.game_code}`;
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="bg-primary/5 rounded-lg p-4 shadow-sm border border-primary/10 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="font-heading font-medium text-base text-neutral-800 mb-1">{game.title}</div>
          <div className="text-xs font-mono text-primary bg-primary/10 rounded px-2 py-1 inline-block">
            Code: {game.game_code}
          </div>
        </div>
        <div className={`text-xs px-2 py-1 rounded border font-medium ${getGameStatusColor(game.status)}`}>
          {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
        </div>
      </div>
      
      <div className="text-xs text-neutral-600 font-body space-y-1">
        <div>Baby: {game.baby_first_name} {game.baby_middle_name} {game.baby_last_name}</div>
        <div>Dates: {formatDate(game.start_date)} - {formatDate(game.end_date)}</div>
        <div className="flex items-center gap-4">
          <span>👥 {game.total_players || 0} players</span>
          <span>🏆 {game.winners_count || 0} winners</span>
          <span>💭 {game.total_guesses || 0} guesses</span>
        </div>
      </div>
      
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => navigate(`/game/${game.game_code}`)}
          className="text-xs py-1.5 px-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-150 font-medium"
        >
          View Game
        </button>
        {game.status === 'active' && (
          <button
            onClick={handleCopyLink}
            className="text-xs py-1.5 px-3 rounded-lg bg-secondary/20 text-neutral-700 hover:bg-secondary/30 transition-all duration-150 font-medium"
          >
            Copy Link
          </button>
        )}
      </div>
    </div>
  );
};

export default GameCard;