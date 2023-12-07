import React from 'react';

type Props = {
  onClick?: () => void;
  children?: React.ReactNode;
  'aria-label'?: string;
  type?: 'submit';
};

const Button = React.forwardRef<React.ElementRef<'button'>, Props>(
  (props, forwardedRef) => (
    <button
      className="rounded-xs -mx-2 inline-flex h-10 items-center rounded-sm px-2 text-slate-600 outline-none hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-200"
      ref={forwardedRef}
      {...props}
    />
  ),
);

Button.displayName = 'Button';

export default Button;
