'use client';

import React from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import { AboutPagePropsProps } from 'about-page';
import ImageContentSection from './ImageContentSection';
import MissionPurposeSection from './MissionPurposeSection';
import OurValuesSection from './OurValuesSection';
import PartnershipAdvantageSection from './PartnershipAdvantageSection';
import MobileHeader from '@/components/common/MobileHeader';

const AboutPage: React.FC<AboutPagePropsProps> = ({ aboutPage }) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const aboutPageHeading = aboutPage?.template?.aboutPage?.aboutPageHeading;
  const aboutPageSubHeading =
    aboutPage?.template?.aboutPage?.aboutPageSubHeading;
  const missionPurpose = aboutPage?.template?.aboutPage?.ourPurpose;
  const ourValues = aboutPage?.template?.aboutPage?.ourValues;
  const bigImage = aboutPage?.template?.aboutPage?.aboutPageBanner;
  const smallImage = aboutPage?.template?.aboutPage?.aboutPageBannerSmall;

  return (
    <>
      {isTablet && <MobileHeader title='About Us' />}
      <div className='mx-auto px-5 md:px-10 pt-5 pb-15'>
        <ImageContentSection
          aboutPageTitle={aboutPage?.title}
          aboutPageHeading={aboutPageHeading}
          aboutPageSubHeading={aboutPageSubHeading}
          smallImage={smallImage}
          bigImage={bigImage}
        />

        <MissionPurposeSection data={missionPurpose} />
        <OurValuesSection data={ourValues} />
        <PartnershipAdvantageSection
          data={aboutPage?.template?.aboutPage?.advantagesRepeater}
        />
      </div>
    </>
  );
};

export default AboutPage;
