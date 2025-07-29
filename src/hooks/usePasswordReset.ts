import { useState } from 'react';
import { AuthAPI } from '../lib/supabase';

interface UsePasswordResetReturn {
  loading: boolean;
  error: string | null;
  success: string | null;
  sendResetEmail: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  clearMessages: () => void;
}

export const usePasswordReset = (): UsePasswordResetReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const sendResetEmail = async (email: string) => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      await AuthAPI.resetPassword(email);
      setSuccess('Password reset email sent! Check your inbox for instructions.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      await AuthAPI.updatePassword(newPassword);
      setSuccess('Password updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    sendResetEmail,
    updatePassword,
    clearMessages
  };
};