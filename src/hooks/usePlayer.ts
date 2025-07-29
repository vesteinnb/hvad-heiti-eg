import { useState } from 'react';
import { GameAPI } from '../lib/supabase';
import type { Player, PlayerGuess } from '../types/database';

interface UsePlayerReturn {
  player: Player | null;
  loading: boolean;
  error: string | null;
  joinGame: (gameId: string, playerName: string) => Promise<Player>;
  updateActivity: () => Promise<void>;
  revealClue: () => Promise<void>;
}

export const usePlayer = (): UsePlayerReturn => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinGame = async (gameId: string, playerName: string): Promise<Player> => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to get existing player first
      let playerData: Player;
      try {
        playerData = await GameAPI.getPlayer(gameId, playerName);
      } catch (error) {
        // Player doesn't exist, create new one
        playerData = await GameAPI.joinGame(gameId, playerName);
      }
      
      setPlayer(playerData);
      
      // Update player activity
      await GameAPI.updatePlayerActivity(playerData.id);
      
      return playerData;
    } catch (err: any) {
      console.error('Error joining game:', err);
      const errorMessage = err.message || 'Failed to join game';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateActivity = async () => {
    if (!player) return;
    
    try {
      await GameAPI.updatePlayerActivity(player.id);
    } catch (err: any) {
      console.error('Error updating player activity:', err);
    }
  };

  const revealClue = async () => {
    if (!player) return;
    
    try {
      setLoading(true);
      const updatedPlayer = await GameAPI.revealClue(player.id);
      setPlayer(updatedPlayer);
    } catch (err: any) {
      console.error('Error revealing clue:', err);
      setError(err.message || 'Failed to reveal clue');
    } finally {
      setLoading(false);
    }
  };

  return {
    player,
    loading,
    error,
    joinGame,
    updateActivity,
    revealClue,
  };
};