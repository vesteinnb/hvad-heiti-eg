import React from 'react';
import { useGameCreation } from '../../hooks';
import ClueEditor from './ClueEditor';
import type { GameSuccess } from '../../SuccessGameScreen';

interface GameCreationFormProps {
  onSuccess: (successData: GameSuccess) => void;
  onCancel?: () => void;
}

const GameCreationForm: React.FC<GameCreationFormProps> = ({ onSuccess, onCancel }) => {
  const {
    formData,
    errors,
    touched,
    clueErrors,
    isValid,
    submitting,
    submitError,
    handleInputChange,
    handleBlur,
    handleClueChange,
    addClue,
    removeClue,
    submitGame,
    resetForm,
  } = useGameCreation();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const successData = await submitGame();
      onSuccess(successData);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
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
              maxLength={32}
              className={`w-full rounded-xl border-2 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 min-h-[48px] ${errors.babyFirstName && touched.babyFirstName ? 'border-error' : 'border-gray-200'}`}
              value={formData.babyFirstName}
              onChange={e => handleInputChange('babyFirstName', e.target.value)}
              onBlur={() => handleBlur('babyFirstName')}
              required
              aria-invalid={!!errors.babyFirstName}
              aria-describedby="babyFirstName-error"
              disabled={submitting}
            />
            {errors.babyFirstName && touched.babyFirstName && (
              <div className="text-error text-xs mt-1" id="babyFirstName-error">{errors.babyFirstName}</div>
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
              maxLength={32}
              className={`w-full rounded-xl border-2 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 min-h-[48px] ${errors.babyMiddleName && touched.babyMiddleName ? 'border-error' : 'border-gray-200'}`}
              value={formData.babyMiddleName}
              onChange={e => handleInputChange('babyMiddleName', e.target.value)}
              onBlur={() => handleBlur('babyMiddleName')}
              aria-invalid={!!errors.babyMiddleName}
              aria-describedby="babyMiddleName-error"
              disabled={submitting}
            />
            {errors.babyMiddleName && touched.babyMiddleName && (
              <div className="text-error text-xs mt-1" id="babyMiddleName-error">{errors.babyMiddleName}</div>
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
              maxLength={32}
              className={`w-full rounded-xl border-2 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 min-h-[48px] ${errors.babyLastName && touched.babyLastName ? 'border-error' : 'border-gray-200'}`}
              value={formData.babyLastName}
              onChange={e => handleInputChange('babyLastName', e.target.value)}
              onBlur={() => handleBlur('babyLastName')}
              aria-invalid={!!errors.babyLastName}
              aria-describedby="babyLastName-error"
              disabled={submitting}
            />
            {errors.babyLastName && touched.babyLastName && (
              <div className="text-error text-xs mt-1" id="babyLastName-error">{errors.babyLastName}</div>
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
              maxLength={100}
              className={`w-full rounded-xl border-2 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 min-h-[48px] ${errors.gameTitle && touched.gameTitle ? 'border-error' : 'border-gray-200'}`}
              value={formData.gameTitle}
              onChange={e => handleInputChange('gameTitle', e.target.value)}
              onBlur={() => handleBlur('gameTitle')}
              required
              aria-invalid={!!errors.gameTitle}
              aria-describedby="gameTitle-error"
              disabled={submitting}
            />
            {errors.gameTitle && touched.gameTitle && (
              <div className="text-error text-xs mt-1" id="gameTitle-error">{errors.gameTitle}</div>
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
              maxLength={500}
              className={`w-full rounded-xl border-2 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 min-h-[48px] resize-none ${errors.gameDescription && touched.gameDescription ? 'border-error' : 'border-gray-200'}`}
              value={formData.gameDescription}
              onChange={e => handleInputChange('gameDescription', e.target.value)}
              onBlur={() => handleBlur('gameDescription')}
              aria-invalid={!!errors.gameDescription}
              aria-describedby="gameDescription-error"
              disabled={submitting}
              rows={3}
            />
            {errors.gameDescription && touched.gameDescription && (
              <div className="text-error text-xs mt-1" id="gameDescription-error">{errors.gameDescription}</div>
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
                className={`w-full rounded-xl border-2 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 min-h-[48px] ${errors.startDate && touched.startDate ? 'border-error' : 'border-gray-200'}`}
                value={formData.startDate}
                onChange={e => handleInputChange('startDate', e.target.value)}
                onBlur={() => handleBlur('startDate')}
                required
                aria-invalid={!!errors.startDate}
                aria-describedby="startDate-error"
                disabled={submitting}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.startDate && touched.startDate && (
                <div className="text-error text-xs mt-1" id="startDate-error">{errors.startDate}</div>
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
                className={`w-full rounded-xl border-2 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 min-h-[48px] ${errors.endDate && touched.endDate ? 'border-error' : 'border-gray-200'}`}
                value={formData.endDate}
                onChange={e => handleInputChange('endDate', e.target.value)}
                onBlur={() => handleBlur('endDate')}
                required
                aria-invalid={!!errors.endDate}
                aria-describedby="endDate-error"
                disabled={submitting}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
              />
              {errors.endDate && touched.endDate && (
                <div className="text-error text-xs mt-1" id="endDate-error">{errors.endDate}</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Clues Section */}
      <ClueEditor
        clues={formData.clues}
        clueErrors={clueErrors}
        maxClues={10}
        minClues={1}
        clueLimit={80}
        disabled={submitting}
        onClueChange={handleClueChange}
        onAddClue={addClue}
        onRemoveClue={removeClue}
      />
      
      {/* Form Actions */}
      <div className="flex gap-4 mt-2">
        <button
          type="submit"
          className="flex-1 py-3 px-6 rounded-xl font-heading font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-gradient-to-r from-primary to-primary/80 text-white hover:scale-105 active:scale-100 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Create Game"
          disabled={submitting || !isValid}
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
  );
};

export default GameCreationForm;