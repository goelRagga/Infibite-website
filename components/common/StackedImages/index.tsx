import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import React from 'react';

interface StackedImagesProps {
  max: number;
  items: {
    image: string;
    fallback: string;
  }[];
  className?: string;
  maxString?: string;
  size?: 'sm' | 'md' | 'lg';
}

function StackedImages({
  max,
  items,
  className,
  maxString,
  size = 'sm',
}: StackedImagesProps) {
  const sizeClass = {
    sm: 'w-16 h-8',
    md: 'w-20 h-10',
    lg: 'w-24 h-12',
  };

  const textSizeClass = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const spanTextSizeClass = {
    sm: 'text-[10px]',
    md: 'text-[12px]',
    lg: 'text-[14px]',
  };

  const spaceClass = {
    sm: '-space-x-12',
    md: '-space-x-16',
    lg: '-space-x-20',
  };

  const remainingItems = items?.length - max;

  return (
    <div
      className={cn(
        '*:data-[slot=avatar]:ring-background flex *:data-[slot=avatar]:ring-2',
        spaceClass[size],
        className
      )}
    >
      {items
        ?.slice(0, items?.length > max ? max - 1 : max)
        .map(({ image, fallback }, index) => (
          <Avatar key={index} className={cn('rounded-md', sizeClass[size])}>
            <AvatarImage
              src={image}
              alt={`Image ${index + 1}`}
              className='brightness-50'
            />
            <AvatarFallback>{fallback || ''}</AvatarFallback>
          </Avatar>
        ))}

      {items?.length > max && (
        <Avatar className={cn('rounded-md relative', sizeClass[size])}>
          <AvatarImage
            src={items[max - 1].image}
            alt={`Image ${max}`}
            className='brightness-50'
          />
          <AvatarFallback>{items[max - 1].fallback || ''}</AvatarFallback>
          {remainingItems > 0 && (
            <p
              className={cn(
                'font-medium text-center text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap',
                textSizeClass[size]
              )}
            >
              +{remainingItems}{' '}
              <span className={cn('font-normal', spanTextSizeClass[size])}>
                {maxString || ''}
              </span>
            </p>
          )}
        </Avatar>
      )}
    </div>
  );
}

export default StackedImages;
