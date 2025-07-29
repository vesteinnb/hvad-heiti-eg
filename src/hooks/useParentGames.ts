import { useState, useEffect } from 'react';
import { GameAPI } from '../lib/supabase';
import type { GameSummary } from '../types/database';

interface UseParentGamesReturn {
  games: GameSummary[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  copyGameLink: (gameCode: string) => void;
}

export const useParentGames = (parentId: string | null): UseParentGamesReturn => {
  const [games, setGames] = useState<GameSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async () => {
    if (!parentId) {
      setGames([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await GameAPI.getParentGames(parentId);
      setGames(data);
    } catch (e: any) {
      console.error('Error fetching games:', e);
      setError('Could not load games.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [parentId]);

  const refetch = async () => {
    await fetchGames();
  };

  const copyGameLink = (gameCode: string) => {
    const url = `${window.location.origin}/game/${gameCode}`;
    navigator.clipboard.writeText(url);
    // You could also add a toast notification here
  };

  return {
    games,
    loading,
    error,
    refetch,
    copyGameLink,
  };
};