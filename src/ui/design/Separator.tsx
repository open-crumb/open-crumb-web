import * as SeparatorPrimitive from '@radix-ui/react-separator';
import classNames from 'classnames';

export default function Separator(
  props: React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>,
) {
  return (
    <SeparatorPrimitive.Root
      {...props}
      className={classNames('h-[1px] w-full bg-slate-200', props.className)}
    />
  );
}
