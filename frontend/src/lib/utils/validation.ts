/**
 * Count the number of words in a string.
 * Multiple spaces, tabs, and newlines are normalized.
 */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

/**
 * Validates if the answer satisfies the minimum requirement of at least 2 words.
 */
export function isValidAnswer(text: string): boolean {
  return countWords(text) >= 2;
}
