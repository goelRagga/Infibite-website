'use client';

import React, { useMemo } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import AutoScroll from 'embla-carousel-auto-scroll';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from '@/components/ui';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import BlackArrowLeft from '@/assets/black_arrow_backward.svg';
import BlackArrowRight from '@/assets/black_arrow_forward.svg';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import { cn } from '@/lib/utils';
import { ReusableCarouselProps, CarouselDataItem } from './types';
import type { EmblaOptionsType } from 'embla-carousel';

const DEFAULT_DESKTOP_SPACING_MULTIPLIER = 2;
const DEFAULT_TABLET_SPACING_MULTIPLIER = 1.5;
const DEFAULT_MOBILE_SPACING_MULTIPLIER = 1.2;

// ============================================================================
// UTILITY HOOKS
// ============================================================================

const useResponsiveBreakpoints = () => {
  const [screenWidth, setScreenWidth] = React.useState<number>(1024);
  const [orientation, setOrientation] = React.useState<
    'portrait' | 'landscape'
  >('portrait');

  React.useEffect(() => {
    const updateDimensions = () => {
      setScreenWidth(window.innerWidth);
      setOrientation(
        window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      );
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, []);

  const isMobileBreakpoint = screenWidth < 768;
  const isTabletBreakpoint = screenWidth >= 768 && screenWidth < 1024;
  const isDesktopBreakpoint = screenWidth >= 1024;

  return {
    screenWidth,
    orientation,
    isMobileBreakpoint,
    isTabletBreakpoint,
    isDesktopBreakpoint,
  };
};

const useResponsiveSlidesPerView = (
  slidesPerView: ReusableCarouselProps<any>['slidesPerView'],
  isMobile: boolean,
  isTablet: boolean
) => {
  const {
    orientation,
    isMobileBreakpoint,
    isTabletBreakpoint,
    isDesktopBreakpoint,
  } = useResponsiveBreakpoints();

  return useMemo(() => {
    if (typeof slidesPerView === 'number') return slidesPerView;

    // Check if we're in horizontal mode (landscape on mobile/tablet)
    const isHorizontal = orientation === 'landscape';

    // For horizontal mode, adjust the slides per view
    if (isHorizontal && isMobileBreakpoint) {
      // In horizontal mode on mobile, show more slides
      return slidesPerView?.mobile
        ? Math.min(slidesPerView.mobile + 0.5, 2.5)
        : 2.0;
    }

    if (isHorizontal && isTabletBreakpoint) {
      // In horizontal mode on tablet, show more slides
      return slidesPerView?.tablet
        ? Math.min(slidesPerView.tablet + 0.5, 4.5)
        : 3.5;
    }

    // Normal portrait mode logic with better breakpoint handling
    if (isMobileBreakpoint) return slidesPerView?.mobile ?? 1.3;
    if (isTabletBreakpoint) return slidesPerView?.tablet ?? 2.4;
    if (isDesktopBreakpoint) return slidesPerView?.desktop ?? 3.2;

    // Fallback
    return slidesPerView?.desktop ?? 3.2;
  }, [
    slidesPerView,
    isMobile,
    isTablet,
    orientation,
    isMobileBreakpoint,
    isTabletBreakpoint,
    isDesktopBreakpoint,
  ]);
};

const useCarouselPlugins = (
  autoPlay: boolean,
  loop: boolean,
  autoPlayDelay: number,
  autoScroll: boolean,
  autoScrollSpeed: number,
  autoScrollDirection: 'forward' | 'backward'
) => {
  return useMemo(() => {
    const plugins = [];

    if (autoScroll) {
      plugins.push(
        AutoScroll({
          speed: autoScrollSpeed || 1,
          direction: autoScrollDirection,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        })
      );
    } else if (autoPlay && loop) {
      plugins.push(
        Autoplay({
          delay: autoPlayDelay ?? 3000,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        })
      );
    }

    return plugins;
  }, [
    autoPlay,
    loop,
    autoPlayDelay,
    autoScroll,
    autoScrollSpeed,
    autoScrollDirection,
  ]);
};

const wheelGesturesPlugin = WheelGesturesPlugin({
  touchAction: 'pan-y',
  eventOptions: {
    passive: false,
    capture: true,
  },
});

const useCarouselOptions = (
  loop: boolean,
  centerSlides: boolean,
  startIndex: number
) => {
  return useMemo(() => {
    if (centerSlides) {
      return {
        loop: loop ?? false,
        align: 'center' as const,
        dragFree: false,
        containScroll: '' as const,
        startIndex: startIndex ?? 0,
      };
    }
    return {
      loop: loop ?? false,
      align: centerSlides ? ('center' as const) : ('start' as const),
      dragFree: false,
      containScroll: 'trimSnaps' as const,
      startIndex: startIndex ?? 0,
    };
  }, [loop, centerSlides, startIndex]);
};

// ============================================================================
// COMPONENTS
// ============================================================================

interface CarouselNavigationProps {
  api: CarouselApi | undefined;
  selectedIndex: number;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  showArrows: boolean;
  showDots: boolean;
  isMobile: boolean;
  data: any[];
  scrollSnaps: number[];
  centerSlides: boolean;
  blurInactiveCards: boolean;
  prive: boolean;
}

const CarouselNavigation: React.FC<CarouselNavigationProps> = ({
  api,
  selectedIndex,
  canScrollPrev,
  canScrollNext,
  showArrows,
  showDots,
  isMobile,
  data,
  scrollSnaps,
  centerSlides,
  prive,
}) => {
  if (!showArrows && !showDots) return null;
  if (data.length <= 1) return null;

  const arrowClasses = prive
    ? 'w-7 h-7 rounded-full hover:bg-[rgba(177,132,87,0.15)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 flex items-center justify-center'
    : 'w-7 h-7 rounded-full hover:bg-[rgba(177,132,87,0.15)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 flex items-center justify-center';

  const handlePrevClick = () => {
    if (centerSlides) {
      api?.scrollTo(selectedIndex - 1);
    } else {
      api?.scrollPrev();
    }
  };

  const handleNextClick = () => {
    if (centerSlides) {
      api?.scrollTo(selectedIndex + 1);
    } else {
      api?.scrollNext();
    }
  };

  const isPrevDisabled = centerSlides ? selectedIndex === 0 : !canScrollPrev;
  const isNextDisabled = centerSlides
    ? selectedIndex === data.length - 1
    : !canScrollNext;

  return (
    <div className='flex items-center justify-center gap-4 mt-2'>
      {/* Left Arrow - Desktop and Tablet only */}
      {showArrows && !isMobile && (
        <button
          className={cn(arrowClasses)}
          onClick={handlePrevClick}
          disabled={isPrevDisabled}
        >
          {prive ? (
            <ArrowLeft className={'text-[var(--prive5)]'} />
          ) : (
            <BlackArrowLeft className={'text-foreground'} />
          )}
        </button>
      )}

      {/* Dots */}
      {showDots && (
        <div className='flex justify-center gap-2 items-center'>
          {(centerSlides ? data : scrollSnaps).map((_, index) => (
            <button
              key={`dot-${index}`}
              className={cn(
                'cursor-pointer rounded-full transition-all embla__dot',
                index === selectedIndex
                  ? prive
                    ? 'bg-[#B09287] w-2.5 h-2.5 scale-100'
                    : 'bg-[#B09287] w-2.5 h-2.5 scale-100'
                  : prive
                    ? 'bg-[#E1E1E4] w-2 h-2 md:w-2.5 md:h-2.5 scale-90'
                    : 'bg-[#E1E1E4] w-2 h-2 md:w-2.5 md:h-2.5 scale-90'
              )}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Right Arrow - Desktop and Tablet only */}
      {showArrows && !isMobile && (
        <button
          className={cn(arrowClasses)}
          onClick={handleNextClick}
          disabled={isNextDisabled}
        >
          {prive ? (
            <ArrowRight className={'text-[#B18457]'} />
          ) : (
            <BlackArrowRight className={'text-foreground'} />
          )}
        </button>
      )}
    </div>
  );
};

// ============================================================================
// SCROLL VIEW COMPONENT
// ============================================================================

function ScrollView<T extends CarouselDataItem>({
  data,
  renderItem,
  slidesPerView,
  spacing,
  className,
  keyExtractor,
  showScrollbar,
  blurInactiveCards,
}: Pick<
  ReusableCarouselProps<T>,
  | 'data'
  | 'renderItem'
  | 'slidesPerView'
  | 'spacing'
  | 'className'
  | 'keyExtractor'
  | 'showScrollbar'
  | 'blurInactiveCards'
>) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const currentSlidesPerView = useResponsiveSlidesPerView(
    slidesPerView,
    isMobile,
    isTablet
  );

  const { isMobileBreakpoint, isTabletBreakpoint } = useResponsiveBreakpoints();

  const currentSpacing =
    (isMobileBreakpoint
      ? spacing?.mobile
      : isTabletBreakpoint
        ? spacing?.tablet
        : spacing?.desktop) ?? 16;

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'overflow-x-auto',
          showScrollbar
            ? 'scrollbar-thin scrollbar-thumb-gray-300'
            : 'no-scrollbar'
        )}
      >
        <div
          className='flex'
          style={{
            width: 'max-content',
            gap: `${currentSpacing}px`,
          }}
        >
          {data.map((item, index) => (
            <div
              key={
                keyExtractor?.(item, index) ?? `${item.id ?? 'item'}-${index}`
              }
              className='flex-shrink-0'
              style={{
                width: `calc((100vw - ${currentSpacing * (currentSlidesPerView - 1)}px) / ${currentSlidesPerView})`,
                minWidth: isMobileBreakpoint
                  ? '150px'
                  : isTabletBreakpoint
                    ? '180px'
                    : '200px',
              }}
            >
              <div className={blurInactiveCards ? 'blur-[1px]' : ''}>
                {renderItem(item, index, false)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CAROUSEL VIEW COMPONENT
// ============================================================================

function CarouselView<T extends CarouselDataItem>({
  data,
  renderItem,
  slidesPerView,
  spacing,
  className,
  loop,
  autoPlay,
  autoPlayDelay,
  showArrows,
  showDots,
  prive,
  onSlideChange,
  keyExtractor,
  isMobile,
  centerSlides,
  centerSlideScale = 1,
  startIndex,
  blurInactiveCards,
  autoScroll,
  autoScrollSpeed,
  autoScrollDirection,
}: Pick<
  ReusableCarouselProps<T>,
  | 'data'
  | 'renderItem'
  | 'slidesPerView'
  | 'spacing'
  | 'className'
  | 'loop'
  | 'autoPlay'
  | 'autoPlayDelay'
  | 'showArrows'
  | 'showDots'
  | 'prive'
  | 'onSlideChange'
  | 'keyExtractor'
  | 'centerSlides'
  | 'centerSlideScale'
  | 'startIndex'
  | 'blurInactiveCards'
  | 'autoScroll'
  | 'autoScrollSpeed'
  | 'autoScrollDirection'
> & { isMobile?: boolean }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = React.useState(loop || false);
  const [canScrollNext, setCanScrollNext] = React.useState(loop || false);
  const [selectedIndex, setSelectedIndex] = React.useState(startIndex ?? 0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const isTablet = useIsTablet();
  const currentSlidesPerView = useResponsiveSlidesPerView(
    slidesPerView,
    isMobile ?? false,
    isTablet
  );

  const { isMobileBreakpoint, isTabletBreakpoint } = useResponsiveBreakpoints();

  const currentSpacing =
    (isMobileBreakpoint
      ? spacing?.mobile
      : isTabletBreakpoint
        ? spacing?.tablet
        : spacing?.desktop) ?? 16;

  const plugins = useCarouselPlugins(
    autoPlay ?? false,
    loop ?? false,
    autoPlayDelay ?? 3000,
    autoScroll ?? false,
    autoScrollSpeed ?? 1,
    autoScrollDirection ?? 'forward'
  );
  const carouselOptions = useCarouselOptions(
    loop ?? false,
    centerSlides ?? false,
    startIndex ?? 0
  );

  // Calculate basis class for Tailwind
  const getBasisClass = (slides: number) => {
    const commonClasses: Record<number, string> = {
      1: 'basis-full',
      2: 'basis-1/2',
      3: 'basis-1/3',
      4: 'basis-1/4',
      5: 'basis-1/5',
      6: 'basis-1/6',
      12: 'basis-1/12',
    };
    return commonClasses[slides] || null;
  };

  const basisClass = getBasisClass(currentSlidesPerView);
  const flexBasisValue = basisClass
    ? undefined
    : centerSlides
      ? `${(100 / currentSlidesPerView).toFixed(2)}%`
      : `calc((100% - ${currentSpacing * (currentSlidesPerView - 1)}px) / ${currentSlidesPerView})`;

  // Calculate padding for center slides
  const centerSlidePadding =
    centerSlides && centerSlideScale
      ? Math.ceil((centerSlideScale - 1) * 320)
      : 0;

  const horizontalPadding =
    centerSlides && centerSlideScale
      ? Math.ceil((centerSlideScale - 1) * 160)
      : 0;

  // Handle initial scroll to startIndex
  React.useEffect(() => {
    if (!api || startIndex === undefined) return;
    const validStartIndex = Math.max(0, Math.min(startIndex, data.length - 1));
    api.scrollTo(validStartIndex, false);
  }, [api, startIndex, data.length]);

  // Handle carousel state updates
  React.useEffect(() => {
    if (!api) return;

    const updateButtonStates = () => {
      if (loop) {
        setCanScrollPrev(true);
        setCanScrollNext(true);
      } else {
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
      }
      setSelectedIndex(api.selectedScrollSnap());
      setScrollSnaps(api.scrollSnapList());
    };

    const handleSelect = () => {
      updateButtonStates();
      onSlideChange?.(api.selectedScrollSnap());
    };

    updateButtonStates();
    api.on('select', handleSelect);
    api.on('reInit', updateButtonStates);

    return () => {
      api.off('select', handleSelect);
      api.off('reInit', updateButtonStates);
    };
  }, [api, onSlideChange, loop]);

  return (
    <div className={cn('relative w-full', className)}>
      <Carousel
        className={cn('w-full', {
          'overflow-visible': centerSlides,
        })}
        opts={carouselOptions as EmblaOptionsType}
        plugins={[wheelGesturesPlugin, ...plugins]}
        setApi={setApi}
      >
        <CarouselContent
          className={cn('', centerSlides ? '' : '')}
          style={{
            paddingTop: centerSlides ? `${centerSlidePadding}px` : undefined,
            paddingBottom: centerSlides ? `${centerSlidePadding}px` : undefined,
            paddingLeft: centerSlides ? `${horizontalPadding}px` : undefined,
            paddingRight: centerSlides ? `${horizontalPadding}px` : undefined,
            marginLeft: centerSlides ? 0 : `-${currentSpacing}px`,
            gap: centerSlides ? 0 : 0, // Using individual margins for center slides instead of gap
          }}
        >
          {data.map((item, index) => {
            const isCenter = centerSlides && index === selectedIndex;
            const scaleStyle =
              centerSlides && centerSlideScale && isCenter
                ? {
                    transform: `scale(${centerSlideScale})`,
                    transformOrigin: 'center center',
                  }
                : undefined;

            return (
              <CarouselItem
                key={
                  keyExtractor?.(item, index) ?? `${item.id ?? 'item'}-${index}`
                }
                className={cn(
                  'transition-transform duration-300 ease-in-out',
                  basisClass,
                  { 'z-10': isCenter }
                )}
                style={{
                  ...(flexBasisValue ? { flexBasis: flexBasisValue } : {}),
                  paddingLeft: centerSlides ? 0 : `${currentSpacing}px`,
                  marginLeft:
                    centerSlides && index > 0
                      ? (index === selectedIndex
                          ? Math.ceil(
                              currentSpacing *
                                centerSlideScale *
                                (isMobile
                                  ? DEFAULT_MOBILE_SPACING_MULTIPLIER
                                  : isTablet
                                    ? DEFAULT_TABLET_SPACING_MULTIPLIER
                                    : DEFAULT_DESKTOP_SPACING_MULTIPLIER)
                            )
                          : currentSpacing) + 'px'
                      : 0,
                  marginRight:
                    centerSlides && index < data.length - 1
                      ? (index === selectedIndex
                          ? Math.ceil(
                              currentSpacing *
                                centerSlideScale *
                                (isMobile
                                  ? DEFAULT_MOBILE_SPACING_MULTIPLIER
                                  : isTablet
                                    ? DEFAULT_TABLET_SPACING_MULTIPLIER
                                    : DEFAULT_DESKTOP_SPACING_MULTIPLIER)
                            )
                          : currentSpacing) + 'px'
                      : 0,
                  ...scaleStyle,
                }}
              >
                <div
                  className={cn(
                    blurInactiveCards && !isCenter ? 'blur-[0.7px]' : '',
                    'w-full h-full'
                  )}
                  onClick={() => {
                    api?.scrollTo(index);
                  }}
                >
                  {renderItem(item, index, isCenter)}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      <CarouselNavigation
        api={api}
        selectedIndex={selectedIndex}
        canScrollPrev={canScrollPrev}
        canScrollNext={canScrollNext}
        showArrows={showArrows ?? false}
        showDots={showDots ?? false}
        isMobile={isMobile ?? false}
        data={data}
        scrollSnaps={scrollSnaps}
        centerSlides={centerSlides ?? false}
        blurInactiveCards={blurInactiveCards ?? false}
        prive={prive ?? false}
      />
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ReusableCarousel<T extends CarouselDataItem>({
  data,
  renderItem,
  slidesPerView = { mobile: 1.3, tablet: 2.4, desktop: 3.2 },
  mobileViewType = 'scroll',
  desktopViewType = 'carousel',
  showScrollbar = false,
  loop = false,
  showArrows = false,
  showDots,
  autoPlay = false,
  autoPlayDelay = 3000,
  spacing = { mobile: 16, tablet: 24, desktop: 24 },
  className,
  prive = false,
  centerSlides = false,
  centerSlideScale = 1.1,
  startIndex,
  onSlideChange,
  keyExtractor,
  blurInactiveCards = false,
  autoScroll = false,
  autoScrollSpeed = 1,
  autoScrollDirection = 'forward',
}: ReusableCarouselProps<T>) {
  const isMobile = useIsMobile();

  // Determine which view to use
  const shouldUseCarousel = useMemo(() => {
    const currentViewType = isMobile ? mobileViewType : desktopViewType;
    return currentViewType === 'carousel';
  }, [isMobile, mobileViewType, desktopViewType]);

  // Set default showDots
  const shouldShowDots = useMemo(() => {
    if (showDots !== undefined) return showDots;
    const currentViewType = isMobile ? mobileViewType : desktopViewType;
    return shouldUseCarousel && currentViewType === 'carousel';
  }, [showDots, shouldUseCarousel, isMobile, mobileViewType, desktopViewType]);

  return (
    <div className={cn('w-full', className)}>
      {shouldUseCarousel ? (
        <CarouselView
          data={data}
          renderItem={renderItem}
          slidesPerView={slidesPerView}
          spacing={spacing}
          loop={loop}
          autoPlay={autoPlay}
          autoScroll={autoScroll}
          autoScrollSpeed={autoScrollSpeed}
          autoScrollDirection={autoScrollDirection}
          autoPlayDelay={autoPlayDelay}
          showArrows={showArrows}
          showDots={shouldShowDots}
          prive={prive}
          centerSlides={centerSlides}
          centerSlideScale={centerSlideScale}
          startIndex={startIndex}
          onSlideChange={onSlideChange}
          keyExtractor={keyExtractor}
          isMobile={isMobile}
          blurInactiveCards={blurInactiveCards}
        />
      ) : (
        <ScrollView
          data={data}
          renderItem={renderItem}
          slidesPerView={slidesPerView}
          spacing={spacing}
          keyExtractor={keyExtractor}
          showScrollbar={showScrollbar}
          blurInactiveCards={blurInactiveCards}
        />
      )}
    </div>
  );
}

export default ReusableCarousel;
