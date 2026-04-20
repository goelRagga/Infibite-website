'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MobileSearchInputProps } from './MobileSearchInput.types';

export const MobileSearchInput = ({
  placeholder = 'Search for City, Villa, Location....',
  onClick,
  className,
}: MobileSearchInputProps) => {
  return (
    <div
      className={cn(
        'p-1 flex items-center shadow-lg bg-white/30 backdrop-blur-md border border-secondary-500 h-[58px] rounded-2xl w-full',
        className
      )}
      onClick={onClick}
    >
      <div className='flex-1 py-2 px-4'>
        <div className='flex items-center'>
          <Search className={'w-4 h-4 mr-2 text-secondary-300 '} />
          <span className={'text-sm text-white'}>{placeholder}</span>
        </div>
      </div>
    </div>
  );
};

export default MobileSearchInput;
