'use client';

import React from 'react';
import { partnerWithUsChannels } from 'partner-page';
import CustomImage from '@/components/common/CustomImage';

const TravelPartnerSection: React.FC<partnerWithUsChannels> = ({
  partnerWithUsChannelLogo,
}) => {
  return (
    <>
      <CustomImage
        src={partnerWithUsChannelLogo || ''}
        alt={'logo'}
        width={120}
        height={100}
        className=''
      />
    </>
  );
};

export default TravelPartnerSection;
