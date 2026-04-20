'use client';
import React, { Suspense, useState } from 'react';

import AlayaStaysBrandLogo from '@/assets/alayaLogoWhiteNew.svg';
import PriveBrandLogo from '@/assets/priveBrandLogo.svg';
import ElivaasBrandLogo from '@/assets/elivaasBrandLogo.svg';
import CustomImage from '@/components/common/CustomImage';
import { Badge, Card, CardContent, CardFooter } from '@/components/ui';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import useIsMobile from '@/hooks/useIsMobile';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { normalFeatureMap, priveFeatureMap } from '@/lib/constants';
import { cn, formatPrice } from '@/lib/utils';
import { ArrowUpRight, PawPrint, Star } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Svg from '../Shared/Svg';
import PropertyCardTypes from './PropertyCard.types';
import SliderItemComponent from './itemImage';

const PropertyCardVisaBanner = dynamic(
  () => import('./PropertyCardVisaBanner'),
  { ssr: true }
);

import { motion } from 'framer-motion';
import { trackEvent } from '@/lib/mixpanel';

type PropertyCardProps = PropertyCardTypes.Props;

/** Alaya Stays uses Visa Signature (not Infinite) in copy; normalize API strings. */
function mapAlayaStaysVisaShortDescription(
  brand: string | undefined,
  shortDescription: string | undefined
) {
  if (brand !== 'ALAYASTAYS' || !shortDescription?.includes('Infinite')) {
    return shortDescription;
  }
  return shortDescription.replace(/Infinite/g, 'Signature');
}

