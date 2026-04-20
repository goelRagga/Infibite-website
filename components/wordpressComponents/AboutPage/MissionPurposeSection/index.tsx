'use client';

import React from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import { MissionPurposeSectionProps } from 'mission-purpose-section';

const MissionPurposeSection: React.FC<MissionPurposeSectionProps> = ({
  className,
  data,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className='mt-12 md:mt-30 flex flex-col md:flex-row gap-6'>
      {data?.map((item: any, index: number) => (
        <div className='w-full md:w-1/2' key={index}>
          <div
            className={`bg-card rounded-2xl p-6 sm:h-[230px] lg:h-auto ${className}`}
          >
            <h4 className='text-xl font-serif text-foreground mb-1'>
              {item?.ourPurposeTitle}
            </h4>
            <p className='text-xs md:text-sm text-foreground'>
              {item?.ourPurposeContent}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MissionPurposeSection;
