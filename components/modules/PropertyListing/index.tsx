'use client';

import NoResults from '@/assets/noResults.svg';

import SearchPanel from '@/components/common/SearchPanel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { PropertyFilters, SecondaryPropertyFilters } from '@/contexts';
import { PageInfo } from '@/contexts/property';
import {
  sortFilterOptions,
  useFilters,
  useGuests,
  useSecondaryFilters,
} from '@/hooks/filters';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import {
  KEY_VALUE_KEYS,
  LOYALTY_HOME_PAGE_CONTENT,
  sortByOptions,
} from '@/lib/constants';
import { GET_PROPERTIES_LISTING } from '@/lib/queries';
import {
  capitalizeInitials,
  cn,
  formatParamsCityName,
  generateQueryString,
} from '@/lib/utils';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Pencil, SlidersHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  startTransition,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
// import AdvanceListingFilters from './AdvanceListingFilters';
import Cookies from 'js-cookie';
import { useUserContext } from '@/contexts/SharedProvider';
import GridViewToggle from './GridViewToggle';
import LocationBanner from './LocationContent/LocationBanner';

import { CarouselTemplate } from '@/components/common/Carousel';
import PropertyCard from '@/components/common/PropertyCard';
import { useDateTooltip } from '@/hooks/useDateTooltip';
import { useWallet } from '@/hooks/useWallet';
import { trackEvent } from '@/lib/mixpanel';
import React from 'react';
import { useClient } from 'urql';
import PropertyCardSkeleton from './PropertyCardSkeleton';

const LoyaltySectionHome = dynamic(() => import('../Home/LoyaltySectionHome'), {
  ssr: false,
  loading: () => null,
});
const LoyaltySectionHomeLoggedIn = dynamic(
  () => import('../Home/LoyaltySectionHome/LoggedIn'),
  {
    ssr: false,
    loading: () => null,
  }
);
const AdvanceListingFilters = dynamic(() => import('./AdvanceListingFilters'), {
  ssr: false,
  loading: () => null,
});

const DatePersuation = dynamic(
  () => import('@/components/common/DatePersuation'),
  {
    ssr: false,
    loading: () => null,
  }
);

import PropertyListingTypes from './PropertyListing.types';
import TitleDescription from '@/components/common/TitleDescription';
import LoyaltyExpiringCard from '@/components/common/Loyalty/LoyaltyExpiringCard';
const DiscountCard = dynamic(() => import('@/components/common/DiscountCard'), {
  ssr: false,
  loading: () => null,
});
const LocationDetailsAccordion = dynamic(
  () => import('./LocationContent/LocationDetailsAccordion'),
  {
    ssr: false,
    loading: () => null,
  }
);
const SelectedFilterChip = dynamic(() => import('./SelectedFilterChip'), {
  ssr: false,
  loading: () => null,
});
const FloatingCta = dynamic(() => import('@/components/common/FloatingCta'), {
  ssr: false,
  loading: () => null,
});

type GridLayout = '2x2' | '3x3';

type PropertyListingProps = PropertyListingTypes.Props;

