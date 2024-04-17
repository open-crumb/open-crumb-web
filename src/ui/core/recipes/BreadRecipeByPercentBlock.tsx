import { ID } from '@/ui/core/recipes/data/state';
import {
  useActions,
  useBreadRecipeByPercent,
  useBreadRecipeByPercentIssues,
} from '@/ui/core/recipes/data/hooks';
import RecipeTitleEditor from '@/ui/core/recipes/RecipeTitleEditor';
import { Input, InputContainer, InputSlot } from '@/ui/design/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@/ui/design/dropdown-menu';
import { Button } from '@/ui/design/button';
import { AlertTriangle } from 'lucide-react';
import IngredientByPercentBlock from '@/ui/core/recipes/IngredientByPercentBlock';
import { Badge } from '@/ui/design/badge';
import { Separator } from '@/ui/design/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/design/popover';

type Props = {
  id: ID;
};

export default function BreadRecipeByPercentBlock(props: Props) {
  const recipe = useBreadRecipeByPercent(props.id);
  const issues = useBreadRecipeByPercentIssues({ recipeID: props.id });
  const actions = useActions();

  return (
    <div>
      <RecipeTitleEditor
        title={recipe.title}
        onTitleChange={(title) =>
          actions.setBreadRecipeByPercent({
            id: recipe.id,
            title,
          })
        }
      />
      {recipe.preFermentIDs.length > 0 && (
        <div className="mt-2">
          <IngredientList
            label={<Badge>Pre-Ferments</Badge>}
            ingredientIDs={recipe.preFermentIDs}
            recipeID={recipe.id}
          />
        </div>
      )}
      {recipe.flourIngredientIDs.length > 0 && (
        <div className="mt-4">
          <IngredientList
            label={
              issues.some(
                (issue) => issue.__typename === 'INVALID_TOTAL_FLOUR_PERCENT',
              ) ? (
                <>
                  <Badge variant="destructive">Flour</Badge>
                  <Popover>
                    <PopoverTrigger>
                      <AlertTriangle className="ml-2 h-4 w-4 text-destructive" />
                    </PopoverTrigger>
                    <PopoverContent>
                      Flour percents should add up to 100%.
                    </PopoverContent>
                  </Popover>
                </>
              ) : (
                <Badge>Flour</Badge>
              )
            }
            ingredientIDs={recipe.flourIngredientIDs}
            recipeID={recipe.id}
          />
        </div>
      )}
      <div className="mt-4 flex items-center">
        <div className="flex-[3]">
          <Badge>Hydration</Badge>
        </div>
        <div className="flex-[1]">
          <InputContainer>
            <Input
              type="number"
              value={recipe.hydrationPercent}
              onChange={(hydrationPercent) => {
                actions.setBreadRecipeByPercent({
                  id: recipe.id,
                  hydrationPercent,
                });
              }}
              min="0"
              className="text-right"
            />
            <InputSlot>
              <span className="whitespace-nowrap">%</span>
            </InputSlot>
          </InputContainer>
        </div>
      </div>
      {recipe.otherIngredientIDs.length > 0 && (
        <div className="mt-4">
          <IngredientList
            label={<Badge>Other</Badge>}
            ingredientIDs={recipe.otherIngredientIDs}
            recipeID={recipe.id}
          />
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <CreateIngredientDropdownMenu
          onSelect={(option) => {
            switch (option) {
              case 'PRE_FERMENT':
                return actions.createPreFermentByPercent({
                  recipeID: recipe.id,
                });
              case 'FLOUR':
              case 'OTHER':
                return actions.createRawIngredientByPercent({
                  recipeID: recipe.id,
                  class: option,
                });
            }
          }}
        />
      </div>
    </div>
  );
}

type IngredientListProps = {
  label: React.ReactNode;
  ingredientIDs: ID[];
  recipeID: ID;
};

function IngredientList(props: IngredientListProps) {
  return (
    <>
      <div className="mb-1 flex items-center">{props.label}</div>
      {props.ingredientIDs.map((id, index) => (
        <div key={id}>
          {index > 0 && <Separator className="mb-1 mt-4" />}
          <IngredientByPercentBlock id={id} recipeID={props.recipeID} />
        </div>
      ))}
    </>
  );
}

type CreateIngredientDropdownMenuProps = {
  onSelect: (option: 'PRE_FERMENT' | 'FLOUR' | 'OTHER') => void;
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
          <DropdownMenuItem onClick={() => props.onSelect('FLOUR')}>
            Flour
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => props.onSelect('OTHER')}>
            Other
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
