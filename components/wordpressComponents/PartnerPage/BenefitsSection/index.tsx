'use client';

import React from 'react';
import Svg from '@/components/common/Shared/Svg';
import { partnerWithUsCardsRepeater } from 'partner-page';
import CustomImage from '@/components/common/CustomImage';
import Image from 'next/image';

const BenefitsSection: React.FC<partnerWithUsCardsRepeater> = ({
  cardIcon,
  cardTitle,
  cardTitleCopy,
  width = 34,
  height = 34,
}) => {
  return (
    <div className='text-center'>
      <div className='flex justify-center items-center'>
        <div>
          <Image
            src={cardIcon || ''}
            width={width}
            height={height}
            alt={cardTitle || ''}
          />
        </div>
      </div>
      <h5 className='text-foreground md:font-serif text-base font-semibold md:font-normal md:text-xl mt-2 mb-1.5'>
        {cardTitle}
      </h5>
      <p className='text-primary-500 text-sm'>{cardTitleCopy}</p>
    </div>
  );
};

export default BenefitsSection;
