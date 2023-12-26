import { MEASUREMENT_UNITS } from '@/lib/units';
import {
  useLogbookActions,
  useLogbookMeasurement,
} from '@/ui/core/logbook/LogbookContext';
import Button from '@/ui/design/Button';
import Select from '@/ui/design/Select';
import TextField from '@/ui/design/TextField';
import { Cross1Icon } from '@radix-ui/react-icons';

type Props = {
  id: string;
};

export default function LogbookMeasurement(props: Props) {
  const ingredient = useLogbookMeasurement(props.id);
  const { setMeasurement, deleteMeasurement } = useLogbookActions();

  return (
    <div className="flex items-center gap-2">
      <div className="flex-[4]">
        <TextField.Input
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
        <TextField.Input
          type="number"
          value={ingredient.entity.value}
          onChange={(value) => {
            setMeasurement({
              id: props.id,
              value,
            });
          }}
          placeholder="80"
          align="right"
        />
      </div>
      <div className="flex-[1]">
        <Select.Root
          value={ingredient.entity.unit}
          onValueChange={(unit) => {
            setMeasurement({
              id: props.id,
              unit,
            });
          }}
        >
          <Select.Trigger />
          <Select.Content>
            {MEASUREMENT_UNITS.map(({ value, text }) => (
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
            deleteMeasurement({ id: props.id });
          }}
        >
          <Cross1Icon aria-label="Delete Ingredient" />
        </Button>
      </div>
    </div>
  );
}
