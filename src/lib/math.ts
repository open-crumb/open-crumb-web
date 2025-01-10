export function sum(values: number[]): number {
	let sum = 0;

	for (const value of values) {
		sum += value;
	}

	return sum;
}

export function round(value: number, place: number = 0): number {
	const multiplier = 10 ** place;

	return Math.round(value * multiplier) / multiplier;
}
