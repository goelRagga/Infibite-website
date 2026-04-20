import { Button } from '@/components/ui';
import useIsMobile from '@/hooks/useIsMobile';
import { Check } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import ResponsiveDialogDrawer from '@/components/common/ResponsiveDialogDrawer';
import Cookies from 'js-cookie';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/SharedProvider';
import { KEY_VALUE_KEYS } from '@/lib/constants';
import { getKeyValueData } from '@/lib/api';

interface LoyaltyModalCardContent {
  title: string;
  pointsTitle: string;
  iconUrl: string;
  points: string[];
  welcomeBenefit: string;
  validOnFirstBooking: string;
}

const INITIAL_COUNT = 3;

function LoyaltyModalCard() {
  const isMobile = useIsMobile();
  const { setLoginOpen } = useAuth();
  const [showAll, setShowAll] = useState(false);
  const [firstVisitDrawerOpen, setFirstVisitDrawerOpen] = useState(false);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loyaltyModalCardContent, setLoyaltyModalCardContent] =
    useState<LoyaltyModalCardContent | null>(null);

  useEffect(() => {
    if (!firstVisitDrawerOpen) return;
    getKeyValueData<{ loyaltyModalCardContent: LoyaltyModalCardContent }>(
      KEY_VALUE_KEYS.LOYALTY_MODAL_CARD_CONTENT
    ).then((res) =>
      setLoyaltyModalCardContent(res?.loyaltyModalCardContent ?? null)
    );
  }, [firstVisitDrawerOpen]);

  const itemsToShow = showAll
    ? loyaltyModalCardContent?.points
    : loyaltyModalCardContent?.points?.slice(0, INITIAL_COUNT);
  const hasMore =
    (loyaltyModalCardContent?.points?.length ?? 0) > INITIAL_COUNT;

  const pathname = usePathname();
  const hasAccessToken = !!Cookies.get('accessToken');
  const utmSource = useSearchParams().get('utm_source');
  const handleJoinNow = () => {
    setOpen(false);
    setLoginOpen(true);
  };

  const handleExploreAsGuest = () => {
    setOpen(false);
  };

  const setOpen = (open: boolean) => {
    if (open && typeof window !== 'undefined') {
      localStorage.setItem('loyaltyModalFirstScreen', 'true');
    }
    setFirstVisitDrawerOpen(open);
  };

  const scheduleOpenRef = (el: HTMLDivElement | null) => {
    const isHotelzify = utmSource === 'hotelzify';
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (!el) return;
    if (hasAccessToken) return;
    if (
      typeof window !== 'undefined' &&
      localStorage.getItem('loyaltyModalFirstScreen') === 'true'
    )
      return;
    if (isHotelzify) return;
    openTimerRef.current = setTimeout(() => {
      if (
        typeof window !== 'undefined' &&
        localStorage.getItem('loyaltyModalFirstScreen') !== 'true'
      ) {
        setOpen(utmSource !== 'hotelzify');
      }
    }, 10000);
  };

  return (
    <div ref={scheduleOpenRef} key={pathname}>
      <ResponsiveDialogDrawer
        open={firstVisitDrawerOpen}
        setOpen={setOpen}
        contentClassName='w-full md:w-[480px] h-auto! bg-card gap-0 sm:overflow-y-auto sm:h-[580px]! dark:bg-[var(--prive-background)] dark:border-primary-800'
        title={loyaltyModalCardContent?.title}
        titleClassName='text-left font-medium font-poppins! pb-2'
        isArrowLeft={false}
        isCrossButton={true}
        footer={
          <div className='pt-4 md:mt-4 flex gap-2 items-center justify-center border-t border-primary-100 dark:border-primary-800 sm:fixed sm:bottom-0 sm:left-0 sm:right-0 p-4'>
            <Button
              variant='outline'
              className='flex-1/2 w-full border border-accent-red-900 text-accent-red-900 h-12 rounded-full font-semibold dark:border-accent-yellow-950 dark:border-1 dark:bg-[var(--grey8)] dark:text-accent-yellow-950'
              onClick={handleExploreAsGuest}
            >
              Explore as guest
            </Button>
            <Button
              className='flex-1/2 w-full h-12 rounded-full bg-accent-red-900 text-white font-semibold dark:bg-[var(--accent-background)] dark:text-white'
              onClick={handleJoinNow}
            >
              Join now
            </Button>
          </div>
        }
      >
        <div className=''>
          <div className='flex items-center w-full gap-3'>
            <p className='text-xs text-primary-700 dark:text-[var(--accent-text)] shrink-0 uppercase'>
              {loyaltyModalCardContent?.pointsTitle}
            </p>
            <hr className='flex-1 min-w-4 border-primary-100 dark:border-primary-800' />
            <div className='shrink-0'>
              <Image
                src={loyaltyModalCardContent?.iconUrl ?? ''}
                alt='loyalty coins'
                width={60}
                height={30}
              />
            </div>
          </div>
          <div className='mt-4 mb-4'>
            {itemsToShow?.map((item: string, index: number) => (
              <p key={index} className='text-xs flex gap-1 space-y-2.5'>
                <Check className='w-4 h-4 text-accent-green-800 dark:text-accent-green-500  shrink-0' />
                <span
                  className='text-secondary-800 dark:text-foreground/80'
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              </p>
            ))}
            {hasMore && (
              <button
                type='button'
                onClick={() => setShowAll(!showAll)}
                className='text-xs font-semibold dark:font-normal text-accent-red-900 dark:text-[var(--accent-text)] mt-2 cursor-pointer outline-none'
              >
                {showAll ? 'View less' : 'View more'}
              </button>
            )}
          </div>
          <hr className='w-full border-primary-100 dark:border-primary-800' />
          <div className='relative'>
            <div className='border border-primary-100 bg-white dark:bg-[var(--prive-background)] dark:border-primary-800 rounded-xl pt-4 px-4 pb-8 mt-5 shadow-[0_2px_8px_0_rgba(0,0,0,0.1)]'>
              <p className='text-sm text-foreground dark:text-foreground/80 pb-2'>
                Welcome benefit:{' '}
                <span className='font-semibold'>
                  {' '}
                  {loyaltyModalCardContent?.welcomeBenefit}{' '}
                </span>{' '}
                with free membership
              </p>
            </div>
            <div className='absolute -bottom-4 left-4 flex items-center gap-2 border border-primary-100 dark:border-primary-800  py-2 px-3 bg-white dark:bg-[var(--prive-background)] rounded-full'>
              <Image
                src={`${process.env.IMAGE_DOMAIN}/VALUE_ADDED_SERVICE_c17c5e1678.svg`}
                alt='EliCash discount'
                width={24}
                height={24}
                typeof='image/svg+xml'
              />
              <span className='text-xs text-primary-800 dark:text-foreground/80'>
                {loyaltyModalCardContent?.validOnFirstBooking}
              </span>
            </div>
          </div>
        </div>
      </ResponsiveDialogDrawer>
    </div>
  );
}

export default LoyaltyModalCard;