export default function PropertyListingsModule({
  propertiesList,
  initialPropertiesPageInfo,
  advanceFilterData,
  cityContent,
  offersList,
  citySlug,
  city,
  locations,
  loyaltyExpiringCardContent: loyaltyExpiringCardContentProp,
}: PropertyListingProps) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const client = useClient();
  const router = useRouter();
  const isInitialRender = useRef(true);
  const hasTrackedPageView = useRef(false);
  const searchParams = useSearchParams();
  const params = useParams();
  // Custom hooks for filtering
  const { filters, updateMultipleFilters, urlParams } = useFilters();
  const { guestsData, updateGuestData } = useGuests();
  const {
    secondaryPropertyFilters,
    sortFilter,
    setSecondaryPropertyFilters,
    selectedPropertyType,
    selectedPropertyBrand,
    clearPriceFilter,
    clearAllSecondaryFilters,
    clearPetFriendlyFilter,
    clearPriveFilter,
    clearPropertyTypeFilter,
    clearPropertyBrandFilter,
  } = useSecondaryFilters(advanceFilterData);
  const [openSearchPanel, setOpenSearchPanel] = useState<boolean>(false);
  const [initialActiveIndex, setInitialActiveIndex] = useState<number | null>(
    null
  );
  const accessToken = Cookies.get('accessToken');
  const isCorporateChannel = Cookies.get('isCorporateChannel');

  // Component state
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [gridLayout, setGridLayout] = useState<GridLayout>('3x3');
  const [propertiesData, setPropertiesData] = useState(propertiesList || []);
  const [propertiesPageInfo, setPropertiesPageInfo] = useState(
    initialPropertiesPageInfo
  );
  const [isPropertiesLoading, setIsPropertiesLoading] = useState(false);
  const [isLoadingMoreProperties, setLoadingMoreProperties] = useState(false);
  const [loadMoreData, setLoadMoreData] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  let fetchedCityName = '';

  if (typeof params?.city === 'string') {
    const cityName = formatParamsCityName(params.city);

    if (cityName.toLowerCase() === 'delhi ncr') {
      fetchedCityName = 'Delhi NCR';
    } else {
      fetchedCityName = capitalizeInitials(cityName);
    }
  }

  const appSearchParams = urlParams.getAllParams();
  const showAll = searchParams.size > 0 || params?.city ? false : true;

  const city_name = fetchedCityName;
  const checkin = appSearchParams.checkin;
  const checkout = appSearchParams.checkout;
  const adults = appSearchParams.adults;
  const children = appSearchParams.children;

  const filtersToApply = showAll
    ? {
        city: null,
        checkinDate: null,
        checkoutDate: null,
        adults: 1,
        children: 0,
      }
    : {
        city: city_name,
        checkinDate: checkin,
        checkoutDate: checkout,
        adults: adults,
        children: children,
      };

  // const secondaryFiltersUpdated = JSON.stringify({
  //   secondaryPropertyFilters,
  //   sortFilter,
  // });

  const propertyTypePayload =
    advanceFilterData?.propertyFilters.propertyTypeFilter.find(
      (filter) => filter.slug === selectedPropertyType
    )?.name;
  const { loyaltyTierDetails } = useWallet();

  const renderTitle = () => {
    const searchParams = useSearchParams();
    const propertyType = searchParams.get('propertyType');

    const totalCount = propertiesPageInfo?.totalElementsCount ?? 0;
    const isApartments = propertyType === 'apartments';

    const propertyLabel = isApartments
      ? totalCount <= 1
        ? 'Apartment'
        : 'Apartments'
      : totalCount <= 1
        ? 'Villa'
        : 'Villas';

    return (
      <h2
        className={cn(
          'typography-title-semibold text-sm text-center',
          isTablet && 'my-2 text-sm!'
        )}
      >
        {totalCount} {propertyLabel}{' '}
        {fetchedCityName && <span>in {fetchedCityName}</span>}
      </h2>
    );
  };
  const renderListingHeader = () => {
    return (
      <>
        {renderTitle()}
        <div className='flex items-center gap-5'>
          <Select
            key={`sort-${sortFilter}`}
            defaultValue={sortFilter}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className='cursor-pointer shadow-none relative w-fit h-[42px]! border rounded-lg px-4 py-2 flex items-center gap-2 [&>svg]:text-accent-red-900! [&>svg]:opacity-100! '>
              <span className='typography-small-regular'>Sort By:</span>
              <span className='ml-auto typography-label-semibold'>
                <SelectValue placeholder='Best Value' />
              </span>
            </SelectTrigger>

            <SelectContent className='rounded-lg border shadow-none'>
              {sortByOptions.map((option) => (
                <SelectItem
                  className='cursor-pointer h-10 mb-2'
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <GridViewToggle
            gridLayout={gridLayout}
            setGridLayout={setGridLayout}
          />
        </div>
      </>
    );
  };

  const renderMobileListingHeader = () => {
    const formattedCheckin =
      filters?.checkinDate && format(filters?.checkinDate || '', 'dd MMM');
    const formattedCheckout =
      filters?.checkoutDate && format(filters?.checkoutDate || '', 'dd MMM');

    const handleEditDatesClick = () => {
      setOpenSearchPanel(true);
      trackEvent('edit_dates_clicked', {
        is_city_selected: !!citySlug,
        is_date_selected: !!(checkin && checkout),
        is_number_of_guest_selected: adults > 1 || children > 0,
        page_name: 'property_listing',
      });
    };

    const handleBackClick = (e: React.MouseEvent) => {
      e.preventDefault();
      startTransition(() => router.push('/'));
    };

    return (
      <div className='w-full h-16 flex gap-4 items-center text-center relative'>
        <div className='relative z-[51] flex min-w-[44px] min-h-[44px] w-1/12 items-center justify-center -ml-1'>
          <Link
            href='/'
            aria-label='back'
            prefetch={false}
            onClick={handleBackClick}
            className='flex items-center justify-center w-full h-full touch-manipulation'
          >
            <ArrowLeft />
          </Link>
        </div>
        <div className='w-10/12' onClick={handleEditDatesClick}>
          <div className='flex w-full items-center gap-0 px-4 py-1.5 rounded-full bg-primary-50'>
            <div className='w-11/12'>
              <div className='flex flex-col gap-[0px]'>
                <span className='text-xs font-semibold leading-[20px] text-[#1C1917]'>
                  {filters?.city || 'City/State/Location'}
                </span>
                <span
                  ref={mobileDateFieldRef}
                  className='text-xs font-normal leading-[18px] text-[#1C1917]'
                >
                  {formattedCheckin || 'Check-in'} –{' '}
                  {formattedCheckout || 'Check-out'}
                  <span className='mx-[6px] text-[#D6D3D1]'>|</span>
                  <span className='font-semibold'>
                    {guestsData.numberOfGuests || guestsData.numberOfChildren
                      ? guestsData.numberOfGuests +
                        guestsData.numberOfChildren +
                        ' Guests'
                      : '1 Guest'}
                  </span>
                </span>
              </div>
            </div>
            <div className='w-1/12'>
              <Pencil className='w-4 h-4 text-neutral-700' />
            </div>
          </div>
        </div>
        <div className='w-1/12' onClick={() => setShowFilters(true)}>
          <SlidersHorizontal size={22} />
        </div>

        {isMobileTooltipVisible && (
          <Suspense fallback={''}>
            <DatePersuation
              position={mobileTooltipPosition}
              onDismiss={handleDismissMobileTooltip}
              onClick={handleMobileTooltipClick}
              arrowPosition={mobileArrowPosition}
              arrowHorizontalAlign={mobileArrowHorizontalAlign}
            />
          </Suspense>
        )}
      </div>
    );
  };

  const renderVillaCard = ({ villa, index }: any) => {
    // const handleFavoriteToggle = (id: string, isFavorite: boolean) => {
    //   if (isFavorite) {
    //     setFavorites((prev) => [...prev, id]);
    //   } else {
    //     setFavorites((prev) => prev.filter((favId) => favId !== id));
    //   }
    // };
    const queryString = generateQueryString({
      checkin,
      checkout,
      adults,
      children,
      applyAutoBankOffer: true,
    });

    // Set priority for first 3 cards (LCP optimization)
    const isPriorityCard = index < 3;

    return (
      <PropertyCard
        key={villa?.id}
        property={{
          ...villa,
          isFavorite: favorites.includes(villa?.id),
        }}
        variant={'default'}
        showActionButton={false}
        queryString={queryString}
        verticalPosition={index + 1}
        priority={isPriorityCard}
        lazyLoadAmenityIcons={true}
        peram='listing_page'
        showBrandLogo={true}
      />
    );
  };

  const renderDiscountCard = (offer: any) => (
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
  );

  // Ref to track the main content area (excluding accordion)
  const mainContentRef = useRef<HTMLDivElement>(null);

  const isPageScrolledToBottom = (threshold = 200) => {
    if (typeof window === 'undefined') return false;

    // If we have a main content ref, use its bottom instead of document height
    if (mainContentRef.current) {
      const mainContentRect = mainContentRef.current.getBoundingClientRect();
      const mainContentBottom = mainContentRect.bottom + window.scrollY;

      return (
        window.innerHeight + window.scrollY >= mainContentBottom - threshold
      );
    }

    return (
      window.innerHeight + 20 + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - threshold
    );
  };

  // 2. Fix the fetchPropertiesData function
  const fetchPropertiesData = async (
    filtersToApply: any,
    secondaryPropertyFilters: SecondaryPropertyFilters
  ) => {
    setIsPropertiesLoading(true);
    try {
      const result = await client
        .query(
          GET_PROPERTIES_LISTING,
          {
            page: 0,
            pageSize: 12,
            filters: Object.fromEntries(
              Object.entries({
                ...filtersToApply,
                ...secondaryPropertyFilters,
                propertyType: propertyTypePayload,
                propertyBrands:
                  selectedPropertyBrand?.length > 0
                    ? selectedPropertyBrand
                    : undefined,
              }).filter(([_, value]) => value !== null && value !== undefined)
            ),
            sort: sortFilterOptions[sortFilter]?.payload,
          },
          {
            requestPolicy: 'network-only',
            fetchOptions: {
              headers: {
                'Channel-Id': isCorporateChannel
                  ? isCorporateChannel
                  : process.env.NEXT_PUBLIC_CHANNEL_ID || '',
              },
            },
          }
        )
        .toPromise();

      if (result.error) {
        throw result.error;
      }

      if (result.data?.propertiesRatesV1) {
        setPropertiesData(result.data.propertiesRatesV1.list || []);
        setPropertiesPageInfo({
          currentPage: result.data.propertiesRatesV1.currentPage,
          hasNext: result.data.propertiesRatesV1.hasNext,
          hasPrevious: result.data.propertiesRatesV1.hasPrevious,
          pageSize: result.data.propertiesRatesV1.pageSize,
          pagesCount: result.data.propertiesRatesV1.pagesCount,
          totalElementsCount: result.data.propertiesRatesV1.totalElementsCount,
        });
      }
    } catch (error) {
      console.error('Error in Fetching Properties', error);
    } finally {
      setIsPropertiesLoading(false);
    }
  };

  const loadMore = async (
    loadMoreFilters: PropertyFilters,
    loadMorePageInfo: PageInfo
  ) => {
    if (loadMorePageInfo.hasNext && !isLoadingMoreProperties) {
      setLoadingMoreProperties(true);
      try {
        const result = await client
          .query(
            GET_PROPERTIES_LISTING,
            {
              page: loadMorePageInfo.currentPage + 1,
              pageSize: 12,
              filters: Object.fromEntries(
                Object.entries({
                  ...loadMoreFilters,
                  ...secondaryPropertyFilters,
                  propertyType: propertyTypePayload,
                  propertyBrands:
                    selectedPropertyBrand?.length > 0
                      ? selectedPropertyBrand
                      : undefined,
                }).filter(([_, value]) => value !== null && value !== undefined)
              ),
              sort: sortFilterOptions[sortFilter]?.payload,
            },
            {
              requestPolicy: 'network-only',
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

        if (result.data?.propertiesRatesV1) {
          setPropertiesPageInfo({
            currentPage: result.data.propertiesRatesV1.currentPage,
            hasNext: result.data.propertiesRatesV1.hasNext,
            hasPrevious: result.data.propertiesRatesV1.hasPrevious,
            pageSize: result.data.propertiesRatesV1.pageSize,
            pagesCount: result.data.propertiesRatesV1.pagesCount,
            totalElementsCount:
              result.data.propertiesRatesV1.totalElementsCount,
          });

          setPropertiesData((prevData) => [
            ...prevData,
            ...(result.data.propertiesRatesV1.list || []),
          ]);
        }
      } catch (err) {
        console.error('Error in Fetching Properties', err);
      } finally {
        setLoadingMoreProperties(false);
      }
    }
  };

  const getBottomScrollOffset = () => {
    return isTablet ? 300 : 200;
  };
  const handleSortChange = (value: string) => {
    setSecondaryPropertyFilters({ sortKey: value });
    trackEvent('sort_applied', {
      page_name: 'property_listing',
      sort_type: value,
    });
  };

  const handleScroll = () => {
    if (
      !isLoadingMoreProperties &&
      isPageScrolledToBottom(getBottomScrollOffset())
    ) {
      setLoadMoreData((prev) => prev + 1);
    }
  };

  const handleScrollForSticky = useCallback(() => {
    if (citySlug && typeof window !== 'undefined') {
      const scrollThreshold = 350;
      setIsSticky(window.scrollY > scrollThreshold);
    }
  }, [citySlug]);

  // Setup sticky header effect
  useEffect(() => {
    if (typeof window === 'undefined' || isTablet) return;

    window.addEventListener('scroll', handleScrollForSticky, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollForSticky);
    };
  }, [handleScrollForSticky, isTablet]);

  // Load more data when scrolling to bottom
  useEffect(() => {
    if (loadMoreData > 0) {
      !isLoadingMoreProperties &&
        loadMore(
          { ...filters, city: citySlug ? citySlug : '' },
          propertiesPageInfo
        );
    }
  }, [loadMoreData]);

  // Setup scroll event listener
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const shouldShowMobileTooltip =
    (!filters?.checkinDate || !filters?.checkoutDate) &&
    isTablet &&
    !openSearchPanel;

  const {
    dateFieldRef: mobileDateFieldRef,
    tooltipPosition: mobileTooltipPosition,
    isTooltipVisible: isMobileTooltipVisible,
    handleDismissTooltip: handleDismissMobileTooltip,
    handleTooltipClick: handleMobileTooltipClick,
    arrowPosition: mobileArrowPosition,
    arrowHorizontalAlign: mobileArrowHorizontalAlign,
  } = useDateTooltip({
    shouldShow: shouldShowMobileTooltip,
    position: 'bottom',
    positionConfig: {
      verticalPosition: 'bottom',
      horizontalAlign: 'center',
      horizontalOffsetPercent: 10,
      spacing: 20,
      verticalOffset: 0,
      viewportPadding: 16,
    },
    onTooltipClick: () => {
      setInitialActiveIndex(1);
      setOpenSearchPanel(true);
    },
  });

  useEffect(() => {
    if (isInitialRender.current) {
      const hasActiveFilters =
        secondaryPropertyFilters.bhkList?.length ||
        secondaryPropertyFilters.isPetFriendly ||
        secondaryPropertyFilters.isStressed ||
        secondaryPropertyFilters.maxPrice ||
        secondaryPropertyFilters.minPrice ||
        selectedPropertyType ||
        selectedPropertyBrand?.length ||
        sortFilter !== 'popularity' ||
        checkin ||
        checkout ||
        adults > 1 ||
        children > 0;

      if (hasActiveFilters) {
        isInitialRender.current = false;
        fetchPropertiesData(
          {
            ...filtersToApply,
            city: citySlug,
          },
          secondaryPropertyFilters
        );
      }
    } else {
      // Subsequent renders
      fetchPropertiesData(
        {
          ...filtersToApply,
          city: citySlug,
        },
        secondaryPropertyFilters
      );

      if (typeof window !== 'undefined') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }

    updateMultipleFilters(filtersToApply, false);
    updateGuestData(
      {
        numberOfGuests: filtersToApply.adults || 1,
        numberOfChildren: filtersToApply.children || 0,
        max_adults: 100,
        max_children: 100,
        max_occupancy: 100,
        standard_guests: 20,
      },
      false
    );
  }, [
    secondaryPropertyFilters.bhkList?.length,
    secondaryPropertyFilters.isPetFriendly,
    secondaryPropertyFilters.isStressed,
    secondaryPropertyFilters.maxPrice,
    secondaryPropertyFilters.minPrice,
    selectedPropertyType,
    selectedPropertyBrand?.join(','),
    sortFilter,
    checkin,
    checkout,
    adults,
    children,
    citySlug,
  ]);

  // Track property listing page viewed event (only once when page loads)
  useEffect(() => {
    if (propertiesData.length > 0 && !hasTrackedPageView.current) {
      const searchParams = new URLSearchParams(window.location.search);
      const sourceParam = searchParams.get('source');
      // Valid sources: search_bar, city_card, property_widget
      const validSources = ['search_bar', 'city_card', 'property_widget'];
      const source = validSources.includes(sourceParam || '')
        ? sourceParam
        : null;

      trackEvent('property_listing_page_viewed', {
        is_city_selected: !!citySlug,
        is_date_selected: !!(checkin && checkout),
        is_number_of_guest_selected: adults > 1 || children > 0,
        number_of_cities_shown: propertiesPageInfo?.totalElementsCount || 0,
      });

      hasTrackedPageView.current = true;
    }
  }, [
    propertiesData.length,
    propertiesPageInfo?.totalElementsCount,
    citySlug,
    checkin,
    checkout,
    adults,
    children,
  ]);

  const isAuthenticated = Cookies.get('accessToken') ? true : false;
  const { userData } = useUserContext();
  const hasAuth = !!(Cookies.get('accessToken') || userData?.id);
  const newUserIntentPhone =
    userData?.firstLoginIntent === 'phone' &&
    !(userData?.firstName?.trim() || userData?.email?.trim());
  const newUserIntentGoogle =
    userData?.firstLoginIntent === 'email' && !userData?.phone;
  const isNewUser = newUserIntentPhone || newUserIntentGoogle;

  const expiringCardContent = loyaltyExpiringCardContentProp ?? null;

  // Add .es-portal-root styles on mount, remove on unmount
  // useEffect(() => {
  //   const styleId = 'es-portal-root-styles';
  //   const existingStyle = document.getElementById(styleId);

  //   if (!existingStyle && isMobile) {
  //     const style = document.createElement('style');
  //     style.id = styleId;
  //     style.textContent = `
  //       .es-portal-root {
  //         z-index: 1;
  //         position: absolute;
  //         top: 65px;
  //         left: 0px;
  //         width: 100%;
  //       }
  //     `;
  //     document.head.appendChild(style);
  //   }

  //   return () => {
  //     const styleToRemove = document.getElementById(styleId);
  //     if (styleToRemove) {
  //       styleToRemove.remove();
  //     }
  //   };
  // }, [isMobile]);

  return (
    <>
      {!isTablet && citySlug && (
        <>
          {/* <LocationBanner cityContent={cityContent} />{' '} */}
          <div
            className='elfsight-app-231437b2-ed7d-45b3-ae74-e82694a70626'
            data-elfsight-app-lazy
          />
        </>
      )}

      <div
        className={
          !isTablet && citySlug ? 'mx-auto w-full sm:px-4 xl:px-10 sm:py-4' : ''
        }
        ref={mainContentRef}
      >
        <main className='mx-auto w-full py-0'>
          <div className='flex flex-col lg:flex-row gap-8 h-full'>
            {!isTablet && (
              <aside
                className={`${
                  isTablet
                    ? 'lg:block w-1/5 self-start rounded-lg mt-4  border-[var(--border)]'
                    : 'lg:block w-1/5 self-start rounded-lg mt-4  border-[var(--border)]'
                }`}
              >
                <Suspense fallback=''>
                  <AdvanceListingFilters
                    advanceFilterData={advanceFilterData?.propertyFilters}
                    showPropertyTypes={citySlug ? true : false}
                  />
                </Suspense>
              </aside>
            )}

            <section className='w-full lg:w-4/5 flex flex-col gap-3'>
              {!isTablet ? (
                <>
                  {offersList && offersList.length > 0 && (
                    <div className='mx-auto w-full sm:px-4 xl:px-2 sm:py-4'>
                      <CarouselTemplate
                        items={offersList}
                        slidesPerView={isMobile ? 1.3 : isTablet ? 2.1 : 3.5}
                        renderItem={renderDiscountCard}
                      />
                    </div>
                  )}
                  {cityContent?.title && (
                    <TitleDescription
                      className='mb-3'
                      title={cityContent?.title}
                      description={cityContent?.metaDescription}
                    />
                  )}

                  <div className='flex justify-between items-center px-2'>
                    {renderListingHeader()}
                  </div>

                  {expiringCardContent && (
                    <LoyaltyExpiringCard
                      data={expiringCardContent}
                      hasAuth={hasAuth}
                      isNewUser={isNewUser}
                    />
                  )}
                </>
              ) : (
                <>
                  <div className='px-3 sm:px-10 xl:px-0 sticky top-0 z-15 bg-white w-full left-0 border-b border-[var(--border)]'>
                    {renderMobileListingHeader()}
                  </div>

                  {citySlug && cityContent && (
                    <div className='w-full -mt-3 pt-0'>
                      {/* <LocationBanner cityContent={cityContent} /> */}
                      <div
                        className='elfsight-app-231437b2-ed7d-45b3-ae74-e82694a70626'
                        data-elfsight-app-lazy
                      />

                      {offersList && offersList.length > 0 && (
                        <div className='px-3 sm:px-10 xl:px-0 pt-4'>
                          <CarouselTemplate
                            items={offersList}
                            slidesPerView={
                              isMobile ? 1.3 : isTablet ? 2.1 : 3.2
                            }
                            renderItem={renderDiscountCard}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {!citySlug && offersList && offersList.length > 0 && (
                    <div className='px-3 sm:px-10 xl:px-0 pt-4'>
                      <CarouselTemplate
                        items={offersList}
                        slidesPerView={isMobile ? 1.3 : isTablet ? 2.1 : 3.5}
                        renderItem={renderDiscountCard}
                      />
                    </div>
                  )}
                  {cityContent?.title && (
                    <TitleDescription
                      className='mx-3 sm:px-10'
                      titleClassName='text-primary-900'
                      descriptionClassName='text-[10px]'
                      title={cityContent?.title}
                      description={cityContent?.metaDescription}
                    />
                  )}

                  {isTablet && <div className='w-full'>{renderTitle()}</div>}

                  {expiringCardContent && (
                    <LoyaltyExpiringCard
                      data={expiringCardContent}
                      hasAuth={hasAuth}
                      isNewUser={isNewUser}
                    />
                  )}
                </>
              )}
              <Suspense fallback=''>
                <SelectedFilterChip
                  secondaryPropertyFilters={secondaryPropertyFilters}
                  sortFilter={sortFilter}
                  selectedPropertyType={selectedPropertyType}
                  selectedPropertyBrand={selectedPropertyBrand}
                  clearAllSecondaryFilters={clearAllSecondaryFilters}
                  clearPriceFilter={clearPriceFilter}
                  setSecondaryPropertyFilters={setSecondaryPropertyFilters}
                  clearPetFriendlyFilter={clearPetFriendlyFilter}
                  clearPriveFilter={clearPriveFilter}
                  clearPropertyTypeFilter={clearPropertyTypeFilter}
                  clearPropertyBrandFilter={clearPropertyBrandFilter}
                />
              </Suspense>

              {isPropertiesLoading ? (
                <PropertyCardSkeleton gridLayout={gridLayout} />
              ) : (
                <div
                  className={cn(
                    'grid gap-6 px-3 sm:px-2 md:px-8 xl:px-0',
                    gridLayout === '2x2'
                      ? 'lg:grid-cols-2 sm:pb-10 lg:px-0 xl:px-0'
                      : 'lg:grid-cols-2 xl:grid-cols-3 sm:pb-10 lg:px-0 xl:px-0',
                    'grid-cols-1 sm:grid-cols-2'
                  )}
                >
                  {propertiesData.length > 0 ? (
                    propertiesData.map((villa, index) => {
                      // Calculate animation delay based on current page data only
                      const currentPageIndex = index % 12; // Reset for each page of 12 items
                      const animationDelay = currentPageIndex * 0.1; // 0.1s delay per card

                      return (
                        <React.Fragment key={villa?.id || index}>
                          <div
                            key={villa?.id + index}
                            // initial={{ opacity: 0 }}
                            // animate={{ opacity: 1 }}
                            // transition={{
                            //   duration: 0.6,
                            //   delay: animationDelay,
                            //   ease: 'easeOut',
                            // }}
                          >
                            {renderVillaCard({ villa, index })}
                          </div>
                          {(isMobile ? index === 1 : index === 5) && (
                            <div
                              key={index}
                              className='col-span-full text-center text-lg font-semibold text-gray-800 my-4 -mx-3 md:-mx-0'
                            >
                              {!isAuthenticated ? (
                                <Suspense fallback=''>
                                  <LoyaltySectionHome
                                    isHome={false}
                                    className='bg-[var(--prive4)] rounded-tr-[60px] md:rounded-tr-[160px] px-5 md:px-12 py-10 md:py-15'
                                  />
                                </Suspense>
                              ) : (
                                loyaltyTierDetails && (
                                  <Suspense fallback=''>
                                    <LoyaltySectionHomeLoggedIn
                                      isHome={false}
                                      className='bg-[var(--prive4)] rounded-tr-[60px] md:rounded-tr-[160px] px-5 md:px-12 py-10 md:py-15'
                                      data={loyaltyTierDetails}
                                      title={
                                        LOYALTY_HOME_PAGE_CONTENT?.LoggedIn
                                          ?.elivaasLoyalty
                                      }
                                      pageName='property_listing'
                                    />
                                  </Suspense>
                                )
                              )}
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <motion.div
                      className='col-span-full flex flex-col justify-center items-center min-h-[60dvh] text-center px-4'
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                      <NoResults />
                      <h2 className='text-2xl md:text-4xl  font-serif font-semibold mt-4'>
                        No results found
                      </h2>
                      <p className='text-xs md:text-base mt-2'>
                        Try adjusting your filters or explore other stunning
                        villas.
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
              <AnimatePresence mode='wait'>
                {isLoadingMoreProperties && (
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
                    <PropertyCardSkeleton gridLayout={gridLayout} />
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        </main>
      </div>
      {citySlug && cityContent && (
        <Suspense fallback={<div>Loading...</div>}>
          <LocationDetailsAccordion cityContent={cityContent} />
        </Suspense>
      )}
      {showFilters && isTablet && (
        <AdvanceListingFilters
          advanceFilterData={advanceFilterData?.propertyFilters}
          showPropertyTypes={citySlug ? true : false}
          setOpenFiltersSheet={setShowFilters}
          openFiltersSheet={showFilters}
        />
      )}

      {openSearchPanel && (
        <SearchPanel
          pageType='listing'
          setClose={setOpenSearchPanel}
          storedFilterValues={filtersToApply}
          openDrawer={openSearchPanel}
          setOpenDrawer={setOpenSearchPanel}
          locations={locations}
          initialActiveIndex={initialActiveIndex}
          onActiveIndexChange={() => setInitialActiveIndex(null)}
        />
      )}
      <Suspense fallback={''}>
        <FloatingCta
          page={city}
          isLead={true}
          isPhone={true}
          isWhatsApp={isMobile ? false : true}
          bottom={'90px'}
        />
      </Suspense>
    </>
  );
}
