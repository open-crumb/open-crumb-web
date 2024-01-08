/**
 * Shadcn `Input` component modified to format adjacent slots.
 *
 * @see https://ui.shadcn.com/docs/components/input
 * @see https://www.radix-ui.com/themes/docs/components/text-field
 */
import React from 'react';
import { cn } from '@/lib/shadcn';

type InputContainerProps = {
  children: React.ReactNode;
};

export function InputContainer({ children }: InputContainerProps) {
  return <div className={cn('flex items-center gap-1')}>{children}</div>;
}

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  onChange: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  variant?: 'normal' | 'title';
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onChange, variant = 'normal', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'block h-10 w-full bg-transparent outline-none file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          {
            'text-sm': variant === 'normal',
            'text-lg': variant === 'title',
            'font-medium': variant === 'title',
          },
          className,
        )}
        onChange={(event) => onChange(event.target.value, event)}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export { Input };

type InputSlotProps = {
  children: React.ReactNode;
};

export function InputSlot({ children }: InputSlotProps) {
  return <div className="text-muted-foreground">{children}</div>;
}
