import React from 'react';

interface GameStatsProps {
  finalTime: string;
  incorrectGuesses: number;
  cluesRevealed: number;
  totalClues: number;
  previousGuesses?: string[];
  formatGuess?: (guess: string) => string;
}

const GameStats: React.FC<GameStatsProps> = ({ 
  finalTime, 
  incorrectGuesses, 
  cluesRevealed, 
  totalClues, 
  previousGuesses = [],
  formatGuess = (guess) => guess
}) => {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 mt-4 w-full">
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex flex-col items-center flex-1">
          <span className="text-base font-body text-white/80 flex items-center gap-1" style={{textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>
            <span className="text-xl">⏰</span> Time
          </span>
          <span className="text-2xl font-mono font-bold text-white drop-shadow-sm" style={{textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>{finalTime}</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <span className="text-base font-body text-white/80 flex items-center gap-1" style={{textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>
            <span className="text-xl">❌</span> Wrong
          </span>
          <span className="text-2xl font-mono font-bold text-white drop-shadow-sm" style={{textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>{incorrectGuesses}</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <span className="text-base font-body text-white/80 flex items-center gap-1" style={{textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>
            <span className="text-xl">💡</span> Clues
          </span>
          <span className="text-2xl font-mono font-bold text-white drop-shadow-sm" style={{textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>{cluesRevealed} / {totalClues}</span>
        </div>
      </div>
      
      {previousGuesses.length > 0 && (
        <div className="mt-4 text-sm text-white/80 font-body bg-black/10 rounded-lg p-2 inline-block" style={{fontWeight: 400, lineHeight: 1.4, textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>
          Previous guesses: {previousGuesses.map(formatGuess).join(', ')}
        </div>
      )}
    </div>
  );
};

export default GameStats;