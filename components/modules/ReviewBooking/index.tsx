'use client';

import AvailabilitySection from '@/components/common/AvailabilitySection';
import CustomBreadcrumb from '@/components/common/Breadcrumbs';

import CouponDiscountPopUp from '@/components/common/Coupons/CouponDiscountPopUp';
import SecureBookingBanner from '@/components/common/SecureBookingBanner';
import { useFilterContext } from '@/contexts';
import { useCouponContext } from '@/contexts/coupons/useCouponContext';
import {
  initialPropertyState,
  Quote,
  usePropertyContext,
} from '@/contexts/property';
import { useAuth, useUserContext } from '@/contexts/SharedProvider';
import { useFilters } from '@/hooks/filters/useFilters';
import { useGuests } from '@/hooks/filters/useGuests';

import BookingConfirmCard from '@/components/common/BookingConfirm/BookingConfirmCard';
import { UserDetailsTypes } from '@/components/modules/ProfilePage/profilesidebarmenu/personaldetails/PersonalDetails';

import CouponBanner from '@/components/modules/PropertyDetails/CouponBanner';
import PriceActions from '@/components/modules/PropertyDetails/PriceActions';
import PriceBreakdown from '@/components/modules/PropertyDetails/PriceBreakdown';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import { useURLParams } from '@/hooks/useURLParams';
import { handleCashfreePayment } from '@/lib/cashfree';
import { trackEvent } from '@/lib/mixpanel';
const Coupons = lazy(() => import('@/components/common/Coupons'));
const ContactCTA = lazy(
  () => import('@/components/modules/PropertyDetails/ContactCTA')
);
const AboutHome = lazy(() => import('@/components/common/About'));

import {
  ADD_VAS_TO_QUOTE_MUTATION,
  CHECK_AUTHENTICATION,
  CREATE_GUEST_RESERVATION_MUTATION,
  GET_REVIEW_BOOKING_DETAILS,
  GET_USER_DETAILS,
  USER_SIGNUP,
} from '@/lib/queries';
import { handleRazorPayPayment } from '@/lib/razorpay';
import {
  clearAuthCookies,
  detectGuestDetailsChanges,
  generateQueryString,
} from '@/lib/utils';
import { sendGTMEvent } from '@next/third-parties/google';
import Cookies from 'js-cookie';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'sonner';
import { Client, CombinedError, useClient } from 'urql';
import { Offer } from 'villa-types';
import { GuestData } from './ReviewBooking.types';
import { SectionTemplate } from './Section';
import CancellationPolicy from '../PropertyDetails/CancellationPolicy';
const CancellationPlans = lazy(() => import('./CancellationPlans'));
const ValueAddedServices = lazy(() => import('./ValueAddedServices'));
const ElicashPaymentCard = lazy(
  () => import('@/components/common/ElicashPaymentCard')
);

const GuestDetailsForm = lazy(() => import('./GuestDetail'));

interface ReviewBookingModuleProps {
  reviewBookingDetail: any;
  offers: Offer[];
  valueAddedService: any;
  isPrive: boolean;
  authError?: boolean;
}

