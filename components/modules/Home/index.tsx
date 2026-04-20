'use client';
import CustomImage from '@/components/common/CustomImage';
import { Template } from '@/components/common/Carousel/ReviewTemplate/Template';
import ReusableCarousel from '@/components/common/ReusableCarousel';
import ScrollData from '@/components/common/ScrollData';
import { SectionTemplate } from '@/components/common/Shared/Section';
import { VideoProvider } from '@/contexts/video-context';
import { useGuests } from '@/hooks/filters';
import { useFilters } from '@/hooks/filters/useFilters';
import useIsMobile from '@/hooks/useIsMobile';
import { useWallet } from '@/hooks/useWallet';
import { useWidgetViewTracking } from '@/hooks/useWidgetViewTracking';
import { LOYALTY_HOME_PAGE_CONTENT } from '@/lib/constants';
import { trackEvent } from '@/lib/mixpanel';
import { motion, useInView } from 'framer-motion';
import Cookies from 'js-cookie';
import { ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { forwardRef, Suspense, useEffect, useRef } from 'react';

const BannerCarousel = dynamic(() => import('./BannersCarousel'));
const CityDestinations = dynamic(() => import('./CityDestination'));
const DiscountCard = dynamic(() => import('@/components/common/DiscountCard'));
const LoyaltySectionHome = dynamic(() => import('./LoyaltySectionHome'));
const LoyaltySectionHomeLoggedIn = dynamic(
  () => import('./LoyaltySectionHome/LoggedIn'),
  {
    ssr: false,
    loading: () => null,
  }
);
const PriveCardSection = dynamic(() => import('./PriveCardSection'));
const SpotlightSection = dynamic(() => import('./SpotlightSection'));
const SpecialCardSection = dynamic(() => import('./SpecialCardSection'));
const SuccessNumbers = dynamic(() => import('./SuccessNumbers'));
const PartnerSection = dynamic(() => import('./PartnerSection'));
const PartnerAlliancesLogos = dynamic(() => import('./PartnerAlliancesLogos'));
const EventsSection = dynamic(() => import('./EventsSection'));
const FloatingCta = dynamic(() => import('@/components/common/FloatingCta'), {
  ssr: false,
  loading: () => null,
});

const PropertyCard = dynamic(() => import('@/components/common/PropertyCard'));

// Isolated so visibility state only re-renders this section, not the whole Home (reduces nav tap delay on fast scroll)
const OFFERS_CONTAINER_VARIANTS = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};
const OFFER_ITEM_VARIANTS = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

const OffersSection = forwardRef<
  HTMLElement,
  { offersSection: any; offersList: any[] }
>(function OffersSection({ offersSection, offersList }, ref) {
  const isInView = useInView(ref as React.RefObject<HTMLElement>, {
    once: true,
    margin: '-100px',
  });
  return (
    <section ref={ref} className='w-full px-5 sm:px-10'>
      <SectionTemplate
        heading={offersSection?.heading}
        description={offersSection?.description}
        showDefaultArrows={false}
        verticalPosition={6}
      />
      <motion.div
        variants={OFFERS_CONTAINER_VARIANTS}
        initial='hidden'
        animate={isInView ? 'visible' : 'hidden'}
      >
        <ScrollData
          className=''
          itemClassName='md:w-[37%] lg:w-[27%] xl:w-[23.7%] w-[80%] md:h-[188px] h-[137px] overflow-hidden '
          gap='gap-4 md:gap-6'
        >
          {(offersList || []).map((offer: any, index: number) => (
            <motion.div key={index} variants={OFFER_ITEM_VARIANTS}>
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
                  horizontalPosition={index + 1}
                  shouldLoadImage={isInView}
                />
              </Suspense>
            </motion.div>
          ))}
        </ScrollData>
      </motion.div>
    </section>
  );
});

