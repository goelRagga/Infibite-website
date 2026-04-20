export interface CarouselSectionWrapperProps {
  textAlign?: 'left' | 'center' | 'right' | 'justify' | 'start' | 'end';
  heading?: string;
  id?: string;
  description?: string;
  children?: React.ReactNode;
  showDefaultArrows?: boolean;
  justifyContent?: string;
  onPrev?: () => void;
  onNext?: () => void;
  buttonName?: string;
  isButton?: boolean;
  buttonLink?: string;
  prive?: boolean;
  className?: string;
  isStar?: boolean;
  onClick?: () => void;
  verticalPosition?: number;
  horizontalPosition?: number;
}
