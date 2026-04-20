'use client';

import React from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import CustomImage from '@/components/common/CustomImage';
import EYFormSection from './EYFormSection';
import Link from 'next/link';
import MobileHeader from '@/components/common/MobileHeader';

interface EyPageDetailProps {
  className?: string;
  logo?: string;
  regexpage?: 'ey' | 'burnsmcd' | 'tbo';
  mobileNumber?: string;
}

const EyPageDetail: React.FC<EyPageDetailProps> = ({
  className,
  logo,
  regexpage,
  mobileNumber,
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  localStorage.setItem('loyaltyModalFirstScreen', 'true');
  const featureStats = [
    { number: '24X7', label: '7-star service' },
    { number: '30,000+', label: '5-star reviews' },
    { number: '650+', label: 'Portfolio properties' },
    { number: '3 lacs+', label: 'Delighted guests' },
  ];

  const description = 'By signing up you agree to our';
  const tAndC = 'Terms & Conditions';
  const PrivacyTitle = 'Privacy Policy';

  return (
    <>
      {isTablet && (
        <MobileHeader
          title={
            regexpage == 'burnsmcd'
              ? 'Elivaas x BurnsMcD'
              : regexpage == 'tbo'
                ? 'Elivaas x TBO'
                : 'EY'
          }
        />
      )}
      <div className='flex flex-col md:flex-row'>
        <div className='w-full md:w-1/2 relative sm:h-[91vh]'>
          <CustomImage
            src={
              regexpage == 'burnsmcd'
                ? isMobile
                  ? `${process.env.IMAGE_DOMAIN}/4689_FA_3_F_AD_95_4_ADF_B363_3_E1284_C12_C37_ad782b44e5.png`
                  : `${process.env.IMAGE_DOMAIN}/Banner_jpg_bd70abd06b.jpeg`
                : regexpage == 'tbo'
                  ? `https://d31za8na64dkj7.cloudfront.net/Corporate_banner_tbo_687f68b233.jpg`
                  : `${process.env.IMAGE_DOMAIN}/Rectangle_46_1_210de905fd.jpg`
            }
            alt='image'
            width={isMobile ? 600 : 1100}
            height={isMobile ? 200 : isTablet ? 400 : 1100}
            quality={90}
            className='w-full h-[270px] md:h-full object-cover'
          />

          {!isTablet && (
            <div className='absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-xs shadow-[0px_0px_37.7px_0px_rgba(68,65,65,0.25)] z-10'>
              <div className='grid grid-cols-4 divide-x divide-gray-600'>
                {featureStats.map((feature, index) => (
                  <div key={index} className='p-4 pl-5'>
                    <h3 className='text-white font-serif text-2xl'>
                      {feature.number}
                    </h3>
                    <p className='text-gray-400 text-sm'>{feature.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className={`w-full md:w-1/2 px-5 md:px-24 py-4 md:py-10 ${className}`}
        >
          <EYFormSection
            logo={logo}
            regexpage={regexpage}
            svgClassName={regexpage == 'burnsmcd' ? '' : 'h-12'}
          />
          {mobileNumber && (
            <div className='block py-5'>
              <p className='text-black text-center text-sm'>
                {' '}
                Call to Book{' '}
                <span className='text-accent-red-900'>
                  <Link
                    href={`tel:${mobileNumber}`}
                    className='text-accent-red-900'
                  >
                    {mobileNumber}
                  </Link>
                </span>
              </p>
            </div>
          )}
          <p className='text-xs text-foreground mt-5 md:absolute bottom-8 sm:right-10 sm:relative '>
            {description}{' '}
            <Link
              href={'/explore/terms-and-conditions/'}
              className='text-accent-red-900'
            >
              {tAndC}
            </Link>{' '}
            and{' '}
            <Link
              href={'/explore/privacy-policy'}
              className='text-accent-red-900'
            >
              {PrivacyTitle}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default EyPageDetail;
