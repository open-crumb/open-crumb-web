import { test, expect } from '@jest/globals';
import sum from '@/lib/sum';

test('sum of an empty array should be 0', () => {
  expect(sum([])).toBe(0);
});

test('gets the sum of all the number', () => {
  expect(sum([5, -1, 3, -6, 4])).toBe(5);
});
