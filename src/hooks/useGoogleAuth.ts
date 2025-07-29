import { useState } from 'react';
import { AuthAPI } from '../lib/supabase';

interface UseGoogleAuthReturn {
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  clearError: () => void;
}

export const useGoogleAuth = (): UseGoogleAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await AuthAPI.signInWithGoogle();
      // The redirect will handle the rest
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setError(err.message || 'Google sign in failed');
      setLoading(false); // Only set loading to false on error, redirect will handle success
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    signInWithGoogle,
    clearError,
  };
};