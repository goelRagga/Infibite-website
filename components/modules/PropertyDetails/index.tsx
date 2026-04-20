'use client';
import {
  Badge,
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui';
import { useDateTooltip } from '@/hooks/useDateTooltip';
import { useFilters } from '@/hooks/filters/useFilters';
import { useGuests } from '@/hooks/filters/useGuests';
import useIsLarge from '@/hooks/useIsLarge';
import useIsMobile from '@/hooks/useIsMobile';
import Cookies from 'js-cookie';
import { AlertCircle, ArrowLeft, Award, Loader2, Share } from 'lucide-react';
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import dynamic from 'next/dynamic';
const DatePersuation = dynamic(
  () => import('@/components/common/DatePersuation'),
  {
    ssr: false,
    loading: () => null,
  }
);

import ElicashIcon from '@/assets/elicash.svg';
import { useCouponContext } from '@/contexts/coupons/useCouponContext';
import { Quote, Section, usePropertyContext } from '@/contexts/property';

// hooks
import { propertyDetailTabs } from '@/lib/constants';

// lib
import { GET_AMOUNT_DETAILS } from '@/lib/queries';
import { cn, generateQueryString } from '@/lib/utils';
import { differenceInDays, parseISO } from 'date-fns';

// components

import CustomBreadcrumb from '@/components/common/Breadcrumbs';
import { CarouselTemplate } from '@/components/common/Carousel';
import { CarouselTemplate1 } from '@/components/common/Carousel/CardTemplate';
import AIAssistant from '@/components/common/FaqAi';
// import { Coupons } from '@/components/common/Coupons';

// import ReusableCarousel from '@/components/common/ReusableCarousel';
import SecureBookingBanner from '@/components/common/SecureBookingBanner';
import { ShareButton, ShareModal } from '@/components/common/ShareModal';
import TabSlider from '@/components/common/TabSlider';
import { useAuth } from '@/contexts/SharedProvider';
import { useDebounce } from '@/hooks/useDebounce';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import useIsTablet from '@/hooks/useIsTablet';
import { useWallet } from '@/hooks/useWallet';
import { toast } from 'sonner';
import { CombinedError, useClient } from 'urql';
// import { AmenitiesSection } from './Amenities';
// import CancellationPolicy from './CancellationPolicy';
// import ContactCTA from './ContactCTA';
// import CouponBanner from './CouponBanner';
// import ElfSightWidget from './ElfSightWidget';
import { DetailMobileHeader } from './Header';
import ImageSection from './Image';
// import { MapInfo } from './Location';
// import { PriceActions } from './PriceActions';
// import { PriceBreakdown } from './PriceBreakdown';
// import CouponDiscountPopUp from '@/components/common/Coupons/CouponDiscountPopUp';
import { Template } from '@/components/common/Carousel/ReviewTemplate/Template';
import SimilarProperties from '@/components/common/SimilarProperties';
import SuspenseLoader from '@/components/common/SuspenseLoader';
import { VideoProvider } from '@/contexts/video-context';
import { trackEvent } from '@/lib/mixpanel';
import { addRecentlyViewedProperty } from '@/lib/similarProperties/recentlyViewed';
import { motion } from 'framer-motion';
import VillaDetails from './Info';
import PropertyDetailsTypes from './PropertyDetail.types';
import { SectionTemplate } from './Section';
import { DynamicDataWrapper } from '@/components/common/DynamicDataWrapper';
import { GET_HOME_PAGE_STORIES } from '@/lib/homePageQueries';
const CouponBanner = lazy(() => import('./CouponBanner'));
const Coupons = lazy(() => import('@/components/common/Coupons'));
const ElicashPaymentCard = lazy(
  () => import('@/components/common/ElicashPaymentCard')
);
const AmenitiesSection = lazy(() => import('./Amenities'));
const ContactCTA = lazy(() => import('./ContactCTA'));
// const VillaDetails = lazy(() => import('./Info'));

const CouponDiscountPopUp = lazy(
  () => import('@/components/common/Coupons/CouponDiscountPopUp')
);
// import FloatingCta from '@/components/common/FloatingCta';
const PriceBreakdown = lazy(() => import('./PriceBreakdown'));
const CancellationPolicy = lazy(() => import('./CancellationPolicy'));
// import AvailabilitySection from '@/components/common/AvailabilitySection';

const DiscountCard = lazy(() => import('@/components/common/DiscountCard'));
const AvailabilitySection = lazy(() =>
  import('@/components/common/AvailabilitySection').then((module) => ({
    default: module.default,
  }))
);
const ReusableCarousel = lazy(() =>
  import('@/components/common/ReusableCarousel').then((module) => ({
    default: module.default,
  }))
);
const AboutHome = lazy(() => import('@/components/common/About'));
const FloatingCta = lazy(() => import('@/components/common/FloatingCta'));
const ElfSightWidget = lazy(() => import('./ElfSightWidget'));
const PriceActions = lazy(() =>
  import('./PriceActions').then((module) => ({ default: module.default }))
);
const MapInfo = lazy(() => import('./Location'));
// Lazy load mobile-specific components for better mobile performance
const MobileAvailabilitySection = lazy(
  () => import('@/components/common/AvailabilitySection')
);
const MobilePriceTag = lazy(() => import('./PriceTag/PriceTag'));
const MobilePriceBreakdown = lazy(() =>
  import('./PriceBreakdown').then((module) => ({
    default: module.default,
  }))
);
const MobilePriceActions = lazy(() =>
  import('./PriceActions').then((module) => ({ default: module.default }))
);
const MobileCouponBanner = lazy(() => import('./CouponBanner'));

const PropertyDetailModule: React.FC<
  PropertyDetailsTypes.PropertyDetailProps
> = ({
  propertyInfo,
  valueAddedServices,
  initialOffers,
  stayStories,
  pageName,
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isLarge = useIsLarge();
  const client = useClient();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isCouponClicked, setIsCouponClicked] = useState(false);
  const [isAmountDetails, setIsAmountDetails] = useState<boolean>(false);
  const [isPropertySoldOut, setIsPropertySoldOut] = useState<boolean>(false);
  const [isPropertyError, setIsPropertyError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileBookNowLoading, setMobileBookNowLoading] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [autoOpenCalendar, setAutoOpenCalendar] = useState(false);
  const [showMobileHeader, setShowMobileHeader] = useState(false);
  const offersData = initialOffers;
  const accessToken = Cookies.get('accessToken');
  const utmSource = Cookies.get('utm_source');
  const isCorporateChannel = Cookies.get('isCorporateChannel');
  const { urlParams } = useFilters();
  const { guestsData, updateGuestData } = useGuests();
  const { amountDetails, setAmountDetails } = usePropertyContext();
  const appSearchParams = urlParams.getAllParams();
  const { setLoginOpen } = useAuth();
  const { wallet } = useWallet();
  const walletAmount = wallet?.amount ?? 0;
  const propertyID = propertyInfo ? propertyInfo.id : '';
  const checkin = appSearchParams.checkin;
  const checkout = appSearchParams.checkout;
  const adults = appSearchParams.adults;
  const children = appSearchParams.children;
  const baseQueryParams = { checkin, checkout, adults, children };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowMobileHeader(true);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  // Intersection observer for lazy loading sections
  const vasSection = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '200px',
    triggerOnce: true,
  });

  const mealPlanCode = appSearchParams.mealPlan;
  const lastApiPayloadRef = useRef<string>('');

  const {
    bankOffer,
    setBankOffer,
    prevBankOffer,
    customCoupon,
    prevCustomCoupon,
    setCustomCoupon,
    setIsCouponError,
    setIsCouponErrorMessage,
    setOpenCustomCouponDialog,
    setIsBankOfferLoading,
    setIsCustomCouponLoading,
    setAppliedBankOffers,
    setAppliedCoupons,
    updateAutoApplyBankOffer,
    autoApplyCoupon,
  } = useCouponContext();

  const handleCouponBannerClick = () => {
    if (offersData.length > 0 && isAmountDetails) {
      setIsCouponClicked(true);
    }
  };

  const handleDesktopShareClick = () => {
    trackEvent('share_property_clicked', {
      page_name: pageName,
      property_id: propertyInfo?.id,
      property_name: propertyInfo?.name,
      is_checkin_out_entered: Boolean(checkin && checkout),
    });

    setShareModalOpen(true);
  };

  // Helper function to generate booking URL with current search params
  const generateBookingUrl = () => {
    const currentParams = urlParams.getAllParams();
    const queryParams = new URLSearchParams();
    Object.entries(currentParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.set(key, String(value));
      }
    });
    const queryString = queryParams.toString();
    return queryString
      ? `/booking/${propertyID}?${queryString}`
      : `/booking/${propertyID}`;
  };

  // Share functionality
  const shareText = `Check out this amazing ${propertyInfo?.name} in ${propertyInfo?.city}, ${propertyInfo?.state}!`;

  const sharePreviewImageUrl = useMemo(() => {
    const list = propertyInfo?.images ?? [];
    const isVideoUrl = (u: string) =>
      /\.(mp4|webm|mov|avi|mkv|wmv|flv|m4v|3gp|ogv)$/i.test(u);
    const firstPhoto = list.find(
      (img: { url?: string }) => img?.url && !isVideoUrl(img.url)
    );
    return firstPhoto?.url ?? list[0]?.url;
  }, [propertyInfo?.images]);

  useEffect(() => {
    // Only track once when propertyInfo is available
    if (propertyInfo?.id) {
      const timeoutId = setTimeout(() => {
        trackEvent('property_details_page_viewed', {
          property_id: propertyInfo?.id,
          property_traits: propertyInfo?.isPetFriendly ? ['pet_friendly'] : '',
          property_name: propertyInfo?.name,
          is_checkin_out_entered: checkin && checkin ? true : false,
        });
        addRecentlyViewedProperty(propertyInfo.id);
      }, 300); // delay in milliseconds
      return () => clearTimeout(timeoutId); // clean up
    }
  }, [propertyInfo?.id]); // Only run when propertyInfo.id changes (once on load)

  const ShineOverlay = () => (
    <motion.div
      initial={{ x: '-120%' }}
      animate={{ x: '180%' }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      className='absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent rotate-20'
    />
  );
  // Apply dark mode if property is Prive, and always clean up on unmount
  useEffect(() => {
    if (propertyInfo?.isPrive) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [propertyInfo?.isPrive]);

  useEffect(() => {
    if (checkin && checkout) {
      const bankOfferRemoved = !bankOffer && prevBankOffer;

      if (bankOfferRemoved) {
        updateAutoApplyBankOffer('false');
      } else if (autoApplyCoupon === undefined || autoApplyCoupon === null) {
        updateAutoApplyBankOffer('true');
      }
    } else {
      if (autoApplyCoupon !== undefined && autoApplyCoupon !== null) {
        updateAutoApplyBankOffer(null);
      }
    }
  }, [checkin, checkout, bankOffer, prevBankOffer]);

  const dateInfo = useMemo(() => {
    const hasValidDates = checkin && checkout;
    const isLongStay = hasValidDates
      ? differenceInDays(parseISO(checkout), parseISO(checkin)) > 30
      : false;

    return { hasValidDates, isLongStay, checkin, checkout };
  }, [checkin, checkout]);

  const fetchDependencies = useMemo(
    () => ({
      hasValidDates: dateInfo.hasValidDates,
      checkin: dateInfo.checkin,
      checkout: dateInfo.checkout,
      propertyID,
      numberOfGuests: guestsData?.numberOfGuests,
      numberOfChildren: guestsData?.numberOfChildren,
      customCoupon,
      bankOffer,
      prevBankOffer,
      prevCustomCoupon,
      offersLength: offersData.length,
      mealPlanCode,
      autoApplyCoupon,
    }),
    [
      dateInfo.hasValidDates,
      dateInfo.checkin,
      dateInfo.checkout,
      propertyID,
      guestsData?.numberOfGuests,
      guestsData?.numberOfChildren,
      customCoupon,
      bankOffer,
      prevBankOffer,
      prevCustomCoupon,
      offersData.length,
      mealPlanCode,
      autoApplyCoupon,
    ]
  );

  const debouncedDependencies = useDebounce(fetchDependencies, 500);

  const createPayloadHash = useCallback(() => {
    const children = guestsData?.numberOfChildren;
    const adults = guestsData?.numberOfGuests;

    const shouldApplyAutoBankOffer =
      debouncedDependencies.checkin &&
      debouncedDependencies.checkout &&
      debouncedDependencies.autoApplyCoupon === 'true' &&
      !debouncedDependencies.bankOffer &&
      !debouncedDependencies.prevBankOffer;

    const payload = {
      propertyId: debouncedDependencies.propertyID,
      adults: adults,
      checkinDate: debouncedDependencies.checkin,
      checkoutDate: debouncedDependencies.checkout,
      children: children,
      applyAutoBankOffer: shouldApplyAutoBankOffer
        ? shouldApplyAutoBankOffer
        : false,
      ...(debouncedDependencies.bankOffer && {
        bankOfferCode: debouncedDependencies.bankOffer.toUpperCase(),
      }),
      ...(debouncedDependencies.customCoupon && {
        couponCode: debouncedDependencies.customCoupon.toUpperCase(),
      }),
      ratePlanCode: debouncedDependencies.mealPlanCode || 'ep',
    };

    return JSON.stringify(payload);
  }, [
    debouncedDependencies,
    guestsData?.numberOfChildren,
    guestsData?.numberOfGuests,
  ]);

  const fetchAmountDetails = useCallback(async () => {
    if (!debouncedDependencies.checkin && !debouncedDependencies.checkout) {
      return;
    }
    if (loading) return;

    const currentPayloadHash = createPayloadHash();
    if (lastApiPayloadRef.current === currentPayloadHash) {
      return;
    }

    lastApiPayloadRef.current = currentPayloadHash;

    const children = guestsData?.numberOfChildren;
    const adults = guestsData?.numberOfGuests;

    const shouldApplyAutoBankOffer =
      debouncedDependencies.checkin &&
      debouncedDependencies.checkout &&
      debouncedDependencies.autoApplyCoupon === 'true';

    setLoading(true);

    try {
      const result = await client
        .query(
          GET_AMOUNT_DETAILS,
          {
            filters: {
              propertyId: debouncedDependencies.propertyID,
              adults,
              checkinDate: debouncedDependencies.checkin,
              checkoutDate: debouncedDependencies.checkout,
              children,
              applyAutoBankOffer: shouldApplyAutoBankOffer || false,
              ...(debouncedDependencies.bankOffer && {
                bankOfferCode: debouncedDependencies.bankOffer.toUpperCase(),
              }),
              ...(debouncedDependencies.customCoupon && {
                couponCode: debouncedDependencies.customCoupon.toUpperCase(),
              }),
              ratePlanCode: debouncedDependencies.mealPlanCode || 'ep',
            },
          },
          {
            requestPolicy: 'network-only', // urql replacement for fetchPolicy: 'no-cache'
            fetchOptions: {
              headers: {
                'Channel-Id': isCorporateChannel
                  ? isCorporateChannel
                  : process.env.NEXT_PUBLIC_CHANNEL_ID || '',
                ...(accessToken && {
                  Authorization: `Bearer ${accessToken}`,
                }),
              },
            },
          }
        )
        .toPromise();

      if (result.error) {
        throw result.error;
      }

      const data = result.data;

      if (data?.propertiesRatesV1?.list?.[0]) {
        setAmountDetails(data?.propertiesRatesV1?.list?.[0]?.quotes?.[0]);

        const _quote: Quote | undefined =
          data?.propertiesRatesV1?.list?.[0]?.quotes?.[0];

        // ✅ Handle custom coupon
        if (
          debouncedDependencies.customCoupon &&
          (_quote?.couponDiscountPercentage || _quote?.couponDiscountAmount)
        ) {
          setAppliedCoupons((prev) =>
            prev.find(
              (discount) => debouncedDependencies.customCoupon === discount.code
            )
              ? prev
              : [
                  ...prev,
                  {
                    code: debouncedDependencies.customCoupon,
                    discountPercentage: _quote?.couponDiscountPercentage,
                    discountAmount: _quote?.couponDiscountAmount,
                  },
                ]
          );
          setIsCustomCouponLoading((prev) => ({
            ...prev,
            isLoading: false,
            code: debouncedDependencies.customCoupon,
            action: 'apply',
          }));
        }

        // ✅ Handle bank offer
        if (
          debouncedDependencies.bankOffer &&
          (_quote?.paymentDiscountPercentage || _quote?.paymentDiscountAmount)
        ) {
          setAppliedBankOffers((prev) =>
            prev.find(
              (discount) => debouncedDependencies.bankOffer === discount.code
            )
              ? prev
              : [
                  ...prev,
                  {
                    code: debouncedDependencies.bankOffer,
                    discountPercentage: _quote?.paymentDiscountPercentage,
                    discountAmount: _quote?.paymentDiscountAmount,
                  },
                ]
          );
          setIsBankOfferLoading((prev) => ({
            ...prev,
            isLoading: false,
            code: debouncedDependencies.bankOffer ?? null,
            action: 'apply',
          }));
        }

        if (_quote?.bankOfferCode) setBankOffer(_quote?.bankOfferCode ?? null);
        if (_quote?.couponCode) setCustomCoupon(_quote?.couponCode ?? null);

        setOpenCustomCouponDialog(false);
        setIsAmountDetails(true);
        setError(null);

        if (data?.propertiesRatesV1?.list?.[0]?.quotes?.[0]?.soldOut) {
          if (!isPropertySoldOut) {
            toast(
              <div>
                <p className='font-bold text-base text-foreground'>Sold out</p>
                <p className='text-sm font-semibold text-muted-foreground'>
                  Sorry, this property has been sold out for selected dates
                </p>
              </div>,
              {
                icon: (
                  <AlertCircle className='text-accent-red-900 dark:text-accent-yellow-950 w-5 h-5' />
                ),
              }
            );
          }
          setIsPropertySoldOut(true);
        } else {
          setIsPropertySoldOut(false);
        }
      }
    } catch (error: any) {
      if (error instanceof CombinedError) {
        const gqlError = error.graphQLErrors?.[0];
        const classification =
          gqlError?.extensions?.classification || 'UNKNOWN_ERROR';

        if (classification === 'BANK_OFFER_VALIDATION') {
          setIsCouponError(true);
          setIsCouponErrorMessage(error);
          setTimeout(() => {
            setAppliedBankOffers([]);
            setBankOffer(null);
          }, 0);
        } else if (classification === 'COUPON_VALIDATION') {
          setIsCouponError(true);
          setIsCouponErrorMessage(error);
          setTimeout(() => {
            setAppliedCoupons([]);
            setCustomCoupon(null);
          }, 0);
        } else if (classification === 'BAD_REQUEST') {
          setIsPropertyError(true);
        } else {
          setIsPropertyError(false);
          setIsCouponError(true);
          setIsCouponErrorMessage(error);
        }
      } else {
        console.error('Unexpected Error:', error);
      }
    } finally {
      setLoading(false);
      setIsCustomCouponLoading((prev) => ({ ...prev, isLoading: false }));
      setIsBankOfferLoading((prev) => ({ ...prev, isLoading: false }));
    }
  }, [debouncedDependencies, createPayloadHash]);

  const handleSearch = async () => {
    setMobileBookNowLoading(true);
    try {
      if (!accessToken && utmSource !== 'hotelzify') {
        const bookingUrl = generateBookingUrl();
        setLoginOpen(true, 'drawer', bookingUrl);
        setTimeout(() => {
          setOpenDrawer(false);
        }, 100);
      } else {
        urlParams.navigateWithParams(`/booking/${propertyID}`);
      }
    } finally {
      setMobileBookNowLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(fetchAmountDetails, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchAmountDetails]);

  useEffect(() => {
    if (!propertyInfo) return;

    updateGuestData(
      {
        ...guestsData,
        max_adults: propertyInfo.maxAdults,
        max_occupancy: propertyInfo.maxOccupancy,
        max_children: propertyInfo.maxChildren,
      },
      false
    );
  }, [propertyInfo]);

  useEffect(() => {
    if (!checkin || !checkout) {
      setIsPropertySoldOut(false);
    }
  }, [checkin, checkout]);

  useEffect(() => {
    if (!openDrawer || (checkin && checkout)) {
      setAutoOpenCalendar(false);
    }
  }, [openDrawer, checkin, checkout]);

  const shouldShowDateTooltip =
    isMobile && (!checkin || !checkout) && !openDrawer;

  const {
    dateFieldRef: mobilePriceTagDateFieldRef,
    tooltipPosition: mobilePriceTagTooltipPosition,
    isTooltipVisible: isMobilePriceTagTooltipVisible,
    handleDismissTooltip: handleDismissMobilePriceTagTooltip,
    handleTooltipClick: handleMobilePriceTagTooltipClick,
    arrowPosition: mobilePriceTagArrowPosition,
    arrowHorizontalAlign: mobilePriceTagArrowHorizontalAlign,
  } = useDateTooltip({
    shouldShow: shouldShowDateTooltip,
    position: 'top',
    positionConfig: {
      verticalPosition: 'top',
      horizontalAlign: 'left',
      spacing: -8,
      verticalOffset: 0,
      viewportPadding: 16,
    },
    onTooltipClick: () => {
      if (!checkin || !checkout) {
        setAutoOpenCalendar(true);
      }
      setOpenDrawer(true);
    },
  });

  const queryString = generateQueryString(baseQueryParams);
  const backHref = `/villas/villas-in-${propertyInfo.citySlug}${queryString}`;

  const breadcrumbs = [
    { href: '/', label: 'Home' },
    {
      href: `/villas/villas-in-${propertyInfo.citySlug}${queryString}`,
      label: `Villas in ${propertyInfo?.city}`,
    },
    {
      href: `/villas-in-${propertyInfo.city}/${propertyInfo.id}`,
      label: propertyInfo?.name || propertyInfo.id,
    },
  ];
  const nearestPlacesSection: Section | undefined =
    propertyInfo?.sections?.find(
      (section: Section) => section.title === 'Nearest places'
    );
  return (
    <>
      <div className='hidden lg:flex items-center justify-between cursor-pointer mb-3 lg:px-10 xl:px-0 lg:py-3 xl:py-0'>
        <CustomBreadcrumb items={breadcrumbs} />
        <div className='flex items-center gap-2'>
          <ShareButton
            onClick={handleDesktopShareClick}
            icon={<Share size={16} />}
          >
            Share
          </ShareButton>
        </div>
      </div>
      {isMobile && backHref && showMobileHeader && (
        <div className='block lg:hidden'>
          <Suspense
            fallback={
              <div className='h-20 bg-gray-100 animate-pulse rounded-lg' />
            }
          >
            <DetailMobileHeader
              propertyId={propertyInfo?.id}
              is_checkin_out_entered={checkin && checkout ? true : false}
              name={propertyInfo?.name}
              city={propertyInfo?.city}
              location={propertyInfo?.location}
              metrics={propertyInfo?.metrics}
              backHref={backHref}
              tabs={propertyDetailTabs}
              brandedBrochure={propertyInfo?.brandedBrochure}
            />
          </Suspense>
        </div>
      )}

      <div>
        <ImageSection
          is_checkin_out_entered={checkin && checkout ? true : false}
          propertyName={propertyInfo?.name}
          city={propertyInfo?.city}
          location={propertyInfo?.location}
          state={propertyInfo?.state}
          pageName={pageName}
          propertyId={propertyInfo?.id}
          data={propertyInfo?.images}
          brand={propertyInfo?.brand}
          guidedVideoTour={propertyInfo?.guidedVideoTour}
          nonBrandedGuidedVideoTour={propertyInfo?.nonBrandedGuidedVideoTour}
        />
      </div>
      <div className='grid relative z-1 grid-cols-12 gap-8 mt-[-16px] lg:gap-0 xl:gap-8  sm:mt-6'>
        {/* Left Section */}
        <div className='col-span-12 lg:col-span-8 space-y-6 mt-[-8px]'>
          {!isLarge && propertyDetailTabs.length > 0 && (
            <Suspense fallback=''>
              <TabSlider tabs={propertyDetailTabs} headerOffset={90} />
            </Suspense>
          )}
          <VillaDetails
            name={propertyInfo?.name}
            city={propertyInfo?.city}
            location={propertyInfo?.location}
            metrics={propertyInfo?.metrics}
            isHighDemand={propertyInfo?.isHighDemand}
            isPetFriendly={propertyInfo?.isPetFriendly}
            review={propertyInfo?.review}
            brandedBrochure={propertyInfo?.brandedBrochure}
          />
          {isLarge && (
            <div className='px-4 rounded-2xl overflow-hidden full-width'>
              <div
                className='elfsight-app-231437b2-ed7d-45b3-ae74-e82694a70626'
                data-elfsight-app-lazy
              />
            </div>
          )}

          {propertyInfo?.state === 'Goa' ? (
            <div
              className={
                isMobile
                  ? 'elfsight-app-0f8eb3fd-49ed-478e-a43f-067c9c0bd199'
                  : 'elfsight-app-a1f0e717-a937-4bcc-82b9-bbbc35d90edd'
              }
              data-elfsight-app-lazy
            />
          ) : (
            <div
              className={
                isMobile
                  ? 'elfsight-app-7cb37262-8f49-4077-be7a-71f9e0e1c46a'
                  : 'elfsight-app-1ded2a00-4929-4b9d-a8fc-ce65b87160ef'
              }
              data-elfsight-app-lazy
            />
          )}

          {/* offers section and wallet amount banner */}
          {offersData && offersData?.length > 0 && (
            <SectionTemplate
              showDefaultArrows={false}
              className={`relative ${
                (isMobile || isTablet) &&
                accessToken &&
                walletAmount > 0 &&
                'pb-20'
              } `}
            >
              <CarouselTemplate
                heading='Offers curated just for you'
                items={offersData}
                slidesPerView={isMobile ? 1.3 : isTablet ? 2.1 : 3.2}
                showArrows={!isMobile}
                renderItem={(offer: any) => (
                  <Suspense fallback={''}>
                    <DiscountCard
                      code={offer.code}
                      title={offer.title}
                      description={offer.description}
                      icon={offer.icon}
                      discountPercentage={offer.discountPercentage}
                      discountMethod={offer.discountMethod}
                      maximumDiscountAllowed={offer.maximumDiscountAllowed}
                      minimumNights={offer.minimumNights}
                      endDateTime={offer.endDateTime}
                      termsAndConditions={offer.termsAndConditions}
                      isPDP={true}
                      logoTitleInline={true}
                    />
                  </Suspense>
                )}
              />
              {(isMobile || isTablet) && accessToken && walletAmount > 0 && (
                <div className='absolute bottom-0 left-0 w-full bg-yellow-50 dark:bg-[var(--gold-100)] border-t border-yellow-200 dark:border-primary-800 py-3 text-center rounded-b-2xl'>
                  <div className='flex justify-center gap-2 items-center text-sm'>
                    <span className='font-semibold dark:text-white text-xs'>
                      Save more using Elicash Balance
                    </span>
                    <div className='flex items-center gap-1'>
                      <div className='relative overflow-hidden'>
                        <ElicashIcon classname='w-4 h-4' />
                        <ShineOverlay />
                      </div>
                      <span className='font-semibold dark:text-white'>
                        {walletAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </SectionTemplate>
          )}
          <SectionTemplate showDefaultArrows heading='About Home' id='about'>
            <Suspense fallback=''>
              <AboutHome
                is_checkin_out_entered={checkin && checkout ? true : false}
                data={propertyInfo}
                faqs={propertyInfo?.faqs && propertyInfo?.faqs}
                isAbout={true}
              />
            </Suspense>
          </SectionTemplate>

          <SectionTemplate
            id='cancellation'
            showDefaultArrows
            heading='Cancellation Policy'
            onClick={() => {
              trackEvent('property_content_clicked', {
                page_name: 'property_details',
                widget_name: 'Cancellation Policy',
                widget_type: 'cancellation_policy',
                is_checkin_out_entered: checkin && checkout ? true : false,
              });
            }}
          >
            <Suspense fallback={'Loading...'}>
              <CancellationPolicy
                isPropertyDetail={true}
                policyData={amountDetails?.cancellationPolicies || []}
              />
            </Suspense>
          </SectionTemplate>

          {propertyInfo?.elfSightClassId && (
            <SectionTemplate
              showDefaultArrows
              heading='Guests Reviews'
              id='reviews'
            >
              <Suspense fallback='Loading...'>
                <ElfSightWidget
                  reviewsList={true}
                  widgetId={propertyInfo?.elfSightClassId}
                />
              </Suspense>
            </SectionTemplate>
          )}

          {propertyInfo?.amenities && propertyInfo?.topAmenities && (
            <SectionTemplate id='amenities' heading='Villa Amenities'>
              <Suspense fallback={'Loading...'}>
                <AmenitiesSection
                  is_checkin_out_entered={checkin && checkout ? true : false}
                  amenities={propertyInfo?.amenities}
                  topAmenities={propertyInfo?.topAmenities}
                />
              </Suspense>
            </SectionTemplate>
          )}

          {valueAddedServices.length > 0 && (
            <div ref={vasSection.ref}>
              <SectionTemplate showDefaultArrows id='services'>
                <Badge
                  className='p-2 px-4 text-xs mb-[-12px] min-w-[130px] text-[var(--accent-yellow-600)] border-[var(--accent-yellow-600)] rounded-full font-semibold dark:text-[var(--pink3)] dark:border-[var(--pink4)] dark:bg-[var(--prive7)]'
                  variant='outline'
                >
                  <Award />
                  VIP Indulgences
                </Badge>

                {vasSection.isIntersecting && (
                  <CarouselTemplate
                    heading='Upgrade Your Stay'
                    items={valueAddedServices}
                    slidesPerView={isMobile ? 1.3 : isTablet ? 2.1 : 3}
                    showArrows={isMobile ? false : true}
                    trackingProps={{
                      page_name: 'property_details',
                      widget_type: 'vas',
                      is_checkin_out_entered:
                        checkin && checkout ? true : false,
                    }}
                    renderItem={(item: any) => (
                      <CarouselTemplate1
                        priority={false}
                        data={item}
                        onClick={() => {
                          trackEvent('property_content_clicked', {
                            page_name: 'property_details',
                            widget_type: 'vas',
                            cta_type: 'card_click',
                            horizontal_position:
                              valueAddedServices?.indexOf(item) + 1,
                            is_checkin_out_entered:
                              checkin && checkout ? true : false,
                          });
                        }}
                      />
                    )}
                  />
                )}
                <span className='text-xs text-[var(--color-secondary-700)] dark:text-[var(--brown6)]'>
                  *Add services to your stay while booking
                </span>
              </SectionTemplate>
            </div>
          )}

          {propertyInfo?.spaces && (
            <SectionTemplate showDefaultArrows id='spaces'>
              <CarouselTemplate
                heading='Spaces'
                items={propertyInfo?.spaces}
                slidesPerView={isMobile ? 1.3 : isTablet ? 2.8 : 3}
                showArrows={isMobile ? false : true}
                renderItem={(item: any) => (
                  <CarouselTemplate1
                    priority={false}
                    data={item}
                    onClick={() => {
                      trackEvent('property_content_clicked', {
                        page_name: 'property_details',
                        widget_type: 'spaces',
                        widget_name: 'Spaces',
                        horizontal_position:
                          propertyInfo?.spaces?.indexOf(item) + 1,
                        is_checkin_out_entered:
                          checkin && checkout ? true : false,
                      });
                    }}
                  />
                )}
              />
            </SectionTemplate>
          )}
          {propertyInfo?.googleMapEmbedLink && (
            <SectionTemplate
              heading='Getting There'
              showDefaultArrows
              id='location'
              onClick={() => {
                trackEvent('property_content_clicked', {
                  page_name: 'property_details',
                  widget_name: 'Getting There',
                  is_checkin_out_entered: checkin && checkout ? true : false,
                });
              }}
            >
              <Suspense fallback={'Loading...'}>
                <MapInfo
                  googleMapEmbedLink={propertyInfo?.googleMapEmbedLink}
                  nearestLocation={nearestPlacesSection}
                  isPrive={propertyInfo?.isPrive}
                />
              </Suspense>
            </SectionTemplate>
          )}
          {/* {console.log('elfSightClassId', propertyInfo?.elfSightClassId)} */}
          {/* {propertyInfo?.spaces && (
            <SectionTemplate showDefaultArrows id='Nearby Attractions'>
              <CarouselTemplate
                heading='Nearby Attractions'
                items={propertyInfo?.spaces || []}
                slidesPerView={isTablet ? 2.3 : isMobile ? 1.3 : 3}
                showArrows
                renderItem={(item: any) => (
                  <CarouselTemplate1 priority={false} data={item} />
                )}
              />
            </SectionTemplate>
          )} */}
          {/* STAY STORIES SECTION */}
          <DynamicDataWrapper
            query={GET_HOME_PAGE_STORIES}
            fallbackData={
              stayStories
                ? {
                    homePageStoriesSection: {
                      sectionTitle: stayStories.heading,
                      caption: stayStories.description,
                      homePageStories: stayStories.data || [],
                    },
                  }
                : null
            }
          >
            {(data, loading, error) => {
              const section = data?.homePageStoriesSection;
              const transformedData = section
                ? {
                    heading: section.sectionTitle || '',
                    description: section.caption || '',
                    data: section.homePageStories || [],
                  }
                : null;

              if (!transformedData?.data || transformedData.data.length === 0) {
                return null;
              }

              return (
                <section className='w-full'>
                  <SectionTemplate
                    showDefaultArrows={false}
                    id='starGuestStories'
                    heading={transformedData.heading}
                  >
                    <Suspense fallback={''}>
                      <VideoProvider>
                        <ReusableCarousel
                          data={transformedData.data}
                          renderItem={(item, index, isCenterSlide) => (
                            <Template
                              data={item}
                              isCenterSlide={isCenterSlide}
                              className='sm:h-[400px]! h-[370px]!'
                              pageName='property_details'
                              onClick={() => {
                                trackEvent('property_content_clicked', {
                                  page_name: 'property_details',
                                  widget_name: 'Every Stay Has A Story',
                                  horizontal_position: index + 1,
                                  is_checkin_out_entered:
                                    checkin && checkout ? true : false,
                                });
                              }}
                            />
                          )}
                          slidesPerView={{
                            mobile: 1.2,
                            tablet: 2.5,
                            desktop: 2.8,
                          }}
                          mobileViewType='carousel'
                          desktopViewType='carousel'
                          showArrows={true}
                          prive={propertyInfo?.isPrive}
                          spacing={{ mobile: 12, tablet: 24, desktop: 20 }}
                          centerSlides={true}
                          centerSlideScale={isMobile ? 1.1 : 1.2}
                          startIndex={Math.floor(
                            (transformedData.data?.length || 0) / 2
                          )}
                          blurInactiveCards={true}
                        />
                      </VideoProvider>
                    </Suspense>
                  </SectionTemplate>
                </section>
              );
            }}
          </DynamicDataWrapper>

          {isMobile && (
            <section className='mb-6'>
              <SimilarProperties currentPropertyInfo={propertyInfo} />
            </section>
          )}

          <SectionTemplate
            showDefaultArrows
            heading='Contact Us'
            onClick={() => {
              trackEvent('property_content_clicked', {
                page_name: 'property_details',
                widget_name: 'Contact Us',
                widget_type: 'contact_us',
                cta_type: 'call_us',
                is_checkin_out_entered: checkin && checkout ? true : false,
              });
            }}
          >
            <Suspense fallback={'Loading...'}>
              <ContactCTA pageName={'property_details'} />
            </Suspense>
          </SectionTemplate>
        </div>

        {/* Right Section */}

        <div
          className={cn(
            `hidden lg:flex col-span-12 lg:col-span-4 self-start rounded-2xl overflow-hidden flex-col gap-4 py-0 relative z-10 pr-6 xl:pr-0 ${checkin && checkout ? '' : 'sticky top-5'}`
          )}
        >
          <div className='px-2 space-y-8'>
            <div className='border-primary-100 shadow-lg border rounded-2xl dark:border-secondary-950 dark:border-1 dark:bg-prive-background/200'>
              {checkin && checkout && amountDetails && (
                <Suspense fallback={'Loading...'}>
                  <CouponBanner
                    isMobile={false}
                    amountDetails={amountDetails}
                  />
                </Suspense>
              )}

              <div className='py-6 px-0 space-y-4'>
                <div className='px-6 space-y-4'>
                  <Suspense
                    fallback={
                      <div className='h-16 bg-gray-100 animate-pulse rounded-lg' />
                    }
                  >
                    <MobilePriceTag
                      propertyInfo={propertyInfo}
                      loading={loading}
                      amountDetails={amountDetails}
                      onDateClick={() => {
                        if (!checkin || !checkout) {
                          setAutoOpenCalendar(true);
                        }
                        setOpenDrawer(true);
                      }}
                    />
                  </Suspense>
                  <Suspense fallback={'Loading...'}>
                    <AvailabilitySection
                      id='availability-section'
                      isBooking={false}
                      propertyID={propertyInfo?.id}
                      handlePopoverClose={() => {}}
                      isGuestDrawer={true}
                      soldOut={isPropertySoldOut || isPropertyError}
                    />
                  </Suspense>
                  <div
                    className='elfsight-app-231437b2-ed7d-45b3-ae74-e82694a70626'
                    data-elfsight-app-lazy
                  />
                </div>

                {offersData.length > 0 &&
                  isAmountDetails &&
                  checkin &&
                  checkout &&
                  amountDetails && (
                    <>
                      <hr className='border-primary-50 dark:border-secondary-950' />
                      <div className='px-6'>
                        <Suspense fallback={'Loading...'}>
                          <Coupons
                            propertyId={propertyInfo?.id}
                            propertyName={propertyInfo?.name}
                            isOpen={isCouponClicked}
                            onOpenChange={setIsCouponClicked}
                            offers={offersData}
                            quotes={amountDetails}
                          />
                        </Suspense>
                      </div>
                    </>
                  )}
                {isAmountDetails &&
                  checkin &&
                  checkout &&
                  amountDetails &&
                  accessToken &&
                  !isMobile && (
                    <>
                      <hr className='border-primary-50 dark:border-secondary-950' />
                      <div className='px-6 space-y-4'>
                        <Suspense fallback={'Loading...'}>
                          <ElicashPaymentCard
                            checked={false}
                            onChange={() => {}}
                            type='pdp'
                          />
                        </Suspense>
                      </div>
                    </>
                  )}

                {isAmountDetails && checkin && checkout && amountDetails && (
                  <>
                    <hr className='border-primary-50 dark:border-secondary-950' />
                    <div className='px-6 space-y-4'>
                      <Suspense fallback={'Loading...'}>
                        <PriceBreakdown
                          priceData={amountDetails}
                          primaryClass='dark:bg-[var(--secondary-1000)] dark:border dark:border-[var(--secondary-950)]'
                        />
                      </Suspense>
                      <Suspense fallback={'Loading...'}>
                        <PriceActions
                          isLongStay={dateInfo.isLongStay}
                          showPartialPayment={false}
                          propertyID={propertyID}
                          handleClick={() => {
                            if (!accessToken && utmSource !== 'hotelzify') {
                              const bookingUrl = generateBookingUrl();
                              setLoginOpen(true, 'drawer', bookingUrl);
                            } else {
                              trackEvent('Book Now Click', {
                                page_name: 'property_details',
                                property_id: propertyInfo?.id,
                                checkIn: checkin,
                                checkOut: checkout,
                                is_checkin_out_entered: checkin ? true : false,
                                adults: guestsData?.numberOfGuests || '1',
                                children: guestsData?.numberOfChildren || '0',
                                meal: mealPlanCode || 'ep',
                                bankOffer: bankOffer || '',
                                cancellationPlan:
                                  amountDetails?.cancellationPolicies || '',
                                numberOfNights:
                                  amountDetails?.numberOfNights || '1',
                                coupon: customCoupon || '',
                                propertyName: propertyInfo?.name,
                              });
                              urlParams.navigateWithParams(
                                `/booking/${propertyID}`
                              );
                            }
                          }}
                        />
                      </Suspense>
                    </div>
                  </>
                )}
              </div>
            </div>
            <SecureBookingBanner />
          </div>
        </div>
      </div>
      <div className='block lg:hidden'>
        <div className='fixed bottom-0 left-0 right-0 z-50 w-full flex flex-col pointer-events-none'>
          <div
            className='w-full pointer-events-auto relative z-1'
            onClick={handleCouponBannerClick}
          >
            <Suspense
              fallback={
                <div className='h-16 bg-gray-100 animate-pulse rounded-lg' />
              }
            >
              {checkin && checkout && (
                <MobileCouponBanner
                  isMobile={true}
                  amountDetails={amountDetails}
                />
              )}
            </Suspense>
          </div>

          <div className='w-full pointer-events-auto relative z-9'>
            <div
              ref={
                mobilePriceTagDateFieldRef as React.RefObject<HTMLDivElement>
              }
            >
              <Sheet open={openDrawer} onOpenChange={setOpenDrawer}>
                <div className='bg-white border-t border-gray-200 dark:bg-background dark:border-primary-400'>
                  <div className='flex justify-between items-center px-4 py-3 gap-2 h-[72px]'>
                    <div
                      onClick={() => {
                        trackEvent('edit_dates_clicked', {
                          page_name: pageName,
                          property_id: propertyInfo?.id,
                          property_name: propertyInfo?.name,
                          is_checkin_out_entered:
                            checkin && checkout ? true : false,
                        });

                        if (isMobile && (!checkin || !checkout)) {
                          setAutoOpenCalendar(true);
                        }
                        setOpenDrawer(true);
                      }}
                      className='cursor-pointer'
                    >
                      <Suspense
                        fallback={
                          <div className='h-16 bg-gray-100 animate-pulse rounded-lg' />
                        }
                      >
                        <MobilePriceTag
                          propertyInfo={propertyInfo}
                          loading={loading}
                          amountDetails={amountDetails}
                          onDateClick={() => {
                            if (!checkin || !checkout) {
                              setAutoOpenCalendar(true);
                            }
                            setOpenDrawer(true);
                          }}
                        />
                      </Suspense>
                    </div>

                    <div
                      onClick={() => {
                        if (checkin && checkout && !dateInfo.isLongStay) {
                          // trackEvent('book_now_clicked', {
                          //   is_checkin_out_entered: checkin ? true : false,
                          //   page_name: pageName,
                          //   property_id: propertyInfo?.id,
                          //   property_name: propertyInfo?.name,
                          //   checkOut: checkout,
                          //   adults: guestsData?.numberOfGuests || '1',
                          //   children: guestsData?.numberOfChildren || '0',
                          //   meal: mealPlanCode || 'ep',
                          //   bankOffer: bankOffer || '',
                          //   cancellationPlan:
                          //     amountDetails?.cancellationPolicies || '',
                          //   numberOfNights: amountDetails?.numberOfNights || '1',
                          //   coupon: customCoupon || '',
                          // });
                          handleSearch();
                        } else {
                          setAutoOpenCalendar(true);
                          setOpenDrawer(true);
                        }
                      }}
                    >
                      <Button
                        className='rounded-full bg-accent-red-900 text-white px-9 py-6 font-bold hover:bg-accent-red-950 z-99 dark:bg-[var(--accent-background)]'
                        disabled={mobileBookNowLoading}
                        onClick={() => {
                          trackEvent('book_now_clicked', {
                            page_name: pageName,
                            property_id: propertyInfo?.id,
                            property_name: propertyInfo?.name,
                            is_checkin_out_entered:
                              checkin && checkout ? true : false,
                          });
                        }}
                      >
                        {mobileBookNowLoading ? (
                          <>
                            <Loader2 className='w-4 h-4 animate-spin mr-2' />
                            Processing
                          </>
                        ) : (
                          'Book Now'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <SheetContent
                  className='h-[100%] min-h-[100%] w-[100vw] [&>button]:hidden flex flex-col gap-0 bg-none'
                  side='bottom'
                >
                  <SheetHeader className='p-0 flex-shrink-0 dark:bg-background'>
                    <SheetTitle className='relative flex justify-center items-center font-serif typography-title-regular border-primary-100 border-b py-3 dark:border-secondary-950 text-primary-950'>
                      <ArrowLeft
                        className='absolute left-[20px] dark:text-white '
                        onClick={() => setOpenDrawer(false)}
                      />
                      <div className='flex flex-col items-center text-center'>
                        <div className='text-lg font-medium font-serif truncate overflow-hidden whitespace-nowrap max-w-[200px] dark:text-white '>
                          {propertyInfo?.name?.split('|')[0]?.trim()}
                        </div>
                        <div className='text-sm text-muted-foreground dark:text-white '>
                          {propertyInfo?.city}
                        </div>
                      </div>
                    </SheetTitle>
                  </SheetHeader>

                  <div className='flex-1 overflow-auto px-4 pt-6 pb-36'>
                    <div className='space-y-6 '>
                      <Suspense
                        fallback={
                          <div className='h-32 bg-gray-100 animate-pulse rounded-lg' />
                        }
                      >
                        <MobileAvailabilitySection
                          pdp={true}
                          id='availability-section'
                          isBooking={false}
                          propertyID={propertyInfo?.id}
                          handlePopoverClose={() => {}}
                          isGuestDrawer={true}
                          soldOut={isPropertySoldOut || isPropertyError}
                          autoOpenCalendar={autoOpenCalendar}
                          onCloseParentDrawer={() => setOpenDrawer(false)}
                        />
                      </Suspense>

                      {isAmountDetails &&
                        checkin &&
                        checkout &&
                        amountDetails && (
                          <Suspense
                            fallback={
                              <div className='h-32 bg-gray-100 animate-pulse rounded-lg' />
                            }
                          >
                            {isAmountDetails &&
                              checkin &&
                              checkout &&
                              amountDetails &&
                              accessToken &&
                              isMobile && (
                                <Suspense fallback={'Loading...'}>
                                  <ElicashPaymentCard
                                    checked={false}
                                    onChange={() => {}}
                                    type='pdp'
                                  />
                                </Suspense>
                              )}
                            <MobilePriceBreakdown
                              priceData={amountDetails}
                              primaryClass='bg-primary-50! dark:bg-[var(--secondary-1000)]!'
                            />
                          </Suspense>
                        )}
                    </div>
                  </div>

                  <div className='absolute bottom-0 left-0 right-0  border-t flex-shrink-0 z-10 dark:bg-background dark:border-secondary-950'>
                    <div
                      className='w-full relative z-1'
                      onClick={handleCouponBannerClick}
                    >
                      <CouponBanner
                        isMobile={true}
                        amountDetails={amountDetails}
                      />
                    </div>

                    {dateInfo.isLongStay ? (
                      <div className='px-2 py-1 '>
                        <Suspense
                          fallback={
                            <div className='h-16 bg-gray-100 animate-pulse rounded-lg' />
                          }
                        >
                          <MobilePriceActions
                            isLongStay={dateInfo.isLongStay}
                          />
                        </Suspense>
                      </div>
                    ) : (
                      <div className='w-full relative z-9'>
                        <div className='bg-white border-t border-gray-200 dark:bg-background dark:border-primary-400'>
                          <div
                            className={cn(
                              'flex justify-between items-center px-4 py-3 ark:border-[var(--dawnpink)]',
                              checkin && checkout && 'h-[76px]'
                            )}
                          >
                            <div
                              onClick={() => {
                                trackEvent('edit_dates_clicked', {
                                  page_name: pageName,
                                  property_id: propertyInfo?.id,
                                  property_name: propertyInfo?.name,
                                  is_checkin_out_entered:
                                    checkin && checkout ? true : false,
                                });

                                if (isMobile && (!checkin || !checkout)) {
                                  setAutoOpenCalendar(true);
                                }
                                setOpenDrawer(true);
                              }}
                              className='cursor-pointer'
                            >
                              <Suspense
                                fallback={
                                  <div className='h-16 bg-gray-100 animate-pulse rounded-lg' />
                                }
                              >
                                <MobilePriceTag
                                  propertyInfo={propertyInfo}
                                  loading={loading}
                                  amountDetails={amountDetails}
                                />
                              </Suspense>
                            </div>
                            <Button
                              className='rounded-full bg-accent-red-900 text-white px-9 py-6 font-bold hover:bg-accent-red-950 dark:bg-[var(--accent-background)]'
                              disabled={mobileBookNowLoading}
                              onClick={() => {
                                if (checkin && checkout) {
                                  setOpenDrawer(false);
                                  handleSearch();
                                } else if (!checkin || !checkout) {
                                  setAutoOpenCalendar(true);
                                }
                              }}
                            >
                              {mobileBookNowLoading ? (
                                <>
                                  <Loader2 className='w-4 h-4 animate-spin mr-2' />
                                  Processing
                                </>
                              ) : (
                                'Book Now'
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            {isMobilePriceTagTooltipVisible && (
              <Suspense fallback={''}>
                <DatePersuation
                  position={mobilePriceTagTooltipPosition}
                  onDismiss={handleDismissMobilePriceTagTooltip}
                  onClick={handleMobilePriceTagTooltipClick}
                  arrowPosition={mobilePriceTagArrowPosition}
                  arrowHorizontalAlign={mobilePriceTagArrowHorizontalAlign}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>
      <div className='block lg:hidden'>
        {offersData.length > 0 && isCouponClicked && (
          <Suspense fallback={'Loading...'}>
            <Coupons
              propertyId={propertyInfo?.id}
              propertyName={propertyInfo?.name}
              isOpen={isCouponClicked}
              onOpenChange={setIsCouponClicked}
              offers={offersData}
              quotes={amountDetails}
              pageName={pageName}
            />
          </Suspense>
        )}
      </div>
      <Suspense fallback=''>
        <CouponDiscountPopUp />
      </Suspense>
      <Suspense fallback={''}>
        <FloatingCta
          page={propertyInfo?.state}
          isLead={false}
          events={{
            property_id: propertyInfo?.id,
            property_name: propertyInfo?.name,
            is_checkin_out_entered: checkin && checkout ? true : false,
            page_name: pageName,
          }}
          isPhone={true}
          isWhatsApp={isMobile ? false : true}
          bottom={isMobile ? '220px' : '140px'}
        />
        <div
          className='elfsight-app-92347e4e-0031-4b9b-9288-bf11766f931f'
          data-elfsight-app-lazy
        />
      </Suspense>
      {/* AI Chat Assistant */}
      <Suspense fallback={<SuspenseLoader />}>
        {propertyID && (
          <AIAssistant
            propertyId={propertyID}
            events={{
              property_id: propertyInfo?.id,
              property_name: propertyInfo?.name,
              is_checkin_out_entered: checkin && checkout ? true : false,
              page_name: pageName,
            }}
            propertyName={propertyInfo?.name}
          />
        )}
      </Suspense>
      {shareModalOpen && (
        <ShareModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          modalTitle='Share'
          title={propertyInfo?.name}
          previewImageSrc={sharePreviewImageUrl}
          text={shareText}
        />
      )}
      {!isMobile && <SimilarProperties currentPropertyInfo={propertyInfo} />}
    </>
  );
};

export default PropertyDetailModule;
