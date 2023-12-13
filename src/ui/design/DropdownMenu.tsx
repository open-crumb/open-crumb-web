'use client';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import React from 'react';

export {
  Root,
  Portal,
  Arrow,
  Group,
  Label,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  ItemIndicator,
  Separator,
  Sub,
  SubTrigger,
  SubContent,
} from '@radix-ui/react-dropdown-menu';

export const Trigger = React.forwardRef<
  React.ElementRef<'button'>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.Trigger
    ref={forwardedRef}
    {...props}
    className="rounded-xs -mx-2 inline-flex h-10 items-center rounded-sm px-2 text-slate-600 outline-none hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-200"
  />
));

Trigger.displayName = 'Trigger';

export const Content = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>((props, forwardedRef) => (
  <DropdownMenuPrimitive.Content
    ref={forwardedRef}
    {...props}
    className="rounded-sm bg-white py-2 drop-shadow-md"
  />
));

Content.displayName = 'Content';

export function Item(
  props: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>,
) {
  return (
    <DropdownMenuPrimitive.Item
      {...props}
      className="px-4 py-2 text-slate-700 outline-none hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-200"
    />
  );
}

const DropdownMenu = {
  Root: DropdownMenuPrimitive.Root,
  Trigger,
  Content,
  Item,
  Portal: DropdownMenuPrimitive.Portal,
  Arrow: DropdownMenuPrimitive.Arrow,
  Group: DropdownMenuPrimitive.Group,
  Label: DropdownMenuPrimitive.Label,
  CheckboxItem: DropdownMenuPrimitive.CheckboxItem,
  RadioGroup: DropdownMenuPrimitive.RadioGroup,
  RadioItem: DropdownMenuPrimitive.RadioItem,
  ItemIndicator: DropdownMenuPrimitive.ItemIndicator,
  Separator: DropdownMenuPrimitive.Separator,
  Sub: DropdownMenuPrimitive.Sub,
  SubTrigger: DropdownMenuPrimitive.SubTrigger,
  SubContent: DropdownMenuPrimitive.SubContent,
};

export default DropdownMenu;