const PropertyCard = ({
  property,
  variant = 'default',
  onCardClick,
  className,
  showActionButton = false,
  isClickable = true,
  queryString,
  isRenderFeatures = true,
  isRenderPrice = true,
  isRenderAmenities = true,
  peram,
  isRecentlyViewed = false,
  verticalPosition,
  priority = false,
  lazyLoadAmenityIcons = false,
  showBrandLogo = false,
}: PropertyCardProps) => {
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);

  const { ref: cardRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true,
  });

  const shouldLoadImage = priority ? true : isIntersecting;

  const shouldLoadAmenityIcons = lazyLoadAmenityIcons ? isIntersecting : true;

  const handleCardClick = () => {
    if (isClickable && onCardClick) {
      onCardClick(property?.id || '');
    }
    // Defer tracking so click response (e.g. navigation) isn't blocked (INP)
    const propertyTraits = [];
    if (property?.isPrive) propertyTraits.push('prive');
    if (property?.isPetFriendly) propertyTraits.push('pet_friendly');
    if (property?.isHighDemand) propertyTraits.push('high_demand');
    if (property?.brand === 'ALAYASTAYS') propertyTraits.push('alaya');

    trackEvent('property_card_clicked', {
      property_traits: propertyTraits.length > 0 ? propertyTraits : null,
      property_rating: property?.review?.rating || null,
      horizontal_position: verticalPosition ?? null,
      page_name: peram === 'listing_page' ? 'property_listing' : peram,
    });
  };

  const renderBadges = () => {
    const badgesToRender = [...(property?.badges || [])];

    if (isRecentlyViewed) {
      badgesToRender.push('recently-viewed');
    } else if (property?.isHighDemand && variant === 'default') {
      badgesToRender.push('most-in-demand');
    }

    if (badgesToRender.length === 0) return null;

    return (
      <div className='absolute top-2 right-2 flex flex-wrap gap-1 z-10'>
        {badgesToRender.map((badge: any, index: any) => {
          let badgeStyle = 'bg-primary text-white';

          if (badge === 'sale') badgeStyle = 'bg-accent-red-500 text-white';
          if (badge === 'popular')
            badgeStyle = 'bg-accent-yellow-500 text-white';
          if (badge === 'new') badgeStyle = 'bg-accent-green-500 text-white';
          if (badge === 'smart-tv') badgeStyle = 'bg-secondary-700 text-white';
          if (badge === 'pool') badgeStyle = 'bg-blue-500 text-white';
          if (badge === 'most-in-demand')
            badgeStyle =
              'bg-white border-1 border-white text-black rounded-full text-xs font-semibold h-7 shadow-md overflow-hidden';
          if (badge === 'recently-viewed')
            badgeStyle =
              'bg-white border-1 border-white text-black rounded-full text-xs font-semibold h-7 shadow-md overflow-hidden';

          return (
            <Badge key={index} className={badgeStyle}>
              {badge
                .split('-')
                .map(
                  (word: any) => word.charAt(0).toUpperCase() + word.slice(1)
                )
                .join(' ')}
            </Badge>
          );
        })}
      </div>
    );
  };

  const renderRating = () => {
    if (!property?.review?.rating) return null;

    const ratingClasses = cn({
      'flex items-center gap-1': true,
    });

    const isPrive = variant == 'prive-default' || variant == 'prive-home';

    return (
      <div className={ratingClasses}>
        <Star
          strokeWidth={0}
          className='h-4 w-4 fill-accent-yellow-400 text-accent-yellow-400'
        />
        <span
          className={cn('font-medium text-sm sm:font-semibold', {
            'text-white': isPrive,
          })}
        >
          {property?.review?.rating}
        </span>
      </div>
    );
  };

  const renderPrice = () => {
    const priveVariant =
      variant === 'prive-default' || variant === 'prive-home';
    const originalNetPerNightAmountBeforeTax =
      property?.quotes?.[0]?.originalNetPerNightAmountBeforeTax;
    const netPerNightAmountBeforeTax =
      property?.quotes?.[0]?.netPerNightAmountBeforeTax;
    return (
      <div
        className={cn('flex items-baseline', {
          'text-white': priveVariant,
        })}
      >
        {netPerNightAmountBeforeTax == null ? (
          <>
            <span className='font-semibold text-base'>
              ₹{formatPrice(property?.priceAmount ?? 0)}
            </span>
            <span className='text-sm'>/night</span>
          </>
        ) : (
          <div className='flex items-center'>
            {originalNetPerNightAmountBeforeTax != null &&
              originalNetPerNightAmountBeforeTax >
                netPerNightAmountBeforeTax && (
                <span
                  className={cn('line-through text-sm mr-2 ml-0', {
                    'text-accent-red-700': !priveVariant,
                    'text-white/70': priveVariant,
                  })}
                >
                  ₹{originalNetPerNightAmountBeforeTax.toLocaleString()}
                </span>
              )}
            <span className='font-semibold text-base'>
              ₹{formatPrice(netPerNightAmountBeforeTax ?? 0)}
            </span>
            <span className='text-sm'>/night</span>
          </div>
        )}
      </div>
    );
  };

  const renderAmenities = () => {
    if (!property?.topAmenities || property?.topAmenities.length === 0)
      return null;

    const isPrive = variant === 'prive-default' || variant === 'prive-home';

    // Take only the first 3 amenities
    const topThreeAmenities = property?.topAmenities.slice(0, 3);
    return (
      <div className='flex flex-wrap gap-2 mt-3'>
        {topThreeAmenities.map((amenity: any, index: number) => (
          <Badge
            key={index}
            variant='outline'
            className={cn('flex items-center gap-2 px-2 py-1 rounded-2xl', {
              'bg-none text-primary-500 border-primary-300': !isPrive,
              'bg-yellow-800/20 text-yellow-600 border-yellow-600': isPrive,
            })}
          >
            {amenity?.icon && (
              <>
                {shouldLoadAmenityIcons ? (
                  <Svg
                    src={amenity?.icon}
                    className={cn(
                      'h-4 w-4 object-contain opacity-70 scale-140',
                      {
                        'filter brightness-0 dark:filter dark:invert': !isPrive,
                        'filter invert': isPrive,
                      }
                    )}
                    width='24'
                    height='24'
                  />
                ) : (
                  <div className='h-4 w-4 bg-primary-200 animate-pulse rounded' />
                )}
              </>
            )}
            <span className='typography-xs-regular text-primary-800 font-medium! dark:text-primary-100'>
              {amenity.name.trim()}
            </span>
          </Badge>
        ))}
      </div>
    );
  };

  const renderFeatures = () => {
    if (!property?.metrics || property?.metrics?.length === 0) return null;

    const isPrive = variant === 'prive-default' || variant === 'prive-home';

    const featureMap: Record<
      string,
      {
        label: string;
        icon?: string;
        lucideIcon?: React.ComponentType<any>;
      }
    > = isPrive ? priveFeatureMap : normalFeatureMap;

    // Priority order: Guests, Beds/Bedrooms, Bathrooms
    const priorityOrder = isPrive
      ? ['Guests', 'Beds', 'Bathrooms']
      : ['Guests', 'Bedrooms', 'Bathrooms'];

    // Helper function to find feature by name (case-insensitive, handles singular/plural)
    const findFeature = (metricName: string) => {
      const normalizedName = metricName.toLowerCase();

      // Try exact match first (case-insensitive)
      for (const key in featureMap) {
        if (key.toLowerCase() === normalizedName) {
          return { feature: featureMap[key], key };
        }
      }

      // Try singular/plural variations
      if (normalizedName === 'bedroom' || normalizedName === 'bedrooms') {
        const key = isPrive ? 'Beds' : 'Bedrooms';
        if (featureMap[key]) {
          return { feature: featureMap[key], key };
        }
      }

      if (normalizedName === 'bathroom' || normalizedName === 'bathrooms') {
        const key = 'Bathrooms';
        if (featureMap[key]) {
          return { feature: featureMap[key], key };
        }
      }

      if (normalizedName === 'guest' || normalizedName === 'guests') {
        const key = 'Guests';
        if (featureMap[key]) {
          return { feature: featureMap[key], key };
        }
      }

      return null;
    };

    // Helper function to format label with proper singular/plural
    const formatLabel = (
      value: string | number,
      baseLabel: string,
      metricName: string
    ) => {
      const numValue = Number(value);
      const normalizedName = metricName.toLowerCase();

      // Handle bedrooms/bedrooms/beds
      if (
        normalizedName === 'bedroom' ||
        normalizedName === 'bedrooms' ||
        normalizedName === 'beds'
      ) {
        if (isPrive) {
          return numValue === 1 ? `${numValue} bed` : `${numValue} beds`;
        } else {
          return numValue === 1
            ? `${numValue} bedroom`
            : `${numValue} bedrooms`;
        }
      }

      // Handle bathrooms/bathrooms
      if (normalizedName === 'bathroom' || normalizedName === 'bathrooms') {
        if (isPrive) {
          return numValue === 1 ? `${numValue} bath` : `${numValue} baths`;
        } else {
          return numValue === 1
            ? `${numValue} bathroom`
            : `${numValue} bathrooms`;
        }
      }

      // For guests, use the base label
      return `${value} ${baseLabel}`;
    };

    // Map metrics to features with priority
    type FeatureWithPriority = {
      label: string;
      icon?: string;
      lucideIcon?: React.ComponentType<any>;
      priority: number;
      key: string;
    };

    const featuresWithPriority = property.metrics
      .map((metric: any): FeatureWithPriority | null => {
        const found = findFeature(metric.name);
        if (!found) return null;

        const priority = priorityOrder.indexOf(found.key);

        return {
          label: formatLabel(metric.value, found.feature.label, metric.name),
          icon: found.feature.icon,
          lucideIcon: found.feature.lucideIcon,
          priority: priority === -1 ? 999 : priority, // Lower priority number = higher priority
          key: found.key,
        };
      })
      .filter((item): item is FeatureWithPriority => item !== null);

    const uniqueFeatures = new Map<string, FeatureWithPriority>();
    featuresWithPriority.forEach((feature) => {
      const existing = uniqueFeatures.get(feature.key);
      if (!existing || feature.priority < existing.priority) {
        uniqueFeatures.set(feature.key, feature);
      }
    });

    // Sort by priority (lower number = higher priority), then take top 3
    const features = Array.from(uniqueFeatures.values())
      .sort(
        (a: FeatureWithPriority, b: FeatureWithPriority) =>
          a.priority - b.priority
      )
      .slice(0, 3)
      .map(({ priority, key, ...rest }) => rest); // Remove priority and key from final output

    if (features.length === 0) return null;

    return (
      <div
        className={cn(
          'flex items-center text-xs mt-2 w-full',
          // Base styles (non-prive)
          'flex-wrap md:gap-x-0.5 lg:gap-x-1 text-primary-800',
          // Prive styles
          {
            'justify-between text-white mt-0': isPrive,
            'text-[10px] md:text-xs lg:text-sm': isPrive,
          }
        )}
      >
        {features.map((feature: any, index: number) => (
          <React.Fragment key={index}>
            <span
              className={cn(
                'flex flex-wrap items-center justify-center gap-2 whitespace-nowrap',
                {
                  'gap-1 md:gap-2': isPrive,
                }
              )}
            >
              {feature.icon && (
                <div
                  className={cn('flex-shrink-0 w-4 h-4', {
                    'w-[10px] h-[10px] md:w-4 md:h-4 lg:w-5 lg:h-5': isPrive,
                  })}
                >
                  <CustomImage
                    format='svg'
                    src={feature.icon}
                    alt={feature.label}
                    className={cn('flex-shrink-0 w-4 h-4', {
                      'w-[10px] h-[10px] md:w-4 md:h-4 lg:w-4 lg:h-4': isPrive,
                    })}
                    width={12}
                    height={12}
                  />
                </div>
              )}
              {feature.lucideIcon && (
                <feature.lucideIcon className='w-[10px] h-[10px] md:w-5 md:h-5 fill-[white]' />
              )}
              <span className='leading-none dark:text-primary-100'>
                {feature.label}
              </span>
            </span>
            {index < features.length - 1 && (
              <span
                className={cn(
                  'h-3 w-px flex-shrink-0 self-center',
                  'bg-primary-300 mx-2',
                  {
                    'bg-primary-400': isPrive,
                  }
                )}
              ></span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const cardClasses = cn(
    'relative transition-all duration-300 w-full p-2 shadow-none',
    {
      'cursor-pointer hover:border-1': isClickable,

      'group gap-2! border-1 border-transparent hover:border-1 hover:shadow-sm bg-primary-50 hover:border-primary-200 hover:bg-primary-50 flex flex-col gap-0 dark:bg-[var(--grey8)] dark:text-primary-100 dark:border-[var(--primary-800)]':
        variant === 'default',

      'bg-primary-950 border-2 border-transparent  flex flex-col gap-0':
        variant === 'prive-default',

      'bg-transparent border-0 flex flex-col gap-0': variant === 'prive-home',

      'aspect-[4/3] py-6 px-2': variant === 'prive-home' && !isMobile,

      'aspect-[2/3]': variant === 'prive-home' && isMobile,
    },
    className
  );

  const imageContainerClasses = cn('relative overflow-hidden', {
    'rounded-xl aspect-video w-full md:h-[270px] h-[260px]':
      variant === 'default' || variant === 'prive-default',
    'rounded-xl w-full h-full aspect-square md:aspect-[4/3] ':
      variant === 'prive-home',
  });

  const propertyCardLink = `/villa-in-${property?.citySlug}/${property?.slug}${queryString ? `${queryString}` : `?${peram}`}`;

  //  prive home  variants
  if (variant === 'prive-home') {
    return (
      <Link
        href={propertyCardLink}
        className='group'
        aria-label={property?.name}
        target={isMobile ? '_self' : `listing_${propertyCardLink}`}
        passHref
        prefetch={false}
        onClick={() => {
          if (onCardClick) {
            onCardClick(property?.id || '');
          }
        }}
      >
        <div
          ref={cardRef}
          className='group relative transition-all duration-300 w-full cursor-pointer bg-transparent'
        >
          <Card className='relative overflow-hidden rounded-2xl p-0 border-0 shadow-none bg-transparent'>
            <div className={imageContainerClasses}>
              {shouldLoadImage ? (
                <CustomImage
                  src={`${property?.images?.[0]?.url}`}
                  alt={property?.images?.[0]?.name || 'Property'}
                  className='object-cover w-full h-full'
                  width={720}
                  height={480}
                  quality={20}
                  priority={priority}
                  objectFit='cover'
                />
              ) : (
                <div className='bg-primary-100 w-full h-full animate-pulse' />
              )}

              {/* Features Bar Overlay */}
              {isRenderFeatures && (
                <div className='absolute bottom-6 left-3 right-3 z-20'>
                  <div className='max-w-xs md:max-w-sm mx-auto flex flex-row items-center py-3 px-3 md:px-5 md:py-3 w-full bg-black/15 shadow-[0px_0px_18px_rgba(93,93,93,0.25)] backdrop-blur-[25px] rounded-[24px]'>
                    {renderFeatures()}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Property Details Below Card */}
          <div className='mt-3 md:mt-4 text-center md:text-left'>
            <h3 className='text-white text-xl md:text-xl font-serif font-semibold md:mb-0'>
              {property.name?.split('|')?.[0]}
            </h3>
            <p className='text-white/80 text-xs'>
              {property.location}, {property.city}
            </p>
          </div>

          {!isMobile && showActionButton && (
            <button className='absolute bottom-0 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 cursor-pointer hover:bg-white/30'>
              <ArrowUpRight className='h-6 w-6' />
            </button>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={propertyCardLink}
      className='group'
      aria-label={property?.name}
      target={isMobile ? '_self' : `listing_${propertyCardLink}`}
      passHref
      prefetch={isMobile ? true : false}
    >
      <Card
        ref={cardRef}
        className={cardClasses}
        onClick={handleCardClick}
        // onMouseEnter={() => setIsHovered(true)}
        // onMouseLeave={() => setIsHovered(false)}
        // onMouseOut={() => setIsHovered(false)}
      >
        <div className={imageContainerClasses}>
          {showBrandLogo && (
            <>
              {property?.isPrive && (
                <div
                  className='absolute top-3.5 left-3.5 z-10 w-[54px] h-[52px] flex items-center justify-center rounded-lg shadow-sm'
                  style={{
                    background:
                      'conic-gradient(from 70.97deg at 10.54% -10.5%, #B18457 0deg, #3C2309 210.6deg, #B18457 360deg)',
                  }}
                >
                  <PriveBrandLogo className='h-5 w-auto max-w-full object-contain' />
                </div>
              )}
              {!property?.isPrive && property?.brand == 'ALAYASTAYS' && (
                <div className='absolute top-3.5 left-3.5 z-10 w-[54px] h-[52px] flex items-center justify-center bg-black rounded-lg shadow-sm'>
                  <AlayaStaysBrandLogo className='w-auto max-w-full object-contain' />
                </div>
              )}
              {!property?.isPrive && property?.brand !== 'ALAYASTAYS' && (
                <div className='absolute top-3.5 left-3.5 z-10 w-[54px] h-[52px] flex items-center justify-center bg-white rounded-lg shadow-sm'>
                  <ElivaasBrandLogo className=' w-auto max-w-full object-contain' />
                </div>
              )}
            </>
          )}
          <SliderItemComponent
            slides={
              property?.images?.map((image) => ({
                url: image.url,
                name: image.name || '',
              })) || []
            }
            autoPlay={isHovered}
            shouldLoadFirstImage={shouldLoadImage}
            priority={priority}
          />

          {renderBadges()}
          {property?.isPetFriendly && (
            <div className='absolute bottom-3 left-3 z-10 bg-white backdrop-blur-md rounded-full p-1'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -25 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PawPrint className='h-5 w-5 text-primary-500' />
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className='font-semibold dark:text-primary-100'>
                  Pet Friendly
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          {showActionButton && (
            <button className='absolute bottom-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white'>
              <ArrowUpRight className='h-5 w-5' />
            </button>
          )}
        </div>
        <CardContent
          className={cn('flex-grow', {
            'px-2': variant === 'default' || variant === 'prive-default',
          })}
        >
          <div className={cn('flex flex-col gap-0 mb-2')}>
            <h5
              className={cn('font-serif text-foreground', {
                'text-lg text-white': variant === 'prive-default',
                'text-lg sm:text-xl truncate': variant === 'default',
              })}
            >
              {property?.name}
            </h5>

            <div className='flex justify-between items-center text-xs text-foreground w-full'>
              <p>
                {property?.location},&nbsp;{property?.city}
              </p>
              <div>{renderRating()}</div>
            </div>
          </div>

          {isRenderFeatures && renderFeatures()}
          {isRenderAmenities && renderAmenities()}
        </CardContent>
        {!isRenderFeatures && <div className='h-1'></div>}

        {isRenderPrice && (
          <>
            <CardFooter
              className={cn({
                'p-2 pb-0': variant === 'default' || variant == 'prive-default',
                'pt-3': true,
              })}
            >
              {renderPrice()}
            </CardFooter>
            {property.quotes?.[0]?.shortDescription &&
              property.quotes?.[0]?.icon && (
                <Suspense
                  fallback={
                    <div className='text-center text-xs text-foreground'>
                      ...
                    </div>
                  }
                >
                  <PropertyCardVisaBanner
                    offerIcon={property.quotes?.[0].icon}
                    shortDescription={mapAlayaStaysVisaShortDescription(
                      property?.brand,
                      property.quotes?.[0].shortDescription
                    )}
                  />
                </Suspense>
              )}
          </>
        )}
      </Card>
    </Link>
  );
};

export default React.memo(PropertyCard);
