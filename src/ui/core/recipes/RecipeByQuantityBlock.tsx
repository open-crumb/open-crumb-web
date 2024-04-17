import { ID } from '@/ui/core/recipes/data/state';
import { useActions, useRecipeByQuantity } from '@/ui/core/recipes/data/hooks';
import RecipeTitleEditor from '@/ui/core/recipes/RecipeTitleEditor';
import IngredientByQuantityBlock from '@/ui/core/recipes/IngredientByQuantityBlock';
import { Fragment } from 'react';
import { Separator } from '@/ui/design/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@/ui/design/dropdown-menu';
import { Button } from '@/ui/design/button';

type Props = {
  id: ID;
};

export default function RecipeByQuantityBlock(props: Props) {
  const recipe = useRecipeByQuantity(props.id);
  const actions = useActions();

  return (
    <div>
      <RecipeTitleEditor
        title={recipe.title}
        onTitleChange={(title) =>
          actions.setRecipeByQuantity({
            id: recipe.id,
            title,
          })
        }
      />
      {recipe.ingredientIDs.map((id, index) => (
        <Fragment key={id}>
          {index > 0 && <Separator className="mb-1 mt-4" />}
          <IngredientByQuantityBlock id={id} recipeID={recipe.id} />
        </Fragment>
      ))}
      <div className="mt-4 flex justify-end">
        <CreateIngredientDropdownMenu
          onSelect={(option) => {
            switch (option) {
              case 'PRE_FERMENT':
                return actions.createPreFermentByQuantity({
                  recipeID: recipe.id,
                });
              case 'INGREDIENT':
                return actions.createRawIngredientByQuantity({
                  recipeID: recipe.id,
                });
            }
          }}
        />
      </div>
    </div>
  );
}

type CreateIngredientDropdownMenuProps = {
  onSelect: (option: 'PRE_FERMENT' | 'INGREDIENT') => void;
};

function CreateIngredientDropdownMenu(
  props: CreateIngredientDropdownMenuProps,
) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Add</Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => props.onSelect('PRE_FERMENT')}>
            Pre-Ferment
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => props.onSelect('INGREDIENT')}>
            Ingredient
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
