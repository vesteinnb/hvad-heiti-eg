import { useState } from 'react';
import { GameAPI, AuthAPI } from '../lib/supabase';
import { useFormValidation } from './useFormValidation';
import type { GameSuccess } from '../SuccessGameScreen';

interface GameCreationData {
  babyFirstName: string;
  babyMiddleName: string;
  babyLastName: string;
  gameTitle: string;
  gameDescription: string;
  startDate: string;
  endDate: string;
  clues: string[];
}

const fieldLimits = {
  babyFirstName: 32,
  babyMiddleName: 32,
  babyLastName: 32,
  gameTitle: 64,
  gameDescription: 256,
  clue: 80,
};

function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

const initialFormData: GameCreationData = {
  babyFirstName: '',
  babyMiddleName: '',
  babyLastName: '',
  gameTitle: '',
  gameDescription: '',
  startDate: getTodayISO(),
  endDate: getTodayISO(),
  clues: [''],
};

const validationRules = {
  babyFirstName: {
    required: true,
    maxLength: fieldLimits.babyFirstName,
  },
  babyMiddleName: {
    maxLength: fieldLimits.babyMiddleName,
  },
  babyLastName: {
    maxLength: fieldLimits.babyLastName,
  },
  gameTitle: {
    required: true,
    maxLength: fieldLimits.gameTitle,
  },
  gameDescription: {
    maxLength: fieldLimits.gameDescription,
  },
  startDate: {
    required: true,
  },
  endDate: {
    required: true,
    custom: (value: string, allValues: GameCreationData) => {
      if (allValues.startDate && value && value < allValues.startDate) {
        return 'End date must be after start date';
      }
      return null;
    },
  },
};

interface UseGameCreationReturn {
  formData: GameCreationData;
  errors: Partial<Record<keyof GameCreationData, string>>;
  touched: Partial<Record<keyof GameCreationData, boolean>>;
  clueErrors: string[];
  isValid: boolean;
  submitting: boolean;
  submitError: string | null;
  handleInputChange: (name: keyof GameCreationData, value: string) => void;
  handleBlur: (name: keyof GameCreationData) => void;
  handleClueChange: (index: number, value: string) => void;
  addClue: () => void;
  removeClue: (index: number) => void;
  submitGame: () => Promise<GameSuccess>;
  resetForm: () => void;
}

export const useGameCreation = (): UseGameCreationReturn => {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [clueErrors, setClueErrors] = useState<string[]>(['']);

  const {
    values: formData,
    errors,
    touched,
    isValid: formValid,
    handleChange,
    handleBlur,
    resetForm: resetFormValidation,
  } = useFormValidation(initialFormData, validationRules);

  const validateClues = (clues: string[]): string[] => {
    return clues.map((clue) => {
      if (!clue.trim()) return 'Clue is required';
      if (clue.length > fieldLimits.clue) return `Max ${fieldLimits.clue} characters`;
      return '';
    });
  };

  const handleInputChange = (name: keyof GameCreationData, value: string) => {
    handleChange(name, value);
  };

  const handleClueChange = (index: number, value: string) => {
    const newClues = [...formData.clues];
    newClues[index] = value;
    handleChange('clues', newClues);
    
    // Update clue errors
    const newClueErrors = [...clueErrors];
    newClueErrors[index] = value.trim() ? '' : 'Clue is required';
    if (value.length > fieldLimits.clue) {
      newClueErrors[index] = `Max ${fieldLimits.clue} characters`;
    }
    setClueErrors(newClueErrors);
  };

  const addClue = () => {
    if (formData.clues.length < 10) {
      handleChange('clues', [...formData.clues, '']);
      setClueErrors([...clueErrors, '']);
    }
  };

  const removeClue = (index: number) => {
    if (formData.clues.length > 1) {
      const newClues = formData.clues.filter((_, i) => i !== index);
      handleChange('clues', newClues);
      setClueErrors(clueErrors.filter((_, i) => i !== index));
    }
  };

  const submitGame = async (): Promise<GameSuccess> => {
    setSubmitting(true);
    setSubmitError(null);

    // Validate clues
    const clueValidationErrors = validateClues(formData.clues);
    setClueErrors(clueValidationErrors);

    if (!formValid || clueValidationErrors.some(Boolean)) {
      setSubmitting(false);
      throw new Error('Please fix validation errors');
    }

    try {
      const parent = await AuthAPI.getCurrentParent();
      if (!parent) {
        throw new Error('You must be logged in to create a game');
      }

      const gameData = {
        parent_id: parent.id,
        title: formData.gameTitle,
        description: formData.gameDescription || undefined,
        baby_first_name: formData.babyFirstName,
        baby_middle_name: formData.babyMiddleName || undefined,
        baby_last_name: formData.babyLastName || undefined,
        start_date: formData.startDate,
        end_date: formData.endDate,
        clues: formData.clues.filter(clue => clue.trim().length > 0),
        max_clues_per_player: 5,
        allow_multiple_guesses: true,
        show_other_players_guesses: false
      };

      const createdGame = await GameAPI.createGame(gameData);
      await GameAPI.updateGameStatus(createdGame.id, 'active');

      const gameUrl = `${window.location.origin}/game/${createdGame.game_code}`;

      return {
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
      };
    } catch (error: any) {
      console.error('Error creating game:', error);
      const errorMessage = error.message || 'Failed to create game. Please try again.';
      setSubmitError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    resetFormValidation();
    setClueErrors(['']);
    setSubmitError(null);
  };

  const isValid = formValid && !clueErrors.some(Boolean);

  return {
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
  };
};