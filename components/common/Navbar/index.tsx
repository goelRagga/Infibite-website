'use client';
import ElivaasDark from '@/assets/elivaasDark.svg';
import ElivaasLight from '@/assets/elivaasLight.svg';
import PersonalInfo from '@/components/modules/ProfilePage/PersonalInfo/PersonalInfoMain';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui';
import { useAuth } from '@/contexts/SharedProvider';
import { useFilters, useGuests } from '@/hooks/filters';
import useIsLarge from '@/hooks/useIsLarge';
import useIsMobile from '@/hooks/useIsMobile';
import useTablet from '@/hooks/useIsTablet';
import useLogout from '@/hooks/useLogout';
import {
  corporateOffsitePhoneNumber,
  phoneNumber,
  visaPhoneNumber,
} from '@/lib/constants';
import { trackEvent } from '@/lib/mixpanel';
import { GET_LOCATIONS_LIST } from '@/lib/queries';
import {
  capitalizeInitials,
  cn,
  formatParamsCityName,
  getUserInitials,
} from '@/lib/utils';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { CalendarDays, MapPin, PhoneIcon, User, Users } from 'lucide-react';
import { NavbarProps } from 'navbar-types';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useClient } from 'urql';
import CustomImage from '../CustomImage';
import SearchPanel from '../SearchPanel';
import { formatDate } from '../Shared/FormatDate';
import { useDateTooltip } from '@/hooks/useDateTooltip';

const DatePersuation = dynamic(
  () => import('@/components/common/DatePersuation'),
  {
    ssr: false,
    loading: () => null,
  }
);
export type NavbarVariant = 'default' | 'search';
export type NavbarBehavior = 'static' | 'sticky';

