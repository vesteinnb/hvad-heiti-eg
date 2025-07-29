import React from 'react';
import Card from './Card';

export type GameStatus = 'draft' | 'active' | 'completed' | 'expired';

interface GameCardProps {
  title: string;
  gameCode: string;
  status: GameStatus;
  babyFirstName: string;
  babyMiddleName?: string | null;
  babyLastName?: string | null;
  startDate: string;
  endDate: string;
  totalPlayers?: number;
  winnersCount?: number;
  totalGuesses?: number;
  onView?: () => void;
  onCopyLink?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  className?: string;
}

const GameCard: React.FC<GameCardProps> = ({
  title,
  gameCode,
  status,
  babyFirstName,
  babyMiddleName,
  babyLastName,
  startDate,
  endDate,
  totalPlayers = 0,
  winnersCount = 0,
  totalGuesses = 0,
  onView,
  onCopyLink,
  onDelete,
  isDeleting = false,
  className = '',
}) => {
  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get status styling
  const getStatusBadgeClasses = (gameStatus: GameStatus) => {
    const baseClasses = 'text-xs px-2 py-1 rounded border font-medium';
    
    switch (gameStatus) {
      case 'active':
        return `${baseClasses} text-green-600 bg-green-50 border-green-200`;
      case 'draft':
        return `${baseClasses} text-blue-600 bg-blue-50 border-blue-200`;
      case 'completed':
        return `${baseClasses} text-purple-600 bg-purple-50 border-purple-200`;
      case 'expired':
        return `${baseClasses} text-gray-600 bg-gray-50 border-gray-200`;
      default:
        return `${baseClasses} text-gray-600 bg-gray-50 border-gray-200`;
    }
  };

  // Format baby name
  const babyName = [babyFirstName, babyMiddleName, babyLastName]
    .filter(Boolean)
    .join(' ');

  return (
    <Card variant="game" className={className}>
      {/* Header with title and status */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="font-heading font-medium text-base text-neutral-800 mb-1">
            {title}
          </div>
          <div className="text-xs font-mono text-primary bg-primary/10 rounded px-2 py-1 inline-block">
            Code: {gameCode}
          </div>
        </div>
        <div className={getStatusBadgeClasses(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>

      {/* Game details */}
      <div className="text-xs text-neutral-600 font-body space-y-1 mb-3">
        <div>Baby: {babyName}</div>
        <div>Dates: {formatDate(startDate)} - {formatDate(endDate)}</div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span>👥</span>
            <span>{totalPlayers} players</span>
          </span>
          <span className="flex items-center gap-1">
            <span>🏆</span>
            <span>{winnersCount} winners</span>
          </span>
          <span className="flex items-center gap-1">
            <span>💭</span>
            <span>{totalGuesses} guesses</span>
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {onView && (
          <button
            onClick={onView}
            className="text-xs py-1.5 px-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-150 font-medium"
          >
            View Game
          </button>
        )}
        
        {onCopyLink && status === 'active' && (
          <button
            onClick={onCopyLink}
            className="text-xs py-1.5 px-3 rounded-lg bg-secondary/20 text-neutral-700 hover:bg-secondary/30 transition-all duration-150 font-medium"
          >
            Copy Link
          </button>
        )}
        
        {onDelete && (
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="text-xs py-1.5 px-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-150 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {isDeleting ? (
              <>
                <span className="inline-block w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin"></span>
                Deleting...
              </>
            ) : (
              <>
                <span>🗑️</span>
                Delete
              </>
            )}
          </button>
        )}
      </div>
    </Card>
  );
};

export default GameCard;