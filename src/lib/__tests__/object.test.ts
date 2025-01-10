import { objectOmit } from "@/lib/object";

describe("objectWithoutKey", () => {
	test("empty object", () => {
		expect(objectOmit<string, unknown>({}, "a")).toEqual({});
	});

	test("single value", () => {
		expect(objectOmit<string, number>({ a: 1 }, "a")).toEqual({});
		expect(objectOmit<string, number>({ a: 1 }, "b")).toEqual({ a: 1 });
	});

	test("multiple values", () => {
		expect(
			objectOmit<string, number>(
				{
					a: 1,
					b: 2,
				},
				"b",
			),
		).toEqual({ a: 1 });
		expect(
			objectOmit<string, number>(
				{
					a: 1,
					b: 2,
				},
				"c",
			),
		).toEqual({
			a: 1,
			b: 2,
		});
	});
});
