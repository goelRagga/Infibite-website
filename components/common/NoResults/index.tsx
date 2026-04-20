import NoResultsIcon from '@/assets/noResults.svg';
import { cn } from '@/lib/utils';
import React from 'react';

interface NoResultsProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  minHeight?: string;
}

function NoResults({
  title = 'No results found',
  description = 'No data available at the moment.',
  icon,
  className,
  minHeight = 'min-h-[60dvh]',
}: NoResultsProps) {
  return (
    <div
      className={cn(
        'col-span-full flex flex-col justify-center items-center text-center px-4',
        minHeight,
        className
      )}
    >
      {icon || <NoResultsIcon />}
      <h2 className='text-2xl md:text-4xl font-serif font-semibold mt-4'>
        {title}
      </h2>
      <p className='text-xs md:text-base mt-2'>{description}</p>
    </div>
  );
}

export default NoResults;
