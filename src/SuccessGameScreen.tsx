import React, { useState } from 'react';
import QRCode from 'react-qr-code';

export interface GameSuccess {
  gameId: string;
  gameTitle: string;
  gameCode: string;
  gameUrl: string;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  babyFirstName?: string;
  babyMiddleName?: string;
  babyLastName?: string;
  gameDescription?: string;
}

const SuccessGameScreen: React.FC<{
  game: GameSuccess;
  onViewGame: () => void;
  onCreateAnother: () => void;
  onBackToDashboard?: () => void;
}> = ({ game, onViewGame, onCreateAnother, onBackToDashboard }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(game.gameUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-green-50">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-6 animate-success-modal-enter">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-5xl animate-bounce">🎉</span>
          <div className="text-2xl sm:text-3xl font-heading font-extrabold text-green-700 text-center">Game Created Successfully!</div>
          <div className="text-base sm:text-lg text-green-800 font-body text-center">Your baby name guessing game is ready to play</div>
        </div>
        {/* Game Info */}
        <div className="w-full bg-green-100 rounded-xl p-4 flex flex-col gap-2 items-center border border-green-200">
          <div className="text-lg font-heading font-bold text-green-900 text-center">{game.gameTitle}</div>
          <div className="text-sm text-green-800 font-body text-center">
            <span>Start: {game.startDate.toLocaleDateString()}</span> &ndash; <span>End: {game.endDate.toLocaleDateString()}</span>
            {game.gameDescription && <><br/><span>{game.gameDescription}</span></>}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-mono text-green-700 bg-green-200 rounded px-2 py-1 text-base">Code: {game.gameCode}</span>
          </div>
        </div>
        {/* Share Link */}
        <div className="w-full flex flex-col items-center gap-2">
          <label className="text-sm font-heading text-green-800 mb-1">Game Link</label>
          <div className="flex w-full gap-2">
            <input
              type="text"
              className="flex-1 rounded-xl border-2 border-green-200 bg-green-50 py-2 px-3 text-base font-mono text-green-900 select-all focus:outline-none focus:ring-2 focus:ring-green-300"
              value={game.gameUrl}
              readOnly
              onFocus={e => e.target.select()}
              aria-label="Game Link"
            />
            <button
              type="button"
              className={`rounded-xl px-4 py-2 font-heading font-semibold text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400 transition-all duration-150 ${copied ? 'scale-105' : ''}`}
              onClick={handleCopy}
              aria-label="Copy Link"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
        {/* QR Code */}
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="bg-white border-2 border-green-200 rounded-xl p-4 flex flex-col items-center">
            <QRCode value={game.gameUrl} size={180} bgColor="#fff" fgColor="#166534" />
            <div className="text-xs text-green-700 font-body mt-2">Scan to join game</div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex flex-col gap-3 w-full mt-2">
          <button
            className="w-full py-3 rounded-xl font-heading font-bold text-lg bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md hover:scale-105 active:scale-100 transition-all duration-150"
            onClick={onViewGame}
          >
            View Game
          </button>
          <button
            className="w-full py-3 rounded-xl font-heading font-semibold text-lg bg-green-100 text-green-800 hover:bg-green-200 shadow-sm hover:scale-105 active:scale-100 transition-all duration-150"
            onClick={onCreateAnother}
          >
            Create Another Game
          </button>
          {onBackToDashboard && (
            <button
              className="w-full py-2 rounded-xl font-heading font-medium text-base bg-gray-100 text-neutral-700 hover:bg-gray-200 shadow-sm hover:scale-105 active:scale-100 transition-all duration-150"
              onClick={onBackToDashboard}
            >
              Back to Dashboard
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default SuccessGameScreen; 