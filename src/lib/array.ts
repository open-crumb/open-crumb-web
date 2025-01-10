/**
 * Removes a value from an array.
 */
export function arrayOmit<V>(array: V[], value: V): V[] {
	return array.filter((item) => item !== value);
}
