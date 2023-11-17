import { useContext, useId } from 'react';
import {
  Cross1Icon,
  MinusCircledIcon,
  PlusCircledIcon,
} from '@radix-ui/react-icons';
import TextField from '@/ui/design/TextField';
import CalculatorContext from '@/ui/core/calculator/CalculatorContext';
import DropdownMenu from '@/ui/design/DropdownMenu';
import createID from '@/lib/create-id';
import Button from '@/ui/design/Button';
import Separator from '@/ui/design/Separator';
import Heading from '@/ui/design/Heading';

export default function CalculatorEditor() {
  const doughWeightInputID = useId();
  const totalFlourInputID = useId();
  const hydrationInputID = useId();
  const saltInputID = useId();
  const multiplierInputID = useId();
  const { state, dispatch } = useContext(CalculatorContext);

  return (
    <div>
      <div className="flex items-center gap-4">
        <label htmlFor={doughWeightInputID} className="flex-[2]">
          Dough Weight
        </label>
        <div className="flex-[1]" />
        <div className="flex-[1]">
          <TextField.Root>
            <TextField.Input
              id={doughWeightInputID}
              type="number"
              value={state.inputs.doughWeight}
              onChange={(doughWeight) => {
                dispatch({
                  type: 'SET_DOUGH_WEIGHT',
                  payload: { doughWeight },
                });
              }}
              align="right"
              min="0"
            />
            <TextField.Slot>g</TextField.Slot>
          </TextField.Root>
        </div>
      </div>
      <Separator />
      <div className="flex items-center gap-4">
        <label htmlFor={totalFlourInputID} className="flex-[2]">
          Total Flour
        </label>
        <div className="flex-[1]" />
        <div className="flex-[1]">
          <TextField.Root>
            <TextField.Input
              id={totalFlourInputID}
              type="number"
              value={state.inputs.totalFlourWeight}
              onChange={(totalFlourWeight) => {
                dispatch({
                  type: 'SET_TOTAL_FLOUR_WEIGHT',
                  payload: { totalFlourWeight },
                });
              }}
              align="right"
              min="0"
            />
            <TextField.Slot>g</TextField.Slot>
          </TextField.Root>
        </div>
      </div>
      <Separator />
      <div className="flex items-center gap-4">
        <label htmlFor={hydrationInputID} className="flex-[2]">
          Hydration
        </label>
        <div className="flex-[1]">
          <TextField.Root>
            <TextField.Input
              id={hydrationInputID}
              type="number"
              value={state.inputs.hydrationPercent}
              onChange={(hydrationPercent) => {
                dispatch({
                  type: 'SET_HYDRATION_PERCENT',
                  payload: { hydrationPercent },
                });
              }}
              align="right"
              min="0"
            />
            <TextField.Slot>%</TextField.Slot>
          </TextField.Root>
        </div>
        <div className="flex-[1]">
          <TextField.Root>
            <TextField.Input
              type="number"
              value={state.inputs.hydrationWeight}
              onChange={(hydrationWeight) => {
                dispatch({
                  type: 'SET_HYDRATION_WEIGHT',
                  payload: { hydrationWeight },
                });
              }}
              align="right"
              min="0"
              aria-label="Hydration Weight"
            />
            <TextField.Slot>g</TextField.Slot>
          </TextField.Root>
        </div>
      </div>
      <Separator />
      <div className="flex items-center gap-4">
        <label htmlFor={saltInputID} className="flex-[2]">
          {state.inputs.ingredients[state.inputs.saltID].name}
        </label>
        <div className="flex-[1]">
          <TextField.Root>
            <TextField.Input
              id={saltInputID}
              type="number"
              value={state.inputs.ingredients[state.inputs.saltID].percent}
              onChange={(percent) => {
                dispatch({
                  type: 'SET_INGREDIENT_PERCENT',
                  payload: {
                    id: state.inputs.saltID,
                    percent,
                  },
                });
              }}
              align="right"
              min="0"
            />
            <TextField.Slot>%</TextField.Slot>
          </TextField.Root>
        </div>
        <div className="flex-[1]">
          <TextField.Root>
            <TextField.Input
              type="number"
              value={state.inputs.ingredients[state.inputs.saltID].weight}
              onChange={(weight) => {
                dispatch({
                  type: 'SET_INGREDIENT_WEIGHT',
                  payload: {
                    id: state.inputs.saltID,
                    weight,
                  },
                });
              }}
              align="right"
              min="0"
              aria-label="Salt Weight"
            />
            <TextField.Slot>g</TextField.Slot>
          </TextField.Root>
        </div>
      </div>
      {(state.inputs.flourIngredientIDs.length > 0 ||
        state.inputs.liquidIngredientIDs.length > 0 ||
        state.inputs.otherIngredientIDs.length > 0) && (
        <div className="mt-4">
          {state.inputs.levain && <Heading level="4">Main Dough</Heading>}
          {state.inputs.flourIngredientIDs.length > 0 && (
            <div>
              <Heading level="5">Flours</Heading>
              {state.inputs.flourIngredientIDs.map((id) => (
                <Ingredient key={id} id={id} />
              ))}
            </div>
          )}
          {state.inputs.liquidIngredientIDs.length > 0 && (
            <div>
              <Heading level="5">Liquids</Heading>
              {state.inputs.liquidIngredientIDs.map((id) => (
                <Ingredient key={id} id={id} />
              ))}
            </div>
          )}
          {state.inputs.otherIngredientIDs.length > 0 && (
            <div>
              <Heading level="5">Other</Heading>
              {state.inputs.otherIngredientIDs.map((id) => (
                <Ingredient key={id} id={id} />
              ))}
            </div>
          )}
        </div>
      )}
      <div className="flex justify-end">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <PlusCircledIcon className="mr-1" />
            Add Ingredient
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Item
                onClick={() => {
                  dispatch({
                    type: 'ADD_FLOUR_INGREDIENT',
                    payload: { id: createID() },
                  });
                }}
              >
                Flour
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => {
                  dispatch({
                    type: 'ADD_LIQUID_INGREDIENT',
                    payload: { id: createID() },
                  });
                }}
              >
                Liquid
              </DropdownMenu.Item>
              {!state.inputs.levain && (
                <DropdownMenu.Item
                  onClick={() => {
                    dispatch({
                      type: 'ADD_LEVAIN',
                      payload: {
                        flourIngredientID: createID(),
                        waterIngredientID: createID(),
                      },
                    });
                  }}
                >
                  Levain
                </DropdownMenu.Item>
              )}
              <DropdownMenu.Item
                onClick={() => {
                  dispatch({
                    type: 'ADD_OTHER_INGREDIENT',
                    payload: { id: createID() },
                  });
                }}
              >
                Other
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      {state.inputs.levain && (
        <div className="mt-4">
          <Levain />
        </div>
      )}
      <Separator className="mt-4" />
      <div className="flex items-center gap-4">
        <label htmlFor={multiplierInputID} className="flex-[2]">
          Multiplier
        </label>
        <div className="flex-[1]" />
        <div className="flex-[1]">
          <TextField.Root>
            <TextField.Input
              id={multiplierInputID}
              type="number"
              value={state.inputs.multiplier}
              onChange={(multiplier) => {
                dispatch({
                  type: 'SET_MULTIPLIER',
                  payload: { multiplier },
                });
              }}
              align="right"
              min="0"
            />
            <TextField.Slot>
              <Cross1Icon width="10" height="10" />
            </TextField.Slot>
          </TextField.Root>
        </div>
      </div>
      <div className="mt-2 flex justify-end">
        <Button
          onClick={() => {
            dispatch({ type: 'NEXT_CLICKED' });
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

type IngredientProps = {
  id: string;
};

function Ingredient({ id }: IngredientProps) {
  const { state, dispatch } = useContext(CalculatorContext);

  const ingredient = state.inputs.ingredients[id];

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-[2] gap-2">
        <Button
          onClick={() => {
            dispatch({
              type: 'DELETE_INGREDIENT',
              payload: { id: ingredient.id },
            });
          }}
          aria-label="Delete Ingredient"
        >
          <MinusCircledIcon aria-label="Remove Ingredient" />
        </Button>
        <div className="flex-1">
          <TextField.Input
            value={ingredient.name}
            onChange={(name) => {
              dispatch({
                type: 'SET_INGREDIENT_NAME',
                payload: {
                  id: ingredient.id,
                  name,
                },
              });
            }}
            placeholder="Enter name..."
            min="0"
            aria-label="Ingredient Name"
          />
        </div>
      </div>
      <div className="flex-[1]">
        <TextField.Root>
          <TextField.Input
            type="number"
            value={ingredient.percent}
            onChange={(percent) => {
              dispatch({
                type: 'SET_INGREDIENT_PERCENT',
                payload: {
                  id: ingredient.id,
                  percent,
                },
              });
            }}
            align="right"
            min="0"
            aria-label="Ingredient Percent"
          />
          <TextField.Slot>%</TextField.Slot>
        </TextField.Root>
      </div>
      <div className="flex-[1]">
        <TextField.Root>
          <TextField.Input
            type="number"
            value={ingredient.weight}
            onChange={(weight) => {
              dispatch({
                type: 'SET_INGREDIENT_WEIGHT',
                payload: {
                  id: ingredient.id,
                  weight,
                },
              });
            }}
            align="right"
            min="0"
            aria-label="Ingredient Weight"
          />
          <TextField.Slot>g</TextField.Slot>
        </TextField.Root>
      </div>
    </div>
  );
}

function Levain() {
  const inputID = useId();
  const { state, dispatch } = useContext(CalculatorContext);

  // Invariant that this is only rendered when `levain` is set in state.
  const levain = state.inputs.levain!;
  const flourIngredientIDs = levain.ingredientIDs.filter(
    (id) => state.inputs.ingredients[id].type === 'FLOUR',
  );
  const liquidIngredientIDs = levain.ingredientIDs.filter(
    (id) => state.inputs.ingredients[id].type === 'LIQUID',
  );
  const otherIngredientIDs = levain.ingredientIDs.filter(
    (id) => state.inputs.ingredients[id].type === 'OTHER',
  );

  return (
    <div>
      <div className="flex items-center gap-4">
        <label htmlFor={inputID} className="flex-[2]">
          <Heading level="4">Levain</Heading>
        </label>
        <div className="flex-[1]">
          <TextField.Root>
            <TextField.Input
              id={inputID}
              type="number"
              value={levain.percent}
              onChange={(percent) => {
                dispatch({
                  type: 'SET_LEVAIN_PERCENT',
                  payload: { percent },
                });
              }}
              align="right"
              min="0"
            />
            <TextField.Slot>%</TextField.Slot>
          </TextField.Root>
        </div>
        <div className="flex-[1]">
          <TextField.Root>
            <TextField.Input
              type="number"
              value={levain.weight}
              onChange={(weight) => {
                dispatch({
                  type: 'SET_LEVAIN_WEIGHT',
                  payload: { weight },
                });
              }}
              align="right"
              min="0"
              aria-label="Levain Weight"
            />
            <TextField.Slot>g</TextField.Slot>
          </TextField.Root>
        </div>
      </div>
      {flourIngredientIDs.length > 0 && (
        <div>
          <Heading level="5">Flours</Heading>
          {flourIngredientIDs.map((id) => (
            <Ingredient key={id} id={id} />
          ))}
        </div>
      )}
      {liquidIngredientIDs.length > 0 && (
        <div>
          <Heading level="5">Liquids</Heading>
          {liquidIngredientIDs.map((id) => (
            <Ingredient key={id} id={id} />
          ))}
        </div>
      )}
      {otherIngredientIDs.length > 0 && (
        <div>
          <Heading level="5">Other</Heading>
          {otherIngredientIDs.map((id) => (
            <Ingredient key={id} id={id} />
          ))}
        </div>
      )}
      <div className="flex justify-end gap-4">
        <Button
          onClick={() => {
            dispatch({
              type: 'DELETE_LEVAIN',
            });
          }}
        >
          <MinusCircledIcon className="mr-1" />
          Delete
        </Button>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <PlusCircledIcon className="mr-1" />
            Add Ingredient
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Item
                onClick={() => {
                  dispatch({
                    type: 'ADD_LEVAIN_FLOUR_INGREDIENT',
                    payload: { id: createID() },
                  });
                }}
              >
                Flour
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => {
                  dispatch({
                    type: 'ADD_LEVAIN_LIQUID_INGREDIENT',
                    payload: { id: createID() },
                  });
                }}
              >
                Liquid
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => {
                  dispatch({
                    type: 'ADD_LEVAIN_OTHER_INGREDIENT',
                    payload: { id: createID() },
                  });
                }}
              >
                Other
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}
