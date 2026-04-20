import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterChipProps {
  label: string;
  count?: number;
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
  infoChip?: boolean;
}

const FilterChip: React.FC<FilterChipProps> = ({
  label,
  count,
  removable = false,
  onRemove,
  onClick,
  className,
  infoChip = false,
}) => {
  return (
    <Badge
      variant='secondary'
      className={cn(
        `flex items-center gap-2 px-3 pr-2 py-2 text-sm font-medium text-accent-red-950 bg-primary-50  transition-colors cursor-pointer rounded-3xl border border-primary-200!`,
        className
      )}
      onClick={onClick}
    >
      {count && (
        <span className='bg-primary-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold'>
          {count}
        </span>
      )}
      <span className='text-foreground'>{label}</span>

      {infoChip && <SlidersHorizontal className='h-6 w-6' />}

      {removable && (
        <Button
          variant='ghost'
          size='sm'
          className='h-6 w-6 p-0 rounded-full'
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
        >
          <X className='h-4 w-4 text-accent-red-900' />
        </Button>
      )}
    </Badge>
  );
};

export default FilterChip;
