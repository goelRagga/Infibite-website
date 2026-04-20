declare module 'special-cardSection' {
  export interface SpecialCardSectionProps {
    cardData: Array;
    title?: string;
    description?: string;
    imageSrc?: string;
    imageAlt?: string;
    imagePosition?: 'top' | 'left' | 'bottom';
  }
}
