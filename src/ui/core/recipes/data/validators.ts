import { ID, Ingredient, Recipe, State } from '@/ui/core/recipes/data/state';

export function assertRecipeExists(state: State, options: { id: ID }): Recipe {
  if (!state.recipes[options.id]) {
    throw new Error(
      `Recipe "${options.id}" does not exist in the current state.`,
    );
  }

  return state.recipes[options.id];
}

export function assertIngredientExists(
  state: State,
  options: { id: ID },
): Ingredient {
  if (!state.ingredients[options.id]) {
    throw new Error(
      `Ingredient "${options.id}" does not exist in the current state.`,
    );
  }

  return state.ingredients[options.id];
}
