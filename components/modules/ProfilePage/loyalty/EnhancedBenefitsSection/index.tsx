'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import OfferCardItem from '@/components/modules/ProfilePage/loyalty/OfferCard';
import CommonCard from '@/components/modules/ProfilePage/loyalty/CommonCard';
import { CarouselTemplate } from '@/components/common/Carousel';
import { CarouselTemplate1 } from '@/components/common/Carousel/CardTemplate';
import useIsMobile from '@/hooks/useIsMobile';
import ResponsiveDialogDrawer from '@/components/common/ResponsiveDialogDrawer';
import { Benefit } from '@/components/modules/ProfilePage/loyalty/data/type';

interface EnhancedBenefitsSectionProps {
  className?: string;
  benefits: Benefit[];
  nextTierBenefits?: Benefit[];
  amountNeededForNextTier?: number;
  nextTierName?: string;
}

const OfferCardWrapper = ({ item }: { item: any }) => (
  <OfferCardItem
    title={item?.metadata?.benefits?.name || item?.title}
    description={item?.metadata?.benefits?.description || item?.description}
    image={item?.metadata?.benefits?.image || item?.image}
    className=''
  />
);

export default function EnhancedBenefitsSection({
  className = '',
  benefits = [],
  nextTierBenefits = [],
  amountNeededForNextTier,
  nextTierName,
}: EnhancedBenefitsSectionProps) {
  const isMobile = useIsMobile();
  const [showAllCards, setShowAllCards] = useState(false);
  const [openBenefitsModal, setOpenBenefitsModal] = useState(false);

  // Group current tier benefits by category
  const groupedBenefits = useMemo(() => {
    return benefits.reduce(
      (acc: Record<string, Benefit[]>, benefit: Benefit) => {
        const category = benefit?.category || 'OTHERS';
        if (!acc[category]) acc[category] = [];
        acc[category]?.push(benefit);
        return acc;
      },
      {}
    );
  }, [benefits]);

  // Group next tier benefits by category
  const groupedNextTierBenefits = useMemo(() => {
    return nextTierBenefits.reduce(
      (acc: Record<string, Benefit[]>, benefit: Benefit) => {
        const category = benefit?.category || 'OTHERS';
        if (!acc[category]) acc[category] = [];
        acc[category]?.push(benefit);
        return acc;
      },
      {}
    );
  }, [nextTierBenefits]);

  const stayBenefits = groupedBenefits['STAY'] || [];
  const nextTierStayBenefits = groupedNextTierBenefits['STAY'] || [];

  // If nextTierName is null, show current tier benefits, otherwise show next tier benefits
  const displayBenefits = nextTierName ? nextTierStayBenefits : stayBenefits;
  const benefitsCount = displayBenefits.length;

  const otherCategories = Object.entries(groupedBenefits).filter(
    ([category]) => category !== 'STAY'
  );

  let visibleStayBenefits = showAllCards
    ? stayBenefits
    : stayBenefits?.slice(0, 2);

  const stayBenefitsTitle = 'Exclusive Benefits, Tailored For You';

  return (
    <div className={className}>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch'>
        {/* Left Side - STAY Benefits */}
        <div className='bg-secondary-50 rounded-2xl flex flex-col h-full'>
          <div className='bg-[var(--primary-10)] rounded-2xl p-0 md:py-6 md:px-4'>
            <h2 className='flex justify-start text-xl md:text-2xl text-[var(--grey9)] font-serif px-5 py-4 md:p-0'>
              {stayBenefitsTitle}
            </h2>

            <CommonCard
              data={visibleStayBenefits}
              direction='grid'
              contentDirection={`${isMobile ? 'horizontal' : 'responsive'}`}
              columns={2}
              categoryClassName='text-xs text-foreground'
              cardClassName='text-xs text-foreground md:bg-primary-50 md:border md:border-[var(--primary-100)] md:rounded-2xl pt-2 md:p-4 shadow-none md:mt-4 border-b border-[var(--primary-100)]'
              iconClassName='bg-[var(--red3)] h-[42px] w-[42px] rounded-full flex items-center justify-center cursor-pointer'
              titleClassName='text-xs text-foreground mb-0.5 mt-1'
              nameClassName='text-lg text-accent-red-900 font-serif leading-relaxed mb-0 -mt-1 md:mb-0'
              valueClassName='text-lg text-accent-red-900 font-serif leading-relaxed mb-4 -mt-1 md:mb-0'
              descriptionClassName='text-xs text-foreground'
              contentclassname={`${isMobile ? `text-left` : `text-center`} text-foreground text-xs`}
              imageClassName='h-11 w-11 rounded-full! flex items-center justify-center object-cover bg-accent-red-900'
              imageClassWidth={isMobile ? 30 : 40}
              imageClassHeight={isMobile ? 30 : 40}
              imageClassNameInnerDiv='w-4 h-4'
            />
          </div>

          <div className='mt-4 mb-4 flex justify-center items-center bg-secondary-50 flex-1 rounded-2xl'>
            <div className='flex flex-col items-center text-center '>
              {nextTierName ? (
                <>
                  {amountNeededForNextTier && (
                    <div className='text-sm text-secondary-900 mb-1'>
                      Spend ₹{' '}
                      <span className='font-semibold'>
                        {amountNeededForNextTier?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  {benefitsCount === 0 ? (
                    <p className='text-sm text-secondary-900 mb-2 md:mb-4'>
                      to reach {nextTierName} tier - no benefits available
                    </p>
                  ) : (
                    <p className='text-sm text-secondary-900 mb-2 md:mb-4'>
                      to reach {nextTierName} tier and unlock{' '}
                      <span className='typography-label-semibold'>
                        {benefitsCount >= 2 ? '2' : benefitsCount}+
                      </span>{' '}
                      benefits
                    </p>
                  )}
                </>
              ) : (
                <p className='text-sm text-secondary-900 mb-2 md:mb-4'>
                  You have{' '}
                  <span className='typography-label-semibold'>
                    {benefitsCount >= 2 ? '2' : benefitsCount}
                  </span>{' '}
                  more benefits available
                </p>
              )}
              {benefitsCount > 0 && (
                <Button
                  onClick={() => {
                    if (!showAllCards) {
                      setOpenBenefitsModal(true);
                    }
                  }}
                  variant='outline'
                  className='border-[var(--red3)] text-[var(--red3)] font-semibold rounded-full px-4 py-2 mt-2 md:mt-0 mb-3 md:mb-0 bg-white'
                >
                  {showAllCards ? 'View Less' : 'View Benefits'}
                </Button>
              )}
            </div>
          </div>

          {/* Modal for STAY benefits */}
          <ResponsiveDialogDrawer
            open={openBenefitsModal}
            setOpen={setOpenBenefitsModal}
            title={
              nextTierName
                ? `${nextTierName} Tier Benefits`
                : 'All Exclusive Benefits'
            }
            contentClassName='sm:max-w-[600px]! md:overflow-y-auto md:max-h-[80vh]'
          >
            <CommonCard
              data={displayBenefits}
              direction='grid'
              contentDirection={`${isMobile ? 'horizontal' : 'responsive'}`}
              columns={2}
              categoryClassName='text-xs text-foreground'
              cardClassName='text-xs text-foreground md:bg-primary-50 md:border md:border-[var(--primary-100)] md:rounded-2xl pt-2 md:p-4 shadow-none md:mt-4 border-b border-[var(--primary-100)]'
              iconClassName='bg-[var(--red3)] h-[42px] w-[42px] rounded-full flex items-center justify-center cursor-pointer mb-[10px]'
              titleClassName='text-xs text-foreground mb-0.5 mt-1'
              nameClassName='text-lg text-accent-red-900 font-serif leading-relaxed mb-0 -mt-1 md:mb-0'
              valueClassName='text-lg text-accent-red-900 font-serif leading-relaxed mb-4 -mt-1 md:mb-0'
              descriptionClassName='text-xs text-foreground'
              contentclassname={`${isMobile ? `text-left` : `text-center`} text-foreground text-xs`}
              imageClassName='h-11 w-11 rounded-full! flex items-center justify-center object-cover bg-accent-red-900'
              imageClassWidth={40}
              imageClassHeight={40}
              imageClassNameInnerDiv='w-4 h-4'
            />
          </ResponsiveDialogDrawer>
        </div>

        {/* Right Side - Other Categories */}
        <div className='flex flex-col gap-6 h-full sm:pt-0 pt-2'>
          {otherCategories?.map(([category, items]) => (
            <div
              key={category}
              className='bg-[var(--primary-10)] rounded-2xl p-4'
            >
              <h2 className='text-foreground typography-title-regular font-serif mb-4'>
                {category === 'SPECIAL_MONTHS'
                  ? 'Birthday Perks Await'
                  : `${category} Benefits`}
              </h2>

              {items.length === 1 ? (
                <CommonCard
                  data={items}
                  renderItem={OfferCardWrapper}
                  direction='vertical'
                  cardClassName='border-1 border-primary-100 bg-white rounded-3xl shadow-none bg-gray-50 mt-0 sm:mt-2 h-[280px]'
                  imageClassName='h-[150px] w-full rounded-3xl object-cover overflow-hidden'
                  contentclassname='p-4'
                  titleClassName='text-xs text-foreground mb-0.5 mt-1'
                  nameClassName='text-lg text-foreground font-serif text-left leading-relaxed mb-1 -mt-1 md:mb-0'
                  valueClassName='text-lg text-accent-red-900 font-serif text-left leading-relaxed mb-4 -mt-1 md:mb-0'
                  descriptionClassName='text-foreground mt-1 text-xs text-left'
                  imageClassNameInnerDiv='w-full h-full'
                />
              ) : (
                <CarouselTemplate
                  heading=''
                  items={items}
                  slidesPerView={isMobile ? 1.3 : 1.7}
                  showArrows
                  renderItem={(item: any | Benefit) => {
                    const normalizedItem = {
                      title: item?.metadata?.benefits?.name || item?.title,
                      description:
                        item?.metadata?.benefits?.description ||
                        item?.description,
                      image: item?.metadata?.benefits?.image || item?.image,
                    };

                    return (
                      <CarouselTemplate1
                        isButton={true}
                        className='h-[140px]! overflow-hidden'
                        priority={false}
                        data={normalizedItem}
                        titleClass='text-foreground md:text-[var(--red3)]'
                        descriptionClass='text-[var(--grey9)] line-clamp-4'
                      />
                    );
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
