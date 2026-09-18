import { describe, it, expect } from '../test-utils.ts';
import { countWords, isValidAnswer } from '../../src/lib/utils/validation.ts';

describe('Validation Utility Tests', () => {
  describe('countWords', () => {
    it('should return 0 for empty or whitespace-only strings', () => {
      expect(countWords('')).toBe(0);
      expect(countWords('   ')).toBe(0);
      expect(countWords('\t\n\r  ')).toBe(0);
    });

    it('should accurately count single words', () => {
      expect(countWords('Halo')).toBe(1);
      expect(countWords('  Belajar  ')).toBe(1);
    });

    it('should normalize multiple consecutive spaces and newlines', () => {
      expect(countWords('Satu dua tiga')).toBe(3);
      expect(countWords('Satu    dua    tiga')).toBe(3);
      expect(countWords('Baris pertama\nBaris kedua\n\nBaris ketiga')).toBe(6);
    });

    it('should handle alphanumeric words and punctuation', () => {
      expect(countWords('Frontend Svelte 5 berjalan di tahun 2026.')).toBe(7);
    });
  });

  describe('isValidAnswer', () => {
    it('should reject answers with less than 2 words', () => {
      expect(isValidAnswer('')).toBe(false);
      expect(isValidAnswer('Jawaban')).toBe(false);
      expect(isValidAnswer('   Singkat   ')).toBe(false);
    });

    it('should accept answers with 2 or more words', () => {
      expect(isValidAnswer('Jawaban saya')).toBe(true);
      expect(isValidAnswer('Algoritma binary search membagi dua ruang pencarian')).toBe(true);
    });
  });
});
