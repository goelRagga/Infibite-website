'use client';

import React from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';

import {
  CorporateFeaturesAndExperiencesProps,
  CorporateHappyClientsProps,
  CorporatePageProps,
  CorporateReviewsProps,
  corporateServicesProps,
  CorporateTestimonialsProps,
} from 'corporate-page';
import BannerSection from './BannerSection';
import WhyUsSection from './WhyUsSection';
import CorporateServices from './CorporateServices';
import CorporateHappyClients from './CorporateHappyClients';
import CorporateFeaturesAndExperiences from './CorporateFeaturesAndExperiences';
import CorporateTestimonials from './CorporateTestimonials';
import ExcellentReviews from './ExcellentReviews';
import SingleBlogPageForm from '@/components/wordpressComponents/WPForms/SingleBlogPageForm';
import MobileHeader from '@/components/common/MobileHeader';
import CustomImage from '@/components/common/CustomImage';

const CorporatePageDetail: React.FC<CorporatePageProps> = ({ template }) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const ourHappyClients = 'Our Happy Clients';
  const featuresExperiences = 'Features & Experiences';
  const excellentReviews = 'Excellent Reviews';
  const formHeading = 'Get in touch with us';

  return (
    <>
      {isTablet && <MobileHeader title='Corporate Offsites' />}
      <div>
        <BannerSection
          corporateHeading={template?.corporateHeading}
          corporateBanner={template?.corporateBanner}
          corporateBannerSubHeading={template?.corporateBannerSubHeading}
        />
        <WhyUsSection
          corporateWhyUsContent={
            template?.corporateWhyUsGroup?.corporateWhyUsContent
          }
          corporateWhyUsContentTitle={
            template?.corporateWhyUsGroup?.corporateWhyUsContentTitle
          }
        />
        <div className='px-5 md:px-0'>
          <div className='flex flex-row gap-5 md:justify-evenly items-center w-full pb-20'>
            {template?.corporateServices?.map(
              (service: corporateServicesProps) => (
                <CorporateServices
                  corporateServiceLogo={service?.corporateServiceLogo}
                  corporateServiceName={service?.corporateServiceName}
                />
              )
            )}
          </div>
        </div>

        <div className='' style={{ background: 'var(--grey1)' }}>
          <h3 className='text-center text-white font-serif text-2xl py-3 '>
            {ourHappyClients}
          </h3>
        </div>
        <div
          className='w-full py-5 md:py-10 overflow-x-auto no-scrollbar lg:overflow-visible scrollbar-hide'
          style={{ background: 'var(--grey2)' }}
        >
          <div className='flex flex-nowrap lg:flex-wrap gap-5 justify-evenly items-center px-4 md:px-0'>
            {template?.corporateHappyClients?.map(
              (client: CorporateHappyClientsProps, index: number) => (
                <div key={index} className='flex-shrink-0 w-[30%] md:w-auto'>
                  <CorporateHappyClients
                    corporateCliientLogo={client?.corporateCliientLogo}
                  />
                </div>
              )
            )}
          </div>
        </div>

        <div className='mt-10'>
          <h2 className='text-center font-serif text-2xl md:text-3xl pb-8'>
            {featuresExperiences}
          </h2>
        </div>
        <div className='w-full pb-10 no-scrollbar overflow-x-auto lg:overflow-visible scrollbar-hide'>
          <div className='flex flex-nowrap lg:flex-wrap gap-5 items-center px-4 lg:px-10'>
            {template?.corporateFeatures?.map(
              (
                feature: CorporateFeaturesAndExperiencesProps,
                index: number
              ) => (
                <div
                  key={index}
                  className='flex-shrink-0 w-[70%] md:w-[40%] lg:w-[23%]'
                >
                  <CorporateFeaturesAndExperiences
                    corporateFeatureImage={feature?.corporateFeatureImage}
                    corporateFeatureTitle={feature?.corporateFeatureTitle}
                  />
                </div>
              )
            )}
          </div>
        </div>

        <div className='bg-black py-8'>
          <h3 className='text-center text-white font-serif text-2xl md:text-3xl pb-8'>
            {'Testimonials'}
          </h3>

          <div className='flex gap-5 no-scrollbar w-full px-5 md:px-10 overflow-x-auto lg:overflow-visible scrollbar-hide lg:flex-wrap lg:justify-evenly'>
            {template?.corporateTestimonials?.map(
              (testimonial: CorporateTestimonialsProps, index: number) => (
                <div
                  key={index}
                  className='flex-shrink-0 w-[80%] md:w-[43%] lg:w-[31%]'
                >
                  <CorporateTestimonials
                    corporateTestimonialContent={
                      testimonial?.corporateTestimonialContent
                    }
                    corporateTestimonialLogo={
                      testimonial?.corporateTestimonialLogo
                    }
                    corporateTestimonialName={
                      testimonial?.corporateTestimonialName
                    }
                  />
                </div>
              )
            )}
          </div>
        </div>

        <div className='' style={{ background: 'var(--grey2)' }}>
          <h2 className='text-center text-foreground font-serif text-2xl md:text-3xl pb-0 pt-8 '>
            {excellentReviews}
          </h2>
        </div>
        <div
          className='w-full py-5 no-scrollbar md:py-10 overflow-x-auto md:overflow-visible scrollbar-hide'
          style={{ background: 'var(--grey2)' }}
        >
          <div className='flex flex-nowrap md:flex-wrap md:justify-evenly gap-5 items-center px-4 md:px-0'>
            {template?.corporateReviews?.map(
              (review: CorporateReviewsProps, index: number) => (
                <div key={index} className='flex-shrink-0 w-[33%] md:w-auto'>
                  <ExcellentReviews
                    corporateReviewLogo={review?.corporateReviewLogo}
                    corporateReviewRating={review?.corporateReviewRating}
                  />
                </div>
              )
            )}
          </div>
        </div>

        <div
          className='md:px-10 py-10 w-full flex flex-col lg:flex-row gap-5'
          style={{ background: 'var(--backgroundGradient13)' }}
        >
          <div className='w-full lg:w-1/2'>
            <CustomImage
              src={template?.corporateSideFormImage || ''}
              alt='side image'
              width={630}
              height={450}
              className='w-full h-auto md:h-[500px] object-cover'
            />
          </div>
          <div className='w-full lg:w-1/2'>
            <div className='p-5 md:p-4 md:h-[500px] bg-white shadow'>
              <h2 className='font-serif text-3xl text-center'>{formHeading}</h2>
              <SingleBlogPageForm formType='corporate' />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CorporatePageDetail;
