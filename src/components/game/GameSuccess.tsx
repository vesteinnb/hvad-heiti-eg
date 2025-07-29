import React, { useRef } from 'react';
import GameStats from './GameStats';

interface GameSuccessProps {
  babyName: string;
  finalTime: string;
  incorrectGuesses: number;
  cluesRevealed: number;
  totalClues: number;
  previousGuesses?: string[];
  formatGuess?: (guess: string) => string;
  onClose: () => void;
}

const GameSuccess: React.FC<GameSuccessProps> = ({
  babyName,
  finalTime,
  incorrectGuesses,
  cluesRevealed,
  totalClues,
  previousGuesses = [],
  formatGuess = (guess) => guess,
  onClose
}) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40" aria-hidden="true"></div>
      <div className="relative z-50 max-w-sm w-full mx-4 shadow-2xl rounded-2xl bg-gradient-to-br from-secondary via-accent to-primary animate-success-modal-enter transition-all duration-300 flex flex-col items-center p-6 mt-0 mb-0 max-h-[90vh] overflow-y-auto">
        <button
          ref={closeBtnRef}
          className="absolute top-3 right-3 text-white/80 hover:text-white bg-black/30 rounded-lg p-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 z-50"
          aria-label="Close success modal"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex justify-center mb-2">
          <span className="text-5xl sm:text-6xl drop-shadow-lg animate-bounce">🎉</span>
        </div>
        
        <div className="text-3xl sm:text-4xl font-heading font-extrabold text-white drop-shadow-lg" style={{fontWeight: 800, letterSpacing: '-0.01em', textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>
          Congratulations!
        </div>
        
        <div className="flex justify-center">
          <div className="bg-black/10 rounded-lg p-2 inline-block">
            <span className="text-lg sm:text-xl font-body text-white/90 mb-2" style={{fontWeight: 400, lineHeight: 1.4, textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>
              You guessed <span className='font-semibold bg-white/30 text-white px-2 py-1 rounded'>{babyName}</span> correctly!
            </span>
          </div>
        </div>
        
        <GameStats
          finalTime={finalTime}
          incorrectGuesses={incorrectGuesses}
          cluesRevealed={cluesRevealed}
          totalClues={totalClues}
          previousGuesses={previousGuesses}
          formatGuess={formatGuess}
        />
      </div>
      
      <style>{`
        @keyframes successModalEnter {
          0% { opacity: 0; transform: scale(0.95) translateY(32px); }
          80% { opacity: 1; transform: scale(1.03) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-success-modal-enter {
          animation: successModalEnter 0.5s cubic-bezier(.22,1,.36,1) both;
        }
      `}</style>
    </div>
  );
};

export default GameSuccess;