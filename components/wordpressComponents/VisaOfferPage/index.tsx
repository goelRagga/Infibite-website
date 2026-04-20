'use client';

import React, { memo, useMemo, useCallback } from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import BannerSection from './BannerSection';
import { VisaPageProps, offersRepeater, OfferPropertySlider } from 'visa-page';
import OfferPropertySliderSection from './OfferPropertySlider';
import VisaOfferCardSection from './visaOfferCardSection';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import MobileHeader from '@/components/common/MobileHeader';
import ReusableCarousel from '@/components/common/ReusableCarousel';

const VisaPageDetail: React.FC<VisaPageProps> = ({ template }) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // Memoize static strings
  const staticTexts = useMemo(
    () => ({
      visaCardholderExclusives: 'Visa Cardholder Exclusives',
      ApplicableTitle: 'Applicable on all ELIVAAS properties',
      howToRedeem: 'How to Redeem?',
      termsConditions: 'Terms & Conditions',
      couponCode: 'Coupon Code',
    }),
    []
  );

  // Memoize carousel render function
  const renderCarouselItem = useCallback(
    (slider: OfferPropertySlider) => (
      <div className='pb-15'>
        <OfferPropertySliderSection
          visaPropertyImage={slider?.visaPropertyImage}
          visaPropertyLink={slider?.visaPropertyLink}
          visaPropertyName={slider?.visaPropertyName}
        />
      </div>
    ),
    []
  );

  return (
    <>
      {isTablet && <MobileHeader title='Visa Offer' />}
      <BannerSection
        visaLandingBanner={template?.visaLandingBanner}
        visaLandingHeading={template?.visaLandingHeading}
      />

      <div className='px-5 pt-10 md:px-10'>
        <h2
          className='text-2xl font-serif md:text-3xl'
          style={{ color: 'var(--blue2)' }}
        >
          {staticTexts.visaCardholderExclusives}
        </h2>
      </div>

      {template?.offersRepeater?.map(
        (repeat: offersRepeater, index: number) => (
          <div key={index}>
            <VisaOfferCardSection
              offerContent={repeat.offerContent}
              offerCouponCode={repeat.offerCouponCode}
              offerCouponLable={repeat.offerCouponLable}
              offerTitle={repeat.offerTitle}
              offerTerms={repeat.offerTerms}
              offerTitleCta={repeat.offerTitleCta}
              offerPropertySlider={repeat.offerPropertySlider}
            />

            <ReusableCarousel
              className='px-5 md:px-10 py-5'
              mobileViewType='carousel'
              data={repeat?.offerPropertySlider || []}
              renderItem={renderCarouselItem}
              spacing={{ mobile: 0, tablet: 0, desktop: 0 }}
              slidesPerView={{ mobile: 1.5, tablet: 2.1, desktop: 4 }}
              showArrows={true}
              loop={false}
              prive={false}
            />

            <div className='px-5 pt-4 md:px-10 mb-10'>
              <p className=''>{repeat?.offerContent}</p>
              <h5 className='text-foreground text-base md:text-lg font-semibold mt-3 mb-3 md:mb-0'>
                {staticTexts.ApplicableTitle}
              </h5>
              <span className='flex mt-2'>
                <span
                  className='text-sm md:text-base border text-foreground p-2'
                  style={{ background: 'var(--grey3)' }}
                >
                  {staticTexts.couponCode}
                </span>
                <span className='text-sm md:text-base text-foreground border p-2'>
                  {repeat?.offerCouponCode}
                </span>
              </span>
              <div className='mt-5'>
                {repeat?.offerTerms?.map((term, termIndex) => (
                  <div
                    key={`${index}-term-${termIndex}`}
                    className='p-5'
                    style={{ background: 'var(--grey4)' }}
                  >
                    <p className='mb-2 text-sm text-foreground font-semibold md:text-base'>
                      {term?.offerTermTitle}
                    </p>
                    <p className='text-xs leading-6 text-foreground md:text-sm'>
                      {term?.offerTermDescription}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
      <div className='px-5 md:px-10 mb-10'>
        <Accordion type='single' collapsible className='w-full'>
          <AccordionItem
            className='px-3'
            value='item-1'
            style={{ background: 'var(--grey4)' }}
          >
            <AccordionTrigger className='font-semibold'>
              {staticTexts.howToRedeem}
            </AccordionTrigger>
            <AccordionContent className='flex flex-col gap-4 text-balance'>
              <p
                dangerouslySetInnerHTML={{
                  __html: template?.howToRedeem || '',
                }}
                className='md:text-sm text-xs text-foreground leading-6'
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            className='px-3'
            value='item-2'
            style={{ background: 'var(--grey4)' }}
          >
            <AccordionTrigger className='font-semibold'>
              {staticTexts.termsConditions}
            </AccordionTrigger>
            <AccordionContent className='flex flex-col gap-4 text-balance'>
              <p
                dangerouslySetInnerHTML={{
                  __html: template?.visaTermsAndConditions || '',
                }}
                className='md:text-sm text-xs text-foreground leading-6'
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

const MemoizedVisaPageDetail = memo(VisaPageDetail);
MemoizedVisaPageDetail.displayName = 'VisaPageDetail';

export default MemoizedVisaPageDetail;
