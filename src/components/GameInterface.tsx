import React, { useState, useEffect, useRef } from 'react';

type GameInterfaceProps = {
  score: number;
  onGuess: (guess: string) => void;
  disabled?: boolean;
  feedback?: string | null;
  incorrectGuesses?: number;
  previousGuesses?: string[];
  formatGuess?: (guess: string) => string;
  username?: string;
};

const GameInterface: React.FC<GameInterfaceProps> = ({
  score,
  onGuess,
  disabled = false,
  feedback,
  incorrectGuesses = 0,
  previousGuesses = [],
  formatGuess = (g) => g,
  username,
}) => {
  const [guess, setGuess] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (feedback === 'error' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [feedback]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && guess.trim()) {
      setLoading(true);
      setTimeout(() => {
        onGuess(guess);
        setGuess('');
        setLoading(false);
      }, 1000);
    }
  };

  const inputError = feedback === 'error';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col items-center gap-4 p-4 font-body" aria-label="Guess the baby name form">
      <label htmlFor="guess-input" className="sr-only">Enter your guess</label>
      <input
        ref={inputRef}
        id="guess-input"
        type="text"
        inputMode="text"
        autoComplete="off"
        value={guess}
        onChange={e => setGuess(e.target.value)}
        placeholder="Type your guess (e.g. Emma)"
        className={`w-full min-h-[44px] rounded-xl border-2 transition-all duration-200 py-4 px-6 text-base sm:text-lg font-body text-neutral-800 placeholder-neutral-500 bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary/80 focus:ring-offset-2 focus:border-primary/60 disabled:bg-neutral-100 disabled:cursor-not-allowed ${inputError ? 'border-error' : 'border-gray-300'}`}
        autoFocus
        disabled={disabled || loading}
        style={{fontWeight: 400, lineHeight: 1.5}}
        aria-label="Guess the baby name"
        aria-invalid={inputError}
        aria-required="true"
      />
      <button
        type="submit"
        className={`w-full min-h-[44px] rounded-xl font-heading font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-primary/80 focus:ring-offset-2 py-3 px-6 hover:scale-105 active:scale-100 flex items-center justify-center gap-2 transform
          ${disabled || loading
            ? 'bg-gradient-to-r from-gray-400 to-gray-500 opacity-75 cursor-not-allowed text-white'
            : 'bg-gradient-to-r from-primary to-primary/80 text-white hover:bg-gradient-to-r hover:from-primary/90 hover:to-primary/70'}
        `}
        disabled={disabled || loading}
        style={{fontWeight: 600, textShadow: !disabled && !loading ? '0 1px 2px rgba(0,0,0,0.12)' : undefined}}
        aria-disabled={disabled || loading}
        aria-label="Submit guess"
      >
        {loading && (
          <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-label="Loading"></span>
        )}
        Guess
      </button>
      <div className="w-full flex justify-center">
        <div className="inline-flex items-center gap-2 bg-neutral-50 border border-gray-200 rounded-lg px-4 py-2 text-base sm:text-lg font-body font-medium text-neutral-800 shadow-sm min-h-[44px]">
          <span className="font-bold">Incorrect Guesses:</span>
          <span className="font-mono text-lg">{incorrectGuesses}</span>
        </div>
      </div>
      {previousGuesses.length > 0 && (
        <div
          className="w-full text-xs sm:text-sm text-neutral-700 mb-1 text-center overflow-x-auto whitespace-nowrap px-1 font-body scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent"
          style={{ WebkitOverflowScrolling: 'touch', wordBreak: 'break-word', fontWeight: 400, lineHeight: 1.4, minHeight: 24 }}
          aria-label="Previous guesses"
        >
          Previous guesses: {previousGuesses.map(formatGuess).join(', ')}
        </div>
      )}
      <div role="status" aria-live="polite" className="w-full">
        {feedback === 'success' && (
          <div className="w-full text-center mt-2 text-secondary font-semibold animate-fade-in font-body" style={{fontWeight: 600}}>Correct! 🎉</div>
        )}
        {feedback === 'error' && (
          <div className="w-full text-center mt-2 text-error font-semibold animate-shake font-body" style={{fontWeight: 600}}>That's not correct. Try again!</div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s;
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
          100% { transform: translateX(0); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </form>
  );
};

export default GameInterface; 