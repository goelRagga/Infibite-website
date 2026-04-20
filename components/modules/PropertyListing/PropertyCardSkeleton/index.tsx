import { Skeleton } from '@/components/ui';
import useIsMobile from '@/hooks/useIsMobile';
import { cn } from '@/lib/utils';
import { motion, easeInOut, easeOut } from 'framer-motion';
import React, { memo } from 'react';

const PropertyCardSkeleton = memo(
  ({ gridLayout }: { gridLayout: '2x2' | '3x3' }) => {
    const isMobile = useIsMobile();
    const cards = isMobile ? 1 : 3;

    // Animation variants for staggered skeleton cards
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1,
        },
      },
      exit: {
        opacity: 0,
        transition: {
          duration: 0.3,
          ease: easeInOut,
        },
      },
    };

    const cardVariants = {
      hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.5,
          ease: easeOut,
        },
      },
      exit: {
        opacity: 0,
        y: -10,
        scale: 0.95,
        transition: {
          duration: 0.3,
          ease: easeInOut,
        },
      },
    };

    return (
      <motion.div
        className={cn(
          'grid gap-6 px-2 lg:px-8 xl:px-0',
          gridLayout === '2x2'
            ? 'lg:grid-cols-2 lg:px-8 xl:px-0'
            : 'lg:grid-cols-3 lg:px-8 xl:px-0',
          'grid-cols-1 sm:grid-cols-2 lg:px-8 xl:px-0'
        )}
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        exit='exit'
      >
        {Array(cards)
          .fill(0)
          .map((_, index) => (
            <motion.div
              key={index}
              className='rounded-2xl border bg-card border-none p-3 space-y-3'
              variants={cardVariants}
            >
              {/* Image skeleton */}
              <Skeleton className='rounded-xl h-[260px] w-full' />

              {/* Title and location */}
              <div className='space-y-2 px-1'>
                <Skeleton className='h-5 w-2/3' />
                <Skeleton className='h-4 w-1/2' />
              </div>

              {/* Specs (guests, bedrooms, etc.) */}
              <div className='flex gap-2 px-1'>
                <Skeleton className='h-3 w-1/4' />
                <Skeleton className='h-3 w-1/4' />
                <Skeleton className='h-3 w-1/4' />
              </div>

              {/* Features */}
              <div className='flex gap-2 mt-2 px-1'>
                <Skeleton className='h-6 w-[100px] rounded-full' />
                <Skeleton className='h-6 w-[100px] rounded-full' />
                <Skeleton className='h-6 w-[100px] rounded-full' />
              </div>

              {/* Price */}
              <div className='mt-7 px-1'>
                <Skeleton className='h-4 w-[120px]' />
              </div>
            </motion.div>
          ))}
      </motion.div>
    );
  }
);

PropertyCardSkeleton.displayName = 'PropertyCardSkeleton';

export default PropertyCardSkeleton;
