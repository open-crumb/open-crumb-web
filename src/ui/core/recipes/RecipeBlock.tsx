'use client';

import { useRecipe } from '@/ui/core/recipes/data/hooks';
import { ID } from '@/ui/core/recipes/data/state';
import BreadRecipeByPercentBlock from './BreadRecipeByPercentBlock';
import RecipeByQuantityBlock from './RecipeByQuantityBlock';

type Props = {
  id: ID;
};

export default function RecipeBlock(props: Props) {
  const recipe = useRecipe(props.id);

  switch (recipe.__typename) {
    case 'BreadRecipeByPercent':
      return <BreadRecipeByPercentBlock id={recipe.id} />;
    case 'RecipeByQuantity':
      return <RecipeByQuantityBlock id={recipe.id} />;
    default:
      return null;
  }
}
