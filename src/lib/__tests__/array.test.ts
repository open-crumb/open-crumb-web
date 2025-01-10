import { arrayOmit } from "@/lib/array";

describe("arrayOmit", () => {
	test("empty array", () => {
		expect(arrayOmit([], "a")).toEqual([]);
	});

	test("single value", () => {
		expect(arrayOmit(["a"], "a")).toEqual([]);
		expect(arrayOmit(["a"], "b")).toEqual(["a"]);
	});

	test("multiple values", () => {
		expect(arrayOmit([1, 2, 3], 2)).toEqual([1, 3]);
		expect(arrayOmit([4, 5, 6], 2)).toEqual([4, 5, 6]);
	});
});
