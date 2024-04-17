import { ID } from '@/ui/core/recipes/data/state';
import {
  useActions,
  useIngredientByQuantity,
  useRecipeByQuantity,
} from '@/ui/core/recipes/data/hooks';
import PreFermentByQuantityEditor from '@/ui/core/recipes/PreFermentByQuantityEditor';
import RawIngredientByQuantityEditor from '@/ui/core/recipes/RawIngredientByQuantityEditor';

type Props = {
  id: ID;
  recipeID: ID;
};

export default function IngredientByQuantityBlock(props: Props) {
  const ingredient = useIngredientByQuantity(props.id);
  const recipe = useRecipeByQuantity(props.recipeID);
  const actions = useActions();

  switch (ingredient.__typename) {
    case 'PreFermentByQuantity':
      return (
        <PreFermentByQuantityEditor
          name={ingredient.name}
          onNameChange={(name) => {
            actions.setPreFermentByQuantity({
              id: ingredient.id,
              name,
            });
          }}
          quantity={ingredient.quantity}
          onQuantityChange={(quantity) => {
            actions.setPreFermentByQuantity({
              id: ingredient.id,
              quantity,
            });
          }}
          unit={ingredient.unit}
          onUnitChange={(unit) => {
            actions.setPreFermentByQuantity({
              id: ingredient.id,
              unit,
            });
          }}
          hydrationPercent={ingredient.hydrationPercent}
          onHydrationPercentChange={(hydrationPercent) => {
            actions.setPreFermentByQuantity({
              id: ingredient.id,
              hydrationPercent,
            });
          }}
          onDelete={() => {
            actions.deleteIngredient({
              id: ingredient.id,
              recipeID: recipe.id,
            });
          }}
        />
      );
    case 'RawIngredientByQuantity':
      return (
        <RawIngredientByQuantityEditor
          name={ingredient.name}
          onNameChange={(name) => {
            actions.setRawIngredientByQuantity({
              id: ingredient.id,
              name,
            });
          }}
          quantity={ingredient.quantity}
          onQuantityChange={(quantity) => {
            actions.setRawIngredientByQuantity({
              id: ingredient.id,
              quantity,
            });
          }}
          unit={ingredient.unit}
          onUnitChange={(unit) => {
            actions.setRawIngredientByQuantity({
              id: ingredient.id,
              unit,
            });
          }}
          onDelete={() => {
            actions.deleteIngredient({
              id: ingredient.id,
              recipeID: recipe.id,
            });
          }}
        />
      );
  }
}
