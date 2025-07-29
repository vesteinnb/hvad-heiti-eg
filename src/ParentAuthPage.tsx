import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm, SignUpForm, GoogleAuthButton, GameList } from './components';
import { useAuth, useParentGames } from './hooks';
import type { Parent, GameSummary } from './types/database';

const ParentAuthPage: React.FC = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();
  
  // Use custom hooks
  const { user: parent, loading: authLoading } = useAuth();
  const { games, loading: gamesLoading, error: gamesError, refetch, copyGameLink } = useParentGames(parent?.id || null);

  const handleLoginSuccess = () => {
    // Auth hook handles the login state automatically
    setShowSignUp(false);
  };

  const handleSignUpSuccess = () => {
    setShowSignUp(false);
  };

  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-heading">
        Loading...
      </div>
    );
  }

  if (!parent) {
    return (
      <main className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4 py-8">
        <GoogleAuthButton />
        
        <div className="w-full flex items-center my-2 max-w-sm">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-3 text-neutral-400 font-body text-sm">or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {!showSignUp ? (
          <LoginForm 
            onSuccess={handleLoginSuccess}
            onShowSignUp={() => setShowSignUp(true)}
          />
        ) : (
          <SignUpForm
            onSuccess={handleSignUpSuccess}
            onShowLogin={() => setShowSignUp(false)}
          />
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md mx-auto flex flex-col items-center space-y-6 pt-8">
        <div className="flex items-center gap-3 w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl" role="img" aria-label="Parent">🧑‍🍼</span>
            <span className="font-heading font-semibold text-lg text-neutral-700">
              Welcome, <span className="font-bold">{parent?.username || parent?.first_name || 'Parent'}</span>
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="py-2 px-4 rounded-lg font-heading font-medium text-base bg-gradient-to-r from-gray-200 to-gray-300 text-neutral-700 shadow-sm hover:shadow-md focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
            aria-label="Sign Out"
          >
            Sign Out
          </button>
        </div>
        
        <div className="w-full bg-white/90 rounded-xl shadow-lg p-6 flex flex-col items-center gap-4">
          <div className="text-2xl font-heading font-bold text-neutral-700 mb-2 tracking-wide">Create New Game</div>
          <div className="text-neutral-600 font-body text-center">Set up a new baby name guessing game for your friends and family!</div>
          <button
            className="mt-2 py-3 px-6 rounded-xl font-heading font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-gradient-to-r from-primary to-primary/80 text-white hover:scale-105 active:scale-100"
            onClick={() => navigate('/parent/create')}
          >
            + New Game
          </button>
        </div>
        
        {/* Games Section */}
        <div className="w-full bg-white/90 rounded-xl shadow-lg p-6 flex flex-col gap-3 mt-4">
          <GameList
            games={games}
            loading={gamesLoading}
            error={gamesError}
            onRefresh={refetch}
            onCopyLink={copyGameLink}
          />
        </div>
      </div>
    </main>
  );
};

export default ParentAuthPage;