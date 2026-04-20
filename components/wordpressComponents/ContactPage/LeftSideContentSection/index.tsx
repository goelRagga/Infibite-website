'use client';

import React from 'react';
import Link from 'next/link';
import { LeftSideContentSectionProps } from 'contact-page';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import Svg from '@/components/common/Shared/Svg';

const ContactLink: React.FC<{
  href: string;
  iconSrc?: string;
  label?: string;
  isTablet?: boolean;
  fullWidth?: boolean;
  className?: string;
}> = ({ href, iconSrc, label, isTablet, fullWidth = false, className }) => (
  <Link
    href={href}
    className={`text-accent-red-900 text-xs md:text-base flex flex-col items-center lg:items-start gap-3 px-4 lg:p-0 py-4 w-full lg:w-auto border border-primary-100 lg:border-0 rounded-2xl ${
      fullWidth ? 'w-full' : 'w-1/2'
    }`}
    style={
      isTablet
        ? {
            background: 'var(--white3)',
          }
        : undefined
    }
  >
    {isTablet && (
      <Svg src={iconSrc} className='w-5 h-5' width='21' height='22' />
    )}
    <span>{label}</span>
  </Link>
);

const LeftSideContentSection: React.FC<LeftSideContentSectionProps> = ({
  contactPageHeading,
  contactPageSubHeading,
  customerSupportTitle,
  customerSupportDescription,
  customerSupportEmailAddress,
  customerSupportPhoneNumber,
  mediaEnquiriesTitle,
  mediaEnquiriesDescription,
  mediaEnquiriesEmailAddress = 'marketing@elivaas.com',
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const callIcon = `${process.env.IMAGE_DOMAIN}/call_1e2776a1be.svg`;
  const mailIcon = `${process.env.IMAGE_DOMAIN}/mail_73841de452.svg`;

  return (
    <div className=''>
      {!isTablet && (
        <>
          <h1 className='text-3xl font-serif text-foreground mb-1.5'>
            {contactPageHeading}
          </h1>
          <p className='text-secondary-700 text-base'>
            {contactPageSubHeading}
          </p>
        </>
      )}

      <div className='mt-0 md:mt-10'>
        <h5 className='text-base text-foreground font-semibold mb-1.5'>
          {customerSupportTitle}
        </h5>
        <p className='text-secondary-700 text-sm md:text-base mb-1.5'>
          {customerSupportDescription}
        </p>

        <div className='flex flex-row lg:flex-col lg:justify-between gap-2 lg:gap-0 mt-3'>
          <ContactLink
            href={`tel:${customerSupportPhoneNumber}`}
            iconSrc={callIcon}
            label={`${customerSupportPhoneNumber}`}
            isTablet={isTablet}
            className='w-full lg:p-0'
          />
          <ContactLink
            href={`mailto:${customerSupportEmailAddress}`}
            iconSrc={mailIcon}
            label={customerSupportEmailAddress}
            isTablet={isTablet}
            className='w-full lg:p-0'
          />
        </div>
      </div>

      <div className='mt-5'>
        <h5 className='text-base text-foreground font-semibold mb-1.5'>
          {mediaEnquiriesTitle}
        </h5>
        <p className='text-secondary-700 text-sm md:text-base mb-3 md:mb-1.5'>
          {mediaEnquiriesDescription}
        </p>

        <ContactLink
          href={`mailto:${mediaEnquiriesEmailAddress}`}
          iconSrc={mailIcon}
          label={mediaEnquiriesEmailAddress}
          isTablet={isTablet}
          fullWidth
        />
      </div>
    </div>
  );
};

export default LeftSideContentSection;
