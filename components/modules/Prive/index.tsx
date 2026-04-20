'use client';
import { Template } from '@/components/common/Carousel/ReviewTemplate/Template';
import PropertyCard from '@/components/common/PropertyCard';
import { ReusableCarousel } from '@/components/common/ReusableCarousel';
import { SectionTemplate } from '@/components/common/Shared/Section';
import PriveHero from '@/components/modules/Prive/PriveHero';
import { VideoProvider } from '@/contexts/video-context';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import { useWallet } from '@/hooks/useWallet';
import { useWidgetViewTracking } from '@/hooks/useWidgetViewTracking';
import {
  LOYALTY_HOME_PAGE_CONTENT,
  PRIVE_PROPERTIES_LIST_ROUTE,
} from '@/lib/constants';
import { trackEvent } from '@/lib/mixpanel';
import Cookies from 'js-cookie';
import { PrivePageProps } from 'prive-page-types';
import { useEffect, useRef } from 'react';
import LoyaltySectionHome from '../Home/LoyaltySectionHome';
import LoyaltySectionHomeLoggedIn from '../Home/LoyaltySectionHome/LoggedIn';
import SpotlightSection from '../Home/SpotlightSection';
import PriveCtaCard from './PriveCtaCard';
import PriveFeatureCard from './PriveFeatureCard';
import ServiceCard from './ServiceCard';
import ServicesSection from './ServicesSection';

