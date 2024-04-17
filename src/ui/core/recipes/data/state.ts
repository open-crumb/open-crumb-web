/**
 * UI state for the Recipe page.
 */
import createID from '@/lib/create-id';
import removeArrayValue from '@/lib/remove-array-value';
import removeRecordItem from '@/lib/remove-record-item';
import {
  assertIngredientExists,
  assertRecipeExists,
} from '@/ui/core/recipes/data/validators';

export type ID = string;

export type IngredientUnit =
  | 'MassGram'
  | 'MassKilogram'
  | 'MassOunce'
  | 'MassPound'
  | 'VolumeMilliliter'
  | 'VolumeLiter'
  | 'VolumeFluidOunce'
  | 'VolumeTeaspoon'
  | 'VolumeTablespoon'
  | 'VolumeCup'
  | 'VolumePint'
  | 'VolumeQuart'
  | 'VolumeGallon';

export type IngredientClass = 'FLOUR' | 'OTHER';

export type RawIngredientByPercent = {
  __typename: 'RawIngredientByPercent';
  id: ID;
  name: string;
  percent: string;
  class: IngredientClass;
};

export type RawIngredientByQuantity = {
  __typename: 'RawIngredientByQuantity';
  id: ID;
  name: string;
  quantity: string;
  unit: IngredientUnit | null;
};

export type PreFermentByPercent = {
  __typename: 'PreFermentByPercent';
  id: ID;
  name: string;
  percent: string;
  hydrationPercent: string;
};

export type PreFermentByQuantity = {
  __typename: 'PreFermentByQuantity';
  id: ID;
  name: string;
  quantity: string;
  unit: IngredientUnit | null;
  hydrationPercent: string;
};

export type IngredientByPercent = PreFermentByPercent | RawIngredientByPercent;

export type IngredientByQuantity =
  | PreFermentByQuantity
  | RawIngredientByQuantity;

export type Ingredient = IngredientByPercent | IngredientByQuantity;

export type BreadRecipeByPercent = {
  __typename: 'BreadRecipeByPercent';
  id: ID;
  title: string;
  hydrationPercent: string;
  preFermentIDs: ID[];
  flourIngredientIDs: ID[];
  otherIngredientIDs: ID[];
};

export type RecipeByQuantity = {
  __typename: 'RecipeByQuantity';
  id: ID;
  title: string;
  ingredientIDs: ID[];
};

export type Recipe = BreadRecipeByPercent | RecipeByQuantity;

export type State = {
  recipes: Record<ID, Recipe>;
  ingredients: Record<ID, Ingredient>;
};

