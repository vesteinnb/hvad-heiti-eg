import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthAPI, GameAPI } from './lib/supabase';
import type { Parent, GameSummary } from './types/database';

const ParentAuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [parent, setParent] = useState<Parent | null>(null);
  const [games, setGames] = useState<GameSummary[]>([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [gamesError, setGamesError] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const p = await AuthAPI.getCurrentParent();
        if (p) {
          setLoggedIn(true);
          setParent(p);
          await fetchGames(p.id);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };
    
    checkAuth();
  }, []);

  const fetchGames = async (parentId: string) => {
    setGamesLoading(true);
    setGamesError('');
    try {
      const data = await GameAPI.getParentGames(parentId);
      setGames(data);
    } catch (e: any) {
      console.error('Error fetching games:', e);
      setGamesError('Could not load games.');
    } finally {
      setGamesLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await AuthAPI.signIn(email, password);
      const p = await AuthAPI.getCurrentParent();
      if (p) {
        setLoggedIn(true);
        setParent(p);
        await fetchGames(p.id);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await AuthAPI.signInWithGoogle();
      // The redirect will handle the rest
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message || 'Google login failed');
      setGoogleLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthAPI.signOut();
      setLoggedIn(false);
      setParent(null);
      setGames([]);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getGameStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'draft': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'completed': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'expired': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4 py-8">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white/90 rounded-xl shadow-lg p-6 flex flex-col gap-4 items-center">
          <div className="text-2xl font-heading font-bold text-neutral-700 mb-2 tracking-wide">Parent Login</div>
          
          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full py-3 px-6 rounded-xl font-heading font-semibold text-base transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-white text-neutral-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3"
          >
            {googleLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </button>

          <div className="w-full flex items-center my-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-3 text-neutral-400 font-body text-sm">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
            aria-label="Email"
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            aria-label="Password"
            disabled={loading}
            required
          />
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-xl font-heading font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-gradient-to-r from-primary to-primary/80 text-white hover:scale-105 active:scale-100 flex items-center justify-center gap-2"
            aria-label="Sign In"
            disabled={loading}
          >
            {loading && <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            Sign In
          </button>
          {error && <div className="w-full text-center text-error font-medium animate-shake">{error}</div>}
          <div className="w-full text-center mt-2">
            <button
              type="button"
              className="text-primary underline font-medium hover:text-primary/80 transition-all"
              onClick={() => { setShowSignUp(true); setSignUpSuccess(''); setSignUpError(''); }}
            >
              Don't have an account? Sign up
            </button>
          </div>
        </form>
        
        {showSignUp && (
          <form onSubmit={async e => {
            e.preventDefault();
            setSignUpError('');
            setSignUpSuccess('');
            setSignUpLoading(true);
            try {
              await AuthAPI.signUp(signUpEmail, signUpPassword, signUpUsername);
              setSignUpSuccess('Sign-up successful! Please check your email to confirm your account, then log in.');
              setSignUpEmail('');
              setSignUpPassword('');
              setSignUpUsername('');
              setTimeout(() => setShowSignUp(false), 2000);
            } catch (err: any) {
              console.error('Sign up error:', err);
              setSignUpError(err.message || 'Sign-up failed');
            } finally {
              setSignUpLoading(false);
            }
          }} className="w-full max-w-sm bg-white/90 rounded-xl shadow-lg p-6 flex flex-col gap-4 items-center mt-6">
            <div className="text-2xl font-heading font-bold text-neutral-700 mb-2 tracking-wide">Sign Up</div>
            <input
              type="text"
              placeholder="Username"
              className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200"
              value={signUpUsername}
              onChange={e => setSignUpUsername(e.target.value)}
              autoComplete="username"
              aria-label="Username"
              disabled={signUpLoading}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200"
              value={signUpEmail}
              onChange={e => setSignUpEmail(e.target.value)}
              autoComplete="email"
              aria-label="Email"
              disabled={signUpLoading}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200"
              value={signUpPassword}
              onChange={e => setSignUpPassword(e.target.value)}
              autoComplete="new-password"
              aria-label="Password"
              disabled={signUpLoading}
              required
            />
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl font-heading font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-gradient-to-r from-primary to-primary/80 text-white hover:scale-105 active:scale-100 flex items-center justify-center gap-2"
              aria-label="Sign Up"
              disabled={signUpLoading}
            >
              {signUpLoading && <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              Sign Up
            </button>
            {signUpError && <div className="w-full text-center text-error font-medium animate-shake">{signUpError}</div>}
            {signUpSuccess && <div className="w-full text-center text-green-700 font-medium animate-fade-in">{signUpSuccess}</div>}
            <div className="w-full text-center mt-2">
              <button
                type="button"
                className="text-primary underline font-medium hover:text-primary/80 transition-all"
                onClick={() => setShowSignUp(false)}
              >
                Already have an account? Log in
              </button>
            </div>
          </form>
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
          <div className="flex items-center justify-between">
            <div className="text-lg font-heading font-semibold text-primary mb-1">Your Games</div>
            {!gamesLoading && !gamesError && games.length > 0 && (
              <button
                onClick={() => parent && fetchGames(parent.id)}
                className="text-sm text-primary hover:text-primary/80 underline font-medium"
              >
                Refresh
              </button>
            )}
          </div>
          
          {gamesLoading ? (
            <div className="text-neutral-400 font-body text-sm flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              Loading games...
            </div>
          ) : gamesError ? (
            <div className="text-error font-body text-sm">{gamesError}</div>
          ) : games.length === 0 ? (
            <div className="text-neutral-400 font-body text-sm text-center py-4">
              <div className="text-4xl mb-2">🎮</div>
              <div>No games created yet.</div>
              <div className="text-xs mt-1">Create your first game to get started!</div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {games.map((game) => (
                <div key={game.id} className="bg-primary/5 rounded-lg p-4 shadow-sm border border-primary/10 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-heading font-medium text-base text-neutral-800 mb-1">{game.title}</div>
                      <div className="text-xs font-mono text-primary bg-primary/10 rounded px-2 py-1 inline-block">
                        Code: {game.game_code}
                      </div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded border font-medium ${getGameStatusColor(game.status)}`}>
                      {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
                    </div>
                  </div>
                  
                  <div className="text-xs text-neutral-600 font-body space-y-1">
                    <div>Baby: {game.baby_first_name} {game.baby_middle_name} {game.baby_last_name}</div>
                    <div>Dates: {formatDate(game.start_date)} - {formatDate(game.end_date)}</div>
                    <div className="flex items-center gap-4">
                      <span>👥 {game.total_players || 0} players</span>
                      <span>🏆 {game.winners_count || 0} winners</span>
                      <span>💭 {game.total_guesses || 0} guesses</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => navigate(`/game/${game.game_code}`)}
                      className="text-xs py-1.5 px-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-150 font-medium"
                    >
                      View Game
                    </button>
                    {game.status === 'active' && (
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/game/${game.game_code}`;
                          navigator.clipboard.writeText(url);
                        }}
                        className="text-xs py-1.5 px-3 rounded-lg bg-secondary/20 text-neutral-700 hover:bg-secondary/30 transition-all duration-150 font-medium"
                      >
                        Copy Link
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ParentAuthPage;