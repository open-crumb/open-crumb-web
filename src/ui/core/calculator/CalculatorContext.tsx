import { createContext, Dispatch, useReducer } from 'react';
import removeRecordItem, { removeRecordItems } from '@/lib/remove-record-item';
import {
  calculateDefaultLevainIngredientPercent,
  calculateDoughWeight,
  calculateDoughWeightByIngredientWeights,
  calculateIngredientPercent,
  calculateIngredientWeight,
  calculatePercentDifference,
  calculateTotalFlourWeight,
  calculateTotalFlourWeightByIngredientWeightChange,
} from '@/ui/core/calculator/utils';
import createID from '@/lib/create-id';

type Ingredient = {
  type: 'FLOUR' | 'LIQUID' | 'OTHER';
  id: string;
  name: string;
  percent: string;
  weight: string;
};

type State = {
  /**
   * Modifiable parameters in the calculator.
   */
  inputs: {
    totalFlourWeight: string;
    doughWeight: string;
    hydrationPercent: string;
    hydrationWeight: string;
    /**
     * A normalized record of all ingredients in the state where the ingredient
     * ID is the key and the ingredient is the value. The top level
     * `flourIngredientIDs`, `liquidIngredientIDs` and `otherIngredientIDs`
     * distinguish ingredients for the main dough from those in the levain.
     *
     * If no specific flour ingredients are added then the only flour ingredient
     * is assumed to be bread flour.
     *
     * If no specific liquid ingredients are added then the only liquid
     * ingredient is assumed to be water.
     */
    ingredients: Record<string, Ingredient>;
    /**
     * Salt is typically present in all doughs and considered a fixed ingredient
     * displayed with the dough weight, total flour, and hydration.
     */
    saltID: string;
    flourIngredientIDs: string[];
    liquidIngredientIDs: string[];
    otherIngredientIDs: string[];
    /**
     * Flour and liquid components of a levain contribute to the total flour and
     * hydration of the dough and are not extras in dough weight calculation. If
     * no ingredients are added to the levain, it is assumed to be a 1:1 ratio
     * of flour and water.
     *
     * Percentages of levain ingredients are currently percentages of the total
     * flour weight. I'm undecided if it would be more clear if they were
     * percentages of the levain weight instead.
     */
    levain: {
      percent: string;
      weight: string;
      ingredientIDs: string[];
    } | null;
    multiplier: string;
  };
  /**
   * - `BY_FLOUR_WEIGHT` - Indicates we would like to hold flour weight constant
   *   and update the dough weight when certain ingredient quantities change.
   *   This is set by modifying the total flour weight.
   * - `BY_DOUGH_WEIGHT` - Indicates we would like to hold dough weight constant
   *   and update the flour weight when certain ingredient quantities change.
   *   This is set by modifying the dough weight.
   */
  mode: 'BY_FLOUR_WEIGHT' | 'BY_DOUGH_WEIGHT';
  step: 'EDIT' | 'DISPLAY';
};

