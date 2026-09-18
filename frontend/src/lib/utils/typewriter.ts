/**
 * Helper to reveal text smoothly character-by-character without translating component positions.
 * Returns an abort / cleanup function.
 */
export function animateFeedback(
  text: string,
  onTick: (partialText: string) => void,
  onComplete?: () => void,
  intervalMs = 30
): () => void {
  if (!text) {
    onTick('');
    if (onComplete) onComplete();
    return () => {};
  }

  let index = 0;
  let currentText = '';
  let isCancelled = false;

  const timer = setInterval(() => {
    if (isCancelled) {
      clearInterval(timer);
      return;
    }

    currentText += text[index];
    onTick(currentText);
    index++;

    if (index >= text.length) {
      clearInterval(timer);
      if (onComplete) onComplete();
    }
  }, intervalMs);

  return () => {
    isCancelled = true;
    clearInterval(timer);
  };
}
