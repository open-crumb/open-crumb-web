import React, { ChangeEvent } from 'react';
import classNames from 'classnames';

type RootProps = {
  children: React.ReactNode;
};

export function Root({ children }: RootProps) {
  return <div className="flex items-center gap-1">{children}</div>;
}

type SlotProps = {
  children: React.ReactNode;
};

export function Slot({ children }: SlotProps) {
  return <div className="text-gray-500">{children}</div>;
}

type InputProps = {
  type?: 'text' | 'number';
  value: string;
  onChange: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  align?: 'left' | 'right';
  placeholder?: string;
  name?: string;
  min?: string;
  max?: string;
  id?: string;
  'aria-label'?: string;
  variant?: 'normal' | 'title';
};

export const Input = React.forwardRef<React.ElementRef<'input'>, InputProps>(
  (
    { type = 'text', onChange, align = 'left', variant = 'normal', ...props },
    forwardedRef,
  ) => (
    <input
      className={classNames('block', 'w-full', 'outline-none', 'h-10', {
        'text-right': align === 'right',
        'font-semibold': variant === 'title',
        'text-lg': variant === 'title',
      })}
      type={type}
      onChange={(event) => onChange(event.target.value, event)}
      ref={forwardedRef}
      {...props}
    />
  ),
);

Input.displayName = 'Input';

const TextField = { Root, Slot, Input };

export default TextField;
