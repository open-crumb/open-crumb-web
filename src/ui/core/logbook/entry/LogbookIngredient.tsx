import { INGREDIENT_UNITS } from '@/lib/units';
import {
  useLogbookActions,
  useLogbookIngredient,
} from '@/ui/core/logbook/LogbookContext';
import { Button } from '@/ui/design/button';
import { Input } from '@/ui/design/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/design/select';
import { IngredientUnit } from '@/ui/graphql/graphql';
import { X as DeleteIcon } from 'lucide-react';

type Props = {
  id: string;
};

export default function LogbookIngredient(props: Props) {
  const ingredient = useLogbookIngredient(props.id);
  const { setIngredient, deleteIngredient } = useLogbookActions();

  return (
    <div className="flex items-center gap-2">
      <div className="flex-[3]">
        <Input
          value={ingredient.entity.name}
          onChange={(name) => {
            setIngredient({
              id: props.id,
              name,
            });
          }}
          placeholder="Flour"
        />
      </div>
      <div className="flex-[1]">
        <Input
          type="number"
          value={ingredient.entity.quantity}
          onChange={(quantity) => {
            setIngredient({
              id: props.id,
              quantity,
            });
          }}
          placeholder="50"
          className="text-right"
        />
      </div>
      <div className="flex-[1]">
        <Select
          value={ingredient.entity.unit}
          onValueChange={(unit) => {
            setIngredient({
              id: props.id,
              unit: unit as IngredientUnit,
            });
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {INGREDIENT_UNITS.map(({ value, text }) => (
              <SelectItem key={value} value={value}>
                {text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-shrink">
        <Button
          variant="ghost"
          onClick={() => {
            deleteIngredient({ id: props.id });
          }}
          size="icon"
        >
          <DeleteIcon aria-label="Delete Ingredient" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
