import React, { useRef, useEffect, useState } from 'react';
import { useAutocomplete } from '../../hooks/useAutocomplete';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  autoFocus?: boolean;
  'aria-label'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled = false,
  loading = false,
  className = '',
  autoFocus = false,
  'aria-label': ariaLabel,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  
  const {
    suggestions,
    isLoading: autocompleteLoading,
    selectedIndex,
    showSuggestions,
    selectSuggestion,
    selectCurrentSuggestion,
    handleKeyDown,
    hideSuggestions,
    showSuggestionsForQuery
  } = useAutocomplete({
    debounceMs: 200,
    maxSuggestions: 5
  });

  // Update suggestions when value changes
  useEffect(() => {
    if (isFocused) {
      showSuggestionsForQuery(value);
    }
  }, [value, isFocused, showSuggestionsForQuery]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
    if (value.trim()) {
      showSuggestionsForQuery(value);
    }
  };

  // Handle input blur
  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setIsFocused(false);
      hideSuggestions();
    }, 150);
  };

  // Handle key down events
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const wasHandled = handleKeyDown(e);
    
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // If a suggestion is selected, use it
      const selectedSuggestion = selectCurrentSuggestion();
      if (selectedSuggestion) {
        const newValue = getValueWithSuggestion(selectedSuggestion);
        onChange(newValue);
        hideSuggestions();
        onSubmit(newValue);
      } else {
        // Submit current value
        onSubmit(value);
      }
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string, index: number) => {
    const newValue = getValueWithSuggestion(suggestion);
    onChange(newValue);
    hideSuggestions();
    onSubmit(newValue);
    inputRef.current?.focus();
  };

  // Helper function to construct new value with selected suggestion
  const getValueWithSuggestion = (suggestion: string): string => {
    const words = value.trim().split(/\s+/);
    if (words.length <= 1) {
      return suggestion;
    }
    // Replace the last word with the suggestion
    words[words.length - 1] = suggestion;
    return words.join(' ');
  };

  // Handle suggestion hover
  const handleSuggestionHover = (index: number) => {
    selectSuggestion(index);
  };

  const shouldShowSuggestions = showSuggestions && isFocused && suggestions.length > 0;

  return (
    <div className="relative w-full">
      {/* Input field */}
      <input
        ref={inputRef}
        type="text"
        inputMode="text"
        autoComplete="off"
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
        disabled={disabled || loading}
        autoFocus={autoFocus}
        className={className}
        aria-label={ariaLabel}
        aria-invalid={ariaInvalid}
        aria-required={ariaRequired}
        aria-expanded={shouldShowSuggestions}
        aria-haspopup="listbox"
        role="combobox"
      />

      {/* Loading indicator */}
      {autocompleteLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Suggestions dropdown */}
      {shouldShowSuggestions && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1">
          <ul
            className="bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
            role="listbox"
            aria-label="Name suggestions"
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                  index === selectedIndex
                    ? 'bg-purple-100 text-purple-900'
                    : 'text-gray-900 hover:bg-gray-50'
                } ${index === 0 ? 'rounded-t-xl' : ''} ${
                  index === suggestions.length - 1 ? 'rounded-b-xl' : ''
                }`}
                onClick={() => handleSuggestionClick(suggestion, index)}
                onMouseEnter={() => handleSuggestionHover(index)}
                role="option"
                aria-selected={index === selectedIndex}
              >
                <span className="font-medium text-base">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;