export default function ReviewBookingModule({
  reviewBookingDetail,
  offers,
  valueAddedService,
  isPrive,
  authError = false,
}: ReviewBookingModuleProps) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [isCouponClicked, setIsCouponClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offersData, setOfferData] = useState([]);
  const [isPartialPaymentEnabled, setIsPartialPaymentEnabled] = useState(false);
  const client = useClient();
  const { amountDetails, setAmountDetails } = usePropertyContext();
  const { guestsData, updateGuestData } = useGuests();
  const { setDatePickerOpen } = useFilterContext();
  const { filters, urlParams } = useFilters();
  const { updateParams } = useURLParams();
  const { bookingReview, setBookingReview } = usePropertyContext();
  const [isPaymentDetail, setPaymentDetail] = useState<{
    guestReservations: any;
  } | null>(null);
  const [isPropertySoldOut, setIsPropertySoldOut] = useState<boolean>(false);
  const [isPropertyError, setIsPropertyError] = useState<boolean>(false);

  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [quoteIdUpdated, setQuoteIdUpdated] = useState<boolean>(false);

  const isCorporateChannel = Cookies.get('isCorporateChannel');
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

  useEffect(() => {
    // Only track once when propertyInfo is available
    if (reviewBookingDetail.id) {
      const timeoutId = setTimeout(() => {
        trackEvent('booking_details_page_viewed', {
          property_id: reviewBookingDetail.id,
          property_name: reviewBookingDetail.name,
          nights: reviewBookingDetail?.quotes[0]?.numberOfNights,
        });
      }, 300); // delay in milliseconds
      return () => clearTimeout(timeoutId); // clean up
    }
  }, [reviewBookingDetail.id]);

  useEffect(() => {
    if (authError) {
      toast(
        <div>
          <p className='font-bold text-base text-foreground'>
            Session Timed Out
          </p>
          <p className='text-sm font-semibold text-muted-foreground'>
            Your session has expired. Please log in again to continue.
          </p>
        </div>,
        {
          icon: (
            <AlertCircle className='text-accent-red-900 dark:text-accent-yellow-950 w-5 h-5' />
          ),
        }
      );
      clearAuthCookies();
      window.location.reload();
    }
  }, [authError]);

  const initialGuestData = useMemo(
    () => ({
      id: '',
      salutation: 'Mr.' as const,
      firstName: '',
      lastName: '',
      mobile: '',
      email: '',
      countryCode: '+91',
      phoneVerified: false,
    }),
    []
  );

  const [guestData, setGuestData] = useState<GuestData>(initialGuestData);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof GuestData, string>>
  >({});
  const [isGuestEdit, setIsGuestEdit] = useState(true);
  const { userData, setUserData } = useUserContext();

  const userDetails = useMemo(() => {
    const accessToken = Cookies.get('accessToken');
    let details: UserDetailsTypes | undefined;

    if (userData) {
      details = userData;
    } else {
      const userDataFromCookie = Cookies.get('userData');
      if (userDataFromCookie) {
        try {
          details = JSON.parse(userDataFromCookie) as UserDetailsTypes;
        } catch (error) {
          console.error('Failed to parse userData from cookies', error);
          details = undefined;
        }
      }
    }
    return accessToken && details ? details : null;
  }, [
    userData?.firstName,
    userData?.lastName,
    userData?.id,
    userData?.salutation,
    userData?.email,
    userData?.phoneNumber,
    userData?.phoneVerified,
  ]);

  const handleGuestDataChange = useCallback((newGuestData: GuestData) => {
    setGuestData(newGuestData);
  }, []);

  const handleGuestEditToggle = useCallback((editMode: boolean) => {
    setIsGuestEdit(editMode);
  }, []);

  const validateGuestDetails = () => {
    const requiredFields: (keyof GuestData)[] = [
      'firstName',
      'lastName',
      'salutation',
      'mobile',
      'email',
      'countryCode',
    ];
    const newErrors: Partial<Record<keyof GuestData, string>> = {};
    requiredFields.forEach((field) => {
      if (!guestData[field])
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1')} is mandatory`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (userDetails) {
      setGuestData({
        id: userDetails.id,
        salutation: (userDetails.salutation as 'Mr.' | 'Mrs.' | 'Ms.') || 'Mr.',
        firstName: userDetails.firstName || '',
        lastName: userDetails.lastName || '',
        mobile: userDetails.phoneNumber || '',
        email: userDetails.email || '',
        countryCode: userDetails.countryCode || '+91',
        phoneVerified: userDetails.phoneVerified || false,
      });
      setIsGuestEdit(false);
    }
  }, [userDetails]);

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
  const appSearchParams = urlParams.getAllParams();
  const {
    checkin,
    checkout,
    mealPlan: mealPlanCode,
    cancellationPlan: cancellationPlanID,
    applyAutoBankOffer: applyAutoBankOfferParam,
    bankOffer: bankOfferParam,
    couponCode: couponCodeParam,
    wallet: walletParam,
  } = appSearchParams;

  const [bookingId, setBookingId] = useState<any>(null);
  const [walletChecked, setWalletChecked] = useState(() => {
    // Initialize from URL parameter
    return walletParam === 'true';
  });
  const accessToken = Cookies.get('accessToken');

  const propertyID = reviewBookingDetail ? reviewBookingDetail.id : '';

  const paramsSource = appSearchParams.source;
  const paramMedium = appSearchParams.medium;
  const paramCampaign = appSearchParams.campaign;
  const paramTerm = appSearchParams.term;
  const paramContent = appSearchParams.content;
  const paymentId = appSearchParams.paymentId;

  const cashfreeMode = process?.env?.CASHFREE_MODE;
  const razorpayKey = process.env.RAZORPAY_KEY;
  const paymentGateway = process.env.PAYMENT_GATEWAY
    ? process.env.PAYMENT_GATEWAY
    : 'RAZORPAY';

  const [selectedVAS, setSelectedVAS] = useState<
    { id: string; quantity: number }[]
  >([]);

  const [error, setError] = useState<string | null>(null);
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  const adultsCount = Number(appSearchParams.adults ?? 1);
  const childrenCount = Number(appSearchParams.children ?? 0);
  const baseQueryParams = {
    checkin,
    checkout,
    adults: adultsCount,
    children: childrenCount,
  };

  const queryStringWithoutMealPlan = generateQueryString({
    ...baseQueryParams,
    ...(couponCodeParam && { couponCode: couponCodeParam }),
    ...(bankOfferParam && { bankOffer: bankOfferParam }),
    ...(applyAutoBankOfferParam && {
      applyAutoBankOffer: applyAutoBankOfferParam,
    }),
  });

  const queryStringWithMealPlan = generateQueryString({
    ...baseQueryParams,
    mealPlanCode,
    ...(couponCodeParam && { couponCode: couponCodeParam }),
    ...(bankOfferParam && { bankOffer: bankOfferParam }),
    ...(applyAutoBankOfferParam && {
      applyAutoBankOffer: applyAutoBankOfferParam,
    }),
  });
  const backHref = `/villa-in-${reviewBookingDetail?.citySlug}/${reviewBookingDetail?.slug}${queryStringWithMealPlan}`;
  const breadcrumb = [
    { href: '/', label: 'Home' },
    {
      href: `/villas/villas-in-${reviewBookingDetail?.citySlug}${queryStringWithoutMealPlan}`,
      label: `Villas in ${reviewBookingDetail?.city}`,
    },
    {
      href: `/villa-in-${reviewBookingDetail?.citySlug}/${reviewBookingDetail?.slug}${queryStringWithMealPlan}`,
      label: reviewBookingDetail?.name || reviewBookingDetail?.id,
    },
    { href: '/', label: 'Review Booking' },
  ];

  const handlePartialPaymentToggle = (value: boolean) => {
    setIsPartialPaymentEnabled(value);
  };

  async function refreshAccessToken(refreshToken: string): Promise<string> {
    const result = await client
      .query(CHECK_AUTHENTICATION, { refreshToken })
      .toPromise();

    if (result.error) {
      throw new Error(
        `Failed to refresh access token: ${result.error.message}`
      );
    }

    if (result.data?.authenticate?.accessToken) {
      Cookies.set('accessToken', result.data.authenticate.accessToken, {
        expires: 30,
      });
      Cookies.set('refreshToken', result.data.authenticate.refreshToken, {
        expires: 30,
      });
      return result.data.authenticate.accessToken;
    } else {
      throw new Error('Refresh token is invalid or expired.');
    }
  }

  const fetchPropertyBookingData = useCallback(
    async (
      cancellationPlanID: string | null,
      checkin: string,
      checkout: string
    ) => {
      if (!checkin && !checkout) {
        setBookingReview(initialPropertyState.bookingReview);
        setAmountDetails(initialPropertyState.amountDetails);
        return;
      }

      setProcessing(true);
      setLoading(true);
      setQuoteIdUpdated(false);

      try {
        const result = await client
          .query(
            GET_REVIEW_BOOKING_DETAILS,
            {
              filters: {
                propertyId: propertyID,
                adults: adultsCount,
                children: childrenCount,
                checkinDate: checkin,
                checkoutDate: checkout,
                ...(checkin &&
                  checkout && {
                    ratePlanCode: mealPlanCode ?? 'ep',
                  }),
                ...(bankOffer && {
                  bankOfferCode: bankOffer.toUpperCase(),
                }),
                ...(customCoupon && {
                  couponCode: customCoupon.toUpperCase(),
                }),
                ...(cancellationPlanID &&
                  checkin &&
                  checkout && {
                    cancellationPlanRuleId: cancellationPlanID,
                  }),
              },
            },
            {
              requestPolicy: 'network-only',
              fetchOptions: {
                headers: {
                  'Channel-Id': isCorporateChannel
                    ? isCorporateChannel
                    : process.env.NEXT_PUBLIC_CHANNEL_ID || '',
                  ...(Cookies.get('accessToken') && {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                  }),
                },
              },
            }
          )
          .toPromise();

        if (result.error) {
          throw result.error;
        }

        if (result.data) {
          setBookingReview(result.data?.propertiesRatesV1?.list[0]);

          const _quote: Quote | undefined =
            result.data?.propertiesRatesV1?.list[0]?.quotes[0];
          const isSoldOut =
            result.data?.propertiesRatesV1?.list[0]?.quotes[0]?.soldOut;

          setQuoteIdUpdated(true);

          if (
            customCoupon &&
            (_quote?.couponDiscountPercentage || _quote?.couponDiscountAmount)
          ) {
            setAppliedCoupons((prev) =>
              prev.find((discount) => customCoupon === discount.code)
                ? prev
                : [
                    ...prev,
                    {
                      code: customCoupon,
                      discountPercentage: _quote?.couponDiscountPercentage,
                      discountAmount: _quote?.couponDiscountAmount,
                    },
                  ]
            );
            setIsCustomCouponLoading((prev) => ({
              ...prev,
              isLoading: false,
              code: customCoupon,
              action: 'apply',
            }));
          }

          if (
            bankOffer &&
            (_quote?.paymentDiscountPercentage || _quote?.paymentDiscountAmount)
          ) {
            setAppliedBankOffers((prev) =>
              prev.find((discount) => bankOffer === discount.code)
                ? prev
                : [
                    ...prev,
                    {
                      code: bankOffer,
                      discountPercentage: _quote?.paymentDiscountPercentage,
                      discountAmount: _quote?.paymentDiscountAmount,
                    },
                  ]
            );
            setIsBankOfferLoading((prev) => ({
              ...prev,
              isLoading: false,
              code: bankOffer ?? null,
              action: 'apply',
            }));
          }

          if (_quote?.bankOfferCode !== bankOffer) {
            setBankOffer(_quote?.bankOfferCode ?? null);
          }
          if (_quote?.couponCode !== customCoupon) {
            setCustomCoupon(_quote?.couponCode ?? null);
          }

          if (isSoldOut) {
            if (!isPropertySoldOut) {
              toast(
                <div>
                  <p className='font-bold text-base text-foreground'>
                    Sold out
                  </p>
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

          setOpenCustomCouponDialog(false);
        }
      } catch (error: any) {
        const graphQLErrors = error?.graphQLErrors || [];

        if (
          graphQLErrors[0]?.extensions?.classification ===
          'BANK_OFFER_VALIDATION'
        ) {
          setIsCouponError(true);
          setIsCouponErrorMessage(error);
          setTimeout(() => {
            setAppliedBankOffers([]);
            setBankOffer(null);
          }, 0);
        } else if (
          graphQLErrors[0]?.extensions?.classification === 'COUPON_VALIDATION'
        ) {
          setIsCouponError(true);
          setIsCouponErrorMessage(error);
          setTimeout(() => {
            setAppliedCoupons([]);
            setCustomCoupon(null);
          }, 0);
        } else if (
          graphQLErrors[0]?.extensions?.classification === 'BAD_REQUEST'
        ) {
          setIsPropertyError(true);
          setDatePickerOpen(true);
        } else {
          setIsPropertyError(false);
          setIsCouponError(true);
          setIsCouponErrorMessage(error);
        }
      } finally {
        setTimeout(() => {
          setProcessing(false);
          setLoading(false);
          setIsCustomCouponLoading((prev) => ({ ...prev, isLoading: false }));
          setIsBankOfferLoading((prev) => ({ ...prev, isLoading: false }));
        }, 100);
      }
    },
    [
      adultsCount,
      childrenCount,
      customCoupon,
      bankOffer,
      prevBankOffer,
      prevCustomCoupon,
      offersData.length,
      mealPlanCode,
      cancellationPlanID,
      propertyID,
      autoApplyCoupon,
    ]
  );

  const updateValueAddedServicesInQuote = async ({ quoteId }: any) => {
    if (!quoteId || !client) {
      throw new Error('Quote ID and urql Client are required');
    }

    const response = await client
      .mutation(
        ADD_VAS_TO_QUOTE_MUTATION,
        {
          quoteId,
          services: selectedVAS,
        },
        {
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

    if (response.error) {
      throw new Error(
        `GraphQL error while updating VAS: ${response.error.message}`
      );
    }

    const updatedQuote = response.data?.addVasToQuote;
    if (updatedQuote) {
      setAmountDetails(updatedQuote);

      if (walletChecked && !updatedQuote.isWalletUsed) {
        setWalletChecked(false);
      }
    }
  };

  const { setLoginOpen } = useAuth();

  async function fetchUserDetails(
    client: Client,
    accessToken: string,
    refreshToken: string = ''
  ) {
    try {
      const result = await client
        .query(
          GET_USER_DETAILS,
          {},
          {
            fetchOptions: {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          }
        )
        .toPromise();

      if (result.data?.me) {
        return result.data.me;
      } else {
        throw new Error('Failed to fetch user details: No user data received.');
      }
    } catch (error: any) {
      if (
        refreshToken &&
        (error?.networkError?.statusCode === 401 ||
          error?.message?.includes('access token expired'))
      ) {
        try {
          const newAccessToken = await refreshAccessToken(refreshToken);

          const retryResult = await client
            .query(
              GET_USER_DETAILS,
              {},
              {
                fetchOptions: {
                  headers: { Authorization: `Bearer ${newAccessToken}` },
                },
              }
            )
            .toPromise();

          if (retryResult.data?.me) {
            return retryResult.data.me;
          } else {
            throw new Error('Retry failed: No user data received.');
          }
        } catch (refreshError) {
          throw refreshError;
        }
      }

      throw error;
    }
  }

  const handleSignupError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleSignupMutation = async (signupData: {
    id: string;
    salutation?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    countryCode?: string;
  }) => {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    if (!guestData?.id) {
      throw new Error('User ID not found');
    }

    try {
      setIsSignupLoading(true);

      const { data, error } = await client
        .mutation(USER_SIGNUP, {
          id: signupData.id,
          salutation: signupData.salutation,
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          ...(signupData.email && { email: signupData.email }),
          ...(signupData.phoneNumber && {
            phone: `${signupData.countryCode}${signupData.phoneNumber}`,
          }),
        })
        .toPromise();

      if (error) {
        throw error;
      }

      const updatedUserData = {
        ...userData,
        salutation: signupData.salutation,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        ...(signupData.phoneNumber && {
          phone: signupData.phoneNumber,
          countryCode: signupData.countryCode,
        }),
        ...data?.userSignup,
      };

      Cookies.set('userData', JSON.stringify(updatedUserData), { expires: 30 });

      if (accessToken && fetchUserDetails) {
        try {
          const freshUserDetails = await fetchUserDetails(
            client,
            accessToken,
            refreshToken || ''
          );

          const syncedUserData = {
            ...updatedUserData,
            ...freshUserDetails,
          };

          Cookies.set('userData', JSON.stringify(syncedUserData), {
            expires: 30,
          });
          setUserData(syncedUserData);
          handleGuestEditToggle(false);
        } catch (fetchError) {
          console.warn('Failed to fetch fresh user details:', fetchError);
        }
      }

      return updatedUserData;
    } catch (error: any) {
      console.error('Signup mutation error:', error);

      const message =
        error instanceof CombinedError
          ? error.graphQLErrors?.[0]?.message || 'Signup failed'
          : error instanceof Error
            ? error.message
            : 'Signup failed';

      toast.error('Signup Failed', {
        description: message,
      });

      if (handleSignupError) {
        handleSignupError(message);
      }

      throw error;
    } finally {
      setIsSignupLoading(false);
    }
  };

  const handlePaymentClick = async () => {
    if (!accessToken) {
      if (guestData.mobile) {
        if (!validateGuestDetails()) {
          handleGuestEditToggle(true);
          return;
        }

        if (!guestData.phoneVerified) {
          setIsLoginModalOpen(true);
        }

        return;
      }
      setLoginOpen(true, 'drawer');
      return;
    }

    if (!filters?.checkinDate || !filters?.checkoutDate) {
      toast(
        <div>
          <p className='font-bold text-base text-foreground'>Error</p>
          <p className='text-sm font-semibold text-muted-foreground'>
            Select Check-in and Check-out dates
          </p>
        </div>,
        {
          icon: (
            <AlertCircle className='text-accent-red-900 dark:text-accent-yellow-950 w-5 h-5' />
          ),
        }
      );
      setLoading(false);
      return;
    }

    if (!validateGuestDetails()) {
      handleGuestEditToggle(true);
      return;
    }

    if (guestData.mobile && userData?.firstLoginIntent != 'email') {
      if (!guestData.phoneVerified) {
        setIsLoginModalOpen(true);
        return;
      }
    }

    setLoading(true);

    try {
      const userData = Cookies.get('userData')
        ? JSON.parse(Cookies.get('userData') as string)
        : null;

      const guestDetailsChange = detectGuestDetailsChanges(userData, guestData);

      if (
        (guestData.phoneVerified || userData?.firstLoginIntent == 'email') &&
        guestDetailsChange.hasChanges &&
        guestDetailsChange.signupPayload
      ) {
        try {
          await handleSignupMutation(guestDetailsChange.signupPayload);
        } catch (error) {
          setLoading(false);
          return;
        }
      }

      if (!bookingReview?.quotes) {
        setLoading(false);
        return;
      }

      const quotes = bookingReview?.quotes[0];

      const updatedUserData = Cookies.get('userData')
        ? JSON.parse(Cookies.get('userData') as string)
        : userData;

      trackEvent('proceed_to_pay_clicked', {
        'First Name': updatedUserData?.firstName,
        'Last Name': updatedUserData?.lastName,
        email: updatedUserData?.email,
        phone: updatedUserData?.phone,
        'guest city': updatedUserData?.guestCity,
        paymentType: isPartialPaymentEnabled === true ? 'SPLIT' : 'FULL',
        bookingAmount: quotes?.netAmountAfterTax,
        checkIn: filters?.checkinDate || quotes?.checkinDate,
        checkOut: filters?.checkoutDate || quotes?.checkoutDate,
        promotionCode: quotes?.promotionCode,
        couponCode: quotes?.couponCode,
        cancellationPlan: quotes?.cancellationPlan,
        bankOffer: quotes?.bankOfferCode,
        'guest count': quotes?.numberOfGuests,
        meal: quotes?.ratePlan?.displayName,
        night: quotes?.numberOfNights,
        page_name: 'booking_details',
      });

      const { data, error } = await client
        .mutation<{ guestReservations: any }>(
          CREATE_GUEST_RESERVATION_MUTATION,
          {
            reservationInput: {
              guest: {
                salutation:
                  updatedUserData?.salutation ||
                  updatedUserData?.prefix ||
                  'Mr',
                firstName: updatedUserData?.firstName,
                lastName: updatedUserData?.lastName,
                email: updatedUserData?.email,
                phone: updatedUserData?.phone || updatedUserData?.phoneNumber,
                city: updatedUserData?.city ?? undefined,
              },
              paymentGateway,
              paymentTerm: isPartialPaymentEnabled ? 'SPLIT' : 'FULL',
              utm: {
                source: paramsSource ?? undefined,
                medium: paramMedium ?? undefined,
                campaign: paramCampaign ?? undefined,
                term: paramTerm ?? undefined,
                content: paramContent ?? undefined,
              },
              userId: userData?.id,
            },
            quoteId: quotes?.id,
          }
        )
        .toPromise();

      Cookies.set('userData', JSON.stringify(updatedUserData) || '', {
        expires: 30,
      });

      sendGTMEvent({
        event:
          isPartialPaymentEnabled === true
            ? 'partial_payment_click'
            : 'full_payment_click',
        value:
          isPartialPaymentEnabled === true
            ? quotes?.splitPaymentAmount
            : quotes?.netAmountAfterTax,
        userData: {
          firstName: updatedUserData?.firstName,
          lastName: updatedUserData?.lastName,
          email: updatedUserData?.email,
          mobile: updatedUserData?.phone || updatedUserData?.phoneNumber,
          totalAmount: quotes?.netAmountAfterTax,
        },
      });

      if (error) {
        throw error;
      }

      if (data) {
        setPaymentDetail(data);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);

      if (error instanceof CombinedError && error.graphQLErrors.length > 0) {
        const messages = error.graphQLErrors
          .map((err) => err.message)
          .join('\n');

        toast(
          <div>
            <p className='font-bold text-base text-foreground'>
              Booking Failed
            </p>
            <p className='text-sm font-semibold text-muted-foreground'>
              {messages}
            </p>
          </div>,
          {
            icon: (
              <AlertCircle className='text-accent-red-900 dark:text-accent-yellow-950 w-5 h-5' />
            ),
          }
        );
      } else {
        toast(
          <div>
            <p className='font-bold text-base text-foreground'>
              Something went wrong
            </p>
            <p className='text-sm font-semibold text-muted-foreground'>
              Please try again later.
            </p>
          </div>,
          {
            icon: (
              <AlertCircle className='text-accent-red-900 dark:text-accent-yellow-950 w-5 h-5' />
            ),
          }
        );
      }
    }
  };

  const QuoteId = bookingReview?.quotes?.[0]?.id;

  useEffect(() => {
    if (QuoteId || selectedVAS) {
      updateValueAddedServicesInQuote({ quoteId: QuoteId });
    }
  }, [QuoteId, selectedVAS]);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (currentUrl && isPaymentDetail?.guestReservations?.id) {
      const baseUrl = currentUrl.split('?')[0];
      const newUrl = `${baseUrl}?paymentId=${isPaymentDetail?.guestReservations?.id}`;

      if (isPaymentDetail?.guestReservations?.paymentGateway === 'CASHFREE') {
        handleCashfreePayment({
          paymentSessionId:
            isPaymentDetail?.guestReservations?.paymentGatewayCheckoutCode,
          callbackUrl: newUrl,
          cashfreeMode,
        });
      } else if (
        isPaymentDetail?.guestReservations?.paymentGateway === 'RAZORPAY'
      ) {
        handleRazorPayPayment({
          orderId:
            isPaymentDetail?.guestReservations?.paymentGatewayCheckoutCode,
          reservationsId: isPaymentDetail?.guestReservations?.id,
          razorpayKey,
        });
      }
    }
  }, [
    isPaymentDetail?.guestReservations?.id,
    currentUrl,
    isPaymentDetail,
    bookingId,
  ]);

  const handleCouponBannerClick = () => {
    setIsCouponClicked(true);
    trackEvent('apply_offers_clicked', {
      page_name: 'booking_details',
      property_id: reviewBookingDetail?.id,
      property_name: reviewBookingDetail?.name,
      is_checkin_out_entered: checkin && checkout ? true : false,
    });
  };

  useEffect(() => {
    if (reviewBookingDetail) {
      updateGuestData(
        {
          ...guestsData,
          max_adults: reviewBookingDetail.maxAdults,
          max_occupancy: reviewBookingDetail.maxOccupancy,
          max_children: reviewBookingDetail.maxChildren,
        },
        false
      );
      setBookingReview(reviewBookingDetail);
    }
  }, []);

  useEffect(() => {
    fetchPropertyBookingData(cancellationPlanID || null, checkin, checkout);
  }, [
    cancellationPlanID,
    adultsCount,
    childrenCount,
    customCoupon,
    bankOffer,
    prevBankOffer,
    prevCustomCoupon,
    offersData.length,
    mealPlanCode,
    propertyID,
    autoApplyCoupon,
    checkin,
    checkout,
  ]);

  useEffect(() => {
    if (walletChecked) {
      setWalletChecked(false);
    }
  }, [
    checkin,
    checkout,
    guestsData?.numberOfGuests,
    guestsData?.numberOfChildren,
    mealPlanCode,
    selectedVAS,
    customCoupon,
    bankOffer,
  ]);

  useEffect(() => {
    if (!checkin || !checkout) {
      setIsPropertySoldOut(false);
    }
  }, [checkin, checkout]);

  useEffect(() => {
    if (selectedVAS) {
      const vasString = selectedVAS
        .map((vas) => `${vas.id}:${vas.quantity}`)
        .join(',');
      if (vasString) {
        updateParams({
          service: vasString,
        });
      }
    }
  }, [selectedVAS]);

  const handleWalletActionComplete = useCallback(async () => {
    if (bookingReview?.quotes?.[0]?.id && client) {
      try {
        const response = await client
          .mutation(
            ADD_VAS_TO_QUOTE_MUTATION,
            {
              quoteId: bookingReview.quotes[0].id,
              services: selectedVAS,
            },
            {
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

        if (response.error) {
          console.error('Error calling addVasToQuote:', response.error);
          return;
        }

        const updatedQuote = response.data?.addVasToQuote;
        if (updatedQuote) {
          setAmountDetails(updatedQuote);

          if (!updatedQuote.isWalletUsed) {
            setWalletChecked(false);
          }
        }
      } catch (error) {
        console.error('Error in handleWalletActionComplete:', error);
        setWalletChecked(false);
      }
    }
  }, [
    bookingReview?.quotes,
    client,
    selectedVAS,
    setAmountDetails,
    setWalletChecked,
  ]);

  const cancellationPlan = bookingReview?.quotes?.[0]?.cancellationPlans || [];

  const isPartialPayment =
    amountDetails?.splitPaymentPercentage != null &&
    amountDetails.splitPaymentPercentage < 100;

  // Handle wallet state changes and URL synchronization
  const handleWalletCheckedChange = useCallback(
    (checked: boolean) => {
      setWalletChecked(checked);

      // Update URL parameter
      if (checked) {
        updateParams({ wallet: 'true' });
      } else {
        // Remove wallet parameter when unchecked
        const currentParams = new URLSearchParams(window.location.search);
        if (currentParams.has('wallet')) {
          currentParams.delete('wallet');
          const newUrl = currentParams.toString()
            ? `${window.location.pathname}?${currentParams.toString()}`
            : window.location.pathname;
          window.history.replaceState(null, '', newUrl);
        }
      }
    },
    [updateParams]
  );

  useEffect(() => {
    // Sync wallet state with URL parameter on component mount and when dependencies change
    const shouldBeChecked = Boolean(
      walletParam === 'true' && accessToken && userDetails?.id
    );

    if (shouldBeChecked !== walletChecked) {
      setWalletChecked(shouldBeChecked);
    }
  }, [walletParam, accessToken, userDetails?.id]);

  return (
    <main className='mx-auto w-full px-0 py-0 sm:px-10 sm:py-4'>
      <div className='flex flex-col lg:flex-row w-full sm:gap-10 gap-0 pb-20 sm:pb-0'>
        {/* Left section */}
        <div className='w-full lg:w-2/3'>
          {/* property info and calender section */}
          {isTablet ? (
            <div className='absolute top-4 left-0 right-0 z-50 flex justify-between items-center px-4'>
              <Link
                href={backHref}
                aria-label='Go back'
                prefetch
                className='bg-white/80 backdrop-blur-md rounded-full p-2 shadow-sm inline-flex items-center justify-center'
              >
                <ArrowLeft className='w-5 h-5 text-[#3b3b3b] border-white' />
              </Link>
            </div>
          ) : (
            <CustomBreadcrumb items={breadcrumb} />
          )}

          <div className='bg-card border-none mt-0 mb-6 sm:rounded-2xl  md:mt-6 dark:bg-[var(--prive-background)] overflow-hidden'>
            <BookingConfirmCard
              booking={reviewBookingDetail}
              isReviewBooking={true}
            />
            {!isTablet ? (
              <AvailabilitySection
                id={'availability-section'}
                isBooking={true}
                propertyID={reviewBookingDetail?.id}
                handlePopoverClose={() => {}}
                isGuestDrawer={true}
                soldOut={isPropertySoldOut || isPropertyError}
                pageName={'booking_details'}
              />
            ) : (
              <div className='relative z-10 -mt-6 px-4 md:px-0! xl:px-4!'>
                <div className='rounded-xl pt-4 px-2 bg-primary-50 border-1 md:border-0 lg:border-1 border-primary-100 dark:bg-[var(--black5)] dark:border-primary-800'>
                  <AvailabilitySection
                    id={'availability-section'}
                    isBooking={true}
                    propertyID={reviewBookingDetail?.id}
                    handlePopoverClose={() => {}}
                    isGuestDrawer={true}
                    soldOut={isPropertySoldOut || isPropertyError}
                    pageName={'booking_details'}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Guest Details section */}
          <SectionTemplate showDefaultArrows heading='Guest Details' id='about'>
            <Suspense fallback=''>
              <GuestDetailsForm
                guest={guestData}
                onGuestDataChange={handleGuestDataChange}
                isEdit={isGuestEdit}
                onEditToggle={handleGuestEditToggle}
                errors={errors}
                setErrors={setErrors}
                validateGuestDetails={validateGuestDetails}
                isLoginModalOpen={isLoginModalOpen}
                setIsLoginModalOpen={setIsLoginModalOpen}
              />
            </Suspense>
          </SectionTemplate>

          {/* Cancellation Plans section */}
          {cancellationPlan?.length > 0 ? (
            <SectionTemplate
              showDefaultArrows
              heading='Cancellation Plans'
              id='about'
            >
              <Suspense fallback=''>
                <CancellationPlans cancellationPlan={cancellationPlan} />
              </Suspense>
            </SectionTemplate>
          ) : bookingReview?.quotes?.[0]?.cancellationPolicies ? (
            <SectionTemplate
              id='cancellation'
              showDefaultArrows
              heading='Cancellation Policy'
            >
              <Suspense fallback={'Loading...'}>
                <CancellationPolicy
                  isPropertyDetail={true}
                  policyData={
                    bookingReview?.quotes?.[0]?.cancellationPolicies || []
                  }
                />
              </Suspense>
            </SectionTemplate>
          ) : null}

          {/* VAS Services section */}
          {valueAddedService.length > 0 && (
            <Suspense fallback=''>
              <ValueAddedServices
                valueAddedServices={valueAddedService || []}
                onVASChange={setSelectedVAS}
              />
            </Suspense>
          )}

          {isMobile && accessToken && (
            <div className='px-5 pb-1 mt-3'>
              <Suspense fallback=''>
                <ElicashPaymentCard
                  checked={walletChecked}
                  onChange={handleWalletCheckedChange}
                  type='beforeApply'
                  quoteId={QuoteId}
                  onWalletActionComplete={handleWalletActionComplete}
                  priceData={amountDetails}
                  quoteIdUpdated={quoteIdUpdated}
                />
              </Suspense>
            </div>
          )}
          {isMobile && (
            <div className='w-full space-y-6 mt-6 mb-6 px-3'>
              <PriceBreakdown priceData={amountDetails} />
            </div>
          )}

          {/* House Rules section */}
          <SectionTemplate
            showDefaultArrows
            heading='House Rules'
            id='about'
            onClick={() => {
              trackEvent('house_rules_clicked', {
                page_name: 'booking_details',
              });
            }}
          >
            <Suspense fallback=''>
              <AboutHome
                data={reviewBookingDetail}
                faqs={reviewBookingDetail?.faqs && reviewBookingDetail?.faqs}
                isAbout={false}
              />
            </Suspense>
          </SectionTemplate>

          {/* Contact Us section */}
          <SectionTemplate showDefaultArrows heading='Contact Us' id='about'>
            <Suspense fallback=''>
              <ContactCTA pageName={'booking_details'} />
            </Suspense>
          </SectionTemplate>
        </div>
        {/* right section */}
        <div className='w-full lg:w-1/3 space-y-6 lg:mt-6 px-3 lg:px-0'>
          {isTablet ? (
            <></>
          ) : (
            <div className='border-primary-100 shadow-lg border rounded-2xl py-3 space-y-4 mt-5 bg-white dark:bg-[var(--black5)] dark:border-secondary-950'>
              {!isMobile && accessToken && (
                <div className='px-5 pb-1 mt-3'>
                  <Suspense fallback=''>
                    <ElicashPaymentCard
                      checked={walletChecked}
                      onChange={handleWalletCheckedChange}
                      type='beforeApply'
                      quoteId={QuoteId}
                      onWalletActionComplete={handleWalletActionComplete}
                      priceData={amountDetails}
                      quoteIdUpdated={quoteIdUpdated}
                    />
                  </Suspense>
                </div>
              )}

              <PriceBreakdown
                priceData={amountDetails}
                primaryClass='bg-white py-0 mb-1'
              />
              <div className='px-5 pb-1 mt-3'>
                <hr className='border-t dark:border-primary-800' />
              </div>

              <div className='px-5'>
                <PriceActions
                  showPartialPayment={isPartialPayment}
                  onPartialToggle={handlePartialPaymentToggle}
                  propertyID={propertyID}
                  isPartialPaymentEnabled={isPartialPaymentEnabled}
                  amountDetails={amountDetails}
                  handleClick={handlePaymentClick}
                  checkin={checkin}
                  checkout={checkout}
                  propertyName={reviewBookingDetail?.name}
                  shouldTrackBookNow={false}
                />
              </div>
            </div>
          )}

          {/* Coupon section */}
          {offers.length > 0 &&
            (!isTablet ? (
              <div className='rounded-2xl border p-4 space-y-4 bg-white relative dark:bg-[var(--black5)] dark:border-secondary-950'>
                <div className='absolute bg-white left-[-1px] top-1/2 -translate-y-1/2 w-4 h-8 border border-[#e8e0dc] border-r-1 border-l-white rounded-r-[100px] dark:bg-[var(--prive4)] dark:border-l-0 dark:border-secondary-950'></div>
                <Suspense fallback=''>
                  <Coupons
                    isOpen={isCouponClicked}
                    onOpenChange={setIsCouponClicked}
                    offers={offers}
                    quotes={
                      bookingReview?.quotes ? bookingReview?.quotes[0] : null
                    }
                    propertyId={reviewBookingDetail?.id}
                    propertyName={reviewBookingDetail?.name}
                    pageName={'booking_details'}
                  />
                </Suspense>
                <div className='absolute bg-white right-[-1px] top-1/2 -translate-y-1/2 w-4 h-8 border border-[#e8e0dc] border-l-1 border-r-white rounded-l-[100px] dark:bg-[var(--prive4)] dark:border-r-0 dark:border-secondary-950'></div>
              </div>
            ) : (
              <Suspense fallback=''>
                <Coupons
                  isOpen={isCouponClicked}
                  onOpenChange={setIsCouponClicked}
                  offers={offers}
                  quotes={
                    bookingReview?.quotes ? bookingReview?.quotes[0] : null
                  }
                  propertyId={reviewBookingDetail?.id}
                  propertyName={reviewBookingDetail?.name}
                  pageName={'booking_details'}
                />
              </Suspense>
            ))}

          {!isTablet && <SecureBookingBanner />}
        </div>
        <Suspense fallback=''>
          <CouponDiscountPopUp />
        </Suspense>
      </div>
      {isTablet && (
        <div className='fixed bottom-0 left-0 right-0 z-50 bg-white shadow-md border-t border-gray-200 dark:bg-[var(--prive4)] dark:border-secondary-950'>
          {offers.length > 0 && (
            <div
              className='w-full relative z-1!'
              onClick={handleCouponBannerClick}
            >
              <CouponBanner isMobile={true} amountDetails={amountDetails} />
            </div>
          )}
          <div className='w-full px-4 py-3 dark:border-t-1 relative dark:border-primary-100 z-9!'>
            <PriceActions
              showPartialPayment={isPartialPayment}
              onPartialToggle={handlePartialPaymentToggle}
              propertyID={propertyID}
              isPartialPaymentEnabled={isPartialPaymentEnabled}
              amountDetails={amountDetails}
              handleClick={handlePaymentClick}
              checkin={checkin}
              checkout={checkout}
              propertyName={reviewBookingDetail?.name}
              shouldTrackBookNow={false}
            />
          </div>
        </div>
      )}
      {reviewBookingDetail?.state === 'Goa' ? (
        <div
          className={
            isMobile
              ? 'elfsight-app-51dc1535-2163-440b-b2e1-9375c4623b00'
              : 'elfsight-app-9639f01b-33d7-45fa-8f6e-d5e45093d7df'
          }
          data-elfsight-app-lazy
        />
      ) : (
        <div
          className={
            isMobile
              ? 'elfsight-app-d5920c48-3b8f-479f-9767-3528f7e241cc'
              : 'elfsight-app-37733807-2540-4748-9388-0511920e58fb'
          }
          data-elfsight-app-lazy
        />
      )}
    </main>
  );
}
