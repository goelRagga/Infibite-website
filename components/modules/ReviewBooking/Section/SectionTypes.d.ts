export interface CarouselSectionWrapperProps {
  heading?: string;
  id?: string;
  description?: string;
  children: React.ReactNode;
  showDefaultArrows?: boolean;
  justifyContent?: string;
  onPrev?: () => void;
  onNext?: () => void;
  onClick?: () => void;
}