const HomeModule = ({
  locations,
  cities,
  rankedProperties,
  latestProperties,
  bannerContent,
  partnerLogos,
  allianceLogos,
  partnerWithUsSection,
  statsSection,
  eventsSection,
  starStays,
  stayStories,
  specialCards,
  priveCards,
  spotlightSection,
  offersSection,
  seasonalRecommendations,
  newestProperties,
  escapeProperties,
  gemsProperties,
  priveProperties,
  offersList,
  loyaltyTiers = [],
}: any) => {
  const isAuthenticated = Cookies.get('accessToken') ? true : false;
  const isMobile = useIsMobile();

  const { banners } = bannerContent?.HomePageContent || {};

  const bannerRef = useRef<HTMLElement | null>(null);
  const cityDestinationsRef = useRef<HTMLElement | null>(null);
  const spotlightMobileRef = useRef<HTMLElement | null>(null);
  const starStaysRef = useRef<HTMLElement | null>(null);
  const spotlightDesktopRef = useRef<HTMLElement | null>(null);
  const loyaltyRef = useRef<HTMLDivElement | null>(null);
  const offersRef = useRef<HTMLElement | null>(null);
  const seasonalRef = useRef<HTMLElement | null>(null);
  const priveCardsRef = useRef<HTMLElement | null>(null);
  const specialCardsRef = useRef<HTMLElement | null>(null);
  const stayStoriesRef = useRef<HTMLElement | null>(null);
  const eventsRef = useRef<HTMLElement | null>(null);
  const statsRef = useRef<HTMLElement | null>(null);
  const newestPropertiesRef = useRef<HTMLElement | null>(null);
  const partnerWithUsRef = useRef<HTMLElement | null>(null);
  const allianceLogosRef = useRef<HTMLElement | null>(null);
  const partnerLogosRef = useRef<HTMLElement | null>(null);
  const dummyBanners = [
    {
      urlMobile: `${process.env.IMAGE_DOMAIN}/LBM_f21da12402_m_74783f576f.webp`,
      urlDesktop: `${process.env.IMAGE_DOMAIN}/LOYALTY_BANNER_36648b6734.webp`,
      isImage: true,
      isVideo: false,
      link: '/villas',
    },
    {
      urlMobile: `${process.env.IMAGE_DOMAIN}/Visa_offers_min_Mob_62ec0f6d85.jpg`,
      urlDesktop: `${process.env.IMAGE_DOMAIN}/visa_offers_min_desk_866d095ae5.jpg`,
      isImage: true,
      isVideo: false,
      link: '/villas',
    },
  ];
  useWidgetViewTracking({
    ref: bannerRef,
    verticalPosition: 1,
    widgetName: 'Banner Carousel',
    widgetType: 'banner',
    condition: !!(banners && banners.length > 0),
  });

  useWidgetViewTracking({
    ref: cityDestinationsRef,
    verticalPosition: 2,
    widgetName: 'City Destinations',
    widgetType: 'destinations',
    condition: cities?.length > 0,
  });

  useWidgetViewTracking({
    ref: spotlightMobileRef,
    verticalPosition: 13,
    widgetName: 'Spotlight',
    widgetType: 'spotlight',
    condition: !!(isMobile && spotlightSection?.data),
  });

  useWidgetViewTracking({
    ref: starStaysRef,
    verticalPosition: 10,
    widgetName: 'Star-Studded Stays',
    widgetType: 'video_cards',
    condition: !!starStays?.data,
  });

  useWidgetViewTracking({
    ref: spotlightDesktopRef,
    verticalPosition: 13,
    widgetName: 'Spotlight',
    widgetType: 'spotlight',
    condition: !!(!isMobile && spotlightSection?.data),
  });

  useWidgetViewTracking({
    ref: loyaltyRef,
    verticalPosition: 4,
    widgetName: 'Loyalty Program',
    widgetType: 'loyalty',
    condition: true,
  });

  useWidgetViewTracking({
    ref: offersRef,
    verticalPosition: 3,
    widgetName: 'Offers & Discounts',
    widgetType: 'offers',
    condition: offersList?.length > 0,
  });

  useWidgetViewTracking({
    ref: seasonalRef,
    verticalPosition: 4,
    widgetName: 'Magical Winter Escape',
    widgetType: 'escapes',
    condition: rankedProperties?.propertiesList?.length > 0,
  });

  useWidgetViewTracking({
    ref: priveCardsRef,
    verticalPosition: 6,
    widgetName: 'Prive Cards',
    widgetType: 'prive',
    condition: !!(priveProperties && priveProperties.length > 0),
  });

  useWidgetViewTracking({
    ref: specialCardsRef,
    verticalPosition: 11,
    widgetName: 'Special Cards',
    widgetType: 'special_cards',
    condition: !!specialCards,
  });

  useWidgetViewTracking({
    ref: stayStoriesRef,
    verticalPosition: 13,
    widgetName: 'Every stay has a story',
    widgetType: 'video_cards',
    condition: stayStories?.data && stayStories.data.length > 0,
  });

  useWidgetViewTracking({
    ref: eventsRef,
    verticalPosition: 9,
    widgetName: 'Events',
    widgetType: 'events',
    condition: eventsSection?.events && eventsSection.events.length > 0,
  });

  useWidgetViewTracking({
    ref: statsRef,
    verticalPosition: 8,
    widgetName: 'Success Numbers',
    widgetType: 'stats',
    condition: statsSection?.data && statsSection.data.length > 0,
  });

  useWidgetViewTracking({
    ref: newestPropertiesRef,
    verticalPosition: 7,
    widgetName: 'Discover Our Newest Gems',
    widgetType: 'discover',
    condition: latestProperties?.propertiesList?.length > 0,
  });

  useWidgetViewTracking({
    ref: partnerWithUsRef,
    verticalPosition: 14,
    widgetName: 'Partner With Us',
    widgetType: 'partner',
    condition: !!partnerWithUsSection,
  });

  useWidgetViewTracking({
    ref: allianceLogosRef,
    verticalPosition: 15,
    widgetName: 'Alliance Logos',
    widgetType: 'logos',
    condition:
      allianceLogos?.alliancesLogos && allianceLogos.alliancesLogos.length > 0,
  });

  useWidgetViewTracking({
    ref: partnerLogosRef,
    verticalPosition: 16,
    widgetName: 'Partner Logos',
    widgetType: 'logos',
    condition:
      partnerLogos?.partnerLogos && partnerLogos.partnerLogos.length > 0,
  });

  const { clearFilterParams } = useFilters();
  const { clearGuestParams } = useGuests();

  useEffect(() => {
    clearFilterParams();
    clearGuestParams();
  }, []);

  // Track homepage_viewed event when homepage is opened
  useEffect(() => {
    trackEvent('homepage_viewed', {
      page_name: 'homepage',
    });
  }, []);

  const handleFavoriteToggle = () => {};

  const handleSeasonalCardClick = (id: string, index: number) => {
    trackEvent('widget_clicked', {
      page_name: 'homepage',
      widget_name: 'Enchanting Autumn Escapes',
      widget_type: 'escapes',
      cta_type: 'property_clicked',
      vertical_position: 7,
      horizontal_position: index + 1,
    });
  };

  const handleNewestCardClick = (id: string, index: number) => {
    trackEvent('widget_clicked', {
      page_name: 'homepage',
      widget_name: 'Discover Our Newest Gems',
      widget_type: 'discover',
      cta_type: 'property_clicked',
      vertical_position: 13,
      horizontal_position: index + 1,
    });
  };

  const { loyaltyTierDetails } = useWallet();
  return (
    <div className='space-y-15 sm:space-y-28'>
      {/* BANNER CAROUSEL SECTION */}
      <section ref={bannerRef} className='w-full mb-10 sm:mb-16'>
        <BannerCarousel
          banners={banners || dummyBanners}
          locations={locations}
          verticalPosition={1}
          horizontalPosition={1}
        />

        <div
          className='elfsight-app-231437b2-ed7d-45b3-ae74-e82694a70626'
          data-elfsight-app-lazy
        ></div>
      </section>

      {/* CITY DESTINATIONS SECTION */}
      {cities && cities?.length > 0 && (
        <section ref={cityDestinationsRef} className='w-full px-5 sm:px-10'>
          <Suspense fallback={''}>
            <CityDestinations
              data={cities}
              verticalPosition={2}
              horizontalPosition={2}
            />
          </Suspense>
        </section>
      )}

      {/* OFFERS & DISCOUNTS SECTION */}
      {offersSection && offersList?.length > 0 && (
        <OffersSection
          ref={offersRef}
          offersSection={offersSection}
          offersList={offersList}
        />
      )}

      {/* SEASONAL RECOMMENDATIONS SECTION */}
      {seasonalRecommendations &&
        escapeProperties &&
        escapeProperties.length > 0 && (
          <section ref={seasonalRef} className='w-full px-5 sm:px-10'>
            {isMobile ? (
              <div className='mb-4 sm:mb-6'>
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex flex-col gap-1 md:w-full'>
                    {seasonalRecommendations?.heading && (
                      <h3 className='text-left font-serif text-xl md:text-4xl inline-flex'>
                        {seasonalRecommendations.heading}
                      </h3>
                    )}
                    {seasonalRecommendations?.description && (
                      <h5 className='text-left text-xs sm:text-sm md:text-base sm:p-0'>
                        {seasonalRecommendations.description}
                      </h5>
                    )}
                  </div>
                  {seasonalRecommendations?.buttonName && (
                    <Link
                      href={seasonalRecommendations?.buttonLink || '/villas'}
                      onClick={() => {
                        trackEvent('widget_clicked', {
                          page_name: 'homepage',
                          widget_name: 'Enchanting Autumn Escapes',
                          widget_type: 'escapes',
                          cta_type: 'explore_more',
                          vertical_position: 7,
                        });
                      }}
                      className='flex items-center justify-center w-9 h-9 aspect-square p-0 rounded-full bg-accent-red-900 hover:bg-accent-red-950 transition-colors shrink-0'
                    >
                      <ChevronRight className='w-4 h-4 text-white flex-shrink-0' />
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <SectionTemplate
                verticalPosition={7}
                heading={seasonalRecommendations?.heading}
                description={seasonalRecommendations?.description}
                showDefaultArrows={false}
                isButton={true}
                buttonName={
                  seasonalRecommendations?.buttonName || 'Explore more'
                }
                buttonLink={seasonalRecommendations?.buttonLink || '/villas'}
                onClick={() => {
                  trackEvent('widget_clicked', {
                    page_name: 'homepage',
                    widget_name: 'Enchanting Autumn Escapes',
                    widget_type: 'escapes',
                    cta_type: 'explore_more',
                    vertical_position: 7,
                  });
                }}
              />
            )}
            <Suspense fallback={''}>
              <ScrollData
                className=''
                itemClassName='w-[90%] sm:w-[65%] md:w-[45%] lg:w-[33%] xl:w-[23.7%]'
                gap='gap-3 md:gap-6'
              >
                {escapeProperties
                  ?.slice(0, 4)
                  .map((property: any, index: number) => (
                    <div key={index}>
                      <Suspense fallback={''}>
                        <PropertyCard
                          key={index}
                          property={property}
                          variant={'default'}
                          onFavoriteToggle={handleFavoriteToggle}
                          onCardClick={(id) =>
                            handleSeasonalCardClick(id, index)
                          }
                          showActionButton={false}
                          peram='homepage'
                          lazyLoadAmenityIcons={true}
                        />
                      </Suspense>
                    </div>
                  ))}
              </ScrollData>
            </Suspense>
          </section>
        )}

      {/* Show LoyaltySectionHome only if user is not authenticated */}
      {!isAuthenticated ? (
        <div ref={loyaltyRef} className='md:mx-10 overflow-hidden'>
          <LoyaltySectionHome
            verticalPosition={5}
            className='bg-[var(--prive4)] rounded-tr-[60px] md:rounded-tr-[160px] px-5 md:px-12 py-10 md:py-15'
            loyaltyTiers={loyaltyTiers}
          />
        </div>
      ) : (
        loyaltyTierDetails && (
          <div ref={loyaltyRef} className='md:mx-10 overflow-hidden'>
            <LoyaltySectionHomeLoggedIn
              verticalPosition={5}
              isHome={true}
              className='bg-[var(--prive4)] rounded-tr-[60px] md:rounded-tr-[160px] px-5 md:px-12 py-10 md:py-15'
              data={loyaltyTierDetails}
              title={LOYALTY_HOME_PAGE_CONTENT?.LoggedIn?.elivaasLoyalty}
              pageName='homepage'
            />
          </div>
        )
      )}

      {/* DESKTOP SPOTLIGHT SECTION */}
      {!isMobile && (
        <section ref={spotlightDesktopRef} className='w-full px-5 sm:px-10'>
          {spotlightSection?.data && (
            <Suspense fallback={''}>
              <SpotlightSection
                spotlightData={spotlightSection?.data || ''}
                heading={spotlightSection?.heading}
                description={spotlightSection?.description}
                verticalPosition={4}
              />
            </Suspense>
          )}
        </section>
      )}

      {/* MOBILE SPOTLIGHT SECTION */}
      {isMobile && spotlightSection && (
        <section ref={spotlightMobileRef} className='w-full px-5'>
          {spotlightSection?.data && (
            <Suspense fallback={''}>
              <SpotlightSection
                spotlightData={spotlightSection?.data || ''}
                heading={spotlightSection?.heading}
                description={spotlightSection?.description}
                verticalPosition={3}
              />
            </Suspense>
          )}
        </section>
      )}

      {/* STAR GUEST STORIES SECTION CONTENT */}
      {starStays && (
        <section ref={starStaysRef} className='w-full'>
          {starStays?.data && (
            <SectionTemplate
              showDefaultArrows={false}
              textAlign='center'
              id='starGuestStories'
              isStar
              heading={starStays?.heading}
              description={starStays?.description}
              verticalPosition={3}
            >
              <Suspense fallback={''}>
                <VideoProvider>
                  <ReusableCarousel
                    data={starStays?.data}
                    renderItem={(item, index, isCenterSlide) => (
                      <Template
                        data={item}
                        isCenterSlide={isCenterSlide}
                        pageName='homepage'
                        onClick={(ctaType) => {
                          trackEvent('widget_clicked', {
                            page_name: 'homepage',
                            widget_name: 'Star-Studded Stays',
                            widget_type: 'video_cards',
                            cta_type: ctaType,
                            vertical_position: 3,
                            horizontal_position: index + 1,
                          });
                        }}
                      />
                    )}
                    slidesPerView={{ mobile: 1.5, tablet: 2.5, desktop: 4.4 }}
                    mobileViewType='carousel'
                    desktopViewType='carousel'
                    showArrows={true}
                    prive={false}
                    spacing={{ mobile: 16, tablet: 24, desktop: 24 }}
                    centerSlides={true}
                    centerSlideScale={isMobile ? 1.1 : 1.2}
                    startIndex={Math.floor((starStays?.data?.length || 0) / 2)}
                    blurInactiveCards={true}
                  />
                </VideoProvider>
              </Suspense>
            </SectionTemplate>
          )}
        </section>
      )}

      {/* PRIVE CARDS SECTION */}
      {priveCards && priveProperties && priveProperties.length > 0 && (
        <section
          ref={priveCardsRef}
          className='w-full relative overflow-hidden'
        >
          {/* Left Side Image */}
          <CustomImage
            src={priveCards?.leftSideBackground || ''}
            alt='Side Background'
            width={200}
            height={800}
            className='block absolute md:left-0 -left-15 overflow-hidden top-0 h-full z-20'
          />
          {/* Right Side Image */}
          <CustomImage
            src={priveCards?.rightSideBackground || ''}
            alt='Side Background'
            width={200}
            height={800}
            className='block absolute md:right-0 -right-15 overflow-hidden top-0 h-full rotate-180 z-20'
          />

          <div className='relative z-10'>
            <Suspense fallback={''}>
              <PriveCardSection
                onClick={(index) => {
                  trackEvent('widget_clicked', {
                    page_name: 'homepage',
                    widget_name: 'Prive',
                    widget_type: 'prive',
                    cta_type: 'property_clicked',
                    vertical_position: 8,
                    horizontal_position: index + 1,
                  });
                }}
                priveCardData={priveProperties}
                heading={priveCards?.heading}
                verticalPosition={8}
              />
            </Suspense>
          </div>
        </section>
      )}

      {/* SUCCESS NUMBERS / STATS SECTION */}
      {statsSection && statsSection?.data?.length > 0 && (
        <section ref={statsRef} className='w-full px-5 sm:px-10'>
          <Suspense fallback={''}>
            <SuccessNumbers
              data={statsSection?.data}
              heading={statsSection?.heading}
              description={statsSection?.description}
              verticalPosition={12}
            />
          </Suspense>
        </section>
      )}

      {/* NEWEST PROPERTIES SECTION */}
      {newestProperties && gemsProperties && gemsProperties.length > 0 && (
        <section ref={newestPropertiesRef} className='w-full px-5 sm:px-10'>
          {isMobile ? (
            <div className='mb-4 sm:mb-6'>
              <div className='flex items-center justify-between gap-4'>
                <div className='flex flex-col gap-1 md:w-full'>
                  {newestProperties?.heading && (
                    <h3 className='text-left font-serif text-xl md:text-4xl inline-flex'>
                      {newestProperties.heading}
                    </h3>
                  )}
                  {newestProperties?.description && (
                    <h5 className='text-left text-xs sm:text-sm md:text-base sm:p-0'>
                      {newestProperties.description}
                    </h5>
                  )}
                </div>
                {newestProperties?.buttonName && (
                  <Link
                    href={newestProperties?.buttonLink || '/villas'}
                    onClick={() => {
                      trackEvent('widget_clicked', {
                        page_name: 'homepage',
                        widget_name: 'Discover Our Newest Gems',
                        widget_type: 'discover',
                        cta_type: 'explore_more',
                        vertical_position: 13,
                      });
                    }}
                    className='flex items-center justify-center w-9 h-9 aspect-square p-0 rounded-full bg-accent-red-900 hover:bg-accent-red-950 transition-colors shrink-0'
                  >
                    <ChevronRight className='w-4 h-4 text-white flex-shrink-0' />
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <SectionTemplate
              verticalPosition={13}
              heading={newestProperties?.heading}
              description={newestProperties?.description}
              showDefaultArrows={false}
              isButton={true}
              buttonLink={newestProperties?.buttonLink || '/villas'}
              buttonName={
                newestProperties?.buttonName || 'Explore more Properties'
              }
              onClick={() => {
                trackEvent('widget_clicked', {
                  page_name: 'homepage',
                  widget_name: 'Discover Our Newest Gems',
                  widget_type: 'discover',
                  cta_type: 'explore_more',
                  vertical_position: 13,
                });
              }}
            />
          )}

          <Suspense fallback={''}>
            <ScrollData
              className=''
              itemClassName='w-[90%] sm:w-[65%] md:w-[45%] lg:w-[33%] xl:w-[23.7%]'
              gap='gap-3 md:gap-6'
            >
              {gemsProperties
                ?.slice(0, 4)
                .map((property: any, index: number) => (
                  <div key={index}>
                    <Suspense fallback={''}>
                      <PropertyCard
                        property={property}
                        variant={'default'}
                        onFavoriteToggle={handleFavoriteToggle}
                        onCardClick={(id) => handleNewestCardClick(id, index)}
                        showActionButton={false}
                        peram='homepage'
                        lazyLoadAmenityIcons={true}
                      />
                    </Suspense>
                  </div>
                ))}
            </ScrollData>
          </Suspense>
        </section>
      )}

      {/* EVENTS SECTION */}
      {eventsSection && eventsSection?.events?.length > 0 && (
        <section ref={eventsRef} className='w-full px-5 sm:px-10'>
          <Suspense fallback={''}>
            <EventsSection
              heading={eventsSection?.heading}
              description={eventsSection?.description}
              events={eventsSection?.events}
              verticalPosition={11}
            />
          </Suspense>
        </section>
      )}

      {/* STAY STORIES SECTION */}
      {stayStories && stayStories?.data && stayStories?.data?.length > 0 && (
        <section ref={stayStoriesRef} className='w-full'>
          <SectionTemplate
            verticalPosition={10}
            showDefaultArrows={false}
            id='starGuestStories'
            heading={stayStories?.heading}
            description={stayStories?.description}
            textAlign='center'
            justifyContent='justify-center'
          >
            <Suspense fallback={''}>
              <VideoProvider>
                <ReusableCarousel
                  data={stayStories?.data}
                  renderItem={(item, index, isCenterSlide) => (
                    <Template
                      onClick={(ctaType) => {
                        trackEvent('widget_clicked', {
                          page_name: 'homepage',
                          widget_name: 'Every stay has a story',
                          widget_type: 'video_cards',
                          cta_type: ctaType,
                          vertical_position: 10,
                          horizontal_position: index + 1,
                        });
                      }}
                      data={item}
                      isCenterSlide={isCenterSlide}
                      pageName='homepage'
                    />
                  )}
                  slidesPerView={{ mobile: 1.5, tablet: 2.5, desktop: 4.4 }}
                  mobileViewType='carousel'
                  desktopViewType='carousel'
                  showArrows={true}
                  prive={false}
                  spacing={{ mobile: 16, tablet: 24, desktop: 24 }}
                  centerSlides={true}
                  centerSlideScale={isMobile ? 1.1 : 1.2}
                  startIndex={Math.floor((stayStories?.data?.length || 0) / 2)}
                  blurInactiveCards={true}
                />
              </VideoProvider>
            </Suspense>
          </SectionTemplate>
        </section>
      )}

      {/* SPECIAL CARDS SECTION */}
      {specialCards && (
        <section ref={specialCardsRef} className='w-full px-5 sm:px-10'>
          <Suspense fallback={''}>
            <SpecialCardSection
              cardData={specialCards}
              title={specialCards?.heading}
              description={specialCards?.description}
            />
          </Suspense>
        </section>
      )}

      {/* PARTNER WITH US SECTION */}
      {partnerWithUsSection && (
        <section ref={partnerWithUsRef} className='w-full px-0 xl:px-10'>
          <Suspense fallback={''}>
            <PartnerSection
              partnerSectionData={partnerWithUsSection}
              verticalPosition={14}
            />
          </Suspense>
        </section>
      )}

      {/* ALLIANCE LOGOS SECTION */}
      {allianceLogos && allianceLogos?.alliancesLogos?.length > 0 && (
        <section ref={allianceLogosRef} className='w-full'>
          <Suspense fallback={''}>
            <PartnerAlliancesLogos
              data={allianceLogos?.alliancesLogos}
              heading={allianceLogos?.title}
              verticalPosition={15}
            />
          </Suspense>
        </section>
      )}

      {/* PARTNER LOGOS SECTION */}
      {partnerLogos && partnerLogos?.partnerLogos?.length > 0 && (
        <section ref={partnerLogosRef} className='w-full mb-0'>
          <Suspense fallback={''}>
            <PartnerAlliancesLogos
              data={partnerLogos?.partnerLogos}
              heading={partnerLogos?.title}
              verticalPosition={16}
            />
          </Suspense>
        </section>
      )}

      {/* FLOATING CTA SECTION */}
      <Suspense fallback={''}>
        <FloatingCta
          isPhone={true}
          isWhatsApp={isMobile ? false : true}
          bottom={'90px'}
        />
      </Suspense>
    </div>
  );
};

export default HomeModule;