function Prive({
  priveHeroSectionData,
  locations,
  priveSelection,
  priveFeatures,
  seasonalRecommendations,
  spotlightSection,
  stayStories,
  priveProperties,
  privePropertiesDescending,
  priveEscapeCurationContent,
  priveServicesSectionContent,
}: PrivePageProps) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isAuthenticated = Cookies.get('accessToken') ? true : false;
  const { loyaltyTierDetails } = useWallet();

  // Refs for tracking widget views
  const heroRef = useRef<HTMLElement | null>(null);
  const priveSelectionRef = useRef<HTMLElement | null>(null);
  const priveFeaturesRef = useRef<HTMLElement | null>(null);
  const seasonalRef = useRef<HTMLElement | null>(null);
  const spotlightRef = useRef<HTMLElement | null>(null);
  const loyaltyRef = useRef<HTMLDivElement | null>(null);
  const stayStoriesRef = useRef<HTMLElement | null>(null);
  const priveServicesRef = useRef<HTMLElement | null>(null);
  const priveEscapeCurationRef = useRef<HTMLElement | null>(null);

  // Track widget views using the reusable hook
  useWidgetViewTracking({
    ref: heroRef,
    verticalPosition: 1,
    widgetName: 'Prive Hero',
    widgetType: 'hero',
    condition: !!priveHeroSectionData,
    pageName: 'prive',
  });

  useWidgetViewTracking({
    ref: priveSelectionRef,
    verticalPosition: 2,
    widgetName: priveSelection?.heading || 'The Prive Selection',
    widgetType: 'selection',
    condition: !!(
      priveSelection &&
      priveProperties &&
      priveProperties.length > 0
    ),
    pageName: 'prive',
  });

  useWidgetViewTracking({
    ref: priveFeaturesRef,
    verticalPosition: 3,
    widgetName: priveFeatures?.heading || 'What Sets Prive Apart',
    widgetType: 'features',
    condition: !!priveFeatures,
    pageName: 'prive',
  });

  useWidgetViewTracking({
    ref: seasonalRef,
    verticalPosition: 4,
    widgetName: 'Enchanting Autumn Escapes',
    widgetType: 'escapes',
    condition: !!(
      seasonalRecommendations &&
      privePropertiesDescending &&
      privePropertiesDescending.length > 0
    ),
    pageName: 'prive',
  });

  useWidgetViewTracking({
    ref: spotlightRef,
    verticalPosition: 5,
    widgetName: spotlightSection?.heading || 'ELIVAAS in the Spotlight',
    widgetType: 'spotlight',
    condition: !!spotlightSection,
    pageName: 'prive',
  });

  useWidgetViewTracking({
    ref: loyaltyRef,
    verticalPosition: 6,
    widgetName: 'Loyalty Program',
    widgetType: 'loyalty',
    condition: true,
    pageName: 'prive',
  });

  useWidgetViewTracking({
    ref: stayStoriesRef,
    verticalPosition: 7,
    widgetName: 'Every stay has a story',
    widgetType: 'video_cards',
    condition: !!(stayStories?.data && stayStories.data.length > 0),
    pageName: 'prive',
  });

  useWidgetViewTracking({
    ref: priveServicesRef,
    verticalPosition: 8,
    widgetName: priveServicesSectionContent?.heading || 'Prive Services',
    widgetType: 'services',
    condition: !!priveServicesSectionContent,
    pageName: 'prive',
  });

  useWidgetViewTracking({
    ref: priveEscapeCurationRef,
    verticalPosition: 9,
    widgetName: 'Prive Escape Curation',
    widgetType: 'cta',
    condition: !!priveEscapeCurationContent,
    pageName: 'prive',
  });

  // Apply dark mode by default for Prive page
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  const handleSeasonalCardClick = (id: string, index: number) => {
    trackEvent('widget_clicked', {
      page_name: 'prive',
      widget_name: 'The privè Selection',
      cta_type: 'property_clicked',
      vertical_position: 2,
      horizontal_position: index + 1,
    });
  };

  const handleSeasonalCardClickSecond = (id: string, index: number) => {
    trackEvent('widget_clicked', {
      page_name: 'prive',
      widget_name: 'Enchanting Autumn Escapes',
      cta_type: 'property_clicked',
      vertical_position: 4,
      horizontal_position: index + 1,
    });
  };

  return (
    <div className='space-y-15 sm:space-y-28'>
      {/* PRIVE HERO SECTION CONTENT */}
      {priveHeroSectionData && (
        <section ref={heroRef} className='mb-2 sm:mb-18'>
          <PriveHero
            priveHeroSectionData={priveHeroSectionData}
            locations={locations}
            verticalPosition={1}
          />
        </section>
      )}

      {/* PRIVE SELECTION SECTION CONTENT */}
      {priveSelection && priveProperties && priveProperties?.length > 0 && (
        <section ref={priveSelectionRef} className='w-full px-5 md:px-10'>
          <SectionTemplate
            verticalPosition={2}
            prive={true}
            heading={priveSelection?.heading}
            description={priveSelection?.description}
            showDefaultArrows={false}
            isButton={true}
            buttonName={priveSelection?.buttonName}
            buttonLink={PRIVE_PROPERTIES_LIST_ROUTE}
            className='mb-6 md:mb-8'
          />
          <ReusableCarousel
            data={priveProperties}
            renderItem={(property, index) => (
              <PropertyCard
                property={property}
                variant='prive-home'
                isClickable={false}
                showActionButton={true}
                peram='prive'
                onCardClick={(id) => handleSeasonalCardClick(id, index)}
              />
            )}
            slidesPerView={{ mobile: 1.5, tablet: 1.5, desktop: 3.1 }}
            mobileViewType='scroll'
            desktopViewType='carousel'
            showArrows={true}
            prive={true}
            spacing={{ mobile: 16, tablet: 24, desktop: 24 }}
          />
        </section>
      )}

      {/* WHAT SETS PRIVE APART SECTION CONTENT */}
      {priveFeatures && (
        <section ref={priveFeaturesRef} className='w-full px-5 md:px-10'>
          <SectionTemplate
            verticalPosition={3}
            prive={true}
            heading={priveFeatures?.heading}
            description={priveFeatures?.description}
            showDefaultArrows={false}
            className='mb-6 md:mb-8'
            textAlign='center'
            justifyContent='center'
          />
          <div className='-mx-5 md:-mx-10'>
            <ReusableCarousel
              data={priveFeatures?.data}
              renderItem={(item) => <PriveFeatureCard data={item} />}
              slidesPerView={{ mobile: 1.2, tablet: 2.5, desktop: 2.8 }}
              mobileViewType='carousel'
              desktopViewType='carousel'
              showArrows={true}
              prive={true}
              spacing={{ mobile: 16, tablet: 24, desktop: 24 }}
              centerSlides={true}
              centerSlideScale={1.1}
              startIndex={Math.floor((priveFeatures?.data?.length || 0) / 2)}
            />
          </div>
        </section>
      )}

      {/* SEASONAL RECOMMENDATIONS SECTION CONTENT */}
      {seasonalRecommendations &&
        privePropertiesDescending &&
        privePropertiesDescending?.length > 0 && (
          <section ref={seasonalRef} className='w-full px-5 md:px-10'>
            <SectionTemplate
              verticalPosition={4}
              prive={true}
              heading={seasonalRecommendations?.heading}
              description={seasonalRecommendations?.description}
              showDefaultArrows={false}
              isButton={true}
              buttonName={seasonalRecommendations?.buttonName}
              buttonLink={PRIVE_PROPERTIES_LIST_ROUTE}
              className='mb-6 md:mb-8'
            />
            <ReusableCarousel
              data={privePropertiesDescending || []}
              renderItem={(property, index) => (
                <PropertyCard
                  property={property}
                  variant='prive-home'
                  isClickable={false}
                  showActionButton={true}
                  onCardClick={(id) => handleSeasonalCardClickSecond(id, index)}
                />
              )}
              slidesPerView={{ mobile: 1.2, tablet: 1.5, desktop: 3.1 }}
              mobileViewType='scroll'
              desktopViewType='carousel'
              showArrows={true}
              prive={true}
              spacing={{ mobile: 16, tablet: 24, desktop: 24 }}
            />
          </section>
        )}

      {/* SPOTLIGHT SECTION CONTENT */}
      {spotlightSection && (
        <section
          ref={spotlightRef}
          className='w-full px-5 md:px-10 py-5 md:pb-12 md:pt-0'
        >
          <SpotlightSection
            verticalPosition={5}
            spotlightData={spotlightSection?.data || ''}
            heading={spotlightSection?.heading}
            description={spotlightSection?.description}
            prive={true}
          />
        </section>
      )}

      {/* Show LoyaltySectionHome only if user is not authenticated */}
      {!isAuthenticated ? (
        <div ref={loyaltyRef} className='md:mx-10 overflow-hidden'>
          <LoyaltySectionHome
            verticalPosition={6}
            className='rounded-tr-[60px] md:rounded-tr-[160px] px-5 md:px-12 py-10 md:py-15 isolate border-[1px] border-[color:var(--primary-900)] bg-[color:var(--primary-950)]'
          />
        </div>
      ) : (
        loyaltyTierDetails && (
          <div ref={loyaltyRef} className='md:mx-10 overflow-hidden'>
            <LoyaltySectionHomeLoggedIn
              verticalPosition={6}
              isHome={true}
              className='rounded-tr-[60px] md:rounded-tr-[160px] px-5 md:px-12 py-10 md:py-15 isolate border-[1px] border-[color:var(--primary-900)] bg-[color:var(--primary-950)]'
              data={loyaltyTierDetails}
              title={LOYALTY_HOME_PAGE_CONTENT?.LoggedIn?.elivaasLoyalty}
              pageName='prive'
            />
          </div>
        )
      )}

      {/* STAR GUEST STORIES SECTION CONTENT */}
      {stayStories?.data && (
        <section ref={stayStoriesRef} className='w-full px-5 md:px-10'>
          <SectionTemplate
            verticalPosition={7}
            showDefaultArrows={false}
            prive={true}
            heading={stayStories?.heading}
            description={stayStories?.description}
            className='mb-6 md:mb-8'
            textAlign='center'
            justifyContent='justify-center'
          />
          <div className='-mx-5 md:-mx-10'>
            <VideoProvider>
              <ReusableCarousel
                data={stayStories?.data}
                renderItem={(item, index, isCenterSlide) => (
                  <Template
                    data={item}
                    isCenterSlide={isCenterSlide}
                    pageName='prive'
                    widgetName='Every stay has a story'
                    verticalPosition={7}
                  />
                )}
                // slidesPerView={isTablet ? 4 : isMobile ? 1.3 : 4.4}
                slidesPerView={{ mobile: 1.2, tablet: 3.5, desktop: 2.8 }}
                mobileViewType='carousel'
                desktopViewType='carousel'
                showArrows={true}
                prive={true}
                spacing={{ mobile: 16, tablet: 24, desktop: 24 }}
                centerSlides={true}
                centerSlideScale={isMobile ? 1.1 : 1.2}
                startIndex={Math.floor((stayStories?.data?.length || 0) / 2)}
                blurInactiveCards={true}
              />
            </VideoProvider>
          </div>
        </section>
      )}

      {/* PRIVE SERVICES SECTION CONTENT */}
      {priveServicesSectionContent && (
        <>
          <section
            ref={priveServicesRef}
            className='w-full px-5 md:px-10 py-8 md:py-14 block md:hidden'
          >
            <SectionTemplate
              verticalPosition={8}
              prive={true}
              heading={priveServicesSectionContent?.heading}
              description={priveServicesSectionContent?.mobileDescription}
              showDefaultArrows={false}
            >
              <ReusableCarousel
                data={priveServicesSectionContent?.data?.slice(
                  0,
                  priveServicesSectionContent?.data.length - 1
                )}
                renderItem={(item: any) => (
                  <ServiceCard
                    imageSrc={isMobile ? item.mobileImage : item.image}
                    title={item.title}
                    description={item.description}
                  />
                )}
                slidesPerView={{ mobile: 1.2, tablet: 2.8, desktop: 2.8 }}
                mobileViewType='scroll'
                desktopViewType='carousel'
                showArrows={true}
                prive={true}
                spacing={{ mobile: 16, tablet: 24, desktop: 24 }}
                centerSlides={true}
                centerSlideScale={isMobile ? 1.1 : 1.2}
                startIndex={Math.floor(
                  (priveServicesSectionContent?.data?.length || 0) / 2
                )}
              />
            </SectionTemplate>
          </section>

          <section
            ref={priveServicesRef}
            className='w-full px-5 md:px-10 hidden md:block mb-0'
          >
            <SectionTemplate
              prive={true}
              heading={priveServicesSectionContent?.heading}
              description={priveServicesSectionContent?.webDescription}
              showDefaultArrows={false}
              textAlign='center'
              className='mb-6 md:mb-8'
            />
            <ServicesSection
              experiences={priveServicesSectionContent?.data || []}
            />
          </section>
        </>
      )}

      {/* PRIVE ESCAPE CURATION CONTENT */}
      {priveEscapeCurationContent && (
        <section
          ref={priveEscapeCurationRef}
          className='w-full px-5 md:px-10 mb-24'
        >
          <PriveCtaCard
            data={priveEscapeCurationContent}
            verticalPosition={9}
          />
        </section>
      )}
    </div>
  );
}

export default Prive;
