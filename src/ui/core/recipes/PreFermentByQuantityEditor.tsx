import { Button } from '@/ui/design/button';
import { Input } from '@/ui/design/input';
import { InputBadge } from '@/ui/design/input-badge';
import { IngredientUnit } from '@/ui/core/recipes/data/state';
import IngredientUnitSelect from '@/ui/core/recipes/IngredientUnitSelect';

type Props = {
  name: string;
  onNameChange: (name: string) => void;
  quantity: string;
  onQuantityChange: (quantity: string) => void;
  unit: IngredientUnit | null;
  onUnitChange: (unit: IngredientUnit | null) => void;
  hydrationPercent: string;
  onHydrationPercentChange: (hydrationPercent: string) => void;
  onDelete: () => void;
};

export default function PreFermentByQuantityEditor(props: Props) {
  return (
    <>
      <div className="flex gap-2">
        <div className="flex-[3]">
          <Input
            value={props.name}
            onChange={props.onNameChange}
            placeholder="Name"
          />
        </div>
        <div className="flex-[1]">
          <Input
            type="number"
            value={props.quantity}
            onChange={props.onQuantityChange}
            min="0"
            className="text-right"
          />
        </div>
        <div className="flex-[1]">
          <IngredientUnitSelect
            value={props.unit}
            onChange={props.onUnitChange}
          />
        </div>
      </div>
      <div className="mt-1 flex gap-4">
        <InputBadge
          value={props.hydrationPercent}
          onChange={props.onHydrationPercentChange}
        />
        <Button variant="outline" className="h-8" onClick={props.onDelete}>
          Delete
        </Button>
      </div>
    </>
  );
}
