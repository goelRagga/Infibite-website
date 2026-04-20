'use client';

import React from 'react';
import Svg from '@/components/common/Shared/Svg';

interface EventBenefitsRepeater {
  cardIcon?: string;
  cardTitle?: string;
  cardTitleCopy?: string;
}

const BenefitsSection: React.FC<EventBenefitsRepeater> = ({
  cardIcon,
  cardTitle,
  cardTitleCopy,
}) => {
  return (
    <div className='text-center'>
      <div className='flex justify-center items-center'>
        <Svg src={cardIcon} width='42' height='42' />
      </div>
      <h5 className='text-foreground md:font-serif text-base font-semibold md:font-normal md:text-xl mt-2 mb-1.5'>
        {cardTitle}
      </h5>
      <p className='text-primary-500 text-sm'>{cardTitleCopy}</p>
    </div>
  );
};

export default BenefitsSection;
