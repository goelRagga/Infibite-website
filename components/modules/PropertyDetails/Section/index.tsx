import React from 'react';
import { Button, Card } from '@/components/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CarouselSectionWrapperProps } from './SectionTypes';

export const SectionTemplate = ({
  heading,
  description,
  children,
  id,
  showDefaultArrows = false,
  justifyContent = 'justify-between',
  onPrev,
  onNext,
  className,
  onClick,
}: CarouselSectionWrapperProps) => {
  return (
    <Card
      className={`relative border-none shadow-none m-3 p-4 xl:my-6 xl:mx-0 sm:m-10 xl:p-4 mb-6 dark:bg-[var(--prive-background)] ${className || ''}`}
      id={id}
      onClick={onClick}
    >
      {(heading || description) && (
        <div className={`flex items-center ${justifyContent} mb-0`}>
          <div className='flex flex-col gap-1 text-card-foreground'>
            {heading && (
              <h3 className='text-xl sm:text-2xl font-serif'>{heading}</h3>
            )}
            {description && (
              <h5 className='text-sm md:text-base'>{description}</h5>
            )}
          </div>
        </div>
      )}
      {children}
    </Card>
  );
};
