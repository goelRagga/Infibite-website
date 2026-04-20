'use client';

import React from 'react';
import CustomImage from '@/components/common/CustomImage';

const BannerSection: React.FC<{}> = ({}) => {
  return (
    <div>
      <div>
        <CustomImage
          src={`${process.env.IMAGE_DOMAIN}/partner_Bg_1cf106270b.jpg`}
          alt={'banner'}
          width={100}
          height={100}
        />
      </div>
    </div>
  );
};

export default BannerSection;
