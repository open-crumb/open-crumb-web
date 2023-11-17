/**
 * Baker's math is such that all ingredients are expressed as percents of the
 * total flour in the dough. For example if there is 500g of flour and 400g of
 * water in the dough, the hydration is expressed as 80% (or 400 / 500). It is
 * often the case though that we want to work backwards from a total dough
 * weight (to fit a specific size of banneton or target a specific final product
 * weight) and figure out the weight of each ingredient. This calculator
 * supports both methods.
 *
 * Formula derivations:
 *
 *   Dough Weight = sum(Ingredient Weights)
 *
 *   Example:
 *     Dough Weight = Flour Weight + Water Weight + Salt Weight
 *     910g = 500g + 400g + 10g
 *
 *   Ingredient Weight = Flour Weight * Ingredient Percent
 *
 *   Example:
 *     Water Weight = Flour Weight * Water Percent
 *     400g = 500g * 80%
 *
 *   Dough Weight = sum(Flour Weight * Ingredient Percent[i])
 *   Dough Weight = Flour Weight * sum(Ingredient Percent[i])
 *
 *   Example:
 *     Dough Weight =
 *       Flour Weight * Flour Percent +
 *       Flour Weight * Water Percent +
 *       Flour Weight * Salt Percent
 *     910g = 500g * 100% + 500g * 80% + 500g * 2%
 *     910g = 500g + 400g + 10g
 *
 *   Flour Weight = Dough Weight / sum(Ingredient Percent[i])
 *
 *   Example:
 *     Flour Weight =
 *       Dough Weight /
 *       (Flour Percent + Water Percent + Salt Percent)
 *     500g = 910g / (100% + 80% + 2%)
 *     500g = 910g / 182%
 */
import sum from '@/lib/sum';

/**
 * Calculates dough weight using the formula:
 *
 *   Dough Weight =
 *     Total Flour Weight +
 *     sum(Total Flour Weight * Ingredient Percent[i])
 */
export function calculateDoughWeight(options: {
  totalFlourWeight: string;
  ingredientPercents: string[];
}): string {
  const totalFlourWeight = parseFloat(options.totalFlourWeight);
  const ingredientPercents = options.ingredientPercents.map((percent) =>
    parseFloat(percent),
  );

  if (![totalFlourWeight, ...ingredientPercents].every(Number.isFinite)) {
    return '';
  }

  const result =
    totalFlourWeight +
    ingredientPercents.reduce(
      (total, percent) => total + (totalFlourWeight * percent) / 100,
      0,
    );

  return String(Math.round(result));
}

/**
 * Calculates dough weight using the formula:
 *
 *   Dough Weight = sum(Ingredient Weight[i])
 */
export function calculateDoughWeightByIngredientWeights(options: {
  ingredientWeights: string[];
}): string {
  const ingredientWeights = options.ingredientWeights.map((weight) =>
    parseFloat(weight),
  );

  if (!ingredientWeights.every(Number.isFinite)) {
    return '';
  }

  return String(Math.round(sum(ingredientWeights)));
}

/**
 * Calculates total flour weight using the formula:
 *
 *   Total Flour Weight = Dough Weight / (1 + sum(Ingredient Percent[i]))
 */
export function calculateTotalFlourWeight(options: {
  doughWeight: string;
  ingredientPercents: string[];
}): string {
  const doughWeight = parseFloat(options.doughWeight);
  const ingredientPercents = options.ingredientPercents.map(
    (ingredientPercent) => parseFloat(ingredientPercent),
  );

  if (![doughWeight, ...ingredientPercents].every(Number.isFinite)) {
    return '';
  }

  const result =
    doughWeight /
    ingredientPercents.reduce((total, percent) => total + percent / 100, 1);

  return String(Math.round(result));
}

/**
 * Calculates new total flour weight given a single ingredient weight change
 * using the formula:
 *
 *   Total Flour Weight =
 *     (Dough Weight - Changed Ingredient Weight) /
 *     sum(Unchanged Ingredient Percent[i])
 */
export function calculateTotalFlourWeightByIngredientWeightChange(options: {
  doughWeight: string;
  changedIngredientWeight: string;
  unchangedIngredientPercents: string[];
}): string {
  const doughWeight = parseFloat(options.doughWeight);
  const changedIngredientWeight = parseFloat(options.changedIngredientWeight);
  const unchangedIngredientPercents = options.unchangedIngredientPercents.map(
    (percent) => parseFloat(percent) / 100,
  );

  if (
    ![
      doughWeight,
      changedIngredientWeight,
      ...unchangedIngredientPercents,
    ].every(Number.isFinite)
  ) {
    return '';
  }

  const result =
    (doughWeight - changedIngredientWeight) /
    (1 + sum(unchangedIngredientPercents));

  return String(Math.round(result));
}

/**
 * Calculates an ingredient percent using the formula:
 *
 *   Ingredient Percent = Ingredient Weight / Total Flour Weight
 */
export const calculateIngredientPercent = withValidation(
  (options: { totalFlourWeight: number; weight: number }): number =>
    Math.round((options.weight / options.totalFlourWeight) * 100),
);

/**
 * Calculates an ingredient weight using the formula:
 *
 *   Ingredient Weight = Total Flour Weight * Ingredient Percent
 */
export const calculateIngredientWeight = withValidation(
  (options: { totalFlourWeight: number; percent: number }): number =>
    Math.round((options.totalFlourWeight * options.percent) / 100),
);

/**
 * Levain is usually composed of a 1:1 ratio of flour and water. Thus we will
 * consider the default ingredient percent to be 1/2 of the total levain
 * percent.
 */
export const calculateDefaultLevainIngredientPercent = withValidation(
  (options: { levainPercent: number }): number =>
    Math.round(options.levainPercent / 2),
);

/**
 * Applies a multiplier to a calculator input.
 */
export const applyMultiplier = withValidation(
  (options: { value: number; multiplier: number }): number =>
    options.value * options.multiplier,
);

/**
 * Calcualtes the difference between a total percent and the sum of a list of
 * individual percents. For example the levain's liquid ingredients will detract
 * from the main dough's hydration percent.
 */
export function calculatePercentDifference(options: {
  totalPercent: string;
  otherPercents: string[];
}): string {
  const totalPercent = parseFloat(options.totalPercent);
  const otherPercents = options.otherPercents.map((percent) =>
    parseFloat(percent),
  );

  if (![totalPercent, ...otherPercents].every(Number.isFinite)) {
    return '';
  }

  return String(totalPercent - sum(otherPercents));
}

/**
 * Most of these operations are taking the raw string inputs from the text
 * fields and producing a calculation for another text field. This is a
 * higher-order function to handle converting the inputs to numbers, validating
 * that they are finite numbers, performing the calculation, then converting the
 * result back into a string. This simplifies validation boilerplate in each of
 * the individual calculators. Calculators with more complex inputs will perform
 * their own validation.
 */
function withValidation<O extends Record<string, number>>(
  calculate: (options: O) => number,
) {
  return (options: { [Prop in keyof O]: string }): string => {
    const optionEntries = Object.entries(options).map(([key, value]) => [
      key,
      parseFloat(value),
    ]);

    if (!optionEntries.every(([, value]) => Number.isFinite(value))) {
      return '';
    }

    const result = calculate(Object.fromEntries(optionEntries));

    return String(result);
  };
}
