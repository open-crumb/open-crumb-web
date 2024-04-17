'use client';

import {
  Dispatch,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import {
  Action,
  INITIAL_STATE,
  State,
  reducer,
  ID,
  Recipe,
  INITIAL_RECIPES,
  IngredientClass,
  BreadRecipeByPercent,
  IngredientByPercent,
  RecipeByQuantity,
  IngredientByQuantity,
  IngredientUnit,
} from '@/ui/core/recipes/data/state';
import createID from '@/lib/create-id';
import ApplicationContext from '@/ui/core/ApplicationContext';
import {
  BreadRecipeByPercentIssue,
  selectBreadRecipeByPercent,
  selectBreadRecipeByPercentIssues,
  selectIngredientByPercent,
  selectIngredientByQuantity,
  selectRecipe,
  selectRecipeByQuantity,
} from '@/ui/core/recipes/data/selectors';

export const RecipeBlockContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({
  state: {
    recipes: {},
    ingredients: {},
  },
  dispatch: () => {},
});

type RecipeBlockProviderProps = {
  children: React.ReactNode;
};

export function RecipeBlockProvider(props: RecipeBlockProviderProps) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <RecipeBlockContext.Provider value={{ state, dispatch }}>
      {props.children}
    </RecipeBlockContext.Provider>
  );
}

export const RecipeListBlockContext = createContext<{ recipes: Recipe[] }>({
  recipes: [],
});

type RecipesBlockProviderProps = {
  children: React.ReactNode;
};

export function RecipeListBlockProvider(props: RecipesBlockProviderProps) {
  return (
    <RecipeListBlockContext.Provider value={{ recipes: INITIAL_RECIPES }}>
      {props.children}
    </RecipeListBlockContext.Provider>
  );
}

export function useRecipeList(): Recipe[] {
  const { recipes } = useContext(RecipeListBlockContext);

  return recipes;
}

export function useRecipe(id: ID): Recipe {
  const { state } = useContext(RecipeBlockContext);

  return selectRecipe(state, { id });
}

export function useBreadRecipeByPercent(id: ID): BreadRecipeByPercent {
  const { state } = useContext(RecipeBlockContext);

  return selectBreadRecipeByPercent(state, { id });
}

export function useBreadRecipeByPercentIssues(options: {
  recipeID: ID;
}): BreadRecipeByPercentIssue[] {
  const { state } = useContext(RecipeBlockContext);
  const issues = useMemo(
    () =>
      selectBreadRecipeByPercentIssues(state, {
        recipeID: options.recipeID,
      }),
    [state, options.recipeID],
  );

  return issues;
}

export function useRecipeByQuantity(id: ID): RecipeByQuantity {
  const { state } = useContext(RecipeBlockContext);

  return selectRecipeByQuantity(state, { id });
}

export function useIngredientByPercent(id: ID): IngredientByPercent {
  const { state } = useContext(RecipeBlockContext);

  return selectIngredientByPercent(state, { id });
}

export function useIngredientByQuantity(id: ID): IngredientByQuantity {
  const { state } = useContext(RecipeBlockContext);

  return selectIngredientByQuantity(state, { id });
}

export function useActions() {
  const { dispatch } = useContext(RecipeBlockContext);
  const { preferences } = useContext(ApplicationContext);

  const actions = useMemo(
    () => ({
      setBreadRecipeByPercent(options: {
        id: ID;
        title?: string;
        hydrationPercent?: string;
      }) {
        dispatch({
          type: 'SET_BREAD_RECIPE_BY_PERCENT',
          payload: options,
        });
      },
      setRecipeByQuantity(options: { id: ID; title?: string }) {
        dispatch({
          type: 'SET_RECIPE_BY_QUANTITY',
          payload: options,
        });
      },
      createPreFermentByPercent(options: { recipeID: ID }) {
        dispatch({
          type: 'CREATE_PRE_FERMENT_BY_PERCENT',
          payload: {
            id: createID('PreFermentByPercent'),
            recipeID: options.recipeID,
          },
        });
      },
      createPreFermentByQuantity(options: { recipeID: ID }) {
        dispatch({
          type: 'CREATE_PRE_FERMENT_BY_QUANTITY',
          payload: {
            id: createID('PreFermentByQuantity'),
            recipeID: options.recipeID,
            unit: (() => {
              switch (preferences.units) {
                case 'METRIC':
                  return 'MassGram';
                case 'IMPERIAL':
                  return 'MassOunce';
                default:
                  return null;
              }
            })(),
          },
        });
      },
      setPreFermentByPercent(options: {
        id: ID;
        name?: string;
        percent?: string;
        hydrationPercent?: string;
      }) {
        dispatch({
          type: 'SET_PRE_FERMENT_BY_PERCENT',
          payload: options,
        });
      },
      setPreFermentByQuantity(options: {
        id: ID;
        name?: string;
        quantity?: string;
        unit?: IngredientUnit | null;
        hydrationPercent?: string;
      }) {
        dispatch({
          type: 'SET_PRE_FERMENT_BY_QUANTITY',
          payload: options,
        });
      },
      createRawIngredientByPercent(options: {
        recipeID: ID;
        class: IngredientClass;
      }) {
        dispatch({
          type: 'CREATE_RAW_INGREDIENT_BY_PERCENT',
          payload: {
            id: createID('RawIngredientByPercent'),
            recipeID: options.recipeID,
            class: options.class,
          },
        });
      },
      createRawIngredientByQuantity(options: { recipeID: ID }) {
        dispatch({
          type: 'CREATE_RAW_INGREDIENT_BY_QUANTITY',
          payload: {
            id: createID('RawIngredientByQuantity'),
            recipeID: options.recipeID,
            unit: (() => {
              switch (preferences.units) {
                case 'METRIC':
                  return 'MassGram';
                case 'IMPERIAL':
                  return 'MassOunce';
                default:
                  return null;
              }
            })(),
          },
        });
      },
      setRawIngredientByPercent(options: {
        id: ID;
        name?: string;
        percent?: string;
        class?: IngredientClass;
      }) {
        dispatch({
          type: 'SET_RAW_INGREDIENT_BY_PERCENT',
          payload: options,
        });
      },
      setRawIngredientByQuantity(options: {
        id: ID;
        name?: string;
        quantity?: string;
        unit?: IngredientUnit | null;
      }) {
        dispatch({
          type: 'SET_RAW_INGREDIENT_BY_QUANTITY',
          payload: options,
        });
      },
      deleteIngredient(options: { id: ID; recipeID: ID }) {
        dispatch({
          type: 'DELETE_INGREDIENT',
          payload: options,
        });
      },
    }),
    [dispatch, preferences.units],
  );

  return actions;
}
