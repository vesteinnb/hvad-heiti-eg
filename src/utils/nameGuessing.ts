export interface NameGuessResult {
  isFullMatch: boolean;
  isPartialMatch: boolean;
  matchedParts: {
    firstName: boolean;
    middleName: boolean;
    lastName: boolean;
  };
  feedback: string;
  revealedName: string;
}

export const checkNameGuess = (
  guess: string,
  firstName: string,
  middleName: string | null,
  lastName: string | null
): NameGuessResult => {
  const normalizeString = (str: string) => str.toLowerCase().trim();
  const normalizedGuess = normalizeString(guess);
  
  const normalizedFirstName = normalizeString(firstName);
  const normalizedMiddleName = middleName ? normalizeString(middleName) : null;
  const normalizedLastName = lastName ? normalizeString(lastName) : null;
  
  // Build the full name parts that exist
  const nameParts = [firstName];
  if (middleName) nameParts.push(middleName);
  if (lastName) nameParts.push(lastName);
  
  const fullName = nameParts.join(' ').toLowerCase();
  
  // Check for full match first (or just first+middle if last name exists)
  const requiredName = middleName ? `${firstName} ${middleName}` : firstName;
  const isCompleteGuess = normalizedGuess === fullName || normalizedGuess === requiredName.toLowerCase();
  
  if (isCompleteGuess) {
    return {
      isFullMatch: true,
      isPartialMatch: false,
      matchedParts: {
        firstName: true,
        middleName: !!middleName,
        lastName: !!lastName
      },
      feedback: `🎉 Correct! The baby's name is ${nameParts.join(' ')}!`,
      revealedName: nameParts.join(' ')
    };
  }
  
  // Check individual parts (excluding last name since it's always visible)
  const matchedParts = {
    firstName: normalizedGuess === normalizedFirstName,
    middleName: normalizedMiddleName ? normalizedGuess === normalizedMiddleName : false,
    lastName: false // Last name is always visible, so don't count as a match
  };
  
  const hasAnyMatch = matchedParts.firstName || matchedParts.middleName;
  
  if (!hasAnyMatch) {
    return {
      isFullMatch: false,
      isPartialMatch: false,
      matchedParts,
      feedback: "❌ That's not correct. Try again!",
      revealedName: ''
    };
  }
  
  // Handle partial matches
  if (matchedParts.firstName) {
    const revealedParts = [firstName];
    let feedback = `✅ Great! You got the first name: ${firstName}`;
    
    if (middleName) {
      feedback += `\n\n🤔 But there's more! You also need to guess the middle name.`;
    }
    
    return {
      isFullMatch: false,
      isPartialMatch: true,
      matchedParts,
      feedback,
      revealedName: revealedParts.join(' ')
    };
  }
  
  if (matchedParts.middleName) {
    return {
      isFullMatch: false,
      isPartialMatch: true,
      matchedParts,
      feedback: `✅ You got the middle name: ${middleName}\n\n🤔 But you still need to guess the first name to win!`,
      revealedName: ''
    };
  }
  
  return {
    isFullMatch: false,
    isPartialMatch: false,
    matchedParts,
    feedback: "❌ That's not correct. Try again!",
    revealedName: ''
  };
};