import type { EmblaOptionsType } from 'embla-carousel';

export interface CarouselDataItem {
  id?: string | number;
  [key: string]: any;
}

export interface ResponsiveSlidesPerView {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}

export interface ReusableCarouselProps<T extends CarouselDataItem> {
  // Required props
  data: T[];
  renderItem: (item: T, index: number, isCenter?: boolean) => React.ReactNode;

  // Responsive behavior
  slidesPerView?: number | ResponsiveSlidesPerView;

  // View type control - separate for mobile and desktop
  mobileViewType?: 'carousel' | 'scroll'; // 'carousel' = always carousel on mobile, 'scroll' = always scroll on mobile
  desktopViewType?: 'carousel' | 'scroll'; // 'carousel' = always carousel on desktop, 'scroll' = always scroll on desktop
  showScrollbar?: boolean;

  // Carousel options
  loop?: boolean;
  showArrows?: boolean;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  startIndex?: number; // Index of the slide to start from (0-based)

  // Layout options
  spacing?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  className?: string;

  // Visual options
  showDots?: boolean;
  /** If true, blur inactive cards in the carousel */
  blurInactiveCards?: boolean;
  autoScroll?: boolean;
  autoScrollSpeed?: number;
  autoScrollDirection?: 'forward' | 'backward';

  // Centered slides feature
  centerSlides?: boolean;
  centerSlideScale?: number; // Scale factor for center slide (e.g., 1.1 for 10% larger)

  // Prive theming
  prive?: boolean;

  // Callbacks
  onSlideChange?: (index: number) => void;
  keyExtractor?: (item: T, index: number) => string | number;

  /**
   * renderItem(item, index, isCenterOrActive): ReactNode
   * isCenterOrActive is true for the active/center card, false otherwise
   */

  options?: EmblaOptionsType;
}

export interface SampleCardProps {
  title: string;
  description?: string;
  image?: string;
  tag?: string;
  price?: string;
  rating?: number;
}
