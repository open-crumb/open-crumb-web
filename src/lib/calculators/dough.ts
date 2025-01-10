import { round, sum } from "@/lib/math";

type ID = string;

type IngredientPercent = {
	id: ID;
	name: string;
	percent: number;
};

type IngredientWeight = {
	id: ID;
	name: string;
	weight: number;
};

type InclusionDoughPercent = {
	id: ID;
	name: string;
	percent: number;
	hydrationPercent: number;
	ingredients: IngredientPercent[];
};

type InclusionDoughPart = {
	id: ID;
	name: string;
	percent: number;
	hydrationPercent: number;
	flourPercent: number;
	liquidPercent: number;
	ingredients: IngredientPercent[];
};

type InclusionDoughWeight = {
	id: ID;
	name: string;
	weight: number;
	hydrationPercent: number;
	flourWeight: number;
	liquidWeight: number;
	ingredients: IngredientWeight[];
};

type CalculateDoughBatchOptions =
	| {
			type: "BY_DOUGH_WEIGHT";
			name: string;
			doughWeight: number;
			scale: number;
			totalHydrationPercent: number;
			inclusionDoughs: InclusionDoughPercent[];
			ingredients: IngredientPercent[];
	  }
	| {
			type: "BY_FLOUR_WEIGHT";
			name: string;
			flourWeight: number;
			scale: number;
			totalHydrationPercent: number;
			inclusionDoughs: InclusionDoughPercent[];
			ingredients: IngredientPercent[];
	  };

export type CalculateDoughBatchResult = {
	name: string;
	portion: number;
	scale: number;
	totalHydrationPercent: number;
	flourWeight: number;
	liquidWeight: number;
	inclusionDoughs: InclusionDoughWeight[];
	ingredients: IngredientWeight[];
};

/**
 * Calculates the weights of ingredients in a dough batch. See `README.md` for
 * derivations.
 */
