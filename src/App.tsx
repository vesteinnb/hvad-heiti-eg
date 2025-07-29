import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GameHeader from './components/GameHeader';
import { GameTimer, ClueReveal, GuessInput, GameSuccess } from './components';
import { useGame, usePlayer, useGameTimer, useGuesses } from './hooks';
import type { GameWithClues, Player, PlayerGuess } from './types/database';

const App: React.FC = () => {
  const { gameCode } = useParams();
  
  // Local state
  const [gameStatus, setGameStatus] = useState<'active' | 'won'>('active');
  
  // Use custom hooks
  const { game, loading: gameLoading, error: gameError, isActive } = useGame(gameCode || '');
  const { player, joinGame, revealClue } = usePlayer();
  const { timer, start: startTimer, stop: stopTimer } = useGameTimer(gameStatus === 'active');
  const { 
    previousGuesses, 
    incorrectGuesses, 
    submitGuess, 
    loadPlayerGuesses, 
    formatGuess 
  } = useGuesses();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [username, setUsername] = useState<string>('');
  const [hasStarted, setHasStarted] = useState(false);

  // Handle game status changes
  useEffect(() => {
    if (!isActive && game) {
      // Game is not currently active
      console.warn('Game is not currently active');
    }
  }, [isActive, game]);

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
      const playerData = await joinGame(game.id, playerName);
      
      // If player already won, set appropriate state
      if (playerData.has_won) {
        setGameStatus('won');
        setEndTime(playerData.won_at ? new Date(playerData.won_at).getTime() : Date.now());
        stopTimer();
      } else {
        startTimer();
      }
      
      // Load their previous guesses
      await loadPlayerGuesses(playerData.id);
      
      setHasStarted(true);
      
    } catch (error: any) {
      console.error('Error joining game:', error);
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
      const timeElapsed = Math.floor((Date.now() - (player.joined_at ? new Date(player.joined_at).getTime() : Date.now())) / 1000);
      
      // Submit guess using hook
      await submitGuess(
        player.id,
        game.id,
        trimmed,
        isCorrect,
        timeElapsed,
        player.clues_revealed
      );
      
      if (isCorrect) {
        setGameStatus('won');
        setEndTime(Date.now());
        setFeedback('success');
        stopTimer();
      } else {
        setFeedback('error');
      }
      
    } catch (error: any) {
      console.error('Error submitting guess:', error);
      setFeedback('error');
    }
  };

  // Reveal clue handler
  const handleRevealClue = async () => {
    if (!game || !player || player.clues_revealed >= game.game_clues.length) return;
    
    try {
      await revealClue();
    } catch (error: any) {
      console.error('Error revealing clue:', error);
    }
  };

  // Final stats for success
  const finalTime = endTime ? timer : timer;
  const recentGuesses = previousGuesses.slice(0, 8);

  if (gameLoading) {
    return <div className="min-h-screen flex items-center justify-center text-lg font-heading">Loading game...</div>;
  }
  
  if (gameError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-lg font-heading text-error px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😞</div>
          <div className="text-xl mb-2">Oops!</div>
          <div>{gameError}</div>
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
        <GameTimer currentTime={timer} />
        <ClueReveal
          clues={game.game_clues.map(c => c.clue_text)}
          cluesRevealed={player?.clues_revealed || 0}
          maxClues={game.game_clues.length}
          onRevealClue={handleRevealClue}
        />
        <GuessInput
          onGuess={handleGuess}
          disabled={gameStatus !== 'active' || showSuccessModal}
          feedback={showSuccessMsg ? 'success' : feedback}
          incorrectGuesses={incorrectGuesses}
          previousGuesses={recentGuesses}
          formatGuess={formatGuess}
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
        <GameSuccess
          babyName={game.baby_first_name}
          finalTime={finalTime}
          incorrectGuesses={incorrectGuesses}
          cluesRevealed={player?.clues_revealed || 0}
          totalClues={game.game_clues.length}
          previousGuesses={recentGuesses}
          formatGuess={formatGuess}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default App;