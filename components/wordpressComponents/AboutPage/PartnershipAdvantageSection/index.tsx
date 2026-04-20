'use client';

import React from 'react';
import { PartnershipAdvantageSectionProps } from 'partnership-advantage-section';
import PartnershipAdvantageCard from './PartnershipAdvantageCard';

const PartnershipAdvantageSection: React.FC<
  PartnershipAdvantageSectionProps
> = ({ className, data }) => {
  return (
    <div className='mt-15 flex flex-col gap-4 md:gap-6'>
      {data?.map((item: any, index: number) => (
        <PartnershipAdvantageCard
          key={index}
          title={item?.title}
          content={item?.content}
          imgSrc={item?.sideImage || ''}
          reverse={index % 2 === 1}
          className={className}
        />
      ))}
    </div>
  );
};

export default PartnershipAdvantageSection;
