import { round, sum } from "@/lib/math";

describe("sum", () => {
	test("no values", () => {
		expect(sum([])).toBe(0);
	});

	test("one value", () => {
		expect(sum([16])).toBe(16);
	});

	test("multiple values", () => {
		expect(sum([2, 8, -1])).toBe(9);
	});
});

test("round", () => {
	expect(round(10.36, 1)).toBe(10.4);
	expect(round(23.123, 2)).toBe(23.12);
	expect(round(3.912)).toBe(4);
});
