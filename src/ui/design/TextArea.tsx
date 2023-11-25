import React, { ChangeEvent } from 'react';
import classNames from 'classnames';

type Props = {
  value: string;
  onChange: (value: string, event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  name?: string;
  id?: string;
  'aria-label'?: string;
  rows?: number;
};

export const TextArea = React.forwardRef<React.ElementRef<'textarea'>, Props>(
  ({ onChange, rows = 2, ...props }, forwardedRef) => (
    <textarea
      className={classNames('block', 'w-full', 'outline-none', 'py-2')}
      onChange={(event) => onChange(event.target.value, event)}
      ref={forwardedRef}
      rows={rows}
      {...props}
    />
  ),
);

TextArea.displayName = 'TextArea';

export default TextArea;
