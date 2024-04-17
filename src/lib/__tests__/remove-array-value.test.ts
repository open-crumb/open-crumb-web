import { test, expect } from '@jest/globals';
import removeArrayValue from '@/lib/remove-array-value';

test('removes a value from an array', () => {
  expect(removeArrayValue([1, 2, 3], 2)).toEqual([1, 3]);
});
