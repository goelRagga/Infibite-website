import { CarouselTemplate } from '@/components/common/Carousel';
import PropertyCard from '@/components/common/PropertyCard';
import ScrollData from '@/components/common/ScrollData';
import PropertyCardSkeleton from '@/components/modules/PropertyListing/PropertyCardSkeleton';
import { Card } from '@/components/ui/card';
import { useFilters } from '@/hooks/filters/useFilters';
import { useGuests } from '@/hooks/filters/useGuests';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import { useSimilarProperties } from '@/hooks/useSimilarProperties';
import { getRecentlyViewedProperties } from '@/lib/similarProperties/recentlyViewed';
import { generateQueryString } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

import React, { useMemo } from 'react';

interface SimilarPropertiesProps {
  currentPropertyInfo: any;
}

const SimilarProperties: React.FC<SimilarPropertiesProps> = ({
  currentPropertyInfo,
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { urlParams } = useFilters();
  const { guestsData } = useGuests();
  const appSearchParams = urlParams.getAllParams();

  const { similarProperties, loading } = useSimilarProperties({
    currentPropertyInfo,
    guestsData,
    checkin: appSearchParams.checkin,
    checkout: appSearchParams.checkout,
    limit: 5,
  });

  const recentlyViewedIds = useMemo(() => {
    return getRecentlyViewedProperties();
  }, []);

  const queryString = useMemo(
    () =>
      generateQueryString({
        checkin: appSearchParams.checkin,
        checkout: appSearchParams.checkout,
        adults: guestsData?.numberOfGuests || appSearchParams.adults,
        children: guestsData?.numberOfChildren || appSearchParams.children,
        ...(appSearchParams.bankOffer && {
          bankOffer: appSearchParams.bankOffer,
        }),
        ...(appSearchParams.couponCode && {
          couponCode: appSearchParams.couponCode,
        }),
        ...(appSearchParams.mealPlan && { mealPlan: appSearchParams.mealPlan }),
      }),
    [appSearchParams, guestsData]
  );

  if (!loading && similarProperties.length === 0) {
    return null;
  }

  const renderPropertyCard = (property: any) => {
    const transformedProperty = {
      ...property,
      image: property.images?.[0]?.url || property.images?.[0],
    };

    const isRecentlyViewed = recentlyViewedIds.includes(
      transformedProperty?.id
    );

    return (
      <PropertyCard
        key={transformedProperty?.id}
        property={transformedProperty}
        variant='default'
        showActionButton={false}
        queryString={queryString}
        isRecentlyViewed={isRecentlyViewed}
        showBrandLogo={true}
      />
    );
  };

  return (
    <Card
      className='relative border-none shadow-none m-0 p-0 bg-white md:mt-10 dark:bg-background xl:dark:bg-background mb-3 sm:mb-6'
      id='similarProperties'
    >
      <AnimatePresence mode='wait'>
        {loading ? (
          <motion.div
            key='loading-skeleton'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
            }}
          >
            <PropertyCardSkeleton gridLayout='3x3' />
          </motion.div>
        ) : (
          <motion.div
            key='carousel'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
            }}
          >
            {isMobile || isTablet ? (
              <div className='px-4'>
                <div className='mb-4'>
                  <h2 className='text-xl sm:text-2xl font-serif text-card-foreground'>
                    Nearby Similar Properties
                  </h2>
                </div>

                <ScrollData className='' itemClassName='w-[95%]' gap='gap-3'>
                  {similarProperties.map((property: any) => (
                    <div key={property?.id}>{renderPropertyCard(property)}</div>
                  ))}
                </ScrollData>
              </div>
            ) : (
              <CarouselTemplate
                heading='Nearby Similar Properties'
                items={similarProperties}
                slidesPerView={3.5}
                showArrows={true}
                renderItem={renderPropertyCard}
                spaceBetween={16}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default SimilarProperties;
