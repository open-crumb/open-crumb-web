import { MEASUREMENT_UNITS } from '@/lib/units';
import {
  useLogbookActions,
  useLogbookMeasurement,
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
import { MeasurementUnit } from '@/ui/graphql/graphql';
import { X as DeleteIcon } from 'lucide-react';

type Props = {
  id: string;
};

export default function LogbookMeasurement(props: Props) {
  const ingredient = useLogbookMeasurement(props.id);
  const { setMeasurement, deleteMeasurement } = useLogbookActions();

  return (
    <div className="flex items-center gap-2">
      <div className="flex-[4]">
        <Input
          value={ingredient.entity.name}
          onChange={(name) => {
            setMeasurement({
              id: props.id,
              name,
            });
          }}
          placeholder="Dough Temperature"
        />
      </div>
      <div className="flex-[1]">
        <Input
          type="number"
          value={ingredient.entity.value}
          onChange={(value) => {
            setMeasurement({
              id: props.id,
              value,
            });
          }}
          placeholder="80"
          className="text-right"
        />
      </div>
      <div className="flex-[1]">
        <Select
          value={ingredient.entity.unit}
          onValueChange={(unit) => {
            setMeasurement({
              id: props.id,
              unit: unit as MeasurementUnit,
            });
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MEASUREMENT_UNITS.map(({ value, text }) => (
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
            deleteMeasurement({ id: props.id });
          }}
          size="icon"
        >
          <DeleteIcon aria-label="Delete Ingredient" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
