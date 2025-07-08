import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GameHeader from './components/GameHeader';
import Timer from './components/Timer';
import CluesSection from './components/CluesSection';
import GameInterface from './components/GameInterface';
import { GameAPI } from './lib/supabase';
import type { GameWithClues, Player, PlayerGuess } from './types/database';

const App: React.FC = () => {
  const { gameCode } = useParams();
  const [game, setGame] = useState<GameWithClues | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cluesRevealed, setCluesRevealed] = useState(0);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<'active' | 'won'>('active');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [timer, setTimer] = useState('00:00');
  const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [username, setUsername] = useState<string>('');
  const [hasStarted, setHasStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [playerGuesses, setPlayerGuesses] = useState<PlayerGuess[]>([]);

  // Load game data
  useEffect(() => {
    if (!gameCode) {
      setError('No game code provided.');
      setLoading(false);
      return;
    }

    const loadGame = async () => {
      try {
        setLoading(true);
        setError(null);
        const gameData = await GameAPI.getGameByCode(gameCode);
        
        // Check if game is active
        if (!GameAPI.isGameActive(gameData)) {
          setError('This game is not currently active.');
          setLoading(false);
          return;
        }
        
        setGame(gameData);
      } catch (e: any) {
        console.error('Error loading game:', e);
        setError('Game not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [gameCode]);

  // Timer logic
  useEffect(() => {
    if (hasStarted && gameStatus === 'active' && game && player) {
      timerInterval.current = setInterval(() => {
        const elapsed = (startTime ? Date.now() - startTime : 0);
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        setTimer(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    } else if (gameStatus === 'won' && timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [hasStarted, gameStatus, startTime, game, player]);

  useEffect(() => {
    if (gameStatus === 'won') {
      setShowSuccessMsg(true);
      setTimeout(() => {
        setShowSuccessMsg(false);
        setShowSuccessModal(true);
        setTimeout(() => {
          closeBtnRef.current?.focus();
        }, 100);
      }, 1200);
    }
  }, [gameStatus]);

  // Join game as player
  const handleJoinGame = async (playerName: string) => {
    if (!game) return;
    
    try {
      // Try to get existing player first
      let playerData: Player;
      try {
        playerData = await GameAPI.getPlayer(game.id, playerName);
        
        // If player already won, set appropriate state
        if (playerData.has_won) {
          setGameStatus('won');
          setEndTime(playerData.won_at ? new Date(playerData.won_at).getTime() : Date.now());
        }
        
        // Load their previous state
        setCluesRevealed(playerData.clues_revealed);
        
        // Load their previous guesses
        const guesses = await GameAPI.getPlayerGuesses(playerData.id);
        setPlayerGuesses(guesses);
        setPreviousGuesses(guesses.filter(g => g.status === 'incorrect').map(g => g.guess_text));
        setIncorrectGuesses(guesses.filter(g => g.status === 'incorrect').length);
        
      } catch (error) {
        // Player doesn't exist, create new one
        playerData = await GameAPI.joinGame(game.id, playerName);
      }
      
      setPlayer(playerData);
      setHasStarted(true);
      setStartTime(Date.now());
      
      // Update player activity
      await GameAPI.updatePlayerActivity(playerData.id);
      
    } catch (error: any) {
      console.error('Error joining game:', error);
      setError(error.message || 'Failed to join game');
    }
  };

  // Guess handler
  const handleGuess = async (guess: string) => {
    if (gameStatus !== 'active' || !game || !player) return;
    
    const trimmed = guess.trim();
    const lowerTrimmed = trimmed.toLowerCase();
    const answer = game.baby_first_name.toLowerCase();
    const isCorrect = lowerTrimmed === answer;
    
    try {
      const timeElapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
      
      // Submit guess to database
      const guessRecord = await GameAPI.submitGuess(
        player.id,
        game.id,
        trimmed,
        isCorrect,
        timeElapsed,
        cluesRevealed
      );
      
      // Update local state
      setPlayerGuesses(prev => [guessRecord, ...prev]);
      
      if (isCorrect) {
        setGameStatus('won');
        setEndTime(Date.now());
        setFeedback('success');
        
        // Update player state
        setPlayer(prev => prev ? {
          ...prev,
          has_won: true,
          won_at: new Date().toISOString(),
          final_time_seconds: timeElapsed
        } : null);
        
      } else {
        setIncorrectGuesses(prev => prev + 1);
        setPreviousGuesses(prev => [trimmed, ...prev].slice(0, 20));
        setFeedback('error');
      }
      
    } catch (error: any) {
      console.error('Error submitting guess:', error);
      setFeedback('error');
    }
  };

  // Reveal clue handler
  const handleRevealClue = async () => {
    if (!game || !player || cluesRevealed >= game.game_clues.length) return;
    
    try {
      // Update in database
      const updatedPlayer = await GameAPI.revealClue(player.id);
      setPlayer(updatedPlayer);
      setCluesRevealed(updatedPlayer.clues_revealed);
    } catch (error: any) {
      console.error('Error revealing clue:', error);
    }
  };

  // Final stats for success
  const finalTime = endTime && startTime
    ? (() => {
        const elapsed = endTime - startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      })()
    : timer;

  const formatGuess = (guess: string) =>
    guess.length > 10 ? guess.slice(0, 10) + '…' : guess;
  const recentGuesses = previousGuesses.slice(0, 8);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg font-heading">Loading game...</div>;
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-lg font-heading text-error px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😞</div>
          <div className="text-xl mb-2">Oops!</div>
          <div>{error}</div>
        </div>
      </div>
    );
  }
  
  if (!game) {
    return <div className="min-h-screen flex items-center justify-center text-lg font-heading text-error">Game not found.</div>;
  }

  // Username entry screen
  if (!hasStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4 py-8">
        <div className="w-full max-w-xs bg-white/90 rounded-xl shadow-lg p-6 flex flex-col items-center gap-4">
          <div className="text-center mb-4">
            <div className="text-2xl font-heading font-bold text-primary mb-2">{game.title}</div>
            {game.description && (
              <div className="text-sm text-neutral-600 font-body">{game.description}</div>
            )}
          </div>
          
          <div className="text-xl font-heading font-bold text-neutral-700 mb-2">Enter Your Name</div>
          <form
            className="w-full flex flex-col gap-4"
            onSubmit={e => {
              e.preventDefault();
              if (username.trim()) {
                handleJoinGame(username.trim());
              }
            }}
          >
            <input
              type="text"
              className="w-full rounded-xl border-2 border-primary/30 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 min-h-[48px]"
              placeholder="Enter your name"
              value={username}
              onChange={e => setUsername(e.target.value)}
              maxLength={32}
              required
              autoFocus
              aria-label="Your name"
            />
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl font-heading font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-gradient-to-r from-primary to-primary/80 text-white hover:scale-105 active:scale-100"
              disabled={!username.trim()}
            >
              Start Game
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-neutral-50 flex flex-col items-center px-6 transition-all duration-200${showSuccessModal ? '' : ''}`} style={{paddingTop: 'env(safe-area-inset-top, 0px)'}}>
      <div className="w-full max-w-lg space-y-4">
        <GameHeader />
        <div className="w-full flex justify-between items-center text-sm text-neutral-500 font-body mb-1 pr-1">
          <div>Player: <span className="font-semibold text-primary ml-1">{username}</span></div>
          <div>Game: <span className="font-mono text-primary">{game.game_code}</span></div>
        </div>
        <Timer currentTime={timer} />
        <CluesSection
          clues={game.game_clues.map(c => c.clue_text)}
          cluesRevealed={cluesRevealed}
          maxClues={game.game_clues.length}
          onRevealClue={handleRevealClue}
        />
        <GameInterface
          score={0}
          onGuess={handleGuess}
          disabled={gameStatus !== 'active' || showSuccessModal}
          feedback={showSuccessMsg ? 'success' : feedback}
          incorrectGuesses={incorrectGuesses}
          previousGuesses={recentGuesses}
          formatGuess={formatGuess}
          username={username}
        />
        {(gameStatus === 'won' || showSuccessModal) && (
          <div className="w-full flex justify-center mt-2">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3 text-lg font-semibold text-green-700 shadow-sm">
              <span className="text-2xl">✅</span>
              <span>
                Correct! The answer is <span className="font-bold text-green-800">'{game.baby_first_name}'</span>
              </span>
            </div>
          </div>
        )}
      </div>
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40" aria-hidden="true"></div>
          <div className="relative z-50 max-w-sm w-full mx-4 shadow-2xl rounded-2xl bg-gradient-to-br from-secondary via-accent to-primary animate-success-modal-enter transition-all duration-300 flex flex-col items-center p-6 mt-0 mb-0 max-h-[90vh] overflow-y-auto">
            <button
              ref={closeBtnRef}
              className="absolute top-3 right-3 text-white/80 hover:text-white bg-black/30 rounded-lg p-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 z-50"
              aria-label="Close success modal"
              onClick={() => setShowSuccessModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex justify-center mb-2">
              <span className="text-5xl sm:text-6xl drop-shadow-lg animate-bounce">🎉</span>
            </div>
            <div className="text-3xl sm:text-4xl font-heading font-extrabold text-white drop-shadow-lg" style={{fontWeight: 800, letterSpacing: '-0.01em', textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>Congratulations!</div>
            <div className="flex justify-center">
              <div className="bg-black/10 rounded-lg p-2 inline-block">
                <span className="text-lg sm:text-xl font-body text-white/90 mb-2" style={{fontWeight: 400, lineHeight: 1.4, textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>
                  You guessed <span className='font-semibold bg-white/30 text-white px-2 py-1 rounded'>{game.baby_first_name}</span> correctly!
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:gap-6 mt-4 w-full">
              <div className="flex items-center justify-between gap-4 w-full">
                <div className="flex flex-col items-center flex-1">
                  <span className="text-base font-body text-white/80 flex items-center gap-1" style={{textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>
                    <span className="text-xl">⏰</span> Time
                  </span>
                  <span className="text-2xl font-mono font-bold text-white drop-shadow-sm" style={{textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>{finalTime}</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <span className="text-base font-body text-white/80 flex items-center gap-1" style={{textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>
                    <span className="text-xl">❌</span> Wrong
                  </span>
                  <span className="text-2xl font-mono font-bold text-white drop-shadow-sm" style={{textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>{incorrectGuesses}</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <span className="text-base font-body text-white/80 flex items-center gap-1" style={{textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>
                    <span className="text-xl">💡</span> Clues
                  </span>
                  <span className="text-2xl font-mono font-bold text-white drop-shadow-sm" style={{textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>{cluesRevealed} / {game.game_clues.length}</span>
                </div>
              </div>
            </div>
            {recentGuesses.length > 0 && (
              <div className="mt-4 text-sm text-white/80 font-body bg-black/10 rounded-lg p-2 inline-block" style={{fontWeight: 400, lineHeight: 1.4, textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>
                Previous guesses: {recentGuesses.map(formatGuess).join(', ')}
              </div>
            )}
          </div>
          <style>{`
            @keyframes successModalEnter {
              0% { opacity: 0; transform: scale(0.95) translateY(32px); }
              80% { opacity: 1; transform: scale(1.03) translateY(-4px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            .animate-success-modal-enter {
              animation: successModalEnter 0.5s cubic-bezier(.22,1,.36,1) both;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default App;