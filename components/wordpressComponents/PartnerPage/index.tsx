'use client';

import React, { useRef } from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import BannerSection from './BannerSection';
import BenefitsSection from './BenefitsSection';
import { PartnerPageProps } from 'partner-page';
import SingleBlogModalForm from '@/components/wordpressComponents/Blogs/SingleBlogModalForm';
import ExcellenceAwardsSection from './ExcellenceAwardSection';
import PartnerPageForm from '@/components/wordpressComponents/WPForms/PartnerPageForm';
import MobileHeader from '@/components/common/MobileHeader';
import Marquee from '@/components/common/Marquee';
import CustomImage from '@/components/common/CustomImage';
import { motion, useInView } from 'framer-motion';
import { PARTNER_PAGE } from 'lib/constants';

const PartnerPageDetail: React.FC<PartnerPageProps> = ({ template }) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const {
    benefitsSectionHeading,
    benefitsSectionDescription,
    travelPlatformsTitle,
    SingleModalFormTitle,
    SingleModalFormDescription,
    SingleModalFormCtaTitle,
    SingleModalFormFormTitle,
    excellenceAwardsTitle,
  } = PARTNER_PAGE;

  const logoItems = template?.partnerWithUsChannels?.map(
    (item: any, index: number) => (
      <CustomImage
        src={item.partnerWithUsChannelLogo || ''}
        alt={`partner-logo-${index}`}
        width={120}
        height={100}
        key={index}
        className='h-8 md:h-11 w-auto object-contain transition-all duration-300'
      />
    )
  );

  const benefitsSectionRef = useRef(null);
  const isBenefitsSectionInView = useInView(benefitsSectionRef, {
    once: true,
    margin: '-100px',
  });

  return (
    <>
      {isTablet && <MobileHeader title='Partner With Us' />}
      <div>
        <BannerSection
          partnerWithUsHeading={template?.partnerWithUsHeading}
          partnerWithUsSubHeading={template?.partnerWithUsSubHeading}
          partnerWithUsBanner={template?.partnerWithUsBanner}
        />

        {/* benefits section */}
        <div className='px-10 py-10 md:py-15' ref={benefitsSectionRef}>
          <h2 className='text-xl md:text-3xl text-foreground font-serif text-center'>
            {benefitsSectionHeading}
          </h2>
          <p className='text-xs md:text-sm text-secondary-700 text-center mt-1 mb-5'>
            {benefitsSectionDescription}
          </p>
          <motion.div
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15 py-10'
            initial={{ opacity: 0, y: 10 }}
            animate={isBenefitsSectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {template?.partnerWithUsCardsRepeater?.map(
              (item: any, index: number) => (
                <BenefitsSection
                  key={index}
                  cardIcon={item.cardIcon}
                  cardTitle={item.cardTitle}
                  cardTitleCopy={item.cardTitleCopy}
                />
              )
            )}
          </motion.div>
        </div>

        {/* travel platforms section logo wala */}
        <div>
          <h2 className='text-foreground font-serif text-base md:text-2xl text-center mb-2 md:mb-4'>
            {travelPlatformsTitle}
          </h2>
          <Marquee
            items={logoItems}
            speed={isMobile ? 10 : 20}
            className='py-6 md:py-8 px-2'
          />
        </div>

        {/* modal form open ke liye */}
        <div className='px-5 md:px-10 md:py-6'>
          <SingleBlogModalForm
            title={SingleModalFormTitle}
            description={SingleModalFormDescription}
            ctaTitle={SingleModalFormCtaTitle}
            formTitle={SingleModalFormFormTitle}
            data={template?.partnerWithUsBlog}
            className='sm:max-w-[550px] md:max-w-[100vw]! lg:max-w-[550px]! h-auto! md:h-[470px] bg-card'
            formComponent={<PartnerPageForm onClose={() => {}} />}
          />
        </div>

        {/* excellence awards section */}
        <div className='px-5 md:px-10 pb-10'>
          <h2 className='text-xl md:text-3xl text-foreground text-center font-serif pb-8 mt-10 md:mt-0'>
            {excellenceAwardsTitle}
          </h2>
          <div className='flex gap-5 no-scrollbar md:gap-30 hide-scrollbar items-center overflow-x-auto md:justify-center md:overflow-x-visible'>
            {template?.excellenceAwardsRepeator?.map(
              (item: any, index: number) => (
                <div key={index} className='flex-shrink-0'>
                  <ExcellenceAwardsSection
                    excellenceAwardsImage={item?.excellenceAwardsImages}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerPageDetail;
