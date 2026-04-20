declare module 'success-numbers' {
  export interface SuccessNumberItem {
    icon: string;
    countingNumbers: string;
    countingFeature: string;
  }

  export interface SuccessNumbersProps {
    data: SuccessNumberItem[];
    heading: string;
    description: string;
    verticalPosition?: number;
    horizontalPosition?: number;
  }
}
