import sum from '@/lib/sum';
import {
  BreadRecipeByPercent,
  ID,
  IngredientByPercent,
  IngredientByQuantity,
  RawIngredientByPercent,
  Recipe,
  RecipeByQuantity,
  State,
} from '@/ui/core/recipes/data/state';
import {
  assertIngredientExists,
  assertRecipeExists,
} from '@/ui/core/recipes/data/validators';

export function selectRecipe(state: State, options: { id: ID }): Recipe {
  return assertRecipeExists(state, { id: options.id });
}

export function selectBreadRecipeByPercent(
  state: State,
  options: { id: ID },
): BreadRecipeByPercent {
  const recipe = selectRecipe(state, { id: options.id });

  if (recipe.__typename !== 'BreadRecipeByPercent') {
    throw new Error(`Recipe "${recipe.id}" is not a "BreadRecipeByPercent".`);
  }

  return recipe;
}

export function selectRecipeByQuantity(
  state: State,
  options: { id: ID },
): RecipeByQuantity {
  const recipe = selectRecipe(state, { id: options.id });

  if (recipe.__typename !== 'RecipeByQuantity') {
    throw new Error(`Recipe "${recipe.id}" is not a "RecipeByQuantity".`);
  }

  return recipe;
}

export function selectIngredientByPercent(
  state: State,
  options: { id: ID },
): IngredientByPercent {
  assertIngredientExists(state, { id: options.id });

  const ingredient = state.ingredients[options.id];

  if (
    ingredient.__typename !== 'RawIngredientByPercent' &&
    ingredient.__typename !== 'PreFermentByPercent'
  ) {
    throw new Error(`Ingredient "${options.id}" is not by percent.`);
  }

  return ingredient;
}

export function selectIngredientByQuantity(
  state: State,
  options: { id: ID },
): IngredientByQuantity {
  assertIngredientExists(state, { id: options.id });

  const ingredient = state.ingredients[options.id];

  if (
    ingredient.__typename !== 'RawIngredientByQuantity' &&
    ingredient.__typename !== 'PreFermentByQuantity'
  ) {
    throw new Error(`Ingredient "${options.id}" is not by quantity.`);
  }

  return ingredient;
}

/**
 * If there are more than a single flour ingredient, they should sum to 100% for
 * baker's percentage to work properly.
 */
export type BreadRecipeByPercentIssue = {
  __typename: 'INVALID_TOTAL_FLOUR_PERCENT';
};

export function selectBreadRecipeByPercentIssues(
  state: State,
  options: { recipeID: ID },
): BreadRecipeByPercentIssue[] {
  const issues: BreadRecipeByPercentIssue[] = [];

  for (const checker of BREAD_RECIPE_BY_PERCENT_ISSUE_CHECKERS) {
    const result = checker(state, { recipeID: options.recipeID });

    if (result) {
      issues.push(result);
    }
  }

  return issues;
}

const BREAD_RECIPE_BY_PERCENT_ISSUE_CHECKERS = [
  (
    state: State,
    options: { recipeID: ID },
  ): BreadRecipeByPercentIssue | null => {
    const recipe = selectBreadRecipeByPercent(state, { id: options.recipeID });

    if (recipe.flourIngredientIDs.length === 0) {
      return null;
    }

    const percents = recipe.flourIngredientIDs.map((id) =>
      parseFloat((state.ingredients[id] as RawIngredientByPercent).percent),
    );

    if (percents.some((percent) => Number.isNaN(percent))) {
      return { __typename: 'INVALID_TOTAL_FLOUR_PERCENT' };
    }

    if (sum(percents) !== 100) {
      return { __typename: 'INVALID_TOTAL_FLOUR_PERCENT' };
    }

    return null;
  },
];
