import { describe as nodeDescribe, it as nodeIt, beforeEach as nodeBeforeEach } from 'node:test';
import assert from 'node:assert/strict';

// Polyfill Svelte 5 runes for in-process node execution
if (typeof (globalThis as any).$state === 'undefined') {
  (globalThis as any).$state = (val: any) => val;
}
if (typeof (globalThis as any).$derived === 'undefined') {
  (globalThis as any).$derived = (val: any) => val;
}

// Polyfill localStorage
if (typeof (globalThis as any).localStorage === 'undefined') {
  const store: Record<string, string> = {};
  (globalThis as any).localStorage = {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = String(v); },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { for (const k in store) delete store[k]; },
  };
}

export const describe = nodeDescribe;
export const it = nodeIt;
export const beforeEach = nodeBeforeEach;

export function expect(actual: any) {
  return {
    toBe(expected: any) {
      assert.strictEqual(actual, expected);
    },
    toEqual(expected: any) {
      assert.deepStrictEqual(actual, expected);
    },
    toContain(expected: any) {
      if (typeof actual === 'string') {
        assert.ok(actual.includes(expected), `Expected "${actual}" to contain "${expected}"`);
      } else if (Array.isArray(actual)) {
        assert.ok(actual.includes(expected), `Expected array to contain ${expected}`);
      } else {
        assert.ok(expected in actual);
      }
    },
    toBeDefined() {
      assert.notStrictEqual(actual, undefined, 'Expected value to be defined');
    },
    toBeCloseTo(expected: number, precision = 1) {
      const diff = Math.abs(actual - expected);
      assert.ok(diff < Math.pow(10, -precision) / 2, `Expected ${actual} to be close to ${expected}`);
    },
    toBeNull() {
      assert.strictEqual(actual, null);
    },
    toBeGreaterThan(expected: number) {
      assert.ok(actual > expected, `Expected ${actual} to be greater than ${expected}`);
    },
    toBeInstanceOf(expectedClass: any) {
      assert.ok(actual instanceof expectedClass, `Expected instance of ${expectedClass?.name}`);
    },
    toThrow(expectedMessage?: string) {
      if (typeof actual !== 'function') {
        throw new Error('actual must be a function to test toThrow');
      }
      if (expectedMessage) {
        assert.throws(actual, new RegExp(expectedMessage));
      } else {
        assert.throws(actual);
      }
    },
    async rejectsToThrow(expectedClass?: any) {
      await assert.rejects(actual, expectedClass);
    },
  };
}