export default function Navbar({
  variant = 'default',
  behavior = 'static',
  logo,
  className,
  isPrive,
  isTransparent: isTransparentProp,
}: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isAuthenticated = Cookies.get('accessToken') ? true : false;
  const isMobile = useIsMobile();
  const isTablet = useTablet();
  const isLarge = useIsLarge();
  const IS_TRANSAPRENT = isTransparentProp || pathname === '/';

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [locationsData, setLocationsData] = useState<any[]>([]);
  const { filters, urlParams } = useFilters();
  const { guestsData } = useGuests();
  const searchParams = useSearchParams();
  const { setLoginOpen } = useAuth();
  const appSearchParams = urlParams.getAllParams();
  const [open, setOpen] = useState(false);
  const handleLogout = useLogout();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [initialActiveIndex, setInitialActiveIndex] = useState<number | null>(
    null
  );
  const userDetails = Cookies.get('userData')
    ? JSON.parse(Cookies.get('userData') as string)
    : null;

  const userInitials = userDetails
    ? getUserInitials(userDetails.firstName, userDetails.lastName)
    : null;

  // Create fallback name logic
  const getDisplayName = () => {
    if (!userDetails) return 'User';

    const { firstName, lastName, mobile, email } = userDetails;

    // If both firstName and lastName exist, use them
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }

    // If only firstName exists
    if (firstName) {
      return firstName;
    }

    // If only lastName exists
    if (lastName) {
      return lastName;
    }

    // If no name, try mobile number
    if (mobile) {
      return mobile;
    }

    // If no mobile, try email
    if (email) {
      return email;
    }

    // Final fallback
    return 'User';
  };

  let fetchedCityName = '';

  const cityName = formatParamsCityName(pathname);

  if (cityName.toLowerCase() === 'delhi ncr') {
    fetchedCityName = 'Delhi NCR';
  } else {
    fetchedCityName = capitalizeInitials(cityName);
  }

  const showAll =
    searchParams.size > 0 || pathname?.includes('villas-in') ? false : true;
  const client = useClient();

  const fetchLocations = async () => {
    try {
      const result = await client
        .query(GET_LOCATIONS_LIST, {}, { requestPolicy: 'cache-first' })
        .toPromise();

      if (result.error) {
        console.error('GraphQL error fetching locations:', result.error);
        setLocationsData([]);
        return;
      }

      setLocationsData(result.data?.getLocations ?? []);
    } catch (error) {
      console.error('Unexpected error fetching locations:', error);
      setLocationsData([]);
    }
  };

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

  useEffect(() => {
    if (behavior === 'sticky') {
      const handleScroll = () => {
        setScrolled(window.scrollY > 1);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [behavior]);

  useEffect(() => {
    const checkDarkMode = () =>
      setIsDarkMode(document.documentElement.classList.contains('dark'));

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const defaultLogo = (
    <div className='flex items-center'>
      <Link href='/' className='text-lg font-bold flex items-center'>
        {isPrive ? (
          <Image
            src='/assets/elivaasPriveLogo.svg'
            alt='Prive Logo'
            width={102}
            height={118}
            className='object-cover object-bottom h-20'
          />
        ) : isDarkMode ? (
          <CustomImage
            src={`${process.env.IMAGE_DOMAIN}/Prive_Logo_f7202f7b17.svg`}
            alt='Prive logo'
            width={92}
            height={48}
            format='svg'
            className='w-[80px] lg:w-[92px]'
          />
        ) : IS_TRANSAPRENT ? (
          <ElivaasLight />
        ) : (
          <ElivaasDark />
        )}
      </Link>
    </div>
  );

  useEffect(() => {
    if (!pathname.includes('villas')) {
      setIsSearchOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (isSearchOpen) {
      fetchLocations();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      trackEvent('Page View', {
        pathname: pathname,
      });
    }, 300); // delay in milliseconds (500ms here)

    return () => clearTimeout(timeoutId); // clean up
  }, [pathname]);

  const shouldShowTooltip =
    (!filters?.checkinDate || !filters?.checkoutDate) &&
    variant === 'search' &&
    !isSearchOpen;

  const {
    dateFieldRef,
    tooltipPosition,
    isTooltipVisible,
    handleDismissTooltip,
    handleTooltipClick,
    arrowPosition,
    arrowHorizontalAlign,
  } = useDateTooltip({
    shouldShow: shouldShowTooltip,
    position: 'bottom',
    positionConfig: {
      verticalPosition: 'bottom',
      horizontalAlign: 'center',
      spacing: 20,
      verticalOffset: 4,
      viewportPadding: 1,
    },
    onTooltipClick: () => {
      setInitialActiveIndex(1);
      setIsSearchOpen(true);
    },
  });

  const renderDefaultSearch = () => {
    return (
      <div className='bg-primary-50 px-6 py-2 h-11 rounded-full min-w-[465px] justify-between flex items-center space-x-6 transition-all shadow-[inset_0_2px_6px_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(0,0,0,0.03)]'>
        <span
          className='flex items-center gap-2 text-xs text-muted-foreground font-medium cursor-pointer'
          onClick={() => {
            setInitialActiveIndex(0);
            setIsSearchOpen(true);
          }}
        >
          <MapPin className='w-4 h-4 text-primary' />
          {filters?.city ? filters?.city : 'City / Villa / Location'}
        </span>

        <div className='border-l border-primary-200 h-5' />

        <span
          ref={dateFieldRef}
          className='flex items-center gap-2 text-xs text-muted-foreground font-medium cursor-pointer relative'
          onClick={() => {
            setInitialActiveIndex(1);
            setIsSearchOpen(true);
          }}
        >
          <CalendarDays className='w-4 h-4 text-primary' />
          {filters?.checkinDate && filters?.checkoutDate
            ? `${format(filters?.checkinDate, 'dd MMM, yyyy')} - ${format(
                filters?.checkoutDate,
                'dd MMM, yyyy'
              )}`
            : 'Any - Any'}
        </span>

        <div className='border-l border-primary-200 h-5' />

        <span
          className='flex items-center gap-2 text-xs text-muted-foreground font-medium cursor-pointer'
          onClick={() => {
            setInitialActiveIndex(3);
            setIsSearchOpen(true);
          }}
        >
          <Users className='w-4 h-4 text-primary' />
          {guestsData?.numberOfGuests &&
            `${
              Number(guestsData?.numberOfGuests) +
              Number(guestsData?.numberOfChildren)
            } Guest(s)`}
        </span>
      </div>
    );
  };
  const renderExpandedSearch = () => {
    return (
      <div
        className='w-full rounded-full max-w-3xl mx-auto pt-0'
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <SearchPanel
            pageType='listing'
            setClose={setIsSearchOpen}
            storedFilterValues={filtersToApply}
            locations={locationsData}
            initialActiveIndex={initialActiveIndex}
            onActiveIndexChange={() => setInitialActiveIndex(null)}
          />
        </motion.div>
      </div>
    );
  };

  const defaultPath = '/explore/';
  const visaPath = '/explore/visa-offers';
  const corporateOffsitePath = '/explore/corporate-offsite';

  return (
    <>
      {!isTablet && (
        <>
          {isSearchOpen && (
            <div
              className='fixed inset-0 bg-black/50 z-40'
              onClick={() => setIsSearchOpen(false)}
            />
          )}
          {/* Navbar Header */}
          <header
            className={cn(
              'w-full px-10 flex flex-col items-center justify-between z-50 border-b-1 border-b-[var(--secondary-50)] max-w-[1600px] dark:border-primary-800',
              isPrive ? 'pb-3' : 'py-3',
              behavior === 'sticky' &&
                'sticky top-0 transition-all duration-300 bg-white',
              behavior === 'static' && 'bg-white dark:bg-background',
              scrolled ? ' shadow-sm' : behavior === 'sticky' && 'bg-white',
              (IS_TRANSAPRENT || isPrive) &&
                'absolute !bg-transparent border-none',
              isSearchOpen && 'border-b-white',
              className
            )}
          >
            <div className='w-full flex items-center justify-between'>
              <div className='flex-shrink-0 z-11'>{logo || defaultLogo}</div>
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    key='search-panel'
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{
                      duration: 0.3,
                      // ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className='absolute top-[60px] left-0 w-full z-1 flex justify-center bg-white pb-4'
                  >
                    {renderExpandedSearch()}
                  </motion.div>
                )}
              </AnimatePresence>
              {variant === 'search' && (
                <div className='flex-grow flex justify-center relative max-w-4xl mx-auto'>
                  {!isSearchOpen && renderDefaultSearch()}

                  {isTooltipVisible && (
                    <Suspense fallback={''}>
                      <DatePersuation
                        position={tooltipPosition}
                        onDismiss={handleDismissTooltip}
                        onClick={handleTooltipClick}
                        arrowPosition={arrowPosition}
                        arrowHorizontalAlign={arrowHorizontalAlign}
                      />
                    </Suspense>
                  )}
                </div>
              )}

              <div className='flex items-center space-x-8  z-11'>
                {/* Navigation Links */}
                <nav
                  className={`hidden lg:flex items-center space-x-10 ${isLarge ? 'mr-0' : ''}`}
                >
                  {pathname !== '/explore/partner' &&
                    pathname !== '/explore/tbo' && (
                      <Link
                        href={`tel:${pathname === visaPath ? `+91${visaPhoneNumber}` : pathname === corporateOffsitePath ? corporateOffsitePhoneNumber : phoneNumber}`}
                        prefetch={false}
                        onClick={() => {
                          trackEvent('top_navigation_clicked', {
                            cta_type: 'call_us',
                            vertical_position: 0,
                          });
                        }}
                        className={cn(
                          'text-sm font-medium typography-label-semibold hover:text-accent-red-900 flex items-center gap-2 dark:text-white',
                          pathname === '/explore/contact'
                            ? 'text-accent-red-900'
                            : 'text-muted-foreground',
                          (IS_TRANSAPRENT || isPrive) &&
                            'text-white hover:text-secondary-200'
                        )}
                      >
                        <PhoneIcon className='w-4 h-4' />
                        Call to Book{' '}
                        {`${pathname === visaPath ? `+91${visaPhoneNumber}` : pathname === corporateOffsitePath ? corporateOffsitePhoneNumber : phoneNumber || defaultPath}`}
                      </Link>
                    )}
                  {pathname !== '/explore/corporate-offsite' && (
                    <Link
                      href='/explore/partner'
                      prefetch={false}
                      className={cn(
                        'text-sm font-medium typography-label-semibold transition-colors hover:text-accent-red-900  dark:text-white',
                        pathname === '/explore/partner'
                          ? 'text-accent-red-900'
                          : 'text-muted-foreground',
                        (IS_TRANSAPRENT || isPrive) &&
                          'text-white  hover:text-secondary-200 '
                      )}
                      onClick={() => {
                        trackEvent('top_navigation_clicked', {
                          cta_type: 'partner_with_us',
                          vertical_position: 0,
                        });
                      }}
                    >
                      Partner with Us
                    </Link>
                  )}

                  <Link
                    href='/explore/contact'
                    prefetch={false}
                    className={cn(
                      'text-sm font-medium typography-label-semibold transition-colors hover:text-accent-red-900  dark:text-white',
                      pathname === '/explore/contact'
                        ? 'text-accent-red-900'
                        : 'text-muted-foreground',
                      (IS_TRANSAPRENT || isPrive) &&
                        'text-white  hover:text-secondary-200 '
                    )}
                    onClick={() => {
                      trackEvent('top_navigation_clicked', {
                        cta_type: 'contact_us',
                        vertical_position: 0,
                      });
                    }}
                  >
                    Customer support
                  </Link>
                  {(isDarkMode || isPrive) && (
                    <Link
                      href='/'
                      onClick={() => {
                        trackEvent('top_navigation_clicked', {
                          cta_type: 'visit_elivaas',
                          vertical_position: 0,
                        });
                      }}
                      className='h-9 gap-2.5 rounded-lg border border-[var(--secondary-900)] bg-[var(--grey6)] text-white hover:bg-[var(--prive4)]/90 hover:text-accent-text px-4 py-2 text-sm font-medium whitespace-nowrap'
                    >
                      Visit ELIVAAS
                    </Link>
                  )}
                </nav>

                {!isAuthenticated ? (
                  pathname !== '/explore/tbo' && (
                    <Button
                      variant='outline'
                      className={cn(
                        'bg-transparent typography-label-semibold rounded-full border border-accent-red-900 text-accent-red-900',
                        !isPrive &&
                          'dark:border-[var(--accent-text)] dark:text-[var(--accent-text)] dark:bg-background dark:hover:bg-background',
                        IS_TRANSAPRENT &&
                          'text-white border-white! hover:border-text-secondary-200',
                        isPrive && 'bg-[var(--prive5)] text-white border-none'
                      )}
                      onClick={() => {
                        trackEvent('top_navigation_clicked', {
                          cta_type: 'login_signup',
                          vertical_position: 0,
                        });
                        setLoginOpen(true);
                      }}
                    >
                      Log In / Sign Up
                    </Button>
                  )
                ) : (
                  <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        className={cn(
                          'rounded-full w-10 h-10 p-0 dark:bg-[var(--accent-background)] cursor-pointer',
                          isPrive
                            ? 'bg-[var(--prive5)] text-white hover:bg-[var(--prive5)]/90 hover:text-white '
                            : 'bg-accent-red-900 text-white hover:bg-accent-red-950 hover:text-white'
                        )}
                      >
                        {userInitials ? (
                          <span className='text-sm font-semibold'>
                            {userInitials}
                          </span>
                        ) : (
                          <User className='w-4 h-4' />
                        )}
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align='end'
                      className='border-1 p-0 rounded-2xl w-[282px] h-auto  overflow-hidden dark:border-secondary-950 relative top-3 bg-white  '
                    >
                      <PersonalInfo
                        name={getDisplayName()}
                        avatarUrl={userDetails?.avatarUrl}
                        joinedYear={formatDate(userDetails?.createdAt)}
                        onLogout={handleLogout}
                        closeDrawer={() => setOpen(false)}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </header>
        </>
      )}
    </>
  );
}
