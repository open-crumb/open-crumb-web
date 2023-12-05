import {
  deleteLogbookIngredient,
  setLogbookIngredient,
  useLogbookIngredient,
} from '@/ui/core/logbook/LogbookContext';
import Button from '@/ui/design/Button';
import TextField from '@/ui/design/TextField';
import { Cross1Icon } from '@radix-ui/react-icons';

type Props = {
  id: string;
};

export default function LogbookIngredient(props: Props) {
  const ingredient = useLogbookIngredient(props.id);

  return (
    <TextField.Root>
      <TextField.Input
        value={ingredient.entity.text}
        onChange={(text) => {
          setLogbookIngredient({
            id: props.id,
            text,
          });
        }}
        placeholder="Enter Ingredient..."
      />
      <TextField.Slot>
        <Button
          onClick={() => {
            deleteLogbookIngredient({ id: props.id });
          }}
        >
          <Cross1Icon aria-label="Delete Ingredient" />
        </Button>
      </TextField.Slot>
    </TextField.Root>
  );
}
