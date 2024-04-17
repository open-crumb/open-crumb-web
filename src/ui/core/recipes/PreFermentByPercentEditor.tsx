import { Button } from '@/ui/design/button';
import { Input, InputContainer, InputSlot } from '@/ui/design/input';
import { InputBadge } from '@/ui/design/input-badge';

type Props = {
  name: string;
  onNameChange: (name: string) => void;
  percent: string;
  onPercentChange: (percent: string) => void;
  hydrationPercent: string;
  onHydrationPercentChange: (hydrationPercent: string) => void;
  onDelete: () => void;
};

export default function PreFermentByPercentEditor(props: Props) {
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
          <InputContainer>
            <Input
              type="number"
              value={props.percent}
              onChange={props.onPercentChange}
              min="0"
              className="text-right"
            />
            <InputSlot>
              <span className="whitespace-nowrap">%</span>
            </InputSlot>
          </InputContainer>
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
