import React from 'react';

interface ClueEditorProps {
  clues: string[];
  clueErrors: string[];
  maxClues: number;
  minClues: number;
  clueLimit: number;
  disabled?: boolean;
  onClueChange: (index: number, value: string) => void;
  onAddClue: () => void;
  onRemoveClue: (index: number) => void;
}

const ClueEditor: React.FC<ClueEditorProps> = ({
  clues,
  clueErrors,
  maxClues,
  minClues,
  clueLimit,
  disabled = false,
  onClueChange,
  onAddClue,
  onRemoveClue
}) => {
  return (
    <div>
      <div className="text-lg font-heading font-semibold text-primary mb-2 mt-2">
        Clues <span className="text-error">*</span>
      </div>
      
      <div className="flex flex-col gap-3">
        {clues.map((clue, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <input
              type="text"
              className={`flex-1 rounded-xl border-2 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 min-h-[48px] ${clueErrors[idx] ? 'border-error' : 'border-gray-200'}`}
              placeholder={`Clue #${idx + 1}`}
              maxLength={clueLimit}
              value={clue}
              onChange={e => onClueChange(idx, e.target.value)}
              aria-invalid={!!clueErrors[idx]}
              aria-describedby={`clue-error-${idx}`}
              disabled={disabled}
            />
            {clues.length > minClues && (
              <button
                type="button"
                className="mt-1 px-2 py-1 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-all duration-150 text-lg font-bold"
                onClick={() => onRemoveClue(idx)}
                aria-label="Remove clue"
                disabled={disabled}
              >
                ×
              </button>
            )}
          </div>
        ))}
        
        {clueErrors.some(Boolean) && (
          <div className="text-error text-xs mt-1">
            {clueErrors.map((err, idx) => err && (
              <div key={idx} id={`clue-error-${idx}`}>
                {`Clue #${idx + 1}: ${err}`}
              </div>
            ))}
          </div>
        )}
        
        <button
          type="button"
          className="mt-1 py-2 px-4 rounded-xl font-heading font-medium text-base bg-gradient-to-r from-primary to-primary/80 text-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={onAddClue}
          disabled={clues.length >= maxClues || disabled}
        >
          + Add Clue
        </button>
      </div>
    </div>
  );
};

export default ClueEditor;