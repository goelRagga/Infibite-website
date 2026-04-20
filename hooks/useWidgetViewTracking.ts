import { useEffect, RefObject } from 'react';
import { useInView } from 'framer-motion';
import { trackEvent } from '@/lib/mixpanel';

interface UseWidgetViewTrackingOptions {
  ref: RefObject<HTMLElement | null> | RefObject<HTMLDivElement | null>;
  verticalPosition?: number;
  widgetName: string;
  widgetType: string;
  condition?: boolean;
  once?: boolean;
  margin?: string;
  pageName?: string;
}

export const useWidgetViewTracking = ({
  ref,
  verticalPosition,
  widgetName,
  widgetType,
  condition = true,
  once = true,
  margin = '-100px',
  pageName = 'homepage',
}: UseWidgetViewTrackingOptions) => {
  const isInView = useInView(ref, { once, margin: margin as any });

  useEffect(() => {
    if (isInView && condition && verticalPosition !== undefined) {
      trackEvent('widget_viewed', {
        page_name: pageName,
        widget_name: widgetName,
        widget_type: widgetType,
        vertical_position: verticalPosition,
      });
    }
  }, [isInView, condition, verticalPosition, widgetName, widgetType, pageName]);
};
