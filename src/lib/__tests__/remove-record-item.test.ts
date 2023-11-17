import { test, expect } from '@jest/globals';
import removeRecordItem, { removeRecordItems } from '@/lib/remove-record-item';

test('removes a single item', () => {
  expect(
    removeRecordItem<string, string>(
      {
        '1': 'foo',
        '2': 'bar',
        '3': 'baz',
      },
      '2',
    ),
  ).toEqual({
    '1': 'foo',
    '3': 'baz',
  });
});

test('removes multiple items', () => {
  expect(
    removeRecordItems<string, string>(
      {
        '1': 'foo',
        '2': 'bar',
        '3': 'baz',
      },
      ['1', '3'],
    ),
  ).toEqual({
    '2': 'bar',
  });
});
