'use client';

import LazyImage from '@/components/common/LazyImage';
import { MediaItemNode } from 'events-page';
import React from 'react';

const MediaSection: React.FC<MediaItemNode> = ({ mediaItemUrl }) => {
  return (
    <LazyImage
      src={mediaItemUrl || ''}
      alt={'gallery'}
      width={300}
      height={270}
      rootMargin='150px'
      className='object-cover w-full'
      skeletonClassName='w-full aspect-[300/270] bg-gray-200 animate-pulse'
    />
  );
};

export default MediaSection;
