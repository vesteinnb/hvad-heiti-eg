import { useState, useEffect } from 'react';
import { GameAPI } from '../lib/supabase';
import type { GameWithClues } from '../types/database';

interface UseGameReturn {
  game: GameWithClues | null;
  loading: boolean;
  error: string | null;
  isActive: boolean;
  refetch: () => Promise<void>;
}

export const useGame = (gameCode: string): UseGameReturn => {
  const [game, setGame] = useState<GameWithClues | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGame = async () => {
    if (!gameCode) {
      setError('No game code provided.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const gameData = await GameAPI.getGameByCode(gameCode);
      setGame(gameData);
    } catch (e: any) {
      console.error('Error loading game:', e);
      setError('Game not found or could not be loaded.');
      setGame(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGame();
  }, [gameCode]);

  const isActive = game ? GameAPI.isGameActive(game) : false;

  return {
    game,
    loading,
    error,
    isActive,
    refetch: fetchGame,
  };
};