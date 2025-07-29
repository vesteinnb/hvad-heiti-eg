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
  
  // Check for full match first
  if (normalizedGuess === fullName) {
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
  
  // Check individual parts
  const matchedParts = {
    firstName: normalizedGuess === normalizedFirstName,
    middleName: normalizedMiddleName ? normalizedGuess === normalizedMiddleName : false,
    lastName: normalizedLastName ? normalizedGuess === normalizedLastName : false
  };
  
  const hasAnyMatch = matchedParts.firstName || matchedParts.middleName || matchedParts.lastName;
  
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
    
    if (middleName || lastName) {
      const remainingParts = [];
      if (middleName) remainingParts.push('middle name');
      if (lastName) remainingParts.push('last name');
      
      feedback += `\n\n🤔 But there's more! You also need to guess the ${remainingParts.join(' and ')}.`;
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
      feedback: `✅ You got the middle name: ${middleName}\n\n🤔 But you still need to guess the first name${lastName ? ' and last name' : ''} to win!`,
      revealedName: ''
    };
  }
  
  if (matchedParts.lastName) {
    return {
      isFullMatch: false,
      isPartialMatch: true,
      matchedParts,
      feedback: `✅ You got the last name: ${lastName}\n\n🤔 But you still need to guess the first name${middleName ? ' and middle name' : ''} to win!`,
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