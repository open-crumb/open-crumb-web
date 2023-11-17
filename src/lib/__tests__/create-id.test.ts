import { test, expect } from '@jest/globals';
import createID from '@/lib/create-id';

test('creates a unique ID each time', () => {
  expect(createID()).not.toBe(createID());
});

test('includes the label when provided', () => {
  expect(createID('Ingredient')).toContain('Ingredient');
});
