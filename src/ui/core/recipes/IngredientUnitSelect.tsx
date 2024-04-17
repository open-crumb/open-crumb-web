import { INGREDIENT_UNITS, IngredientUnit } from '@/lib/units';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/design/select';

type Props = {
  value: IngredientUnit | null;
  onChange: (value: IngredientUnit | null) => void;
};

export default function IngredientUnitSelect(props: Props) {
  return (
    <Select
      value={props.value || ''}
      onValueChange={(value) =>
        props.onChange(value === 'NONE' ? null : (value as IngredientUnit))
      }
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="NONE">&nbsp;</SelectItem>
        {INGREDIENT_UNITS.map(({ value, text }) => (
          <SelectItem key={value} value={value}>
            {text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
