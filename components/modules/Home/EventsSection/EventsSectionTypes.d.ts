declare module 'event-section' {
  import { EventItem } from 'api-types';
  export interface EventsSectionProps {
    verticalPosition?: number;
    horizontalPosition?: number;
    heading: string;
    description: string;
    events?: EventItem[];
  }
}
