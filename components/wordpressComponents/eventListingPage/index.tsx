'use client';

import React, { Suspense } from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import BenefitsSection from '@/components/wordpressComponents/PartnerPage/BenefitsSection';
import { EventsListingPageProps } from 'event-listing-page';
import ElivaasLight from '@/assets/elivaasLight.svg';
import PartnerSection from '@/components/modules/Home/PartnerSection';
import BannerSection from './BannerSection';
import EventSpaces from './EventSpaces';
import ReviewSection from './ReviewSection';
import Marquee from '@/components/common/Marquee';
import CustomImage from '@/components/common/CustomImage';
import { SectionTemplate } from '@/components/common/Shared/Section';
import { VideoProvider } from '@/contexts/video-context';
import ReusableCarousel from '@/components/common/ReusableCarousel';
import { Template } from '@/components/common/Carousel/ReviewTemplate/Template';

const EventListingPage: React.FC<EventsListingPageProps> = ({
  content,
  propertyData,
  redirectUrl = '',
  eventPageType = 'events',
  isPartnerSection = true,
  isBannerInfoBox = true,
  isEventSpaces = true,
  isCorporateOffsite = false,
}) => {
  const isMobile = useIsMobile();

  const logoItems = (content?.data?.corporateBrands?.brands || []).map(
    (url: string, index: number) => (
      <CustomImage
        src={url}
        alt={`partner-logo-${index}`}
        width={120}
        height={100}
        key={index}
        className='h-10 md:h-14 w-auto object-contain transition-all duration-300'
      />
    )
  );

  const starStays = content?.data?.starStaysSection;
  const starStaysHeading = starStays?.heading;
  const starStaysDescription = starStays?.description;
  const starStaysData = starStays?.data;
  const ctaName = content?.data?.bannerContent?.cta;

  return (
    <>
      {isMobile && (
        <div className='relative'>
          <div className='p-8 absolute top-0 left-1/2 -translate-x-1/2 z-10'>
            <ElivaasLight />
          </div>
        </div>
      )}
      <div>
        <BannerSection
          isCorporateOffsite={isCorporateOffsite}
          formContentClassName={
            isCorporateOffsite
              ? 'h-screen h-auto! sm:h-[580px]! sm:max-w-[550px]! bg-card gap-0 fixed! bottom-0!'
              : 'h-screen h-auto! sm:h-[640px]! sm:max-w-[550px]! bg-card gap-0 fixed! bottom-0!'
          }
          isBannerInfoBox={isBannerInfoBox}
          ctaName={ctaName}
          bannerContent={{
            firstLine: content?.data?.bannerContent?.lines?.[0]?.firstLine,
            secondLine: content?.data?.bannerContent?.lines?.[1]?.secondLine,
          }}
          Heading={content?.data?.bannerContent?.title}
          SubHeading={content?.data?.bannerContent?.description}
          banner={{
            BannerMob: content?.data?.banner?.urlMobile,
            BannerDesk: content?.data?.banner?.urlDesktop,
            thumbnailMob: content?.data?.banner?.thumbnailMob,
            thumbnailDesk: content?.data?.banner?.thumbnailDesk,
          }}
        />

        {content?.data?.corporateBrands && (
          <div className='pt-5 pb-2 md:pt-2 md:pb-2 grid grid-cols-1 md:grid-cols-3 items-center justify-center'>
            <h2 className='text-xl md:text-3xl font-serif text-foreground text-center pb-2'>
              {content?.data?.corporateBrands?.title}
            </h2>

            <div className='md:col-span-2'>
              <Marquee
                items={logoItems}
                speed={isMobile ? 10 : 20}
                className='py-6 md:py-8 px-2'
              />
            </div>
          </div>
        )}

        <EventSpaces
          isButton={true}
          itemClassName='md:w-[32%] w-[90%]'
          data={propertyData?.list?.slice(0, 3)}
          title={content?.data?.eventSpacesSection?.title}
          description={content?.data?.eventSpacesSection?.description}
          redirectUrl={redirectUrl ?? ''}
        />

        {starStaysData &&
          Array.isArray(starStaysData) &&
          starStaysData.length > 0 && (
            <section className='py-16'>
              <section className='w-full'>
                <SectionTemplate
                  showDefaultArrows={false}
                  textAlign='center'
                  id='starGuestStories'
                  isStar
                  heading={starStaysHeading}
                  description={starStaysDescription}
                  verticalPosition={3}
                >
                  <Suspense fallback={''}>
                    <VideoProvider>
                      <ReusableCarousel
                        data={starStaysData}
                        renderItem={(item, index, isCenterSlide) => (
                          <Template
                            data={item}
                            isCenterSlide={isCenterSlide}
                            pageName='event-listing-page'
                          />
                        )}
                        slidesPerView={{
                          mobile: 1.5,
                          tablet: 2.5,
                          desktop: 4.4,
                        }}
                        mobileViewType='carousel'
                        desktopViewType='carousel'
                        showArrows={true}
                        prive={false}
                        spacing={{ mobile: 16, tablet: 24, desktop: 24 }}
                        centerSlides={true}
                        centerSlideScale={isMobile ? 1.1 : 1.2}
                        startIndex={Math.floor((starStaysData.length || 0) / 2)}
                        blurInactiveCards={true}
                      />
                    </VideoProvider>
                  </Suspense>
                </SectionTemplate>
              </section>
            </section>
          )}

        <div className='px-5 sm:px-10 pt-7 md:pt-15 pb-7 md:pb-15 bg-[var(--white3)] md:bg-primary-50'>
          <h2 className='text-xl md:text-3xl font-serif text-foreground text-center pb-6 md:pb-10'>
            {content?.data?.reviewSection?.title}
          </h2>
          <div className='flex flex-col md:flex-row gap-5'>
            {(content?.data?.reviewSection?.reviews || []).map(
              (item?: any, index?: number) => (
                <ReviewSection
                  key={index}
                  description={item?.content}
                  rating={item?.ratings}
                  name={item?.name}
                />
              )
            )}
          </div>
        </div>

        {/* Top venues for events wala */}
        {isEventSpaces && (
          <EventSpaces
            data={propertyData?.list?.slice(0, 4)}
            title={content?.data?.topStaysEventSpaceSection?.title}
            description={content?.data?.topStaysEventSpaceSection?.description}
            redirectUrl={redirectUrl ?? ''}
          />
        )}

        {/* benefits section */}
        {!isMobile && (
          <div className='px-10 py-10 md:py-15'>
            <h2 className='text-xl md:text-3xl text-foreground font-serif text-center'>
              {content?.data?.benefitsCardsRepeater?.title}
            </h2>
            <p className='text-xs md:text-sm text-secondary-700 text-center mt-1 mb-5'>
              {content?.data?.benefitsCardsRepeater?.description}
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15 py-10'>
              {(content?.data?.benefitsCardsRepeater?.benefits || []).map(
                (item: any, index: number) => (
                  <BenefitsSection
                    key={index}
                    cardIcon={item.cardIcon}
                    width={45}
                    height={45}
                    cardTitle={item.cardTitle}
                    cardTitleCopy={item.cardTitleCopy}
                  />
                )
              )}
            </div>
          </div>
        )}

        {isPartnerSection && content?.data?.partnerSection && (
          <div className='px-0 pt-4 md:px-10 pb-0 md:pb-15'>
            <PartnerSection
              formTitle='Let’s Find You Perfect Venue'
              formDescription="Tell us what you're planning, we’ll make it real."
              contentClassName='sm:max-w-[792px]! bg-card h-[700px]!'
              partnerSectionData={content.data.partnerSection}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default EventListingPage;
