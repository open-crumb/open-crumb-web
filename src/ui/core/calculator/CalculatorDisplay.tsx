import { useContext } from 'react';
import CalculatorContext from '@/ui/core/calculator/CalculatorContext';
import Separator from '@/ui/design/Separator';
import Button from '@/ui/design/Button';
import Heading from '@/ui/design/Heading';
import {
  applyMultiplier,
  calculateIngredientWeight,
  calculatePercentDifference,
} from '@/ui/core/calculator/utils';

export default function CalculatorDisplay() {
  const { state, dispatch } = useContext(CalculatorContext);

  return (
    <div>
      <div className="flex h-10 items-center gap-4">
        <div className="flex-[2]">Dough Weight</div>
        <div className="flex-[1]" />
        <div className="flex-[1] text-right">{state.inputs.doughWeight}g</div>
      </div>
      <Separator />
      <div className="flex h-10 items-center gap-4">
        <div className="flex-[2]">Total Flour</div>
        <div className="flex-[1]" />
        <div className="flex-[1] text-right">
          {state.inputs.totalFlourWeight}g
        </div>
      </div>
      <Separator />
      <div className="flex h-10 items-center gap-4">
        <div className="flex-[2]">Hydration</div>
        <div className="flex-[1] text-right">
          {state.inputs.hydrationPercent}%
        </div>
        <div className="flex-[1] text-right">
          {state.inputs.hydrationWeight}g
        </div>
      </div>
      <Separator />
      <div className="flex h-10 items-center gap-4">
        <div className="flex-[2]">Multiplier</div>
        <div className="flex-[1]" />
        <div className="flex-[1] text-right">
          {state.inputs.multiplier}&times;
        </div>
      </div>
      {state.inputs.levain && <Levain />}
      <div className="mt-4">
        <Heading level="4">Main Dough</Heading>
        {state.inputs.flourIngredientIDs.length > 0 &&
          state.inputs.flourIngredientIDs.map((id) => {
            const ingredient = state.inputs.ingredients[id];

            return (
              <Ingredient
                key={id}
                name={ingredient.name}
                percent={ingredient.percent}
                weight={ingredient.weight}
              />
            );
          })}
        {state.inputs.flourIngredientIDs.length === 0 &&
          (() => {
            const percent = calculatePercentDifference({
              totalPercent: '100',
              otherPercents: state.inputs.levain
                ? state.inputs.levain.ingredientIDs
                    .filter(
                      (id) => state.inputs.ingredients[id].type === 'FLOUR',
                    )
                    .map((id) => state.inputs.ingredients[id].percent)
                : [],
            });

            return (
              <Ingredient
                name="Flour"
                percent={percent}
                weight={calculateIngredientWeight({
                  totalFlourWeight: state.inputs.totalFlourWeight,
                  percent,
                })}
              />
            );
          })()}
        {state.inputs.liquidIngredientIDs.length > 0 &&
          state.inputs.liquidIngredientIDs.map((id) => {
            const ingredient = state.inputs.ingredients[id];

            return (
              <Ingredient
                key={id}
                name={ingredient.name}
                percent={ingredient.percent}
                weight={ingredient.weight}
              />
            );
          })}
        {state.inputs.liquidIngredientIDs.length === 0 &&
          (() => {
            const percent = calculatePercentDifference({
              totalPercent: state.inputs.hydrationPercent,
              otherPercents: state.inputs.levain
                ? state.inputs.levain.ingredientIDs
                    .filter(
                      (id) => state.inputs.ingredients[id].type === 'LIQUID',
                    )
                    .map((id) => state.inputs.ingredients[id].percent)
                : [],
            });

            return (
              <Ingredient
                name="Water"
                percent={percent}
                weight={calculateIngredientWeight({
                  totalFlourWeight: state.inputs.totalFlourWeight,
                  percent,
                })}
              />
            );
          })()}
        <Ingredient
          name={state.inputs.ingredients[state.inputs.saltID].name}
          percent={state.inputs.ingredients[state.inputs.saltID].percent}
          weight={state.inputs.ingredients[state.inputs.saltID].weight}
        />
        {state.inputs.otherIngredientIDs.length > 0 &&
          state.inputs.otherIngredientIDs.map((id) => {
            const ingredient = state.inputs.ingredients[id];

            return (
              <Ingredient
                key={id}
                name={ingredient.name}
                percent={ingredient.percent}
                weight={ingredient.weight}
              />
            );
          })}
      </div>
      <div className="mt-2 flex justify-end">
        <Button
          onClick={() => {
            dispatch({ type: 'BACK_CLICKED' });
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );
}

type IngredientProps = {
  name: string;
  percent: string;
  weight: string;
};

function Ingredient({ name, percent, weight }: IngredientProps) {
  const { state } = useContext(CalculatorContext);

  return (
    <div className="flex h-10 items-center gap-4">
      <div className="flex-[2]">{name}</div>
      <div className="flex-[1] text-right">{percent}%</div>
      <div className="flex-[1] text-right">
        {applyMultiplier({
          value: weight,
          multiplier: state.inputs.multiplier,
        })}
        g
      </div>
    </div>
  );
}

function Levain() {
  const { state } = useContext(CalculatorContext);

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
    <div className="mt-4">
      <div className="flex h-10 items-center gap-4">
        <div className="flex-[2]">
          <Heading level="4">Levain</Heading>
        </div>
        <div className="flex-[1] text-right">{levain.percent}%</div>
        <div className="flex-[1] text-right">
          {applyMultiplier({
            value: levain.weight,
            multiplier: state.inputs.multiplier,
          })}
          g
        </div>
      </div>
      {flourIngredientIDs.length > 0 &&
        flourIngredientIDs.map((id) => {
          const ingredient = state.inputs.ingredients[id];

          return (
            <Ingredient
              key={id}
              name={ingredient.name}
              percent={ingredient.percent}
              weight={ingredient.weight}
            />
          );
        })}
      {liquidIngredientIDs.length > 0 &&
        liquidIngredientIDs.map((id) => {
          const ingredient = state.inputs.ingredients[id];

          return (
            <Ingredient
              key={id}
              name={ingredient.name}
              percent={ingredient.percent}
              weight={ingredient.weight}
            />
          );
        })}
      {otherIngredientIDs.length > 0 &&
        otherIngredientIDs.map((id) => {
          const ingredient = state.inputs.ingredients[id];

          return (
            <Ingredient
              key={id}
              name={ingredient.name}
              percent={ingredient.percent}
              weight={ingredient.weight}
            />
          );
        })}
    </div>
  );
}
