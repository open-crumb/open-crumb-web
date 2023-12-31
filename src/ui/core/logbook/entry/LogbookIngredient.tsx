import { INGREDIENT_UNITS } from '@/lib/units';
import {
  useLogbookActions,
  useLogbookIngredient,
} from '@/ui/core/logbook/LogbookContext';
import Button from '@/ui/design/Button';
import Select from '@/ui/design/Select';
import TextField from '@/ui/design/TextField';
import { Cross1Icon } from '@radix-ui/react-icons';

type Props = {
  id: string;
};

export default function LogbookIngredient(props: Props) {
  const ingredient = useLogbookIngredient(props.id);
  const { setIngredient, deleteIngredient } = useLogbookActions();

  return (
    <div className="flex items-center gap-2">
      <div className="flex-[4]">
        <TextField.Input
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
        <TextField.Input
          type="number"
          value={ingredient.entity.quantity}
          onChange={(quantity) => {
            setIngredient({
              id: props.id,
              quantity,
            });
          }}
          placeholder="50"
          align="right"
        />
      </div>
      <div className="flex-[1]">
        <Select.Root
          value={ingredient.entity.unit}
          onValueChange={(unit) => {
            setIngredient({
              id: props.id,
              unit,
            });
          }}
        >
          <Select.Trigger />
          <Select.Content>
            {INGREDIENT_UNITS.map(({ value, text }) => (
              <Select.Item key={value} value={value}>
                {text}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
      <div className="flex-shrink">
        <Button
          onClick={() => {
            deleteIngredient({ id: props.id });
          }}
        >
          <Cross1Icon aria-label="Delete Ingredient" />
        </Button>
      </div>
    </div>
  );
}
