import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameAPI, AuthAPI } from './lib/supabase';
import SuccessGameScreen, { GameSuccess } from './SuccessGameScreen';

interface GameData {
  babyFirstName: string;
  babyMiddleName?: string;
  babyLastName?: string;
  gameTitle: string;
  gameDescription?: string;
  startDate: string;
  endDate: string;
  clues: string[];
}

function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

const initialForm: GameData = {
  babyFirstName: '',
  babyMiddleName: '',
  babyLastName: '',
  gameTitle: '',
  gameDescription: '',
  startDate: getTodayISO(),
  endDate: getTodayISO(),
  clues: [''],
};

const fieldLimits = {
  babyFirstName: 32,
  babyMiddleName: 32,
  babyLastName: 32,
  gameTitle: 64,
  gameDescription: 256,
  clue: 80,
};

const MAX_CLUES = 10;
const MIN_CLUES = 1;

const CreateGamePage: React.FC = () => {
  const [form, setForm] = useState<GameData>(initialForm);
  const [formErrors, setFormErrors] = useState<{[k: string]: string}>({});
  const [formTouched, setFormTouched] = useState<{[k: string]: boolean}>({});
  const [clueErrors, setClueErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();
  const [successData, setSuccessData] = useState<GameSuccess | null>(null);

  function validate(f: GameData) {
    const errors: {[k: string]: string} = {};
    if (!f.babyFirstName.trim()) errors.babyFirstName = 'First name is required.';
    else if (f.babyFirstName.length > fieldLimits.babyFirstName) errors.babyFirstName = `Max ${fieldLimits.babyFirstName} characters.`;
    if (f.babyMiddleName && f.babyMiddleName.length > fieldLimits.babyMiddleName) errors.babyMiddleName = `Max ${fieldLimits.babyMiddleName} characters.`;
    if (f.babyLastName && f.babyLastName.length > fieldLimits.babyLastName) errors.babyLastName = `Max ${fieldLimits.babyLastName} characters.`;
    if (!f.gameTitle.trim()) errors.gameTitle = 'Game title is required.';
    else if (f.gameTitle.length > fieldLimits.gameTitle) errors.gameTitle = `Max ${fieldLimits.gameTitle} characters.`;
    if (f.gameDescription && f.gameDescription.length > fieldLimits.gameDescription) errors.gameDescription = `Max ${fieldLimits.gameDescription} characters.`;
    if (!f.startDate) errors.startDate = 'Start date is required.';
    if (!f.endDate) errors.endDate = 'End date is required.';
    if (f.startDate && f.endDate && f.endDate < f.startDate) errors.endDate = 'End date must be after start date.';
    return errors;
  }

  function validateClues(clues: string[]) {
    return clues.map((clue, i) => {
      if (!clue.trim()) return 'Clue is required.';
      if (clue.length > fieldLimits.clue) return `Max ${fieldLimits.clue} characters.`;
      return '';
    });
  }

  useEffect(() => {
    setFormErrors(validate(form));
    setClueErrors(validateClues(form.clues));
  }, [form]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setFormTouched(t => ({ ...t, [name]: true }));
  }

  function handleClueChange(idx: number, value: string) {
    setForm(f => ({ ...f, clues: f.clues.map((c, i) => i === idx ? value : c) }));
    setClueErrors(e => e.map((err, i) => i === idx ? '' : err));
  }

  function handleAddClue() {
    if (form.clues.length < MAX_CLUES) {
      setForm(f => ({ ...f, clues: [...f.clues, ''] }));
      setClueErrors(e => [...e, '']);
    }
  }

  function handleRemoveClue(idx: number) {
    if (form.clues.length > MIN_CLUES) {
      setForm(f => ({ ...f, clues: f.clues.filter((_, i) => i !== idx) }));
      setClueErrors(e => e.filter((_, i) => i !== idx));
    }
  }

  function handleCancel() {
    navigate(-1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormTouched({
      babyFirstName: true,
      babyMiddleName: true,
      babyLastName: true,
      gameTitle: true,
      gameDescription: true,
      startDate: true,
      endDate: true,
    });
    
    const errors = validate(form);
    const clueErrs = validateClues(form.clues);
    setFormErrors(errors);
    setClueErrors(clueErrs);
    
    if (Object.keys(errors).length > 0 || clueErrs.some(Boolean)) return;
    
    setSubmitting(true);
    setSubmitError('');
    
    try {
      // Get current parent
      const parent = await AuthAPI.getCurrentParent();
      if (!parent) {
        throw new Error('You must be logged in to create a game');
      }

      // Create the game in Supabase
      const gameData = {
        parent_id: parent.id,
        title: form.gameTitle,
        description: form.gameDescription || undefined,
        baby_first_name: form.babyFirstName,
        baby_middle_name: form.babyMiddleName || undefined,
        baby_last_name: form.babyLastName || undefined,
        start_date: form.startDate,
        end_date: form.endDate,
        clues: form.clues.filter(clue => clue.trim().length > 0),
        max_clues_per_player: 5,
        allow_multiple_guesses: true,
        show_other_players_guesses: false
      };

      const createdGame = await GameAPI.createGame(gameData);
      
      // Update game status to active
      await GameAPI.updateGameStatus(createdGame.id, 'active');
      
      // Create success data
      const gameUrl = `${window.location.origin}/game/${createdGame.game_code}`;
      
      setSuccessData({
        gameId: createdGame.game_code,
        gameTitle: createdGame.title,
        gameCode: createdGame.game_code,
        gameUrl,
        createdAt: new Date(createdGame.created_at),
        startDate: new Date(createdGame.start_date),
        endDate: new Date(createdGame.end_date),
        babyFirstName: createdGame.baby_first_name,
        babyMiddleName: createdGame.baby_middle_name || undefined,
        babyLastName: createdGame.baby_last_name || undefined,
        gameDescription: createdGame.description || undefined,
      });
      
    } catch (error: any) {
      console.error('Error creating game:', error);
      setSubmitError(error.message || 'Failed to create game. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (successData) {
    return (
      <SuccessGameScreen
        game={successData}
        onViewGame={() => navigate(`/game/${successData.gameId}`)}
        onCreateAnother={() => {
          setSuccessData(null);
          setForm(initialForm);
          setFormTouched({});
          setFormErrors({});
          setClueErrors([]);
          setSubmitError('');
        }}
        onBackToDashboard={() => navigate('/parent')}
      />
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md mx-auto flex flex-col items-center space-y-6 pt-8">
        <form onSubmit={handleSubmit} className="w-full bg-white/90 rounded-xl shadow-lg p-6 flex flex-col gap-6 animate-success-modal-enter">
          <div className="text-2xl font-heading font-bold text-neutral-700 mb-2 tracking-wide">Create New Game</div>
          
          {/* Baby Information Section */}
          <div>
            <div className="text-lg font-heading font-semibold text-primary mb-2">Baby Information</div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block font-body text-sm text-neutral-700 mb-1" htmlFor="babyFirstName">
                  Baby's First Name <span className="text-error">*</span>
                </label>
                <input
                  id="babyFirstName"
                  name="babyFirstName"
                  type="text"
                  placeholder="Enter first name"
                  maxLength={fieldLimits.babyFirstName}
                  className={`w-full rounded-xl border-2 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 min-h-[48px] ${formErrors.babyFirstName && formTouched.babyFirstName ? 'border-error' : 'border-gray-200'}`}
                  value={form.babyFirstName}
                  onChange={handleInputChange}
                  onBlur={() => setFormTouched(t => ({ ...t, babyFirstName: true }))}
                  required
                  aria-invalid={!!formErrors.babyFirstName}
                  aria-describedby="babyFirstName-error"
                  disabled={submitting}
                />
                {formErrors.babyFirstName && formTouched.babyFirstName && (
                  <div className="text-error text-xs mt-1" id="babyFirstName-error">{formErrors.babyFirstName}</div>
                )}
              </div>
              <div>
                <label className="block font-body text-sm text-neutral-700 mb-1" htmlFor="babyMiddleName">
                  Baby's Middle Name
                </label>
                <input
                  id="babyMiddleName"
                  name="babyMiddleName"
                  type="text"
                  placeholder="Enter middle name (optional)"
                  maxLength={fieldLimits.babyMiddleName}
                  className={`w-full rounded-xl border-2 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 min-h-[48px] ${formErrors.babyMiddleName && formTouched.babyMiddleName ? 'border-error' : 'border-gray-200'}`}
                  value={form.babyMiddleName}
                  onChange={handleInputChange}
                  onBlur={() => setFormTouched(t => ({ ...t, babyMiddleName: true }))}
                  aria-invalid={!!formErrors.babyMiddleName}
                  aria-describedby="babyMiddleName-error"
                  disabled={submitting}
                />
                {formErrors.babyMiddleName && formTouched.babyMiddleName && (
                  <div className="text-error text-xs mt-1" id="babyMiddleName-error">{formErrors.babyMiddleName}</div>
                )}
              </div>
              <div>
                <label className="block font-body text-sm text-neutral-700 mb-1" htmlFor="babyLastName">
                  Baby's Last Name
                </label>
                <input
                  id="babyLastName"
                  name="babyLastName"
                  type="text"
                  placeholder="Enter last name (optional)"
                  maxLength={fieldLimits.babyLastName}
                  className={`w-full rounded-xl border-2 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 min-h-[48px] ${formErrors.babyLastName && formTouched.babyLastName ? 'border-error' : 'border-gray-200'}`}
                  value={form.babyLastName}
                  onChange={handleInputChange}
                  onBlur={() => setFormTouched(t => ({ ...t, babyLastName: true }))}
                  aria-invalid={!!formErrors.babyLastName}
                  aria-describedby="babyLastName-error"
                  disabled={submitting}
                />
                {formErrors.babyLastName && formTouched.babyLastName && (
                  <div className="text-error text-xs mt-1" id="babyLastName-error">{formErrors.babyLastName}</div>
                )}
              </div>
            </div>
          </div>
          
          {/* Game Settings Section */}
          <div>
            <div className="text-lg font-heading font-semibold text-primary mb-2 mt-2">Game Settings</div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block font-body text-sm text-neutral-700 mb-1" htmlFor="gameTitle">
                  Game Title <span className="text-error">*</span>
                </label>
                <input
                  id="gameTitle"
                  name="gameTitle"
                  type="text"
                  placeholder="e.g., Guess Our Baby's Name!"
                  maxLength={fieldLimits.gameTitle}
                  className={`w-full rounded-xl border-2 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 min-h-[48px] ${formErrors.gameTitle && formTouched.gameTitle ? 'border-error' : 'border-gray-200'}`}
                  value={form.gameTitle}
                  onChange={handleInputChange}
                  onBlur={() => setFormTouched(t => ({ ...t, gameTitle: true }))}
                  required
                  aria-invalid={!!formErrors.gameTitle}
                  aria-describedby="gameTitle-error"
                  disabled={submitting}
                />
                {formErrors.gameTitle && formTouched.gameTitle && (
                  <div className="text-error text-xs mt-1" id="gameTitle-error">{formErrors.gameTitle}</div>
                )}
              </div>
              <div>
                <label className="block font-body text-sm text-neutral-700 mb-1" htmlFor="gameDescription">
                  Game Description
                </label>
                <textarea
                  id="gameDescription"
                  name="gameDescription"
                  placeholder="Add details about your game (optional)"
                  maxLength={fieldLimits.gameDescription}
                  className={`w-full rounded-xl border-2 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 min-h-[48px] resize-none ${formErrors.gameDescription && formTouched.gameDescription ? 'border-error' : 'border-gray-200'}`}
                  value={form.gameDescription}
                  onChange={handleInputChange}
                  onBlur={() => setFormTouched(t => ({ ...t, gameDescription: true }))}
                  aria-invalid={!!formErrors.gameDescription}
                  aria-describedby="gameDescription-error"
                  disabled={submitting}
                  rows={3}
                />
                {formErrors.gameDescription && formTouched.gameDescription && (
                  <div className="text-error text-xs mt-1" id="gameDescription-error">{formErrors.gameDescription}</div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block font-body text-sm text-neutral-700 mb-1" htmlFor="startDate">
                    Game Start Date <span className="text-error">*</span>
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    className={`w-full rounded-xl border-2 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 min-h-[48px] ${formErrors.startDate && formTouched.startDate ? 'border-error' : 'border-gray-200'}`}
                    value={form.startDate}
                    onChange={handleInputChange}
                    onBlur={() => setFormTouched(t => ({ ...t, startDate: true }))}
                    required
                    aria-invalid={!!formErrors.startDate}
                    aria-describedby="startDate-error"
                    disabled={submitting}
                    min={getTodayISO()}
                  />
                  {formErrors.startDate && formTouched.startDate && (
                    <div className="text-error text-xs mt-1" id="startDate-error">{formErrors.startDate}</div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block font-body text-sm text-neutral-700 mb-1" htmlFor="endDate">
                    Game End Date <span className="text-error">*</span>
                  </label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    className={`w-full rounded-xl border-2 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 min-h-[48px] ${formErrors.endDate && formTouched.endDate ? 'border-error' : 'border-gray-200'}`}
                    value={form.endDate}
                    onChange={handleInputChange}
                    onBlur={() => setFormTouched(t => ({ ...t, endDate: true }))}
                    required
                    aria-invalid={!!formErrors.endDate}
                    aria-describedby="endDate-error"
                    disabled={submitting}
                    min={form.startDate || getTodayISO()}
                  />
                  {formErrors.endDate && formTouched.endDate && (
                    <div className="text-error text-xs mt-1" id="endDate-error">{formErrors.endDate}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Clues Section */}
          <div>
            <div className="text-lg font-heading font-semibold text-primary mb-2 mt-2">Clues <span className="text-error">*</span></div>
            <div className="flex flex-col gap-3">
              {form.clues.map((clue, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <input
                    type="text"
                    className={`flex-1 rounded-xl border-2 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 min-h-[48px] ${clueErrors[idx] ? 'border-error' : 'border-gray-200'}`}
                    placeholder={`Clue #${idx + 1}`}
                    maxLength={fieldLimits.clue}
                    value={clue}
                    onChange={e => handleClueChange(idx, e.target.value)}
                    aria-invalid={!!clueErrors[idx]}
                    aria-describedby={`clue-error-${idx}`}
                    disabled={submitting}
                  />
                  {form.clues.length > MIN_CLUES && (
                    <button
                      type="button"
                      className="mt-1 px-2 py-1 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-all duration-150 text-lg font-bold"
                      onClick={() => handleRemoveClue(idx)}
                      aria-label="Remove clue"
                      disabled={submitting}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {clueErrors.some(Boolean) && (
                <div className="text-error text-xs mt-1">
                  {clueErrors.map((err, idx) => err && <div key={idx} id={`clue-error-${idx}`}>{`Clue #${idx + 1}: ${err}`}</div>)}
                </div>
              )}
              <button
                type="button"
                className="mt-1 py-2 px-4 rounded-xl font-heading font-medium text-base bg-gradient-to-r from-primary to-primary/80 text-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleAddClue}
                disabled={form.clues.length >= MAX_CLUES || submitting}
              >
                + Add Clue
              </button>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex gap-4 mt-2">
            <button
              type="submit"
              className="flex-1 py-3 px-6 rounded-xl font-heading font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-gradient-to-r from-primary to-primary/80 text-white hover:scale-105 active:scale-100 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Create Game"
              disabled={submitting || Object.keys(formErrors).length > 0 || clueErrors.some(Boolean)}
            >
              {submitting && <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              Create Game
            </button>
            <button
              type="button"
              className="flex-1 py-3 px-6 rounded-xl font-heading font-semibold text-lg transition-all duration-200 shadow-md bg-gray-100 text-neutral-700 hover:bg-gray-200 focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:scale-105 active:scale-100"
              aria-label="Cancel"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
          
          {/* Error Messages */}
          {submitError && (
            <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-heading font-semibold text-center shadow-sm animate-shake">
              {submitError}
            </div>
          )}
        </form>
        
        {successMsg && (
          <div className="w-full bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 font-heading font-semibold text-center shadow-sm animate-success-modal-enter">{successMsg}</div>
        )}
      </div>
    </main>
  );
};

export default CreateGamePage;