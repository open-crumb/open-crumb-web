/**
 * Removes an item from a record by key. Returns a new record, does not mutate
 * the input record. Example:
 *
 * ```
 * > removeRecordItem<string, string>(
 *     {
 *       '1': 'foo',
 *       '2': 'bar',
 *       '3': 'baz'
 *     },
 *     '2'
 *   )
 * < {
 *     '1': 'foo',
 *     '3': 'baz'
 *   }
 * ```
 */
export default function removeRecordItem<K extends string | number | symbol, V>(
  record: Record<K, V>,
  key: K,
): Record<K, V> {
  const newRecord = {
    ...record,
  };

  delete newRecord[key];

  return newRecord;
}

/**
 * Removes multiple items from a record given an array of the keys to remove.
 * Returns a new record, does not mutate the input record. Example:
 *
 * ```
 * > removeRecordItems<string, string>(
 *     {
 *       '1': 'foo',
 *       '2': 'bar',
 *       '3': 'baz'
 *     },
 *     ['1', '3']
 *   )
 * < {
 *     '2': 'bar'
 *   }
 * ```
 */
export function removeRecordItems<K extends string | number | symbol, V>(
  record: Record<K, V>,
  keys: K[],
): Record<K, V> {
  const newRecord = {
    ...record,
  };

  for (const key of keys) {
    delete newRecord[key];
  }

  return newRecord;
}
