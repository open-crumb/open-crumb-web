/**
 * @see https://ui.shadcn.com/docs/components/textarea
 */
import React from 'react';

import { cn } from '@/lib/shadcn';

export type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange'
> & {
  onChange: (
    value: string,
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onChange, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'block min-h-[80px] w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        onChange={(event) => onChange(event.target.value, event)}
        ref={ref}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
