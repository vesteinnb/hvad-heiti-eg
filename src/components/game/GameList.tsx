import React from 'react';
import GameCard from './GameCard';
import type { GameSummary } from '../../types/database';

interface GameListProps {
  games: GameSummary[];
  loading: boolean;
  error: string | null;
  onRefresh?: () => void;
  onCopyLink?: (gameCode: string) => void;
}

const GameList: React.FC<GameListProps> = ({ games, loading, error, onRefresh, onCopyLink }) => {
  if (loading) {
    return (
      <div className="text-neutral-400 font-body text-sm flex items-center gap-2">
        <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
        Loading games...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-error font-body text-sm">{error}</div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-neutral-400 font-body text-sm text-center py-4">
        <div className="text-4xl mb-2">🎮</div>
        <div>No games created yet.</div>
        <div className="text-xs mt-1">Create your first game to get started!</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-lg font-heading font-semibold text-primary mb-1">Your Games</div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-sm text-primary hover:text-primary/80 underline font-medium"
          >
            Refresh
          </button>
        )}
      </div>
      
      <div className="flex flex-col gap-3">
        {games.map((game) => (
          <GameCard 
            key={game.id} 
            game={game} 
            onCopyLink={onCopyLink}
          />
        ))}
      </div>
    </div>
  );
};

export default GameList;