export type Action =
  | {
      type: 'SET_BREAD_RECIPE_BY_PERCENT';
      payload: {
        id: ID;
        title?: string;
        hydrationPercent?: string;
      };
    }
  | {
      type: 'SET_RECIPE_BY_QUANTITY';
      payload: {
        id: ID;
        title?: string;
      };
    }
  | {
      type: 'CREATE_PRE_FERMENT_BY_PERCENT';
      payload: {
        id: ID;
        recipeID: ID;
      };
    }
  | {
      type: 'CREATE_PRE_FERMENT_BY_QUANTITY';
      payload: {
        id: ID;
        recipeID: ID;
        unit?: IngredientUnit | null;
      };
    }
  | {
      type: 'SET_PRE_FERMENT_BY_PERCENT';
      payload: {
        id: ID;
        name?: string;
        percent?: string;
        hydrationPercent?: string;
      };
    }
  | {
      type: 'SET_PRE_FERMENT_BY_QUANTITY';
      payload: {
        id: ID;
        name?: string;
        quantity?: string;
        unit?: IngredientUnit | null;
        hydrationPercent?: string;
      };
    }
  | {
      type: 'CREATE_RAW_INGREDIENT_BY_PERCENT';
      payload: {
        id: ID;
        recipeID: ID;
        class: IngredientClass;
      };
    }
  | {
      type: 'CREATE_RAW_INGREDIENT_BY_QUANTITY';
      payload: {
        id: ID;
        recipeID: ID;
        unit?: IngredientUnit | null;
      };
    }
  | {
      type: 'SET_RAW_INGREDIENT_BY_PERCENT';
      payload: {
        id: ID;
        name?: string;
        percent?: string;
        class?: IngredientClass;
      };
    }
  | {
      type: 'SET_RAW_INGREDIENT_BY_QUANTITY';
      payload: {
        id: ID;
        name?: string;
        quantity?: string;
        unit?: IngredientUnit | null;
      };
    }
  | {
      type: 'DELETE_INGREDIENT';
      payload: {
        id: ID;
        recipeID: ID;
      };
    };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_BREAD_RECIPE_BY_PERCENT': {
      const recipe = assertRecipeExists(state, { id: action.payload.id });

      if (recipe.__typename !== 'BreadRecipeByPercent') {
        throw new Error(
          `Recipe "${recipe.id}" is not a "BreadRecipeByPercent".`,
        );
      }

      return {
        ...state,
        recipes: {
          ...state.recipes,
          [recipe.id]: {
            ...recipe,
            ...action.payload,
          },
        },
      };
    }
    case 'SET_RECIPE_BY_QUANTITY': {
      const recipe = assertRecipeExists(state, { id: action.payload.id });

      if (recipe.__typename !== 'RecipeByQuantity') {
        throw new Error(`Recipe "${recipe.id}" is not a "RecipeByQuantity".`);
      }

      return {
        ...state,
        recipes: {
          ...state.recipes,
          [recipe.id]: {
            ...recipe,
            ...action.payload,
          },
        },
      };
    }
    case 'CREATE_PRE_FERMENT_BY_PERCENT': {
      const recipe = assertRecipeExists(state, { id: action.payload.recipeID });

      if (recipe.__typename !== 'BreadRecipeByPercent') {
        throw new Error(
          `Recipe "${recipe.id}" is not a "BreadRecipeByPercent".`,
        );
      }

      return {
        ...state,
        recipes: {
          ...state.recipes,
          [recipe.id]: {
            ...recipe,
            preFermentIDs: [...recipe.preFermentIDs, action.payload.id],
          },
        },
        ingredients: {
          ...state.ingredients,
          [action.payload.id]: {
            __typename: 'PreFermentByPercent',
            id: action.payload.id,
            name: '',
            percent: '',
            hydrationPercent: '100',
          },
        },
      };
    }
    case 'CREATE_PRE_FERMENT_BY_QUANTITY': {
      const recipe = assertRecipeExists(state, { id: action.payload.recipeID });

      if (recipe.__typename !== 'RecipeByQuantity') {
        throw new Error(`Recipe "${recipe.id}" is not a "RecipeByQuantity".`);
      }

      return {
        ...state,
        recipes: {
          ...state.recipes,
          [recipe.id]: {
            ...recipe,
            ingredientIDs: [...recipe.ingredientIDs, action.payload.id],
          },
        },
        ingredients: {
          ...state.ingredients,
          [action.payload.id]: {
            __typename: 'PreFermentByQuantity',
            id: action.payload.id,
            name: '',
            quantity: '',
            unit: action.payload.unit || null,
            hydrationPercent: '100',
          },
        },
      };
    }
    case 'SET_PRE_FERMENT_BY_PERCENT': {
      const preFerment = assertIngredientExists(state, {
        id: action.payload.id,
      });

      if (preFerment.__typename !== 'PreFermentByPercent') {
        throw new Error(
          `Ingredient "${preFerment.id}" is not a "PreFermentByPercent".`,
        );
      }

      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [preFerment.id]: {
            ...preFerment,
            ...action.payload,
          },
        },
      };
    }
    case 'SET_PRE_FERMENT_BY_QUANTITY': {
      const preFerment = assertIngredientExists(state, {
        id: action.payload.id,
      });

      if (preFerment.__typename !== 'PreFermentByQuantity') {
        throw new Error(
          `Ingredient "${preFerment.id}" is not a "PreFermentByQuantity".`,
        );
      }

      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [preFerment.id]: {
            ...preFerment,
            ...action.payload,
          },
        },
      };
    }
    case 'CREATE_RAW_INGREDIENT_BY_PERCENT': {
      const recipe = assertRecipeExists(state, { id: action.payload.recipeID });

      if (recipe.__typename !== 'BreadRecipeByPercent') {
        throw new Error(
          `Recipe "${recipe.id}" is not a "BreadRecipeByPercent".`,
        );
      }

      return {
        ...state,
        recipes: {
          ...state.recipes,
          [recipe.id]: {
            ...recipe,
            ...(action.payload.class === 'FLOUR'
              ? {
                  flourIngredientIDs: [
                    ...recipe.flourIngredientIDs,
                    action.payload.id,
                  ],
                }
              : {}),
            ...(action.payload.class === 'OTHER'
              ? {
                  otherIngredientIDs: [
                    ...recipe.otherIngredientIDs,
                    action.payload.id,
                  ],
                }
              : {}),
          },
        },
        ingredients: {
          ...state.ingredients,
          [action.payload.id]: {
            __typename: 'RawIngredientByPercent',
            id: action.payload.id,
            name: (() => {
              // Default the first flour item to "Bread Flour".
              if (
                action.payload.class === 'FLOUR' &&
                recipe.flourIngredientIDs.length === 0
              ) {
                return 'Bread Flour';
              }

              return '';
            })(),
            percent: (() => {
              // Default the first flour item to "100"%.
              if (
                action.payload.class === 'FLOUR' &&
                recipe.flourIngredientIDs.length === 0
              ) {
                return '100';
              }

              return '';
            })(),
            class: action.payload.class,
          },
        },
      };
    }
    case 'CREATE_RAW_INGREDIENT_BY_QUANTITY': {
      const recipe = assertRecipeExists(state, { id: action.payload.recipeID });

      if (recipe.__typename !== 'RecipeByQuantity') {
        throw new Error(`Recipe "${recipe.id}" is not a "RecipeByQuantity".`);
      }

      return {
        ...state,
        recipes: {
          ...state.recipes,
          [recipe.id]: {
            ...recipe,
            ingredientIDs: [...recipe.ingredientIDs, action.payload.id],
          },
        },
        ingredients: {
          ...state.ingredients,
          [action.payload.id]: {
            __typename: 'RawIngredientByQuantity',
            id: action.payload.id,
            name: '',
            quantity: '',
            unit: action.payload.unit || null,
          },
        },
      };
    }
    case 'SET_RAW_INGREDIENT_BY_PERCENT': {
      const ingredient = assertIngredientExists(state, {
        id: action.payload.id,
      });

      if (ingredient.__typename !== 'RawIngredientByPercent') {
        throw new Error(
          `Ingredient "${ingredient.id}" is not a "RawIngredientByPercent".`,
        );
      }

      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [ingredient.id]: {
            ...ingredient,
            ...action.payload,
          },
        },
      };
    }
    case 'SET_RAW_INGREDIENT_BY_QUANTITY': {
      const ingredient = assertIngredientExists(state, {
        id: action.payload.id,
      });

      if (ingredient.__typename !== 'RawIngredientByQuantity') {
        throw new Error(
          `Ingredient "${ingredient.id}" is not a "RawIngredientByQuantity".`,
        );
      }

      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [ingredient.id]: {
            ...ingredient,
            ...action.payload,
          },
        },
      };
    }
    case 'DELETE_INGREDIENT': {
      const recipe = assertRecipeExists(state, { id: action.payload.recipeID });

      assertIngredientExists(state, { id: action.payload.id });

      return {
        ...state,
        recipes: {
          ...state.recipes,
          [recipe.id]:
            recipe.__typename === 'BreadRecipeByPercent'
              ? {
                  ...recipe,
                  preFermentIDs: removeArrayValue(
                    recipe.preFermentIDs,
                    action.payload.id,
                  ),
                  flourIngredientIDs: removeArrayValue(
                    recipe.flourIngredientIDs,
                    action.payload.id,
                  ),
                  otherIngredientIDs: removeArrayValue(
                    recipe.otherIngredientIDs,
                    action.payload.id,
                  ),
                }
              : {
                  ...recipe,
                  ingredientIDs: removeArrayValue(
                    recipe.ingredientIDs,
                    action.payload.id,
                  ),
                },
        },
        ingredients: removeRecordItem(state.ingredients, action.payload.id),
      };
    }
    default:
      return state;
  }
}

