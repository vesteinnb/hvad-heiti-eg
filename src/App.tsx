import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GameHeader from './components/GameHeader';
import { GameTimer, ClueReveal, GuessInput, GameSuccess } from './components';
import { useGame, usePlayer, useGameTimer, useGuesses } from './hooks';
import { checkNameGuess } from './utils/nameGuessing';
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
  const [revealedNameParts, setRevealedNameParts] = useState<string>('');
  const [partialMatchFeedback, setPartialMatchFeedback] = useState<string>('');
  const [guessedParts, setGuessedParts] = useState({
    firstName: false,
    middleName: false,
    lastName: false
  });

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
    
    // Use the new name guessing logic
    const nameResult = checkNameGuess(
      trimmed,
      game.baby_first_name,
      game.baby_middle_name,
      game.baby_last_name
    );
    
    try {
      const timeElapsed = Math.floor((Date.now() - (player.joined_at ? new Date(player.joined_at).getTime() : Date.now())) / 1000);
      
      // Submit guess using hook
      await submitGuess(
        player.id,
        game.id,
        trimmed,
        nameResult.isFullMatch,
        timeElapsed,
        player.clues_revealed
      );
      
      if (nameResult.isFullMatch) {
        setGameStatus('won');
        setEndTime(Date.now());
        setFeedback('success');
        setPartialMatchFeedback('');
        setGuessedParts({
          firstName: true,
          middleName: !!game.baby_middle_name,
          lastName: !!game.baby_last_name
        });
        stopTimer();
      } else if (nameResult.isPartialMatch) {
        setFeedback('partial');
        setPartialMatchFeedback(nameResult.feedback);
        
        // Update guessed parts based on what was matched
        const newGuessedParts = {
          firstName: guessedParts.firstName || nameResult.matchedParts.firstName,
          middleName: guessedParts.middleName || nameResult.matchedParts.middleName,
          lastName: guessedParts.lastName || nameResult.matchedParts.lastName
        };
        
        setGuessedParts(newGuessedParts);
        
        // Update revealed name parts string for display
        const revealedParts = [];
        if (newGuessedParts.firstName) {
          revealedParts.push(game.baby_first_name);
        }
        if (newGuessedParts.middleName && game.baby_middle_name) {
          revealedParts.push(game.baby_middle_name);
        }
        if (newGuessedParts.lastName && game.baby_last_name) {
          revealedParts.push(game.baby_last_name);
        }
        setRevealedNameParts(revealedParts.join(' '));
      } else {
        setFeedback('error');
        setPartialMatchFeedback('');
      }
      
    } catch (error: any) {
      console.error('Error submitting guess:', error);
      setFeedback('error');
      setPartialMatchFeedback('');
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
    <div className={`min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex flex-col items-center px-4 py-6 transition-all duration-200${showSuccessModal ? '' : ''}`} style={{paddingTop: 'env(safe-area-inset-top, 0px)'}}>
      <div className="w-full max-w-lg space-y-6">
        <GameHeader />
        <div className="w-full flex justify-between items-center text-sm font-body bg-white/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/40">
          <div className="text-gray-700">Player: <span className="font-bold text-purple-700">{username}</span></div>
          <div className="text-gray-700">Game: <span className="font-mono font-bold text-purple-700">{game.game_code}</span></div>
        </div>
        <GameTimer currentTime={timer} />
        
        {/* Revealed name parts - prominently displayed */}
        {(guessedParts.firstName || guessedParts.middleName || guessedParts.lastName) && (
          <div className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-xl p-4 text-center shadow-lg">
            <div className="text-sm text-emerald-700 font-medium mb-3">
              ✅ <strong>Progress:</strong>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
              {/* First Name */}
              <div className={`px-3 py-2 rounded-lg font-bold text-lg ${
                guessedParts.firstName 
                  ? 'bg-emerald-200 text-emerald-900' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {guessedParts.firstName ? game.baby_first_name : '?????'}
              </div>
              
              {/* Middle Name */}
              {game.baby_middle_name && (
                <div className={`px-3 py-2 rounded-lg font-bold text-lg ${
                  guessedParts.middleName 
                    ? 'bg-emerald-200 text-emerald-900' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {guessedParts.middleName ? game.baby_middle_name : '?????'}
                </div>
              )}
              
              {/* Last Name */}
              {game.baby_last_name && (
                <div className={`px-3 py-2 rounded-lg font-bold text-lg ${
                  guessedParts.lastName 
                    ? 'bg-emerald-200 text-emerald-900' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {guessedParts.lastName ? game.baby_last_name : '?????'}
                </div>
              )}
            </div>
            <div className="text-xs text-emerald-600">
              {game.baby_middle_name || game.baby_last_name ? 'Keep guessing to complete the full name!' : ''}
            </div>
          </div>
        )}
        
        {/* Game Instructions */}
        <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-center">
          <div className="text-sm text-blue-800 font-medium">
            🎯 <strong>Goal:</strong> Guess the complete baby name using the clues below
          </div>
          <div className="text-xs text-blue-600 mt-1">
            You can guess individual parts (first name) or the full name at once
          </div>
        </div>
        
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
        
        {/* Partial match feedback - only show when not won */}
        {partialMatchFeedback && gameStatus !== 'won' && (
          <div className="w-full flex justify-center mt-4">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-6 shadow-lg max-w-sm text-center">
              <div className="text-3xl mb-3">🎯</div>
              <div className="text-yellow-800 font-medium text-base leading-relaxed whitespace-pre-line">{partialMatchFeedback}</div>
            </div>
          </div>
        )}
        
        {/* Success message - only show when won */}
        {gameStatus === 'won' && !showSuccessModal && (
          <div className="w-full flex justify-center mt-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 shadow-lg max-w-sm text-center">
              <div className="text-4xl mb-3">🎉</div>
              <div className="text-xl font-bold text-green-800 mb-2">Perfect!</div>
              <div className="text-green-700 font-medium">
                The baby's name is
              </div>
              <div className="text-2xl font-bold text-green-900 mt-2">
                {[game.baby_first_name, game.baby_middle_name, game.baby_last_name].filter(Boolean).join(' ')}
              </div>
            </div>
          </div>
        )}
      </div>
      {showSuccessModal && (
        <GameSuccess
          babyName={[game.baby_first_name, game.baby_middle_name, game.baby_last_name].filter(Boolean).join(' ')}
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