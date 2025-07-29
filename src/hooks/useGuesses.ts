import { useState, useEffect } from 'react';
import { GameAPI } from '../lib/supabase';
import type { PlayerGuess } from '../types/database';

interface UseGuessesReturn {
  guesses: PlayerGuess[];
  previousGuesses: string[];
  incorrectGuesses: number;
  loading: boolean;
  error: string | null;
  submitGuess: (
    playerId: string,
    gameId: string,
    guessText: string,
    isCorrect: boolean,
    timeElapsedSeconds: number,
    cluesUsed: number
  ) => Promise<PlayerGuess>;
  loadPlayerGuesses: (playerId: string) => Promise<void>;
  formatGuess: (guess: string) => string;
}

export const useGuesses = (): UseGuessesReturn => {
  const [guesses, setGuesses] = useState<PlayerGuess[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlayerGuesses = async (playerId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const playerGuesses = await GameAPI.getPlayerGuesses(playerId);
      setGuesses(playerGuesses);
    } catch (err: any) {
      console.error('Error loading player guesses:', err);
      setError(err.message || 'Failed to load guesses');
    } finally {
      setLoading(false);
    }
  };

  const submitGuess = async (
    playerId: string,
    gameId: string,
    guessText: string,
    isCorrect: boolean,
    timeElapsedSeconds: number,
    cluesUsed: number
  ): Promise<PlayerGuess> => {
    setLoading(true);
    setError(null);
    
    try {
      const guessRecord = await GameAPI.submitGuess(
        playerId,
        gameId,
        guessText,
        isCorrect,
        timeElapsedSeconds,
        cluesUsed
      );
      
      // Update local state
      setGuesses(prev => [guessRecord, ...prev]);
      
      return guessRecord;
    } catch (err: any) {
      console.error('Error submitting guess:', err);
      const errorMessage = err.message || 'Failed to submit guess';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatGuess = (guess: string): string => {
    return guess.length > 10 ? guess.slice(0, 10) + '…' : guess;
  };

  // Derived state
  const previousGuesses = guesses
    .filter(g => g.status === 'incorrect')
    .map(g => g.guess_text)
    .slice(0, 8); // Recent 8 guesses

  const incorrectGuesses = guesses.filter(g => g.status === 'incorrect').length;

  return {
    guesses,
    previousGuesses,
    incorrectGuesses,
    loading,
    error,
    submitGuess,
    loadPlayerGuesses,
    formatGuess,
  };
};