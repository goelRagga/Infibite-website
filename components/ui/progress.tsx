'use client';

import { cn } from '@/lib/utils';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  indicatorStyle?: React.CSSProperties;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, indicatorStyle, ...props }, ref) => {
    return (
      <ProgressPrimitive.Root
        ref={ref}
        data-slot='progress'
        className={cn(
          'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot='progress-indicator'
          className='h-full w-full flex-1 transition-all rounded-full'
          style={{
            transform: `translateX(-${100 - (value || 0)}%)`,
            ...indicatorStyle,
          }}
        />
      </ProgressPrimitive.Root>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };
