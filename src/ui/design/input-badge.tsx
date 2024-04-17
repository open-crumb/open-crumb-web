/**
 * Custom badge with an input.
 */
import { ChangeEvent } from 'react';

type InputBadgeProps = {
  value: string;
  onChange: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
};

export function InputBadge(props: InputBadgeProps) {
  return (
    <label className="inline-flex w-min items-center rounded-md border border-slate-200">
      <span className="rounded-l-md py-1 pl-4 pr-1 text-sm text-muted-foreground">
        Hydration:
      </span>
      <input
        type="number"
        className="w-10 bg-transparent py-1 text-right text-sm outline-none"
        value={props.value}
        onChange={(event) => props.onChange(event.target.value, event)}
      />
      <span className="pl-1 pr-4 text-sm text-muted-foreground">%</span>
    </label>
  );
}
