import { useState, useEffect, useCallback, useRef } from 'react';
import { searchNamesByQuery } from '../utils/nameUtils';

interface UseAutocompleteOptions {
  debounceMs?: number;
  maxSuggestions?: number;
}

interface UseAutocompleteReturn {
  suggestions: string[];
  isLoading: boolean;
  selectedIndex: number;
  showSuggestions: boolean;
  selectSuggestion: (index: number) => void;
  selectCurrentSuggestion: () => string | null;
  handleKeyDown: (event: React.KeyboardEvent) => boolean;
  hideSuggestions: () => void;
  showSuggestionsForQuery: (query: string) => void;
}

export const useAutocomplete = (
  options: UseAutocompleteOptions = {}
): UseAutocompleteReturn => {
  const {
    debounceMs = 300,
    maxSuggestions = 5
  } = options;

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentQueryRef = useRef<string>('');

  // Debounced search function
  const debouncedSearch = useCallback(
    (query: string) => {
      // Clear previous timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set new timeout
      debounceTimeoutRef.current = setTimeout(async () => {
        if (query.trim() === '') {
          setSuggestions([]);
          setShowSuggestions(false);
          setSelectedIndex(-1);
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        try {
          const results = await searchNamesByQuery(query, maxSuggestions);
          
          // Only update if this is still the current query
          if (currentQueryRef.current === query) {
            setSuggestions(results);
            setShowSuggestions(results.length > 0);
            setSelectedIndex(-1); // Reset selection
          }
        } catch (error) {
          console.error('Error searching names:', error);
          setSuggestions([]);
          setShowSuggestions(false);
        } finally {
          setIsLoading(false);
        }
      }, debounceMs);
    },
    [debounceMs, maxSuggestions]
  );

  // Show suggestions for a given query
  const showSuggestionsForQuery = useCallback((query: string) => {
    currentQueryRef.current = query;
    debouncedSearch(query);
  }, [debouncedSearch]);

  // Select suggestion by index
  const selectSuggestion = useCallback((index: number) => {
    if (index >= 0 && index < suggestions.length) {
      setSelectedIndex(index);
    }
  }, [suggestions.length]);

  // Get currently selected suggestion
  const selectCurrentSuggestion = useCallback((): string | null => {
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      return suggestions[selectedIndex];
    }
    return null;
  }, [selectedIndex, suggestions]);

  // Hide suggestions
  const hideSuggestions = useCallback(() => {
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setSuggestions([]);
    currentQueryRef.current = '';
    
    // Clear any pending debounced search
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent): boolean => {
    if (!showSuggestions || suggestions.length === 0) {
      return false;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        return true;
        
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        return true;
        
      case 'Enter':
        if (selectedIndex >= 0) {
          event.preventDefault();
          return true; // Let the parent handle the selection
        }
        return false;
        
      case 'Escape':
        event.preventDefault();
        hideSuggestions();
        return true;
        
      default:
        return false;
    }
  }, [showSuggestions, suggestions.length, selectedIndex, hideSuggestions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    suggestions,
    isLoading,
    selectedIndex,
    showSuggestions,
    selectSuggestion,
    selectCurrentSuggestion,
    handleKeyDown,
    hideSuggestions,
    showSuggestionsForQuery
  };
};