type Action =
  | {
      type: 'SET_TOTAL_FLOUR_WEIGHT';
      payload: {
        totalFlourWeight: string;
      };
    }
  | {
      type: 'SET_DOUGH_WEIGHT';
      payload: {
        doughWeight: string;
      };
    }
  | {
      type: 'SET_HYDRATION_PERCENT';
      payload: {
        hydrationPercent: string;
      };
    }
  | {
      type: 'SET_HYDRATION_WEIGHT';
      payload: {
        hydrationWeight: string;
      };
    }
  | {
      type: 'SET_MULTIPLIER';
      payload: {
        multiplier: string;
      };
    }
  | {
      type: 'ADD_FLOUR_INGREDIENT';
      payload: {
        id: string;
      };
    }
  | {
      type: 'ADD_LIQUID_INGREDIENT';
      payload: {
        id: string;
      };
    }
  | {
      type: 'ADD_OTHER_INGREDIENT';
      payload: {
        id: string;
      };
    }
  | {
      type: 'ADD_LEVAIN';
      payload: {
        flourIngredientID: string;
        waterIngredientID: string;
      };
    }
  | {
      type: 'DELETE_LEVAIN';
    }
  | {
      type: 'DELETE_INGREDIENT';
      payload: {
        id: string;
      };
    }
  | {
      type: 'SET_INGREDIENT_NAME';
      payload: {
        id: string;
        name: string;
      };
    }
  | {
      type: 'SET_INGREDIENT_PERCENT';
      payload: {
        id: string;
        percent: string;
      };
    }
  | {
      type: 'SET_INGREDIENT_WEIGHT';
      payload: {
        id: string;
        weight: string;
      };
    }
  | {
      type: 'SET_LEVAIN_PERCENT';
      payload: {
        percent: string;
      };
    }
  | {
      type: 'SET_LEVAIN_WEIGHT';
      payload: {
        weight: string;
      };
    }
  | {
      type: 'ADD_LEVAIN_FLOUR_INGREDIENT';
      payload: {
        id: string;
      };
    }
  | {
      type: 'ADD_LEVAIN_LIQUID_INGREDIENT';
      payload: {
        id: string;
      };
    }
  | {
      type: 'ADD_LEVAIN_OTHER_INGREDIENT';
      payload: {
        id: string;
      };
    }
  | {
      type: 'NEXT_CLICKED';
    }
  | {
      type: 'BACK_CLICKED';
    };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TOTAL_FLOUR_WEIGHT':
      /**
       * Setting the total flour weight should update all ingredients with a
       * percent set to have the correct weight based on the new total flour
       * weight.
       */
      return {
        ...state,
        inputs: {
          ...state.inputs,
          totalFlourWeight: action.payload.totalFlourWeight,
          hydrationWeight: calculateIngredientWeight({
            totalFlourWeight: action.payload.totalFlourWeight,
            percent: state.inputs.hydrationPercent,
          }),
          doughWeight: calculateDoughWeight({
            totalFlourWeight: action.payload.totalFlourWeight,
            ingredientPercents: [
              state.inputs.hydrationPercent,
              ...Object.values(state.inputs.ingredients)
                .filter(({ type }) => type === 'OTHER')
                .map(({ percent }) => percent),
            ],
          }),
          levain: state.inputs.levain
            ? {
                ...state.inputs.levain,
                weight: calculateIngredientWeight({
                  totalFlourWeight: action.payload.totalFlourWeight,
                  percent: state.inputs.levain.percent,
                }),
              }
            : null,
          ingredients: Object.fromEntries(
            Object.entries(state.inputs.ingredients).map(([id, ingredient]) => [
              id,
              {
                ...ingredient,
                weight: calculateIngredientWeight({
                  totalFlourWeight: action.payload.totalFlourWeight,
                  percent: ingredient.percent,
                }),
              },
            ]),
          ),
        },
        mode: 'BY_FLOUR_WEIGHT',
      };
    case 'SET_DOUGH_WEIGHT': {
      /**
       * Setting the dough weight should recalculate the total flour weight and
       * subsequently update the new weights of all ingredients.
       */
      const totalFlourWeight = calculateTotalFlourWeight({
        doughWeight: action.payload.doughWeight,
        ingredientPercents: [
          state.inputs.hydrationPercent,
          ...Object.values(state.inputs.ingredients)
            .filter(({ type }) => type === 'OTHER')
            .map(({ percent }) => percent),
        ],
      });

      return {
        ...state,
        inputs: {
          ...state.inputs,
          doughWeight: action.payload.doughWeight,
          totalFlourWeight,
          hydrationWeight: calculateIngredientWeight({
            totalFlourWeight,
            percent: state.inputs.hydrationPercent,
          }),
          levain: state.inputs.levain
            ? {
                ...state.inputs.levain,
                weight: calculateIngredientWeight({
                  totalFlourWeight,
                  percent: state.inputs.levain.percent,
                }),
              }
            : null,
          ingredients: Object.fromEntries(
            Object.entries(state.inputs.ingredients).map(([id, ingredient]) => [
              id,
              {
                ...ingredient,
                weight: calculateIngredientWeight({
                  totalFlourWeight: totalFlourWeight,
                  percent: ingredient.percent,
                }),
              },
            ]),
          ),
        },
        mode: 'BY_DOUGH_WEIGHT',
      };
    }
    case 'SET_HYDRATION_PERCENT': {
      /**
       * When in `BY_FLOUR_WEIGHT` mode this should update the hydration weight
       * and recalculate the dough weight.
       *
       * When in `BY_DOUGH_WEIGHT` mode this should calculate the new flour
       * weight and subsequently update all ingredient weights per the new flour
       * weight.
       */
      if (state.mode === 'BY_FLOUR_WEIGHT') {
        return {
          ...state,
          inputs: {
            ...state.inputs,
            hydrationPercent: action.payload.hydrationPercent,
            hydrationWeight: calculateIngredientWeight({
              totalFlourWeight: state.inputs.totalFlourWeight,
              percent: action.payload.hydrationPercent,
            }),
            doughWeight: calculateDoughWeight({
              totalFlourWeight: state.inputs.totalFlourWeight,
              ingredientPercents: [
                action.payload.hydrationPercent,
                ...Object.values(state.inputs.ingredients)
                  .filter(({ type }) => type === 'OTHER')
                  .map(({ percent }) => percent),
              ],
            }),
          },
        };
      }

      const totalFlourWeight = calculateTotalFlourWeight({
        doughWeight: state.inputs.doughWeight,
        ingredientPercents: [
          action.payload.hydrationPercent,
          ...Object.values(state.inputs.ingredients)
            .filter(({ type }) => type === 'OTHER')
            .map(({ percent }) => percent),
        ],
      });

      return {
        ...state,
        inputs: {
          ...state.inputs,
          totalFlourWeight,
          hydrationPercent: action.payload.hydrationPercent,
          hydrationWeight: calculateIngredientWeight({
            totalFlourWeight,
            percent: action.payload.hydrationPercent,
          }),
          ingredients: Object.fromEntries(
            Object.entries(state.inputs.ingredients).map(([id, ingredient]) => [
              id,
              {
                ...ingredient,
                weight: calculateIngredientWeight({
                  totalFlourWeight,
                  percent: ingredient.percent,
                }),
              },
            ]),
          ),
          levain: state.inputs.levain
            ? {
                ...state.inputs.levain,
                weight: calculateIngredientWeight({
                  totalFlourWeight,
                  percent: state.inputs.levain.percent,
                }),
              }
            : null,
        },
      };
    }
    case 'SET_HYDRATION_WEIGHT': {
      /**
       * When in `BY_FLOUR_WEIGHT` mode this should update the hydration percent
       * and recalculate the new dough weight.
       *
       * When in `BY_DOUGH_WEIGHT` mode this should calculate the new total
       * flour weight and subsequently update all ingredient weights per the new
       * total flour weight.
       */
      if (state.mode === 'BY_FLOUR_WEIGHT') {
        return {
          ...state,
          inputs: {
            ...state.inputs,
            doughWeight: calculateDoughWeightByIngredientWeights({
              ingredientWeights: [
                state.inputs.totalFlourWeight,
                action.payload.hydrationWeight,
                ...Object.values(state.inputs.ingredients)
                  .filter(({ type }) => type === 'OTHER')
                  .map(({ weight }) => weight),
              ],
            }),
            hydrationWeight: action.payload.hydrationWeight,
            hydrationPercent: calculateIngredientPercent({
              totalFlourWeight: state.inputs.totalFlourWeight,
              weight: action.payload.hydrationWeight,
            }),
          },
        };
      }

      const totalFlourWeight =
        calculateTotalFlourWeightByIngredientWeightChange({
          doughWeight: state.inputs.doughWeight,
          changedIngredientWeight: action.payload.hydrationWeight,
          unchangedIngredientPercents: [
            ...Object.values(state.inputs.ingredients)
              .filter(({ type }) => type === 'OTHER')
              .map(({ percent }) => percent),
          ],
        });

      const hydrationPercent = calculateIngredientPercent({
        totalFlourWeight,
        weight: action.payload.hydrationWeight,
      });

      return {
        ...state,
        inputs: {
          ...state.inputs,
          totalFlourWeight,
          hydrationWeight: action.payload.hydrationWeight,
          hydrationPercent,
          ingredients: Object.fromEntries(
            Object.entries(state.inputs.ingredients).map(([id, ingredient]) => [
              id,
              {
                ...ingredient,
                weight: calculateIngredientWeight({
                  totalFlourWeight,
                  percent: ingredient.percent,
                }),
              },
            ]),
          ),
          levain: state.inputs.levain
            ? {
                ...state.inputs.levain,
                weight: calculateIngredientWeight({
                  totalFlourWeight,
                  percent: state.inputs.levain.percent,
                }),
              }
            : null,
        },
      };
    }
    case 'SET_MULTIPLIER':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          multiplier: action.payload.multiplier,
        },
      };
    case 'ADD_FLOUR_INGREDIENT': {
      /**
       * If this is the first flour ingredient we are adding, we pre-fill the
       * percent as 100% and the weight as the total flour weight to save time
       * if the user is expressing only a single flour ingredient.
       */
      const percent =
        state.inputs.flourIngredientIDs.length === 0
          ? calculatePercentDifference({
              totalPercent: '100',
              otherPercents: state.inputs.levain
                ? state.inputs.levain.ingredientIDs
                    .filter(
                      (id) => state.inputs.ingredients[id].type === 'FLOUR',
                    )
                    .map((id) => state.inputs.ingredients[id].percent)
                : [],
            })
          : '';

      return {
        ...state,
        inputs: {
          ...state.inputs,
          ingredients: {
            ...state.inputs.ingredients,
            [action.payload.id]: {
              type: 'FLOUR',
              id: action.payload.id,
              name: '',
              percent,
              weight:
                state.inputs.flourIngredientIDs.length === 0
                  ? calculateIngredientWeight({
                      totalFlourWeight: state.inputs.totalFlourWeight,
                      percent,
                    })
                  : '',
            },
          },
          flourIngredientIDs: [
            ...state.inputs.flourIngredientIDs,
            action.payload.id,
          ],
        },
      };
    }
    case 'ADD_LIQUID_INGREDIENT': {
      /**
       * If this is the first liquid ingredient we're adding, we pre-fill the
       * percent as the hydration percent and the weight as the hydration weight
       * to save time if the user is expressing only a single liquid ingredient.
       */
      const percent =
        state.inputs.flourIngredientIDs.length === 0
          ? calculatePercentDifference({
              totalPercent: state.inputs.hydrationPercent,
              otherPercents: state.inputs.levain
                ? state.inputs.levain.ingredientIDs
                    .filter(
                      (id) => state.inputs.ingredients[id].type === 'LIQUID',
                    )
                    .map((id) => state.inputs.ingredients[id].percent)
                : [],
            })
          : '';

      return {
        ...state,
        inputs: {
          ...state.inputs,
          ingredients: {
            ...state.inputs.ingredients,
            [action.payload.id]: {
              type: 'LIQUID',
              id: action.payload.id,
              name: '',
              percent,
              weight:
                state.inputs.liquidIngredientIDs.length === 0
                  ? calculateIngredientWeight({
                      totalFlourWeight: state.inputs.totalFlourWeight,
                      percent,
                    })
                  : '',
            },
          },
          liquidIngredientIDs: [
            ...state.inputs.liquidIngredientIDs,
            action.payload.id,
          ],
        },
      };
    }
    case 'ADD_OTHER_INGREDIENT':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          ingredients: {
            ...state.inputs.ingredients,
            [action.payload.id]: {
              type: 'OTHER',
              id: action.payload.id,
              name: '',
              percent: '',
              weight: '',
            },
          },
          otherIngredientIDs: [
            ...state.inputs.otherIngredientIDs,
            action.payload.id,
          ],
        },
      };
    case 'ADD_LEVAIN':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          levain: {
            percent: '20',
            weight: calculateIngredientWeight({
              totalFlourWeight: state.inputs.totalFlourWeight,
              percent: '20',
            }),
            ingredientIDs: [
              action.payload.flourIngredientID,
              action.payload.waterIngredientID,
            ],
          },
          ingredients: {
            ...state.inputs.ingredients,
            [action.payload.flourIngredientID]: {
              type: 'FLOUR',
              id: action.payload.flourIngredientID,
              name: 'Flour',
              percent: '10',
              weight: calculateIngredientWeight({
                totalFlourWeight: state.inputs.totalFlourWeight,
                percent: '10',
              }),
            },
            [action.payload.waterIngredientID]: {
              type: 'LIQUID',
              id: action.payload.waterIngredientID,
              name: 'Water',
              percent: '10',
              weight: calculateIngredientWeight({
                totalFlourWeight: state.inputs.totalFlourWeight,
                percent: '10',
              }),
            },
          },
        },
      };
    case 'DELETE_LEVAIN':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          ingredients: state.inputs.levain
            ? removeRecordItems(
                state.inputs.ingredients,
                state.inputs.levain.ingredientIDs,
              )
            : state.inputs.ingredients,
          levain: null,
        },
      };
    case 'DELETE_INGREDIENT': {
      const flourIngredientIDs = state.inputs.flourIngredientIDs.filter(
        (id) => id !== action.payload.id,
      );
      const liquidIngredientIDs = state.inputs.liquidIngredientIDs.filter(
        (id) => id !== action.payload.id,
      );
      const otherIngredientIDs = state.inputs.otherIngredientIDs.filter(
        (id) => id !== action.payload.id,
      );
      const levain = state.inputs.levain
        ? {
            ...state.inputs.levain,
            ingredientIDs: state.inputs.levain.ingredientIDs.filter(
              (id) => id !== action.payload.id,
            ),
          }
        : null;

      /**
       * If we are deleting an ingredient of type `OTHER` it will have an impact
       * on the dough weight.
       */
      if (state.inputs.ingredients[action.payload.id].type !== 'OTHER') {
        return {
          ...state,
          inputs: {
            ...state.inputs,
            ingredients: removeRecordItem(
              state.inputs.ingredients,
              action.payload.id,
            ),
            flourIngredientIDs,
            liquidIngredientIDs,
            otherIngredientIDs,
            levain,
          },
        };
      }

      if (state.mode === 'BY_FLOUR_WEIGHT') {
        return {
          ...state,
          inputs: {
            ...state.inputs,
            doughWeight: calculateDoughWeight({
              totalFlourWeight: state.inputs.totalFlourWeight,
              ingredientPercents: [
                state.inputs.hydrationPercent,
                ...Object.values(state.inputs.ingredients)
                  .filter(
                    ({ id, type }) =>
                      id !== action.payload.id && type === 'OTHER',
                  )
                  .map(({ percent }) => percent),
              ],
            }),
            ingredients: removeRecordItem(
              state.inputs.ingredients,
              action.payload.id,
            ),
            flourIngredientIDs,
            liquidIngredientIDs,
            otherIngredientIDs,
            levain,
          },
        };
      }

      const totalFlourWeight = calculateTotalFlourWeight({
        doughWeight: state.inputs.doughWeight,
        ingredientPercents: [
          state.inputs.hydrationPercent,
          ...Object.values(state.inputs.ingredients)
            .filter(
              ({ id, type }) => id !== action.payload.id && type === 'OTHER',
            )
            .map(({ percent }) => percent),
        ],
      });

      return {
        ...state,
        inputs: {
          ...state.inputs,
          totalFlourWeight,
          hydrationWeight: calculateIngredientWeight({
            totalFlourWeight,
            percent: state.inputs.hydrationPercent,
          }),
          ingredients: Object.fromEntries(
            Object.entries(
              removeRecordItem(state.inputs.ingredients, action.payload.id),
            ).map(([id, ingredient]) => [
              id,
              {
                ...ingredient,
                weight: calculateIngredientWeight({
                  totalFlourWeight,
                  percent: ingredient.percent,
                }),
              },
            ]),
          ),
          flourIngredientIDs,
          liquidIngredientIDs,
          otherIngredientIDs,
          levain,
        },
      };
    }
    case 'SET_INGREDIENT_NAME':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          ingredients: {
            ...state.inputs.ingredients,
            [action.payload.id]: {
              ...state.inputs.ingredients[action.payload.id],
              name: action.payload.name,
            },
          },
        },
      };
    case 'SET_INGREDIENT_PERCENT': {
      /**
       * When in `BY_FLOUR_WEIGHT` mode this should update the ingredient weight
       * and recalculate the dough weight.
       *
       * When in `BY_DOUGH_WEIGHT` mode this should calculate the new flour
       * weight and subsequently update all ingredient weights per the new flour
       * weight.
       */
      if (state.mode === 'BY_FLOUR_WEIGHT') {
        return {
          ...state,
          inputs: {
            ...state.inputs,
            ingredients: {
              ...state.inputs.ingredients,
              [action.payload.id]: {
                ...state.inputs.ingredients[action.payload.id],
                percent: action.payload.percent,
                weight: calculateIngredientWeight({
                  totalFlourWeight: state.inputs.totalFlourWeight,
                  percent: action.payload.percent,
                }),
              },
            },
            doughWeight:
              state.inputs.ingredients[action.payload.id].type === 'OTHER'
                ? calculateDoughWeight({
                    totalFlourWeight: state.inputs.totalFlourWeight,
                    ingredientPercents: [
                      state.inputs.hydrationPercent,
                      action.payload.percent,
                      ...Object.values(state.inputs.ingredients)
                        .filter(
                          ({ id, type }) =>
                            id !== action.payload.id && type === 'OTHER',
                        )
                        .map(({ percent }) => percent),
                    ],
                  })
                : state.inputs.doughWeight,
          },
        };
      }

      const totalFlourWeight = calculateTotalFlourWeight({
        doughWeight: state.inputs.doughWeight,
        ingredientPercents: [
          state.inputs.hydrationPercent,
          ...(state.inputs.ingredients[action.payload.id].type === 'OTHER'
            ? [action.payload.percent]
            : []),
          ...Object.values(state.inputs.ingredients)
            .filter(
              ({ id, type }) => id !== action.payload.id && type === 'OTHER',
            )
            .map(({ percent }) => percent),
        ],
      });

      return {
        ...state,
        inputs: {
          ...state.inputs,
          totalFlourWeight,
          hydrationWeight: calculateIngredientWeight({
            totalFlourWeight,
            percent: state.inputs.hydrationPercent,
          }),
          ingredients: {
            ...state.inputs.ingredients,
            [action.payload.id]: {
              ...state.inputs.ingredients[action.payload.id],
              percent: action.payload.percent,
              weight: calculateIngredientWeight({
                totalFlourWeight,
                percent: action.payload.percent,
              }),
            },
          },
          levain: state.inputs.levain
            ? {
                ...state.inputs.levain,
                weight: calculateIngredientWeight({
                  totalFlourWeight,
                  percent: state.inputs.levain.percent,
                }),
              }
            : null,
        },
      };
    }
    case 'SET_INGREDIENT_WEIGHT': {
      /**
       * When in `BY_FLOUR_WEIGHT` mode this should update the ingredient
       * percent and recalculate the new dough weight.
       *
       * When in `BY_DOUGH_WEIGHT` mode this should calculate the new total
       * flour weight and subsequently update all ingredient weights per the new
       * total flour weight.
       */
      if (state.mode === 'BY_FLOUR_WEIGHT') {
        return {
          ...state,
          inputs: {
            ...state.inputs,
            doughWeight: calculateDoughWeightByIngredientWeights({
              ingredientWeights: [
                state.inputs.totalFlourWeight,
                state.inputs.hydrationWeight,
                // Flour and liquid ingredients are components of the total
                // flour and hydration. Individual ingredient components should
                // not impact dough weight.
                ...(state.inputs.ingredients[action.payload.id].type === 'OTHER'
                  ? [action.payload.weight]
                  : []),
                ...Object.values(state.inputs.ingredients)
                  .filter(
                    ({ id, type }) =>
                      id !== action.payload.id && type === 'OTHER',
                  )
                  .map(({ weight }) => weight),
              ],
            }),
            ingredients: {
              ...state.inputs.ingredients,
              [action.payload.id]: {
                ...state.inputs.ingredients[action.payload.id],
                weight: action.payload.weight,
                percent: calculateIngredientPercent({
                  totalFlourWeight: state.inputs.totalFlourWeight,
                  weight: action.payload.weight,
                }),
              },
            },
          },
        };
      }

      const totalFlourWeight =
        calculateTotalFlourWeightByIngredientWeightChange({
          doughWeight: state.inputs.doughWeight,
          changedIngredientWeight: action.payload.weight,
          unchangedIngredientPercents: [
            state.inputs.hydrationPercent,
            ...Object.values(state.inputs.ingredients)
              .filter(
                ({ id, type }) => id !== action.payload.id && type === 'OTHER',
              )
              .map(({ percent }) => percent),
          ],
        });

      const percent = calculateIngredientPercent({
        totalFlourWeight,
        weight: action.payload.weight,
      });

      return {
        ...state,
        inputs: {
          ...state.inputs,
          totalFlourWeight,
          hydrationWeight: calculateIngredientWeight({
            totalFlourWeight,
            percent: state.inputs.hydrationPercent,
          }),
          ingredients: {
            ...Object.fromEntries(
              Object.entries(state.inputs.ingredients).map(
                ([id, ingredient]) => [
                  id,
                  {
                    ...ingredient,
                    weight: calculateIngredientWeight({
                      totalFlourWeight,
                      percent: ingredient.percent,
                    }),
                  },
                ],
              ),
            ),
            [action.payload.id]: {
              ...state.inputs.ingredients[action.payload.id],
              weight: action.payload.weight,
              percent,
            },
          },
          levain: state.inputs.levain
            ? {
                ...state.inputs.levain,
                weight: calculateIngredientWeight({
                  totalFlourWeight,
                  percent: state.inputs.levain.percent,
                }),
              }
            : null,
        },
      };
    }
    case 'SET_LEVAIN_PERCENT':
      if (!state.inputs.levain) {
        return state;
      }

      return {
        ...state,
        inputs: {
          ...state.inputs,
          levain: {
            ...state.inputs.levain,
            percent: action.payload.percent,
            weight: calculateIngredientWeight({
              totalFlourWeight: state.inputs.totalFlourWeight,
              percent: action.payload.percent,
            }),
          },
        },
      };
    case 'SET_LEVAIN_WEIGHT':
      if (!state.inputs.levain) {
        return state;
      }

      return {
        ...state,
        inputs: {
          ...state.inputs,
          levain: {
            ...state.inputs.levain,
            weight: action.payload.weight,
            percent: calculateIngredientPercent({
              totalFlourWeight: state.inputs.totalFlourWeight,
              weight: action.payload.weight,
            }),
          },
        },
      };
    case 'ADD_LEVAIN_FLOUR_INGREDIENT': {
      if (!state.inputs.levain) {
        return state;
      }

      const percent = calculateDefaultLevainIngredientPercent({
        levainPercent: state.inputs.levain.percent,
      });

      return {
        ...state,
        inputs: {
          ...state.inputs,
          ingredients: {
            ...state.inputs.ingredients,
            [action.payload.id]: {
              type: 'FLOUR',
              id: action.payload.id,
              name: '',
              percent,
              weight: calculateIngredientWeight({
                totalFlourWeight: state.inputs.totalFlourWeight,
                percent,
              }),
            },
          },
          levain: {
            ...state.inputs.levain,
            ingredientIDs: [
              ...state.inputs.levain.ingredientIDs,
              action.payload.id,
            ],
          },
        },
      };
    }
    case 'ADD_LEVAIN_LIQUID_INGREDIENT': {
      if (!state.inputs.levain) {
        return state;
      }

      const percent = calculateDefaultLevainIngredientPercent({
        levainPercent: state.inputs.levain.percent,
      });

      return {
        ...state,
        inputs: {
          ...state.inputs,
          ingredients: {
            ...state.inputs.ingredients,
            [action.payload.id]: {
              type: 'LIQUID',
              id: action.payload.id,
              name: '',
              percent,
              weight: calculateIngredientWeight({
                totalFlourWeight: state.inputs.totalFlourWeight,
                percent,
              }),
            },
          },
          levain: {
            ...state.inputs.levain,
            ingredientIDs: [
              ...state.inputs.levain.ingredientIDs,
              action.payload.id,
            ],
          },
        },
      };
    }
    case 'ADD_LEVAIN_OTHER_INGREDIENT':
      if (!state.inputs.levain) {
        return state;
      }

      return {
        ...state,
        inputs: {
          ...state.inputs,
          ingredients: {
            ...state.inputs.ingredients,
            [action.payload.id]: {
              type: 'OTHER',
              id: action.payload.id,
              name: '',
              percent: '',
              weight: '',
            },
          },
          levain: {
            ...state.inputs.levain,
            ingredientIDs: [
              ...state.inputs.levain.ingredientIDs,
              action.payload.id,
            ],
          },
        },
      };
    case 'NEXT_CLICKED':
      return {
        ...state,
        step: 'DISPLAY',
      };
    case 'BACK_CLICKED':
      return {
        ...state,
        step: 'EDIT',
      };
  }
}

const SALT_ID = createID();
const INITIAL_STATE: State = {
  inputs: {
    totalFlourWeight: '',
    doughWeight: '',
    hydrationPercent: '80',
    hydrationWeight: '',
    ingredients: {
      [SALT_ID]: {
        type: 'OTHER',
        id: SALT_ID,
        name: 'Salt',
        percent: '2',
        weight: '',
      },
    },
    saltID: SALT_ID,
    flourIngredientIDs: [],
    liquidIngredientIDs: [],
    otherIngredientIDs: [],
    levain: null,
    multiplier: '1',
  },
  mode: 'BY_FLOUR_WEIGHT',
  step: 'EDIT',
};

const CalculatorContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({
  state: INITIAL_STATE,
  dispatch: () => {},
});

export default CalculatorContext;

type Props = {
  children: React.ReactNode;
};

export function CalculatorProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <CalculatorContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}
