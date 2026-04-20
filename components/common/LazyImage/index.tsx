'use client';

import CustomImage, { CustomImageProps } from '@/components/common/CustomImage';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import React from 'react';

interface LazyImageProps extends CustomImageProps {
  rootMargin?: string;
  threshold?: number;
  skeleton?: React.ReactNode;
  skeletonClassName?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  rootMargin = '100px',
  threshold = 0.1,
  skeleton,
  skeletonClassName = 'bg-gray-200 animate-pulse',
  ...imageProps
}) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  const defaultSkeleton = (
    <div
      className={`w-full h-full ${skeletonClassName}`}
      style={{
        aspectRatio:
          imageProps.width && imageProps.height
            ? `${imageProps.width} / ${imageProps.height}`
            : undefined,
      }}
    />
  );

  return (
    <div
      ref={ref}
      className={imageProps.outFixClass || 'relative w-full h-full'}
    >
      {isIntersecting ? (
        <CustomImage {...imageProps} priority={false} />
      ) : (
        skeleton || defaultSkeleton
      )}
    </div>
  );
};

export default LazyImage;
