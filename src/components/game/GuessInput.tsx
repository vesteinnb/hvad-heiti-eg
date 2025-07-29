import React, { useState, useEffect, useRef } from 'react';
import AutocompleteInput from './AutocompleteInput';

interface GuessInputProps {
  onGuess: (guess: string) => void;
  disabled?: boolean;
  feedback?: string | null;
  incorrectGuesses?: number;
  previousGuesses?: string[];
  formatGuess?: (guess: string) => string;
}

const GuessInput: React.FC<GuessInputProps> = ({
  onGuess,
  disabled = false,
  feedback,
  incorrectGuesses = 0,
  previousGuesses = [],
  formatGuess = (g) => g,
}) => {
  const [guess, setGuess] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (feedback === 'error' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [feedback]);

  const handleSubmit = (guessValue?: string) => {
    const finalGuess = guessValue || guess;
    if (!disabled && finalGuess.trim()) {
      setLoading(true);
      setTimeout(() => {
        onGuess(finalGuess);
        setGuess('');
        setLoading(false);
      }, 1000);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const inputError = feedback === 'error';
  const inputPartial = feedback === 'partial';

  return (
    <form onSubmit={handleFormSubmit} className="w-full flex flex-col items-center gap-4 p-4 font-body" aria-label="Guess the baby name form">
      <label htmlFor="guess-input" className="sr-only">Enter your guess</label>
      <AutocompleteInput
        value={guess}
        onChange={setGuess}
        onSubmit={handleSubmit}
        placeholder="Type your guess (e.g. Ögmundur or Ölnir)"
        disabled={disabled || loading}
        loading={loading}
        autoFocus
        className={`w-full min-h-[44px] rounded-xl border-2 transition-all duration-200 py-4 px-6 text-base sm:text-lg font-body text-gray-900 placeholder-gray-500 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${inputError ? 'border-red-400 bg-red-50' : inputPartial ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'}`}
        aria-label="Guess the baby name"
        aria-invalid={inputError}
        aria-required="true"
      />
      
      <button
        type="submit"
        className={`w-full min-h-[44px] rounded-xl font-heading font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 py-3 px-6 hover:scale-105 active:scale-100 flex items-center justify-center gap-2 transform
          ${disabled || loading
            ? 'bg-gradient-to-r from-gray-400 to-gray-500 opacity-75 cursor-not-allowed text-white'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'}
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
      
      
      <div role="status" aria-live="polite" className="w-full">
        {feedback === 'success' && (
          <div className="w-full text-center mt-3 p-3 bg-green-100 border border-green-300 rounded-xl text-green-800 font-semibold animate-fade-in font-body">
            🎉 Correct! You won!
          </div>
        )}
        {feedback === 'error' && (
          <div className="w-full text-center mt-3 p-3 bg-red-100 border border-red-300 rounded-xl text-red-800 font-semibold animate-shake font-body">
            ❌ Not quite right. Try again!
          </div>
        )}
        {feedback === 'partial' && (
          <div className="w-full text-center mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded-xl text-yellow-800 font-semibold animate-fade-in font-body">
            ✨ You're on the right track!
          </div>
        )}
        {feedback === 'empty' && (
          <div className="w-full text-center mt-3 p-3 bg-orange-100 border border-orange-300 rounded-xl text-orange-800 font-semibold animate-shake font-body">
            ⚠️ Please enter a guess first!
          </div>
        )}
        {feedback === 'duplicate' && (
          <div className="w-full text-center mt-3 p-3 bg-blue-100 border border-blue-300 rounded-xl text-blue-800 font-semibold animate-shake font-body">
            🔄 You already tried that! Try something else.
          </div>
        )}
      </div>
      
      {/* Previous guesses - now displayed as a numbered list below feedback */}
      {previousGuesses.length > 0 && (
        <div className="w-full mt-4">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl p-4 shadow-sm">
            <h3 className="text-base font-semibold text-gray-800 mb-3 font-body">Previous Guesses:</h3>
            <ol className="space-y-2">
              {previousGuesses.map((guess, index) => (
                <li key={index} className="flex items-start gap-3 text-sm font-body">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-800 rounded-full text-xs font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 font-medium break-all">
                    {formatGuess(guess)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
      
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

export default GuessInput;