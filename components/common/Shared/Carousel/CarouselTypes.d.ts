export interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  slidesPerView?: number;
  loop?: boolean;
  showArrows?: boolean;
  spacing?: string;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  paginationDots?: boolean;
  ref?: React.Ref<{ scrollPrev: () => void; scrollNext: () => void }>;
}
