import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import React from 'react';

export function Root(
  props: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root>,
) {
  return <DropdownMenuPrimitive.Root {...props} />;
}

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

export function Portal(
  props: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Portal>,
) {
  return <DropdownMenuPrimitive.Portal {...props} />;
}

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

export function Arrow(
  props: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Arrow>,
) {
  return <DropdownMenuPrimitive.Arrow {...props} />;
}

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

export function Group(
  props: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group>,
) {
  return <DropdownMenuPrimitive.Group {...props} />;
}

export function Label(
  props: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>,
) {
  return <DropdownMenuPrimitive.Label {...props} />;
}

export function CheckboxItem(
  props: React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.CheckboxItem
  >,
) {
  return <DropdownMenuPrimitive.CheckboxItem {...props} />;
}

export function RadioGroup(
  props: React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.RadioGroup
  >,
) {
  return <DropdownMenuPrimitive.RadioGroup {...props} />;
}

export function RadioItem(
  props: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>,
) {
  return <DropdownMenuPrimitive.RadioItem {...props} />;
}

export function ItemIndicator(
  props: React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.ItemIndicator
  >,
) {
  return <DropdownMenuPrimitive.ItemIndicator {...props} />;
}

export function Separator(
  props: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>,
) {
  return <DropdownMenuPrimitive.Separator {...props} />;
}

export function Sub(
  props: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Sub>,
) {
  return <DropdownMenuPrimitive.Sub {...props} />;
}

export function SubTrigger(
  props: React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.SubTrigger
  >,
) {
  return <DropdownMenuPrimitive.SubTrigger {...props} />;
}

export function SubContent(
  props: React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.SubContent
  >,
) {
  return <DropdownMenuPrimitive.SubContent {...props} />;
}

const DropdownMenu = {
  Root,
  Trigger,
  Portal,
  Content,
  Arrow,
  Item,
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
};

export default DropdownMenu;