export function calculateDoughBatch(
	options: CalculateDoughBatchOptions,
): CalculateDoughBatchResult {
	const inclusionDoughParts: InclusionDoughPart[] = options.inclusionDoughs.map(
		(dough) => {
			// First convert it to part percents. This will be parts of the inclusion
			// dough.
			const parts = [
				100, // Flour percent
				dough.hydrationPercent,
				...dough.ingredients.map(({ percent }) => percent),
			];
			const flourPart = calculateIngredientPart({
				part: 100,
				parts,
			});
			const liquidPart = calculateIngredientPart({
				part: dough.hydrationPercent,
				parts,
			});
			const ingredientParts = dough.ingredients.map(
				({ id, name, percent }) => ({
					id,
					name,
					part: calculateIngredientPart({
						part: percent,
						parts,
					}),
				}),
			);

			// Now convert it to baker's percent of the whole dough.
			return {
				id: dough.id,
				name: dough.name,
				percent: dough.percent,
				hydrationPercent: dough.hydrationPercent,
				flourPercent: (dough.percent * flourPart) / 100,
				liquidPercent: (dough.percent * liquidPart) / 100,
				ingredients: ingredientParts.map(({ id, name, part }) => ({
					id,
					name,
					percent: (dough.percent * part) / 100,
				})),
			};
		},
	);

	const { portion, totalFlourWeight } = (() => {
		if (options.type === "BY_DOUGH_WEIGHT") {
			const totalDoughWeight = options.doughWeight * options.scale;
			const totalFlourWeight = calculateFlourWeight({
				doughWeight: totalDoughWeight,
				ingredientPercents: [
					100, // Flour percent
					options.totalHydrationPercent,
					...options.ingredients.map(({ percent }) => percent),
					...inclusionDoughParts.flatMap((dough) =>
						dough.ingredients.map(({ percent }) => percent),
					),
				],
			});

			return {
				portion: options.doughWeight,
				totalFlourWeight,
			};
		} else {
			const totalFlourWeight = options.flourWeight * options.scale;
			const portion = calculateDoughWeight({
				flourWeight: options.flourWeight,
				ingredientPercents: [
					100, // Flour percent
					options.totalHydrationPercent,
					...options.ingredients.map(({ percent }) => percent),
					...inclusionDoughParts.flatMap((dough) =>
						dough.ingredients.map(({ percent }) => percent),
					),
				],
			});

			return {
				portion,
				totalFlourWeight,
			};
		}
	})();

	const totalLiquidWeight = calculateIngredientWeight({
		flourWeight: totalFlourWeight,
		percent: options.totalHydrationPercent,
	});

	const inclusionDoughWeights: InclusionDoughWeight[] = inclusionDoughParts.map(
		(dough) => ({
			id: dough.id,
			name: dough.name,
			weight: calculateIngredientWeight({
				flourWeight: totalFlourWeight,
				percent: dough.percent,
			}),
			hydrationPercent: dough.hydrationPercent,
			flourWeight: calculateIngredientWeight({
				flourWeight: totalFlourWeight,
				percent: dough.flourPercent,
			}),
			liquidWeight: calculateIngredientWeight({
				flourWeight: totalFlourWeight,
				percent: dough.liquidPercent,
			}),
			ingredients: dough.ingredients.map(({ id, name, percent }) => ({
				id,
				name,
				weight: calculateIngredientWeight({
					flourWeight: totalFlourWeight,
					percent,
				}),
			})),
		}),
	);

	const flourWeight =
		totalFlourWeight -
		sum(inclusionDoughWeights.map((dough) => dough.flourWeight));
	const liquidWeight =
		totalLiquidWeight -
		sum(inclusionDoughWeights.map((dough) => dough.liquidWeight));
	const ingredientWeights: IngredientWeight[] = options.ingredients.map(
		({ id, name, percent }) => ({
			id,
			name,
			weight: calculateIngredientWeight({
				flourWeight: totalFlourWeight,
				percent,
			}),
		}),
	);

	return {
		name: options.name,
		portion,
		scale: options.scale,
		totalHydrationPercent: options.totalHydrationPercent,
		flourWeight,
		liquidWeight,
		inclusionDoughs: inclusionDoughWeights,
		ingredients: ingredientWeights,
	};
}

/**
 * Calculates the flour weight based on dough weight and ingredient percents.
 * See `README.md` for derivation.
 */
export function calculateFlourWeight(options: {
	doughWeight: number;
	ingredientPercents: number[];
}): number {
	return roundWeight(
		options.doughWeight / (sum(options.ingredientPercents) / 100),
	);
}

/**
 * Calculates the dough weight based on the flour weight and ingredient
 * percents. See `README.md` for derivation.
 */
export function calculateDoughWeight(options: {
	flourWeight: number;
	ingredientPercents: number[];
}): number {
	const ingredientWeights = options.ingredientPercents.map(
		(percent) => (options.flourWeight * percent) / 100,
	);

	return sum(ingredientWeights);
}

/**
 * Calculates an ingredient weight based the flour weight and the ingredient
 * percent. See `README.md` for derivation.
 */
export function calculateIngredientWeight(options: {
	flourWeight: number;
	percent: number;
}): number {
	return roundWeight((options.flourWeight * options.percent) / 100);
}

/**
 * Calculates the part (or percent) of the whole of an ingredient (not baker's
 * percent). See `README.md` for derivation.
 */
export function calculateIngredientPart(options: {
	part: number;
	parts: number[];
}): number {
	return (options.part / sum(options.parts)) * 100;
}

/**
 * Rounds a weight value. If the weight is less than 1, it gets rounded to a
 * single decimal place. If it's greater than 1, it gets rounded to a whole
 * number. Grams are small enough that decimals should be negligible for most
 * doughs.
 */
export function roundWeight(weight: number): number {
	if (weight < 1) {
		return round(weight, 1);
	}

	return Math.round(weight);
}
