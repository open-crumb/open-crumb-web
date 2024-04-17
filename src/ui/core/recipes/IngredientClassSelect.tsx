import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/design/select';
import { IngredientClass } from './data/state';

const INGREDIENT_CLASSES: Array<{
  value: IngredientClass;
  text: string;
}> = [
  {
    value: 'FLOUR',
    text: 'Flour',
  },
  {
    value: 'OTHER',
    text: 'Other',
  },
];

type Props = {
  value: IngredientClass;
  onChange: (value: IngredientClass) => void;
};

export default function IngredientClassSelect(props: Props) {
  return (
    <Select value={props.value} onValueChange={props.onChange}>
      <SelectTrigger className="h-8 w-28" variant="outline">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {INGREDIENT_CLASSES.map(({ value, text }) => (
          <SelectItem key={value} value={value}>
            {text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
