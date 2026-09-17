import { describe as nodeDescribe, it as nodeIt, before as nodeBefore } from "node:test";
import assert from "node:assert/strict";

export const describe = nodeDescribe;
export const it = nodeIt;
export const beforeAll = nodeBefore;

export function expect(actual: any) {
  return {
    toBe(expected: any) {
      assert.strictEqual(actual, expected);
    },
    toEqual(expected: any) {
      assert.deepStrictEqual(actual, expected);
    },
    toContain(expected: any) {
      if (typeof actual === "string") {
        assert.ok(actual.includes(expected), `Expected "${actual}" to contain "${expected}"`);
      } else if (Array.isArray(actual)) {
        assert.ok(actual.includes(expected), `Expected array to contain ${expected}`);
      } else {
        assert.ok(expected in actual);
      }
    },
    toBeDefined() {
      assert.notStrictEqual(actual, undefined, "Expected value to be defined");
    },
    toBeGreaterThan(expected: number) {
      assert.ok(actual > expected, `Expected ${actual} to be greater than ${expected}`);
    },
    toBeInstanceOf(expectedClass: any) {
      assert.ok(actual instanceof expectedClass, `Expected instance of ${expectedClass?.name}`);
    },
    toThrow(expectedMessage?: string) {
      if (typeof actual !== "function") {
        throw new Error("actual must be a function to test toThrow");
      }
      if (expectedMessage) {
        assert.throws(actual, new RegExp(expectedMessage));
      } else {
        assert.throws(actual);
      }
    },
  };
}
