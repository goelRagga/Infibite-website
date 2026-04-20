'use client';

import React from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import BannerSection from './BannerSection';
import { PartnerPageProps } from 'partner-page';
import MobileHeader from '@/components/common/MobileHeader';
import MediaSection from './MediaSection';
import OurValuesSection from './ValuesSection';

const EventsPageDetail: React.FC<PartnerPageProps> = ({ template }) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const galley = template?.eventsGallery?.edges;
  const values = template?.ourValuesDetails;
  const coreValueTitle = 'Our Core Values';

  return (
    <>
      {isTablet && <MobileHeader title='Events' />}
      <div>
        <BannerSection
          eventsBanner={template?.eventsBanner}
          eventsHeading={template?.eventsHeading}
        />

        <div className='px-5 md:px-10 py-6 md:py-10'>
          <h2 className='text-2xl md:text-3xl font-serif text-foreground text-center'>
            {template?.eventsTitle}
          </h2>
          <p className='text-xs md:text-sm text-foreground text-center mt-4'>
            {template?.eventContent}
          </p>
        </div>

        <div className='px-5 md:px-10 mb-10'>
          <div className='columns-1 sm:columns-2 md:columns-3 gap-2 space-y-2'>
            {galley.map((edge?: any, index?: number) => (
              <MediaSection
                key={edge?.node?.id || index}
                mediaItemUrl={edge?.node?.mediaItemUrl}
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className='text-2xl text-center mb-8 mt-4 md:text-3xl text-foreground font-serif'>
            {coreValueTitle}
          </h2>
          <div className='mb-10 px-5 md:px-10'>
            <OurValuesSection ourValuesDetails={values} />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsPageDetail;
