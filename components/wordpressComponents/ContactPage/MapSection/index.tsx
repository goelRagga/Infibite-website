'use client';

import React from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import { MapSectionProps } from 'contact-page';

const MapSection: React.FC<MapSectionProps> = ({ addressMapLink }) => {
  const isMobile = useIsMobile();

  if (!addressMapLink) {
    return (
      <div className='w-full h-[440px] rounded-2xl overflow-hidden bg-gray-200 flex items-center justify-center'>
        <p className='text-gray-600'>No Map Available</p>
      </div>
    );
  }

  return (
    <div className='w-full h-[440px] rounded-2xl overflow-hidden'>
      <div
        className='w-full h-full'
        dangerouslySetInnerHTML={{ __html: addressMapLink }}
      />
    </div>
  );
};

export default MapSection;
