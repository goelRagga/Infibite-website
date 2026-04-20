'use client';

import React from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import { ContactAddressSectionProps } from 'contact-page';

const ContactAddressSection: React.FC<ContactAddressSectionProps> = ({
  officeAddressTitle,
  officeAddress,
}) => {
  const isMobile = useIsMobile();

  const findUs = 'Find Us Here';
  const description =
    'Here’s where all the magic happens. You’re welcome to visit!';

  return (
    <>
      <div>
        {!isMobile && (
          <>
            <h2 className='text-2xl font-serif text-foreground'>{findUs}</h2>
            <p className='text-secondary-700 text-base mb-1.5'>{description}</p>
          </>
        )}

        <div className='mt-0 md:mt-5'>
          <h5 className='text-base text-foreground font-semibold mb-1.5'>
            {officeAddressTitle || 'ELIVAAS Corporate Address'}
          </h5>
          <div
            className='text-primary-500 text-sm md:text-base mb-1.5'
            dangerouslySetInnerHTML={{ __html: officeAddress || '' }}
          />
        </div>
      </div>
    </>
  );
};

export default ContactAddressSection;
