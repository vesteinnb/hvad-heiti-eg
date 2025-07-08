import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [gameCode, setGameCode] = useState('');
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/parent');
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameCode.trim()) {
      navigate(`/game/${gameCode.trim()}`);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md mx-auto flex flex-col items-center space-y-8">
        {/* Hero Section */}
        <div className="flex flex-col items-center space-y-4 pt-8">
          <div className="bg-gradient-to-br from-secondary via-accent to-primary rounded-full p-4 shadow-lg mb-2">
            {/* Baby icon/illustration */}
            <span className="text-5xl" role="img" aria-label="Baby face">👶</span>
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-center text-neutral-700 tracking-wide">Baby Name Guessing Game</h1>
          <p className="font-body text-base sm:text-lg text-neutral-700 text-center max-w-xs">Create or join a fun baby name guessing challenge</p>
        </div>

        {/* Parent/Host Path */}
        <section className="w-full flex flex-col items-center space-y-2">
          <button
            className="w-full py-4 px-6 rounded-xl font-heading font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-gradient-to-r from-primary to-primary/80 text-white hover:scale-105 active:scale-100 mb-1"
            onClick={handleCreate}
            aria-label="Create New Game"
          >
            <span className="inline-flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="Host">🍼</span>
              Create New Game
            </span>
          </button>
          <div className="text-neutral-700 font-body text-sm text-center">Set up a new baby name guessing game for friends and family</div>
        </section>

        {/* Divider */}
        <div className="w-full flex items-center my-2">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-3 text-neutral-400 font-body text-sm">or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Player/Join Path */}
        <section className="w-full flex flex-col items-center space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl" role="img" aria-label="Join">🎈</span>
            <span className="font-heading font-semibold text-base text-neutral-700">Join Existing Game</span>
          </div>
          <form onSubmit={handleJoin} className="w-full flex flex-col items-center gap-2">
            <input
              type="text"
              value={gameCode}
              onChange={e => setGameCode(e.target.value)}
              placeholder="e.g. ABC123"
              className="w-full rounded-xl border-2 border-gray-200 bg-white/90 py-4 px-6 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 mb-1"
              aria-label="Enter Game Code"
              autoComplete="off"
              required
            />
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl font-heading font-semibold text-base transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-secondary focus:ring-offset-2 bg-gradient-to-r from-secondary to-accent text-neutral-700 hover:scale-105 active:scale-100"
              aria-label="Join Game"
            >
              Join Game
            </button>
          </form>
          <div className="text-neutral-700 font-body text-sm text-center">Have a game code? Enter it here to join the fun!</div>
        </section>
      </div>
    </main>
  );
};

export default LandingPage; 