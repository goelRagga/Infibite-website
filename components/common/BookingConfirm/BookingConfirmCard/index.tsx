'use client';

import CustomImage from '@/components/common/CustomImage';
import Svg from '@/components/common/Shared/Svg';
import { Badge } from '@/components/ui';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import useIsLarge from '@/hooks/useIsLarge';
import { cn } from '@/lib/utils';
import { BookingConfirmCardProps } from 'booking-card';
import { Star } from 'lucide-react';
import StackedImages from '@/components/common/StackedImages';

const BookingConfirmCard: React.FC<BookingConfirmCardProps> = ({
  booking,
  bookingId,
  isBookingConfirm = false,
  isBookingList = false,
  isReviewBooking = false,
  hideRating = false,
  hideBorderBottom = false,
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isLarge = useIsLarge();

  const isMultiVillaBooking = Boolean(booking?.isGroupBooking);
  const metrics = isMultiVillaBooking
    ? booking?.childBookings?.[0]?.property?.metrics
    : booking?.property?.metrics || booking?.metrics;
  const propertyData = isMultiVillaBooking
    ? booking?.childBookings?.[0]?.property
    : booking?.property || booking;
  const otherProperties = isMultiVillaBooking
    ? booking?.childBookings?.filter((b: any) => b.id !== booking?.id)
    : [];

  const getMetricValue = (name: string) => {
    return metrics?.find(
      (m: any) => m.name.toLowerCase() === name.toLowerCase()
    )?.value;
  };

  const getBedroomValue = () => {
    const value = getMetricValue('Bedroom') || getMetricValue('Bedrooms');
    if (!value) return null;
    const numValue = Number(value);
    return numValue > 1 ? `${numValue} Bedrooms` : `${numValue} Bedroom`;
  };

  const getBathroomValue = () => {
    const value = getMetricValue('Bathroom') || getMetricValue('Bathrooms');
    if (!value) return null;
    const numValue = Number(value);
    return numValue > 1 ? `${numValue} Bathrooms` : `${numValue} Bathroom`;
  };

  const renderMetricItem = (
    name: string,
    fallback: string,
    iconSrc: string
  ) => {
    // Handle Bedrooms and Bathrooms with singular/plural logic
    let displayText = '';
    if (name === 'Bedrooms') {
      const bedroomValue = getBedroomValue();
      displayText = bedroomValue || fallback;
    } else if (name === 'Bathrooms') {
      const bathroomValue = getBathroomValue();
      displayText = bathroomValue || fallback;
    } else {
      // For other metrics like Guests, use the original logic
      const value = getMetricValue(name);
      displayText = value ? `${value} ${name}` : fallback;
    }

    if (!displayText) return null;

    return (
      <div className='flex items-center gap-1'>
        {!isTablet && (
          <Svg
            height='14'
            width='14'
            src={`${process.env.IMAGE_DOMAIN}/${iconSrc}`}
            className='mr-1 [&>svg>path]:fill-primary-200 dark:stroke-primary-200 dark:fill-primary-200'
          />
        )}

        <span className='lowercase text-white md:text-primary-800 dark:text-primary-200'>
          {displayText}
        </span>
      </div>
    );
  };

  // Special mobile booking list card
  if (isBookingList && isTablet) {
    return (
      <div className='flex items-center gap-4 rounded-xl py-3 px-3 overflow-hidden max-w-xs md:min-w-full lg:w-full'>
        <div
          className={cn(
            'w-24 lg:w-32 h-20 relative',
            isMultiVillaBooking && 'mb-3'
          )}
        >
          <div className='h-full w-full rounded-xl overflow-hidden flex-shrink-0 relative'>
            <CustomImage
              src={
                propertyData?.image ||
                propertyData?.defaultMedia?.url ||
                `${process.env.IMAGE_DOMAIN}/IMG_5474_HDR_95f14a6072.webp`
              }
              alt='Property View'
              className='object-cover w-full h-full'
              width={150}
              height={150}
            />
            <div
              className={`absolute left-0 top-0 w-full h-full`}
              style={{
                background: 'var(--backgroundGradient9)',
              }}
            ></div>
          </div>
          <StackedImages
            max={3}
            items={
              otherProperties?.map((b: any) => ({
                image: b.property?.image,
                fallback: b.property?.name,
              })) || []
            }
            className='absolute -bottom-3 left-1/2 transform -translate-x-1/2 '
            maxString='Villas'
          />
        </div>

        <div className='flex-1 min-w-0'>
          {isMultiVillaBooking && (
            <Badge className='mb-2 bg-accent-green-700 text-white text-[10px] font-normal flex items-center justify-center px-2 py-1 rounded-md'>
              Multi-Villa Booking
            </Badge>
          )}
          <h2 className='truncate font-serif font-normal text-xl leading-none text-[#3d2c29] dark:text-white'>
            {propertyData?.name}
          </h2>
          <div className='truncate font-sans font-normal text-xs leading-normal text-[#6d5750] dark:text-white mt-1'>
            {propertyData?.location}, {propertyData?.state}
          </div>
          {!isMultiVillaBooking && (
            <div className='flex mt-2 gap-1 lg:gap-2 gap-y-0 font-sans font-normal text-[10px] md:text-xs leading-normal text-[#6d5750] dark:text-white flex-wrap'>
              <span className='whitespace-nowrap'>
                {getMetricValue('Guests') || '-'} guests
              </span>
              <span className='dark:text-[#B18457]'>|</span>
              <span className='whitespace-nowrap'>
                {getBedroomValue() || '-'}
              </span>
              <span className='dark:text-[#B18457]'>|</span>
              <span className='whitespace-nowrap'>
                {getBathroomValue() || '-'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <>
      <div
        className={cn(
          `
        ${
          isBookingConfirm
            ? 'rounded-tl-2xl rounded-tr-2xl'
            : isTablet
              ? 'rounded-tl-none rounded-tr-none'
              : 'rounded-tl-lg rounded-tr-lg'
        }
        ${!hideBorderBottom && 'border-b border-b-primary-100 dark:border-secondary-950'} overflow-hidden
      `,
          'bg-[var(--brown1)] dark:bg-[var(--grey6)] dark:border-primary-800 dark:rounded-none'
        )}
      >
        <div className='flex relative flex-col md:flex-row items-center md:items-start gap-4 p-0 md:p-6'>
          <div
            className={cn(
              'w-full md:w-3/12 relative',
              isBookingList && !isTablet
                ? 'w-[224px] h-[126px]'
                : isBookingConfirm
                  ? 'h-[150px] md:h-[130px]'
                  : isReviewBooking && isTablet
                    ? 'w-full h-[200px] md:h-[100px]'
                    : 'h-[300px] md:h-[130px]'
            )}
          >
            <div className='md:rounded-xl overflow-hidden order-1 md:order-1 relative h-full w-full sm:max-w-[220px]'>
              <CustomImage
                priority
                src={
                  propertyData?.image ||
                  propertyData?.defaultMedia?.url ||
                  `${process.env.IMAGE_DOMAIN}/IMG_5474_HDR_95f14a6072.webp`
                }
                alt='Property View'
                className='object-cover h-full'
                // width={isBookingConfirm ? 568 : 720}
                // height={isBookingConfirm ? 378 : 600}
                width={720}
                height={600}
                quality={20}
              />
              {isTablet && (
                <div
                  className={`absolute left-0 top-0 w-full h-full`}
                  style={{
                    background: 'var(--backgroundGradient9)',
                  }}
                ></div>
              )}
              {isTablet && (
                <div
                  className='absolute left-0 top-0 w-full h-full'
                  style={{ background: 'var(--backgroundGradient9)' }}
                ></div>
              )}
              {isMultiVillaBooking && (
                <div className='bg-accent-green-700 text-white text-[10px] font-medium absolute top-0 w-full flex items-center justify-center py-1.5'>
                  Multi-Villa Booking
                </div>
              )}
            </div>
            <StackedImages
              max={3}
              items={
                otherProperties?.map((b: any) => ({
                  image: b.property?.image,
                  fallback: b.property?.name,
                })) || []
              }
              className='absolute -bottom-3 left-1/2 transform -translate-x-1/2 '
              maxString='Villas'
              size='lg'
            />
          </div>

          <div
            className={`absolute ${
              isBookingConfirm ? 'bottom-1.5' : 'bottom-10'
            }  left-1/2 -translate-x-1/2 z-30 py-2 md:static md:left-auto md:bottom-auto md:translate-x-0 flex-1 space-y-2 order-2 md:order-2 w-full text-center md:text-left`}
          >
            <div className='text-center md:text-start md:flex mb-0.5 md:mb-2 px-4 sm:px-0'>
              <h1 className='text-xl md:text-2xl font-serif text-white md:text-foreground dark:text-white leading-none px-2 md:px-0 line-clamp-2'>
                {propertyData?.name}
              </h1>
            </div>

            <p
              className={`text-xs md:text-sm text-white md:text-foreground dark:text-white flex items-center justify-center md:justify-start ${
                !isBookingConfirm && isTablet ? 'mb-3 mt-1' : ''
              }`}
            >
              {propertyData?.location}, {propertyData?.state}{' '}
              {!isTablet && !hideRating && propertyData?.review?.rating && (
                <div className='ml-3 flex items-center space-x-2 text-foreground text-xs'>
                  <Star
                    strokeWidth={0}
                    className='h-5 mr-1 w-5 fill-accent-yellow-400 text-accent-yellow-400'
                  />
                  <span className='font-semibold text-sm'>
                    {propertyData?.review?.rating}
                  </span>
                </div>
              )}
            </p>

            {!isBookingConfirm && isTablet && !isReviewBooking && (
              <span
                className='p-2 rounded-lg text-xs text-white md:text-foreground font-semibold border border-secondary-200 dark:border-secondary-800'
                style={{
                  background: 'var(--white4)',
                }}
              >
                Booking ID: <span>{bookingId}</span>
              </span>
            )}
            {isReviewBooking && isTablet && booking?.metrics?.length > 0 && (
              <div className='mt-2 text-xs text-white text-center md:text-secondary-800 md:text-start'>
                {booking.metrics.map((metric: any, idx: number, arr: any[]) => {
                  const metricName = metric.name.toLowerCase();
                  const value = Number(metric.value);
                  let displayText = '';

                  if (metricName === 'bedroom' || metricName === 'bedrooms') {
                    displayText =
                      value > 1 ? `${value} bedrooms` : `${value} bedroom`;
                  } else if (
                    metricName === 'bathroom' ||
                    metricName === 'bathrooms'
                  ) {
                    displayText =
                      value > 1 ? `${value} bathrooms` : `${value} bathroom`;
                  } else {
                    displayText = `${metric.value} ${metricName}`;
                  }

                  return (
                    <span key={metric.name} className='whitespace-nowrap'>
                      {displayText}
                      {idx < arr.length - 1 && (
                        <span className='mx-1 dark:text-white'>|</span>
                      )}
                    </span>
                  );
                })}
              </div>
            )}

            {(!isTablet || (isTablet && isBookingConfirm)) && (
              <div className='flex flex-wrap justify-center md:justify-start gap-x-3 md:gap-x-6 mt-1 md:gap-y-2 text-xs text-white md:text-primary-800 dark:text-white md:mt-4'>
                {renderMetricItem('Guests', '', 'groups_b43ae0fefb.svg')}
                <span className='text-prive-dawnpink dark:text-[#B18457]'>
                  |
                </span>
                {renderMetricItem('Bedrooms', '', 'bed_4c0bf4571f.svg')}
                <span className='text-prive-dawnpink dark:text-[#B18457]'>
                  |
                </span>
                {renderMetricItem('Bathrooms', '', 'shower_c40792b7f7.svg')}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingConfirmCard;
