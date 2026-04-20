'use client';
import { cn } from '@/lib/utils';
import React, { useRef } from 'react';
import { ScrollDataProps } from 'scroll-data';

const ScrollData: React.FC<ScrollDataProps> = ({
  children,
  className = '',
  itemClassName = '',
  gap = 'gap-6',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={`flex overflow-x-auto scrollbar-hide ${gap} ${className} w-[108%] sm:w-full pt-0 px-0 mb-0 -ml-5 pl-5 sm:pl-0 sm:ml-0`}
      style={{
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={cn(
            `flex-shrink-0 ${itemClassName}`,
            index === 0 && 'pl-5 sm:pl-0'
          )}
          style={{ scrollSnapAlign: 'start' }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default ScrollData;
