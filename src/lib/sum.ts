/**
 * Gets the sum of an array of numbers. If the array is empty, returns 0.
 * Example:
 *
 * ```
 * > sum([1, 2, 3])
 * < 6
 * ```
 */
export default function sum(numbers: number[]): number {
  let total = 0;

  for (const number of numbers) {
    total += number;
  }

  return total;
}
