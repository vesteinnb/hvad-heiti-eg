import React from 'react';

type CluesSectionProps = {
  clues: string[];
  cluesRevealed: number;
  maxClues: number;
  onRevealClue: () => void;
};

const CluesSection: React.FC<CluesSectionProps> = ({ clues, cluesRevealed, maxClues, onRevealClue }) => {
  const isDisabled = cluesRevealed >= maxClues;
  return (
    <section className="w-full max-w-md flex flex-col items-center p-4">
      <div className="mb-3 w-full flex justify-between items-center">
        <span className="text-lg sm:text-xl font-body font-medium text-neutral-700" style={{fontWeight: 500}}>Clues Available: {maxClues - cluesRevealed}</span>
        <button
          type="button"
          onClick={onRevealClue}
          disabled={isDisabled}
          className={`ml-2 min-h-12 py-3 px-6 rounded-xl font-heading font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-secondary focus:ring-offset-2 hover:scale-105 active:scale-100 transform
            ${isDisabled
              ? 'bg-gradient-to-r from-gray-400 to-gray-500 opacity-75 cursor-not-allowed text-white'
              : 'bg-gradient-to-r from-secondary to-accent text-neutral-700 hover:bg-gradient-to-r hover:from-secondary/90 hover:to-accent/80'}
          `}
          style={{fontWeight: 600}}
          aria-disabled={isDisabled}
        >
          {isDisabled ? 'No More Clues' : 'Show Next Clue'}
        </button>
      </div>
      <ul className="space-y-4 w-full">
        {clues.slice(0, cluesRevealed).map((clue, idx, arr) => {
          const delayClass = `delay-${(idx + 1) * 100}`;
          return (
            <li
              key={idx}
              className={`bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200 p-6 flex items-start gap-3 opacity-80 animate-fade-slide-in ${delayClass}${idx !== arr.length - 1 ? ' mb-3' : ''}`}
              style={{
                filter: 'grayscale(0.2)',
                animation: `fadeSlideIn 0.3s cubic-bezier(.22,1,.36,1) both`,
                animationDelay: `${(idx + 1) * 100}ms`,
              }}
            >
              <span className="inline-block font-heading font-semibold text-base sm:text-lg rounded-lg px-3 py-1 bg-accent text-white mr-2 shadow-sm transition-all duration-200" style={{fontWeight: 600}}>{idx + 1}</span>
              <span className="font-body text-base sm:text-lg text-neutral-700 leading-relaxed transition-all duration-200" style={{fontWeight: 400}}>{clue}</span>
            </li>
          );
        })}
      </ul>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-slide-in {
          animation: fadeSlideIn 0.3s cubic-bezier(.22,1,.36,1) both;
        }
      `}</style>
    </section>
  );
};

export default CluesSection; 