'use client';

import LazyImage from '@/components/common/LazyImage';
import { EventsPage } from 'events-page';
import React from 'react';

const BannerSection: React.FC<EventsPage> = ({
  eventsBanner,
  eventsHeading,
}) => {
  return (
    <div className={`relative w-full h-[400px] md:h-[450px] `}>
      <LazyImage
        src={eventsBanner || ''}
        alt={eventsHeading || ''}
        fill
        rootMargin='100px'
        className='object-cover w-full h-full'
        skeletonClassName='w-full h-full bg-gray-200 animate-pulse'
      />
      <div className='absolute inset-0 bg-black/50 z-0' />
      <div className='absolute top-1/2 left-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2 p-0 md:p-10 text-center'>
        <h1 className='text-white text-xl md:text-4xl md:leading-10 font-serif mb-4'>
          {eventsHeading}
        </h1>
      </div>
    </div>
  );
};

export default BannerSection;
