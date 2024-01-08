import { cn } from '@/lib/shadcn';

type Props = {
  level?: '1' | '2' | '3' | '4' | '5' | '6';
  children: React.ReactNode;
  className?: string;
};

export default function Heading({ level = '1', children, className }: Props) {
  const Element = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return (
    <Element
      className={cn(
        'font-semibold',
        {
          'text-3xl': Element === 'h1',
          'text-2xl': Element === 'h2',
          'text-xl': Element === 'h3',
          'text-lg': Element === 'h4',
          'text-sm': Element === 'h6',
        },
        className,
      )}
    >
      {children}
    </Element>
  );
}
