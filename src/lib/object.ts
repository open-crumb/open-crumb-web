export function objectOmit<K extends string | number | symbol, V>(
	object: Record<K, V>,
	key: K,
): Record<K, V> {
	const clone = { ...object };

	delete clone[key];

	return clone;
}
