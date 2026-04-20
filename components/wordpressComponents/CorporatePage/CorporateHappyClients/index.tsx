'use client';

import React from 'react';
import { CorporateHappyClientsProps } from 'corporate-page';
import CustomImage from '@/components/common/CustomImage';

const CorporateHappyClients: React.FC<CorporateHappyClientsProps> = ({
  corporateCliientLogo,
}) => {
  return (
    <div className='text-center flex justify-center items-center flex-col'>
      <CustomImage
        src={corporateCliientLogo || ''}
        alt=''
        width='150'
        height='60'
      />
    </div>
  );
};

export default CorporateHappyClients;
