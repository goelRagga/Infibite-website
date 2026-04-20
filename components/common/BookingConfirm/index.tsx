'use client';

import { SideImageTitleCount } from '@/components/common/SideImageTitleCount';
import ContactCTA from '@/components/modules/PropertyDetails/ContactCTA';
import { Button, Separator } from '@/components/ui';
import { useEffect, useRef, useState } from 'react';

import CustomBreadcrumb from '@/components/common/Breadcrumbs';
import MobileHeader from '@/components/common/MobileHeader';
import PendingAmountCard from '@/components/common/PendingAmountCard';
import PrimaryGuestDetailCard from '@/components/common/PrimaryGuestDetailCard';
import EazyDinerPromoCard from '@/components/common/PromoCode';
import { Spinner } from '@/components/common/Spinner';
import { PolicyCard } from '@/components/modules/PropertyDetails/CancellationPolicy';
import MapInfo from '@/components/modules/PropertyDetails/Location';
import PriceBreakdown from '@/components/modules/PropertyDetails/PriceBreakdown';
import { useSecurityDepositContext } from '@/contexts/SharedProvider';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import { trackEvent } from '@/lib/mixpanel';
import { SECURITY_DEPOSIT_DETAILS, VERIFY_PAYMENT } from '@/lib/queries';
import { formatPrice } from '@/lib/utils';
import { sendGTMEvent } from '@next/third-parties/google';
import { SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useClient } from 'urql';
import ElicashPaymentCard from '../ElicashPaymentCard';
import SecurityDepositSection from '../SecurityDeposit';
import Availability from './Availability';
import BookingConfirmCard from './BookingConfirmCard';
import ConfirmationMessageBox from './ConfirmationMessageBox';
import SpecialRequests from './SpecialRequests';

// Type definitions
interface ValueAddedService {
  name: string;
  quantity: number;
  image: string;
  netAmountBeforeTax: number;
}

interface SecurityDeposit {
  securityDepositStatus?: string;
  originalSecurityDepositAmount?: number;
}

interface BookingDetailProps {
  bookingId?: string;
  isBookingConfirm?: boolean;
  data?: any;
  isPrive?: boolean;
}

