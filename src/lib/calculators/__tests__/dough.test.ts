import {
	calculateDoughBatch,
	calculateDoughWeight,
	calculateFlourWeight,
	calculateIngredientPart,
	calculateIngredientWeight,
} from "@/lib/calculators/dough";

describe("calculateDoughBatch", () => {
	test("simple dough (by dough weight)", () => {
		const result = calculateDoughBatch({
			type: "BY_DOUGH_WEIGHT",
			name: "Country Bread",
			doughWeight: 800,
			scale: 1,
			totalHydrationPercent: 80,
			inclusionDoughs: [],
			ingredients: [
				{
					id: "Ingredient.1",
					name: "Salt",
					percent: 2,
				},
				{
					id: "Ingredient.2",
					name: "Yeast",
					percent: 1,
				},
			],
		});

		expect(result.flourWeight).toBe(437);
		expect(result.liquidWeight).toBe(350);
		expect(result.ingredients[0].weight).toBe(9);
		expect(result.ingredients[1].weight).toBe(4);
	});

	test("simple dough (by flour weight)", () => {
		const result = calculateDoughBatch({
			type: "BY_FLOUR_WEIGHT",
			name: "Country Bread",
			flourWeight: 500,
			scale: 1,
			totalHydrationPercent: 80,
			inclusionDoughs: [],
			ingredients: [
				{
					id: "Ingredient.1",
					name: "Salt",
					percent: 2,
				},
				{
					id: "Ingredient.2",
					name: "Yeast",
					percent: 1,
				},
			],
		});

		expect(result.flourWeight).toBe(500);
		expect(result.liquidWeight).toBe(400);
		expect(result.ingredients[0].weight).toBe(10);
		expect(result.ingredients[1].weight).toBe(5);
	});

	test("dough with pre-ferment (by dough weight)", () => {
		const result = calculateDoughBatch({
			type: "BY_DOUGH_WEIGHT",
			name: "Country Sourdough",
			doughWeight: 800,
			scale: 1,
			totalHydrationPercent: 80,
			inclusionDoughs: [
				{
					id: "InclusionDough.1",
					name: "Sourdough Starter",
					percent: 20,
					hydrationPercent: 100,
					ingredients: [
						{
							id: "Ingredient.1",
							name: "Sugar",
							percent: 50,
						},
					],
				},
			],
			ingredients: [
				{
					id: "Ingredient.2",
					name: "Salt",
					percent: 2,
				},
			],
		});

		expect(result.flourWeight).toBe(396);
		expect(result.liquidWeight).toBe(310);
		expect(result.ingredients[0].weight).toBe(9);
		expect(result.inclusionDoughs[0].weight).toBe(86);
		expect(result.inclusionDoughs[0].flourWeight).toBe(34);
		expect(result.inclusionDoughs[0].liquidWeight).toBe(34);
		expect(result.inclusionDoughs[0].ingredients[0].weight).toBe(17);
	});

	test("dough with pre-ferment (by flour weight)", () => {
		const result = calculateDoughBatch({
			type: "BY_FLOUR_WEIGHT",
			name: "Country Sourdough",
			flourWeight: 500,
			scale: 1,
			totalHydrationPercent: 80,
			inclusionDoughs: [
				{
					id: "InclusionDough.1",
					name: "Sourdough Starter",
					percent: 20,
					hydrationPercent: 100,
					ingredients: [
						{
							id: "Ingredient.1",
							name: "Sugar",
							percent: 50,
						},
					],
				},
			],
			ingredients: [
				{
					id: "Ingredient.2",
					name: "Salt",
					percent: 2,
				},
			],
		});

		expect(result.flourWeight).toBe(460);
		expect(result.liquidWeight).toBe(360);
		expect(result.ingredients[0].weight).toBe(10);
		expect(result.inclusionDoughs[0].weight).toBe(100);
		expect(result.inclusionDoughs[0].flourWeight).toBe(40);
		expect(result.inclusionDoughs[0].liquidWeight).toBe(40);
		expect(result.inclusionDoughs[0].ingredients[0].weight).toBe(20);
	});

	test("scaled batch (by dough weight)", () => {
		const result = calculateDoughBatch({
			type: "BY_DOUGH_WEIGHT",
			name: "Country Sourdough Batch",
			doughWeight: 800,
			scale: 2,
			totalHydrationPercent: 80,
			inclusionDoughs: [
				{
					id: "InclusionDough.1",
					name: "Sourdough Starter",
					percent: 20,
					hydrationPercent: 100,
					ingredients: [],
				},
			],
			ingredients: [
				{
					id: "Ingredient.2",
					name: "Salt",
					percent: 2,
				},
			],
		});

		expect(result.flourWeight).toBe(791);
		expect(result.liquidWeight).toBe(615);
		expect(result.ingredients[0].weight).toBe(18);
		expect(result.inclusionDoughs[0].weight).toBe(176);
		expect(result.inclusionDoughs[0].flourWeight).toBe(88);
		expect(result.inclusionDoughs[0].liquidWeight).toBe(88);
	});

	test("scaled batch (by flour weight)", () => {
		const result = calculateDoughBatch({
			type: "BY_FLOUR_WEIGHT",
			name: "Country Sourdough Batch",
			flourWeight: 500,
			scale: 2,
			totalHydrationPercent: 80,
			inclusionDoughs: [
				{
					id: "InclusionDough.1",
					name: "Sourdough Starter",
					percent: 20,
					hydrationPercent: 100,
					ingredients: [],
				},
			],
			ingredients: [
				{
					id: "Ingredient.2",
					name: "Salt",
					percent: 2,
				},
			],
		});

		expect(result.flourWeight).toBe(900);
		expect(result.liquidWeight).toBe(700);
		expect(result.ingredients[0].weight).toBe(20);
		expect(result.inclusionDoughs[0].weight).toBe(200);
		expect(result.inclusionDoughs[0].flourWeight).toBe(100);
		expect(result.inclusionDoughs[0].liquidWeight).toBe(100);
	});
});

test("calculateFlourWeight", () => {
	expect(
		calculateFlourWeight({
			doughWeight: 1000,
			ingredientPercents: [100, 80, 2],
		}),
	).toBe(549);
});

test("calculateDoughWeight", () => {
	expect(
		calculateDoughWeight({
			flourWeight: 500,
			ingredientPercents: [100, 80, 2],
		}),
	).toBe(910);
});

test("calculateIngredientWeight", () => {
	expect(
		calculateIngredientWeight({
			flourWeight: 500,
			percent: 80,
		}),
	).toBe(400);
});

test("calculateIngredientPart", () => {
	expect(
		calculateIngredientPart({
			part: 20,
			parts: [100, 80, 20],
		}),
	).toBe(10);
});
