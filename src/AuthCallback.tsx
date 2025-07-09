import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthAPI } from './lib/supabase';

const AuthCallback: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the user after OAuth callback
        const user = await AuthAPI.getCurrentUser();
        
        if (user) {
          // Try to get or create parent profile
          const parent = await AuthAPI.getCurrentParent();
          
          if (parent) {
            // Redirect to parent dashboard
            navigate('/parent');
          } else {
            setError('Failed to create user profile');
          }
        } else {
          setError('Authentication failed');
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-lg font-heading text-neutral-700">Completing sign in...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">😞</div>
          <div className="text-xl font-heading text-neutral-700 mb-2">Authentication Error</div>
          <div className="text-neutral-600 mb-4">{error}</div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;