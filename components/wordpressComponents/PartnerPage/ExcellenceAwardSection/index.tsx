'use client';

import React from 'react';
import { ExcellenceAwardsRepeator } from 'partner-page';
import CustomImage from '@/components/common/CustomImage';

const ExcellenceAwardsSection: React.FC<ExcellenceAwardsRepeator> = ({
  excellenceAwardsImage,
}) => {
  return (
    <div>
      <div>
        <CustomImage
          src={excellenceAwardsImage || ''}
          alt={'logo'}
          width={100}
          height={100}
        />
      </div>
    </div>
  );
};

export default ExcellenceAwardsSection;
