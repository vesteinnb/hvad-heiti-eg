let namesCache: string[] | null = null;

/**
 * Load names from the names.txt file
 */
export const loadNames = async (): Promise<string[]> => {
  if (namesCache) {
    return namesCache;
  }

  try {
    // Import the names.txt file as a text string using dynamic import
    const namesModule = await import('../names/names.txt?raw');
    const text = namesModule.default;
    
    // Split by lines and filter out empty lines
    const names = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    namesCache = names;
    return names;
  } catch (error) {
    console.error('Error loading names:', error);
    return [];
  }
};

/**
 * Normalize for case-insensitive comparison while preserving Icelandic characters
 * Only converts to lowercase, keeps all special characters intact
 */
const normalizeIcelandic = (str: string): string => {
  return str.toLowerCase();
};

/**
 * Search for names that start with the given query
 * For space-separated input, searches based on the last word
 * Returns up to `limit` names (default 5)
 */
export const searchNames = (query: string, names: string[], limit: number = 5): string[] => {
  if (!query.trim()) {
    return [];
  }

  // Split by spaces and get the last word for searching
  const words = query.trim().split(/\s+/);
  const searchTerm = words[words.length - 1];
  
  if (!searchTerm) {
    return [];
  }

  const normalizedSearchTerm = normalizeIcelandic(searchTerm);
  
  return names
    .filter(name => {
      const normalizedName = normalizeIcelandic(name);
      return normalizedName.startsWith(normalizedSearchTerm);
    })
    .slice(0, limit);
};

/**
 * Hook-friendly function that combines loading and searching
 */
export const searchNamesByQuery = async (query: string, limit: number = 5): Promise<string[]> => {
  if (!query.trim()) {
    return [];
  }

  const names = await loadNames();
  return searchNames(query, names, limit);
};