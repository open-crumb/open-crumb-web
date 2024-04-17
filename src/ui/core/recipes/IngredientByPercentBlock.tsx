import { ID } from '@/ui/core/recipes/data/state';
import {
  useActions,
  useIngredientByPercent,
} from '@/ui/core/recipes/data/hooks';
import PreFermentByPercentEditor from '@/ui/core/recipes/PreFermentByPercentEditor';
import RawIngredientByPercentEditor from '@/ui/core/recipes/RawIngredientByPercentEditor';

type Props = {
  id: ID;
  recipeID: ID;
};

export default function IngredientByPercentBlock(props: Props) {
  const ingredient = useIngredientByPercent(props.id);
  const actions = useActions();

  switch (ingredient.__typename) {
    case 'PreFermentByPercent':
      return (
        <PreFermentByPercentEditor
          name={ingredient.name}
          onNameChange={(name) => {
            actions.setPreFermentByPercent({
              id: ingredient.id,
              name,
            });
          }}
          percent={ingredient.percent}
          onPercentChange={(percent) => {
            actions.setPreFermentByPercent({
              id: ingredient.id,
              percent,
            });
          }}
          hydrationPercent={ingredient.hydrationPercent}
          onHydrationPercentChange={(hydrationPercent) => {
            actions.setPreFermentByPercent({
              id: ingredient.id,
              hydrationPercent,
            });
          }}
          onDelete={() => {
            actions.deleteIngredient({
              id: ingredient.id,
              recipeID: props.recipeID,
            });
          }}
        />
      );
    case 'RawIngredientByPercent':
      return (
        <RawIngredientByPercentEditor
          name={ingredient.name}
          onNameChange={(name) => {
            actions.setRawIngredientByPercent({
              id: ingredient.id,
              name,
            });
          }}
          percent={ingredient.percent}
          onPercentChange={(percent) => {
            actions.setRawIngredientByPercent({
              id: ingredient.id,
              percent,
            });
          }}
          onDelete={() => {
            actions.deleteIngredient({
              id: ingredient.id,
              recipeID: props.recipeID,
            });
          }}
        />
      );
    default:
      return null;
  }
}
