import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';
import classNames from 'classnames';

export { Root } from '@radix-ui/react-select';

type TriggerProps = {
  align?: 'left' | 'right';
};

export const Trigger = React.forwardRef<
  React.ElementRef<'button'>,
  TriggerProps
>(({ align = 'left' }, forwardedRef) => (
  <SelectPrimitive.Trigger
    ref={forwardedRef}
    className="flex h-10 w-full items-center gap-1 outline-none"
  >
    <div
      className={classNames('flex-1', {
        'text-left': align === 'left',
        'text-right': align === 'right',
      })}
    >
      <SelectPrimitive.Value />
    </div>
    <SelectPrimitive.Icon className="flex-shrink">
      <ChevronDownIcon />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));

Trigger.displayName = 'Trigger';

type ContentProps = {
  children: React.ReactNode;
};

export function Content(props: ContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className="overflow-hidden rounded-sm bg-white drop-shadow-md">
        <SelectPrimitive.ScrollUpButton className="flex h-8 items-center justify-center">
          <ChevronUpIcon />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="p-2">
          {props.children}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex h-8 items-center justify-center">
          <ChevronDownIcon />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

type ItemProps = {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
};

export const Item = React.forwardRef<React.ElementRef<'div'>, ItemProps>(
  ({ value, children, disabled = false }, forwardedRef) => (
    <SelectPrimitive.Item
      value={value}
      ref={forwardedRef}
      className="relative flex h-8 select-none items-center pl-6 pr-2 data-[highlighted]:bg-slate-200 data-[disabled]:text-slate-400 data-[highlighted]:outline-none"
      disabled={disabled}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute left-0 inline-flex w-6 items-center justify-center">
        <CheckIcon />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  ),
);

Item.displayName = 'Item';

const Select = {
  Root: SelectPrimitive.Root,
  Trigger,
  Content,
  Item,
};

export default Select;
