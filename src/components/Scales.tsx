import { cn } from '@/lib/utils';

export interface ScalesProps {
  orientation?: 'horizontal' | 'vertical' | 'diagonal';
  size?: number;
  className?: string;
  color?: string;
}

export const Scales = ({
  orientation = 'diagonal',
  size = 10,
  className,
  color,
}: ScalesProps) => {
  const angleMap: Record<string, string> = {
    horizontal: '0deg',
    vertical: '90deg',
    diagonal: '315deg',
  };

  return (
    <div
      className={cn(
        'absolute inset-0 h-full w-full overflow-hidden',
        '[--pattern-scales:var(--color-neutral-950)]/10',
        'dark:[--pattern-scales:var(--color-white)]/10',
        className,
      )}
      style={
        {
          '--scales-size': `${size}px`,
          '--scales-angle': angleMap[orientation] || '315deg',
          ...(color && { '--pattern-scales': color }),
        } as React.CSSProperties
      }
    >
      <div
        className="h-full w-full bg-[repeating-linear-gradient(var(--scales-angle),var(--pattern-scales)_0,var(--pattern-scales)_1px,transparent_0,transparent_50%)]"
        style={{
          backgroundSize: `var(--scales-size) var(--scales-size)`,
        }}
      />
    </div>
  );
};
