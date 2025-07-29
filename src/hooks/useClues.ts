import { useState } from 'react';
import { usePlayer } from './usePlayer';

interface UseCluesReturn {
  cluesRevealed: number;
  canRevealMore: (maxClues: number) => boolean;
  revealNextClue: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useClues = (initialCluesRevealed: number = 0): UseCluesReturn => {
  const [cluesRevealed, setCluesRevealed] = useState(initialCluesRevealed);
  const { revealClue, loading, error } = usePlayer();

  const canRevealMore = (maxClues: number): boolean => {
    return cluesRevealed < maxClues;
  };

  const revealNextClue = async () => {
    try {
      await revealClue();
      setCluesRevealed(prev => prev + 1);
    } catch (err) {
      // Error is already handled in usePlayer hook
      throw err;
    }
  };

  return {
    cluesRevealed,
    canRevealMore,
    revealNextClue,
    loading,
    error,
  };
};