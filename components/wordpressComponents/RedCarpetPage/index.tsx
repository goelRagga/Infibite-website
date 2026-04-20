'use client';
import React, { useState, useEffect, useRef } from 'react';
import BannerSection from './BannerSection';
import useIsMobile from '@/hooks/useIsMobile';
import ElivaasLight from '@/assets/elivaasLight.svg';
import RedCardpetBenefit from './BenefitCard';
import ReusableCarousel from '@/components/common/ReusableCarousel';
import Link from 'next/link';
import ResponsiveDialogDrawer from '@/components/common/ResponsiveDialogDrawer';
import { BenefitData, RedCarpetPageProps } from 'red-carpet';
import BookingCard from '@/components/common/BookingCardCarpet';
import { useAuth } from '@/contexts/SharedProvider';
import Cookies from 'js-cookie';
import { claimWinbackOffer } from '@/lib/api/winback';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ComplementarySection from './ComplementarySection';
import { RED_CARPET_PAGE_CONTENT } from '@/lib/constants';
import UnlockCard from './UnlockCard';
import ErrorMessageBox from './ErrorMessageBox';

const RedCarpetPage: React.FC<RedCarpetPageProps> = ({
  data,
  winbackData,
  winbackError,
}) => {
  const isMobile = useIsMobile();
  const { setLoginOpen } = useAuth();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<
    BenefitData | undefined
  >(undefined);
  const [claimedOfferId, setClaimedOfferId] = useState<number | undefined>(
    winbackData?.claim?.offerId
  );
  const [isClaiming, setIsClaiming] = useState(false);
  const hasTriggeredRefreshRef = useRef(false);
  const previousAccessTokenRef = useRef<string | undefined>(
    Cookies.get('accessToken')
  );
  const complementarySectionRef = useRef<HTMLDivElement>(null);

  const accessToken = Cookies.get('accessToken');
  const userDetails = Cookies.get('userData')
    ? JSON.parse(Cookies.get('userData') as string)
    : null;

  const userName = userDetails ? userDetails?.name : null;

  // Sync claimed offer ID when winbackData changes (e.g., after refresh)
  useEffect(() => {
    if (winbackData?.claim?.offerId) {
      setClaimedOfferId(winbackData.claim.offerId);
    }
  }, [winbackData?.claim?.offerId]);

  useEffect(() => {
    const checkAuthStatus = () => {
      const previousAccessToken = previousAccessTokenRef.current;

      if (
        !previousAccessToken &&
        accessToken &&
        !hasTriggeredRefreshRef.current
      ) {
        hasTriggeredRefreshRef.current = true;
        setLoginOpen(false);
        router.refresh();
      } else if (!accessToken) {
        setLoginOpen(true, undefined, undefined, true);
        hasTriggeredRefreshRef.current = false;
      } else if (accessToken) {
        setLoginOpen(false);
      }

      previousAccessTokenRef.current = accessToken;
    };

    checkAuthStatus();

    const interval = setInterval(checkAuthStatus, 500);

    return () => clearInterval(interval);
  }, [router, setLoginOpen]);

  const handleUnlockClick = async (benefit: BenefitData) => {
    setSelectedBenefit(benefit);
    // Claim the offer first, modal will open only on success
    await handleClaimOfferForBenefit(benefit);
  };

  const handleClaimOfferForBenefit = async (benefit: BenefitData) => {
    if (!benefit?.id) {
      setSelectedBenefit(undefined);
      return;
    }

    // Check if there are any offers available
    if (!winbackData?.offers || winbackData.offers.length === 0) {
      toast.error('No Offers Available');
      setSelectedBenefit(undefined);
      return;
    }

    // Check if the selected benefit exists in available offers
    const offerExists = winbackData.offers.some(
      (offer: any) => offer.id === benefit.id
    );
    if (!offerExists) {
      toast.error('No Offers Available');
      setSelectedBenefit(undefined);
      return;
    }

    const bookingId = winbackData?.booking?.bookingId;

    if (!accessToken) {
      setLoginOpen(true, undefined, undefined, true);
      setSelectedBenefit(undefined);
      return;
    }

    setIsClaiming(true);
    try {
      const claimResponse = await claimWinbackOffer(
        benefit.id,
        bookingId,
        accessToken
      );
      if (claimResponse) {
        setClaimedOfferId(claimResponse.offerId);
        toast.success('Offer Unlocked Successfully!');
        setIsDialogOpen(true);
        router.refresh();
      } else {
        setSelectedBenefit(undefined);
      }
    } catch (error: any) {
      console.error('Error claiming offer:', error);
      let errorMessage = 'Failed to claim offer. Please try again later.';
      if (error?.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      setSelectedBenefit(undefined);
    } finally {
      setIsClaiming(false);
    }
  };

  const bookingData = winbackData?.booking;

  const scrollToComplementarySection = () => {
    complementarySectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const benefitsData: BenefitData[] = winbackData?.offers?.length
    ? winbackData.offers.map((offer: any) => {
        let description: string[] | undefined = undefined;
        if (offer.description) {
          if (Array.isArray(offer.description)) {
            description = offer.description;
          } else if (typeof offer.description === 'string') {
            description = [offer.description];
          }
        }
        return {
          id: offer.id,
          title: offer.title,
          icon: offer.icon || undefined,
          description: description,
          offerType: offer.offerType,
          voucherAmount: offer.voucherAmount,
        };
      })
    : winbackData?.claim?.details
      ? [
          {
            id: winbackData.claim.details.id,
            title: winbackData.claim.details.title,
            icon: winbackData.claim.details.icon || undefined,
            description: winbackData.claim.details.description
              ? Array.isArray(winbackData.claim.details.description)
                ? winbackData.claim.details.description
                : [winbackData.claim.details.description]
              : undefined,
            offerType: winbackData.claim.details.offerType,
            voucherAmount: winbackData.claim.details.voucherAmount,
          },
        ]
      : [];

  const claimedIndex =
    claimedOfferId !== undefined
      ? benefitsData.findIndex((b) => b.id === claimedOfferId)
      : -1;
  const carouselStartIndex =
    claimedIndex >= 0
      ? claimedIndex
      : Math.floor((benefitsData?.length || 0) / 2);

  function renderHeader() {
    return (
      <div className='relative'>
        <div className='pl-5 absolute top-0 left-15 -translate-x-1/2 z-10'>
          <Link href='/'>
            <ElivaasLight width={100} height={100} />
          </Link>
        </div>
      </div>
    );
  }

  function renderBannerSection() {
    return (
      <BannerSection
        mobUrl={data?.banner?.mobUrl}
        deskUrl={
          data?.banner?.deskUrl ||
          `${process.env.IMAGE_DOMAIN}/Banner_Red_Carpets_1b44947c01.webp`
        }
        title={`Welcome  ${winbackData?.booking?.guestName ? `back, ${winbackData?.booking?.guestName}` : `, ${userName}`}`}
        content={
          winbackData
            ? RED_CARPET_PAGE_CONTENT?.bannerSectionContent
            : undefined
        }
        cta={winbackData ? RED_CARPET_PAGE_CONTENT?.bannerSectionCta : ''}
        onCtaClick={scrollToComplementarySection}
      />
    );
  }

  // Show error message if there's an error
  if (winbackError) {
    return (
      <>
        {isMobile && renderHeader()}
        <div className='bg-[#1B0107] min-h-screen'>
          {renderBannerSection()}
          <ErrorMessageBox message={winbackError.message} />
        </div>
      </>
    );
  }

  return (
    <>
      {isMobile && renderHeader()}

      <div className='bg-[#1B0107]'>
        {renderBannerSection()}

        <div className='pt-10 md:pt-15 pb-4 px-5 sm:max-w-4xl mx-auto'>
          <h2 className='text-white text-xl md:text-3xl font-serif text-center pb-8 md:pb-15'>
            {RED_CARPET_PAGE_CONTENT?.bookingCardSection?.title}
          </h2>
          {bookingData && (
            <div className='transition-all duration-300 bg-[#654A47] p-0.5 rounded-2xl'>
              <Link
                href={`/booking-details/${bookingData?.bookingId}`}
                key={bookingData?.bookingId}
                target='_blank'
                className='cursor-pointer'
              >
                <BookingCard booking={winbackData?.booking} />
              </Link>
              <div className='p-4'>
                <h5 className='text-white text-xl font-serif'>
                  {
                    RED_CARPET_PAGE_CONTENT?.bookingCardSection
                      ?.thankYouForFeedback
                  }
                </h5>
                <p className='text-sm text-[var(--black4)] pt-2'>
                  {winbackData?.booking?.reviewReply}
                </p>
              </div>
            </div>
          )}
        </div>

        <div ref={complementarySectionRef}>
          <ComplementarySection data={data} winbackData={winbackData} />
        </div>

        <div className='pb-15'>
          {benefitsData && benefitsData.length > 0 && (
            <ReusableCarousel
              data={benefitsData}
              renderItem={(item, index, isCenterSlide) => (
                <RedCardpetBenefit
                  content={item}
                  key={index}
                  onUnlockClick={handleUnlockClick}
                  isClaimed={claimedOfferId === item.id}
                  isCenterSlide={isCenterSlide}
                  hasAnyClaimed={!!claimedOfferId || !!winbackData?.claim}
                />
              )}
              slidesPerView={{ mobile: 1.1, tablet: 2.5, desktop: 4.4 }}
              mobileViewType='carousel'
              desktopViewType='carousel'
              showArrows={true}
              prive={true}
              spacing={{ mobile: 16, tablet: 24, desktop: 24 }}
              centerSlides={true}
              centerSlideScale={isMobile ? 1.1 : 1.2}
              startIndex={carouselStartIndex}
              blurInactiveCards={true}
            />
          )}
        </div>

        <ResponsiveDialogDrawer
          open={isDialogOpen}
          closeButtonClassName='!text-white outline-none focus:ring-0 focus:ring-offset-0'
          setOpen={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setSelectedBenefit(undefined);
            }
          }}
          contentClassName='bg-[#1B0107] text-white max-w-[400px]! border-0! max-h-[450px]!'
          overlayClassName='bg-[#020D173D]! bg-black/10'
        >
          <div className='mt-6'>
            <UnlockCard
              title={selectedBenefit?.title}
              icon={selectedBenefit?.icon}
              onCtaClick={() => setIsDialogOpen(false)}
            />
          </div>
        </ResponsiveDialogDrawer>
      </div>
    </>
  );
};

export default RedCarpetPage;
