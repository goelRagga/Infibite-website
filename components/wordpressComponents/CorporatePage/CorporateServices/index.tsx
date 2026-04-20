'use client';

import React from 'react';
import { corporateServicesProps } from 'corporate-page';
import Svg from '@/components/common/Shared/Svg';

const CorporateServices: React.FC<corporateServicesProps> = ({
  corporateServiceLogo,
  corporateServiceName,
}) => {
  return (
    <div className='text-center flex justify-center items-center flex-col w-1/2 '>
      <Svg src={corporateServiceLogo} width='45' height='45' />
      <p className='text-center text-xs md:text-lg pt-4'>
        {corporateServiceName}
      </p>
    </div>
  );
};

export default CorporateServices;
