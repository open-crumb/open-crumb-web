/**
 * Removes a value from an array. Returns a new array, does not mutate the input
 * array. Example:
 *
 * ```
 * > removeArrayValue([1, 2, 3], 2);
 * < [1, 3]
 * ```
 */
export default function removeArrayValue<V>(array: V[], value: V): V[] {
  return array.filter((item) => item !== value);
}
