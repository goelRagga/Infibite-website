type ResponsiveSlides = number | { base?: number; md?: number; lg?: number };
export interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  slidesPerView?: ResponsiveSlides;
  slidesPerView?: number;
  loop?: boolean;
  showArrows?: boolean;
  spacing?: string;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  paginationDots?: boolean;
  heading?: string;
  description?: string;
  ref?: React.Ref<{ scrollPrev: () => void; scrollNext: () => void }>;
}