export const INITIAL_PRE_FERMENTS_BY_PERCENT: PreFermentByPercent[] = [
  {
    __typename: 'PreFermentByPercent',
    id: createID('PreFermentByPercent'),
    name: 'Sourdough Starter',
    percent: '20',
    hydrationPercent: '100',
  },
];

export const INITIAL_FLOUR_INGREDIENTS_BY_PERCENT: RawIngredientByPercent[] = [
  {
    __typename: 'RawIngredientByPercent',
    id: createID('RawIngredientByPercent'),
    name: 'Bread Flour',
    percent: '100',
    class: 'FLOUR',
  },
];

export const INITIAL_OTHER_INGREDIENTS_BY_PERCENT: RawIngredientByPercent[] = [
  {
    __typename: 'RawIngredientByPercent',
    id: createID('RawIngredientByPercent'),
    name: 'Salt',
    percent: '2',
    class: 'OTHER',
  },
];

export const INITIAL_INGREDIENTS_BY_QUANTITY: IngredientByQuantity[] = [
  {
    __typename: 'PreFermentByQuantity',
    id: createID('PreFermentByQuantity'),
    name: 'Sourdough Starter',
    quantity: '100',
    unit: 'MassGram',
    hydrationPercent: '100',
  },
  {
    __typename: 'RawIngredientByQuantity',
    id: createID('RawIngredientByQuantity'),
    name: 'Bread Flour',
    quantity: '450',
    unit: 'MassGram',
  },
  {
    __typename: 'RawIngredientByQuantity',
    id: createID('RawIngredientByQuantity'),
    name: 'Water',
    quantity: '350',
    unit: 'MassGram',
  },
  {
    __typename: 'RawIngredientByQuantity',
    id: createID('RawIngredientByQuantity'),
    name: 'Salt',
    quantity: '10',
    unit: 'MassGram',
  },
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    __typename: 'BreadRecipeByPercent',
    id: createID('BreadRecipeByPercent'),
    title: 'Country Sourdough',
    hydrationPercent: '80',
    preFermentIDs: INITIAL_PRE_FERMENTS_BY_PERCENT.map(({ id }) => id),
    flourIngredientIDs: INITIAL_FLOUR_INGREDIENTS_BY_PERCENT.map(
      ({ id }) => id,
    ),
    otherIngredientIDs: INITIAL_OTHER_INGREDIENTS_BY_PERCENT.map(
      ({ id }) => id,
    ),
  },
  {
    __typename: 'RecipeByQuantity',
    id: createID('RecipeByQuantity'),
    title: 'Island Sourdough',
    ingredientIDs: INITIAL_INGREDIENTS_BY_QUANTITY.map(({ id }) => id),
  },
];

export const INITIAL_STATE: State = {
  recipes: Object.fromEntries(
    INITIAL_RECIPES.map((recipe) => [recipe.id, recipe]),
  ),
  ingredients: Object.fromEntries([
    ...INITIAL_PRE_FERMENTS_BY_PERCENT.map((preFerment) => [
      preFerment.id,
      preFerment,
    ]),
    ...INITIAL_FLOUR_INGREDIENTS_BY_PERCENT.map((ingredient) => [
      ingredient.id,
      ingredient,
    ]),
    ...INITIAL_OTHER_INGREDIENTS_BY_PERCENT.map((ingredient) => [
      ingredient.id,
      ingredient,
    ]),
    ...INITIAL_INGREDIENTS_BY_QUANTITY.map((ingredient) => [
      ingredient.id,
      ingredient,
    ]),
  ]),
};