const BookingDetail: React.FC<BookingDetailProps> = ({
  bookingId,
  isBookingConfirm,
  data,
  isPrive,
}) => {
  const manageBooking = 'Manage Booking';
  const contactUs = 'Contact Us';
  const upgradeYourStay = 'Upgrade Your Stay';
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [showMore, setShowMore] = useState(false);
  const client = useClient();
  const router = useRouter();

  // Apply dark mode if isPrive is true
  useEffect(() => {
    if (isPrive) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [isPrive]);

  const [isverifyDetail, setVerifyDetail] = useState<any>();
  const [isverifyErrorDetail, setVerifyErrorDetail] = useState<any>();
  const [isverifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [securityDeposit, setSecurityDeposit] =
    useState<SecurityDeposit | null>(null);

  const visibleItems =
    isMobile && !showMore
      ? data?.valueAddedServices?.slice(0, 2)
      : data?.valueAddedServices;

  const bookingCode = data?.bookingId || bookingId;

  const breadcrumb = [
    { href: '/', label: 'Home' },
    {
      href: `/my-bookings/`,
      label: 'My Bookings',
    },
    {
      href: '/',
      label: bookingCode || '',
    },
  ];

  useEffect(() => {
    const verifyPayment = async (): Promise<void> => {
      try {
        const result = await client
          .query(VERIFY_PAYMENT, { paymentId: bookingId })
          .toPromise();

        if (result.error) throw result.error;

        setVerifyDetail(result.data?.verifyPayment ?? null);
        setVerifyLoading(false);
      } catch (error: any) {
        setVerifyLoading(false);
        if (error?.graphQLErrors?.length > 0) {
          setVerifyErrorDetail(error.graphQLErrors[0]);
        } else {
          setVerifyErrorDetail({
            message: 'An unexpected error occurred',
            locations: [],
            extensions: {
              message: 'An unexpected error occurred',
              classification: 'INTERNAL_ERROR',
            },
          });
        }
        console.error(error);
      }
    };

    if (bookingId && bookingId.includes('pay') && isBookingConfirm) {
      setVerifyLoading(true);
      void verifyPayment(); // 👈 mark async call explicitly
    }
  }, [bookingId, isBookingConfirm, client]);

  useEffect(() => {
    if (isverifyDetail?.status && isverifyDetail?.bookingId) {
      router.replace(
        `/booking_confirm/${isverifyDetail?.bookingId}?status=${isverifyDetail?.status}`,
        {
          scroll: false,
        }
      );
    }
  }, [isverifyDetail, router]);

  useEffect(() => {
    // GTM tracking event Pay Now Click
    const booking = data;
    if (booking && booking.id !== null && isBookingConfirm) {
      sendGTMEvent({
        event: 'confirm_booking',
        value: booking?.actualPaidAmount,
        transaction_id: bookingId,
        userData: {
          booking_id: bookingId,
          email: booking?.user?.email,
          mobile: booking?.user?.phone,
          totalAmount: booking?.actualPaidAmount,
        },
      });
      trackEvent('booking_success_viewed', {
        phone: booking?.user?.phone,
        bookingId: bookingId,
        paidAmount: booking?.actualPaidAmount,
        email: booking?.user?.email,
        mobile: booking?.user?.phone,
        Guests: booking?.numberOfGuest,
        Nights: booking?.numberOfNights,
        paymentType: booking?.paymentStatus,
        meanPlan: booking?.ratePlanName,
        outstandingAmount: booking?.outstandingAmount,
        'property city': booking?.property?.city,
        propertyName: booking?.property?.name,
        booking_amount: booking?.actualPaidAmount,
        property_name: booking?.property?.name,
        property_id: booking?.property?.id,
      });
    }
  }, [data]);

  const renderPaymentDetails = (amount: number | undefined | null | string) => {
    return (
      <div>
        <h3 className='text-xl space-y-1 font-serif text-foreground px-5'>
          Payment Details
        </h3>
        <div className='flex justify-between px-5 mt-2'>
          <span className='text-foreground text-sm font-semibold'>
            Amount Paid
          </span>
          <span className='text-foreground text-sm font-semibold'>
            ₹ {formatPrice(amount)}
          </span>
        </div>
      </div>
    );
  };
  const { depositPaymentDetail, setDepositPaymentDetail } =
    useSecurityDepositContext();

  const getSecurityDepositDetail = async () => {
    try {
      const result = await client
        .query(
          SECURITY_DEPOSIT_DETAILS,
          { bookingId },
          {
            fetchOptions: {
              headers: {
                'Channel-Id': process.env.NEXT_PUBLIC_CHANNEL_ID || '',
              },
            },
          }
        )
        .toPromise();

      if (result.error) {
        throw result.error;
      }

      setDepositPaymentDetail(result.data?.securityDeposit ?? null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (bookingId) {
      getSecurityDepositDetail();
    }
  }, [bookingId]);

  const pricingDetailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      window.location.hash === '#pricingdetails' &&
      pricingDetailsRef.current
    ) {
      setTimeout(() => {
        pricingDetailsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [bookingId, depositPaymentDetail]);

  return (
    <>
      {isTablet && (
        <MobileHeader
          title={isBookingConfirm ? 'Booking Status' : 'Manage Booking'}
        />
      )}
      {!isTablet && !isBookingConfirm && (
        <div className='w-full md:px-10 md:pt-6'>
          <CustomBreadcrumb items={breadcrumb} />
        </div>
      )}

      {isBookingConfirm && isverifyLoading && (
        <div className='w-full h-screen flex items-center justify-center z-10 fixed top-0 left-0 right-0 bottom-0 bg-white dark:bg-[var(--black5)]'>
          <Spinner size='lg' />
        </div>
      )}

      {isBookingConfirm && (
        <ConfirmationMessageBox
          name={data?.user?.name}
          bookingId={bookingId}
          bookedOn={data?.bookingDate}
          checkinDate={data?.checkinDate}
          checkoutDate={data?.checkoutDate}
          propertyLocation={data?.property?.location}
          propertyName={data?.property?.name}
        />
      )}
      {!isBookingConfirm && isTablet && (
        <BookingConfirmCard
          booking={data?.property}
          isBookingConfirm={isBookingConfirm}
          bookingId={data?.id}
        />
      )}

      <div
        className={`w-full ${
          isBookingConfirm ? '' : ''
        }p-5 md:pt-6 md:pb-10 md:pl-10 md:pr-10 grid grid-cols-12 gap-6 relative z-1`}
      >
        <div
          className={`col-span-12 lg:col-span-8 space-y-6 ${
            !isBookingConfirm && isTablet ? 'mt-[-40px]' : ''
          }  md:mt-0`}
        >
          <div
            className={`rounded-lg bg-card dark:bg-[var(--black5)] dark:border-primary-800 dark:border-0 overflow-hidden`}
          >
            {(isBookingConfirm || (!isBookingConfirm && !isTablet)) && (
              <BookingConfirmCard
                booking={data?.property}
                isBookingConfirm={isBookingConfirm}
                bookingId={data?.id}
              />
            )}

            <Availability booking={data} />
            <SpecialRequests hideSpecialRequests={true} booking={data} />
          </div>
          {isTablet && (
            <PrimaryGuestDetailCard
              isBookingConfirm={isBookingConfirm}
              user={data?.user}
              className={
                isTablet && !isBookingConfirm ? 'mb-0' : 'mb-5 border-0'
              }
              isCancellationPlan={
                data?.cancellationPlan?.discountAmount !== 0 &&
                data?.cancellationPlan !== null
              }
            />
          )}
          {visibleItems && visibleItems.length > 0 && (
            <div className='py-6 px-4 md:p-6 bg-card rounded-2xl col-span-12 lg:col-span-8 space-y-6 dark:bg-[var(--black5)]'>
              <h3 className='text-xl md:text-2xl font-serif mb-5 text-foreground'>
                {upgradeYourStay}
              </h3>

              {/* Service List */}
              <div
                className={`grid gap-0 transition-all duration-600 ease-in-out ${
                  showMore ? 'grid-rows-1' : 'grid-rows-2'
                } overflow-hidden`}
                style={{
                  gridTemplateRows: showMore
                    ? 'repeat(auto-fill, minmax(80px, 1fr))'
                    : 'repeat(2, auto)',
                }}
              >
                <div
                  className={`grid gap-4 ${
                    isTablet ? 'grid-cols-1' : 'grid-cols-2'
                  } sm:grid-cols-2 transition-all duration-600 ease-in-out ${
                    showMore ? 'opacity-100' : 'opacity-100'
                  }`}
                >
                  {visibleItems.map(
                    (service: ValueAddedService, index: number) => (
                      <SideImageTitleCount
                        key={index}
                        imageUrl={service.image}
                        name={service.name}
                        quantity={service.quantity}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Show "More Details" button only if there are 3 or more services */}
              {data?.valueAddedServices?.length >= 3 && isTablet && (
                <>
                  <Separator className='border border-t-primary-100 mb-2 dark:border-primary-800' />
                  <div className='pt-3.5'>
                    <button
                      className='text-xs font-semibold text-primary-400 w-full justify-between flex items-center gap-1 transition-all duration-200 hover:text-primary-500 dark:text-primary-100'
                      onClick={() => setShowMore((prev) => !prev)}
                      aria-expanded={showMore}
                    >
                      {showMore ? 'Less Details' : 'More Details'}
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${
                          showMore ? 'rotate-180' : ''
                        }`}
                        fill='none'
                        stroke='currentColor'
                        strokeWidth={2}
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M19 9l-7 7-7-7'
                        />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          {data?.rewards != null && (
            <div className='bg-card rounded-2xl'>
              <EazyDinerPromoCard
                description={data?.rewards?.[0]?.description}
                couponCode={data?.rewards?.[0]?.code}
              />
            </div>
          )}
          {!isBookingConfirm && (
            <div className='bg-card rounded-2xl px-4 py-6 md:p-6'>
              <h3 className='text-xl mb-5 sm:text-2xl font-serif'>
                Getting There
              </h3>
              <MapInfo
                googleMapEmbedLink={data?.property?.googleMapEmbedLink}
                isPrive={isPrive}
              />
            </div>
          )}
          {/* {spaces && !isBookingConfirm && (
            <div className='bg-card rounded-2xl px-4 py-6 md:p-6'>
              <SectionTemplate
                showDefaultArrows={false}
                id='Nearby Attractions'
              >
                <CarouselTemplate
                  heading='Nearby Attractions'
                  items={spaces || []}
                  slidesPerView={isMobile ? 1.3 : 3.5}
                  showArrows
                  renderItem={(item: Space) => (
                    <CarouselTemplate1 data={item} />
                  )}
                />
              </SectionTemplate>
            </div>
          )} */}
          {isTablet && isBookingConfirm && (
            <div className='space-y-4'>
              {data?.reward?.amount != null && (
                <ElicashPaymentCard
                  checked={false}
                  onChange={() => {}}
                  type='afterApply'
                  balance={data?.reward?.amount}
                />
              )}
            </div>
          )}
          {!isBookingConfirm && data?.cancellationPlan !== null && (
            <div className='bg-card rounded-2xl px-4 py-6 md:p-6'>
              <h3 className='text-xl mb-5 sm:text-2xl'>
                <span className='font-serif'>Cancellation Policy</span>{' '}
                <span className='bg-accent-green-700 text-white font-semibold text-xs rounded-xl px-2 py-1'>
                  {data?.cancellationPlan?.ruleName}
                </span>
              </h3>
              <PolicyCard
                title={data?.cancellationPlan?.ruleDescription}
                note={data?.cancellationPlan?.messages}
                color={'pink'}
              />
            </div>
          )}
          {!isBookingConfirm && isTablet && (
            <div className='mt-5'>
              {data?.reward?.amount != null && (
                <ElicashPaymentCard
                  checked={false}
                  onChange={() => {}}
                  type='afterApply'
                  balance={data?.reward?.amount}
                />
              )}
            </div>
          )}
          {isTablet && (
            <>
              {isBookingConfirm ? (
                <div className='md:border-primary-100 border-0 md:border rounded-2xl md:border-t py-3 space-y-4 mt-5 bg-card dark:bg-[var(--black5)] md:bg-white'>
                  {renderPaymentDetails(data?.actualPaidAmount)}
                </div>
              ) : (
                data.showPrice && (
                  <div className='md:border-primary-100 border-0 md:border rounded-2xl md:border-t py-3 space-y-4 mt-5 bg-card dark:bg-[var(--black5)] md:bg-white'>
                    <PriceBreakdown
                      priceData={data}
                      primaryClass='bg-card py-0'
                      mealCost={data?.mealCost}
                    />
                  </div>
                )
              )}

              {data?.outstandingAmount > 0 && (
                <div className='mt-5'>
                  <PendingAmountCard
                    outstandingAmount={data.outstandingAmount}
                    id={data?.id}
                  />
                </div>
              )}
            </>
          )}
          <div className='py-6 px-4 md:p-6 bg-card rounded-2xl flex flex-col gap-3 md:gap-4 dark:bg-[var(--black5)]'>
            <h3 className='text-xl md:text-2xl font-serif mb-1 text-foreground'>
              {contactUs}
            </h3>
            <ContactCTA pageName={'booking_details'} />
          </div>
        </div>

        {/* right side part */}
        <div className='col-span-12 lg:col-span-4 self-start '>
          {!isTablet && (
            <PrimaryGuestDetailCard
              isBookingConfirm={isBookingConfirm}
              user={data?.user}
              className={'mb-5'}
              isCancellationPlan={
                data?.cancellationPlan?.discountAmount !== 0 &&
                data?.cancellationPlan !== null
              }
            />
          )}

          {!isTablet && (
            <>
              {isBookingConfirm ? (
                <div
                  className='border-primary-100 border rounded-2xl py-3 space-y-4 mt-5 bg-white dark:bg-[var(--black5)] dark:border-secondary-950'
                  ref={pricingDetailsRef}
                  id='pricingdetails'
                >
                  {' '}
                  {renderPaymentDetails(data?.actualPaidAmount)}
                </div>
              ) : (
                data.showPrice && (
                  <div
                    className='border-primary-100 border rounded-2xl py-3 space-y-4 mt-5 bg-white dark:bg-[var(--black5)] dark:border-secondary-950'
                    ref={pricingDetailsRef}
                    id='pricingdetails'
                  >
                    <PriceBreakdown
                      priceData={data}
                      primaryClass='bg-white py-0'
                      mealCost={data?.mealCost}
                    />
                  </div>
                )
              )}

              {data?.outstandingAmount > 0 && (
                <div className='mt-5'>
                  <PendingAmountCard
                    outstandingAmount={data.outstandingAmount}
                    id={data?.id}
                  />
                </div>
              )}
            </>
          )}

          {!isTablet && isBookingConfirm && (
            <div className='md:static fixed bottom-0 left-0 right-0 z-[9999] mt-5 p-4 md:p-0 border-t md:border-0 border-primary-100 dark:border-secondary-950 bg-white dark:bg-[var(--black5)]'>
              {data?.reward?.amount != null && (
                <ElicashPaymentCard
                  checked={false}
                  onChange={() => {}}
                  type='afterApply'
                  balance={data?.reward?.amount}
                />
              )}
            </div>
          )}
          {/* <ElicashCard className='mb-5' /> */}
          {isBookingConfirm && (
            <div className='md:static fixed bottom-0 left-0 right-0 z-[9999] mt-5 p-4 md:p-0 border-t md:border-0 border-primary-100 dark:border-secondary-950 bg-white dark:bg-[var(--black5)]'>
              <Link href={`/booking-details/${bookingId}`} className='block'>
                <Button
                  variant='outline'
                  className='cursor-pointer w-full text-sm border border-accent-red-900 hover:bg-[var(--white3)] text-accent-red-900 font-semibold rounded-full px-4 py-6 dark:bg-[var(--black5)] dark:border-[var(--prive2)] dark:text-[var(--prive2)]'
                >
                  <SquareArrowOutUpRight className='w-5 h-5 scale-115' />
                  {manageBooking}
                </Button>
              </Link>
            </div>
          )}

          {!isBookingConfirm && !isTablet && (
            <div className='mt-5'>
              {data?.reward?.amount != null && (
                <ElicashPaymentCard
                  checked={false}
                  onChange={() => {}}
                  type='afterApply'
                  balance={data?.reward?.amount}
                />
              )}
            </div>
          )}
          {/* SECURITY DEPOSIT */}
          {!isBookingConfirm &&
            depositPaymentDetail &&
            !depositPaymentDetail.isOwnerBooking && (
              <div className='mt-5'>
                <SecurityDepositSection
                  bookingId={bookingId}
                  getSecurityDepositDetail={getSecurityDepositDetail}
                />
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default BookingDetail;
