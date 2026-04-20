import { throttle } from '@/lib/utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface DatePersuasionPositionConfig {
  verticalPosition?: 'top' | 'bottom';
  verticalOffset?: number;
  horizontalAlign?: 'left' | 'center' | 'right' | 'custom';
  horizontalOffset?: number;
  horizontalOffsetPercent?: number;
  spacing?: number;
  viewportPadding?: number;
  tooltipWidth?: number;
  tooltipHeight?: number;
}

interface UseDateTooltipOptions {
  shouldShow: boolean;
  onTooltipClick?: () => void;
  position?: 'top' | 'bottom';
  positionConfig?: DatePersuasionPositionConfig;
}

interface TooltipPosition {
  left: number;
  top: number;
}

export const useDateTooltip = ({
  shouldShow,
  onTooltipClick,
  position = 'bottom',
  positionConfig,
}: UseDateTooltipOptions) => {
  const [dateTooltipDismissed, setDateTooltipDismissed] =
    useState<boolean>(false);
  const dateFieldRef = useRef<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] =
    useState<TooltipPosition | null>(null);
  const positionRef = useRef<TooltipPosition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = sessionStorage.getItem('dateTooltipDismissed');
      if (dismissed === 'true') {
        setDateTooltipDismissed(true);
      }
    }
  }, []);

  const memoizedConfig = useMemo(
    () => positionConfig || {},
    [
      positionConfig?.verticalPosition,
      positionConfig?.verticalOffset,
      positionConfig?.horizontalAlign,
      positionConfig?.horizontalOffset,
      positionConfig?.horizontalOffsetPercent,
      positionConfig?.spacing,
      positionConfig?.viewportPadding,
      positionConfig?.tooltipWidth,
      positionConfig?.tooltipHeight,
    ]
  );

  const calculatePosition = useCallback((): TooltipPosition | null => {
    if (!dateFieldRef.current) return null;

    const rect = dateFieldRef.current.getBoundingClientRect();
    const config = memoizedConfig;
    const tooltipHeight = config.tooltipHeight || 60;
    const tooltipWidth = config.tooltipWidth || 240;
    const viewportWidth = window.innerWidth;
    const viewportPadding = config.viewportPadding ?? 16;
    const spacing =
      config.spacing ?? (config.verticalPosition === 'top' ? 8 : 20);

    const verticalPos = config.verticalPosition || position;
    const verticalOffset = config.verticalOffset || 0;

    let topPosition: number;
    if (verticalPos === 'top') {
      topPosition = rect.top - tooltipHeight - spacing + verticalOffset;
    } else {
      topPosition = rect.bottom + spacing + verticalOffset;
    }

    let leftPosition: number;
    const horizontalAlign = config.horizontalAlign || 'right';

    if (config.horizontalOffsetPercent !== undefined) {
      const offsetFromRight =
        rect.width * (config.horizontalOffsetPercent / 100);
      leftPosition = rect.right - tooltipWidth + offsetFromRight;
    } else {
      switch (horizontalAlign) {
        case 'left':
          leftPosition = rect.left;
          break;
        case 'center':
          leftPosition = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'right':
          leftPosition = rect.right - tooltipWidth / 4;
          break;
        case 'custom': {
          const customOffset = config.horizontalOffset || 0;
          leftPosition = rect.left + customOffset;
          break;
        }
        default:
          leftPosition = rect.right - tooltipWidth / 4;
      }
    }

    if (leftPosition + tooltipWidth > viewportWidth - viewportPadding) {
      leftPosition = viewportWidth - tooltipWidth - viewportPadding;
    }

    if (leftPosition < viewportPadding) {
      leftPosition = viewportPadding;
    }

    return {
      left: leftPosition,
      top: topPosition,
    };
  }, [memoizedConfig, position]);

  useEffect(() => {
    const shouldShowTooltip = shouldShow && !dateTooltipDismissed;

    if (shouldShowTooltip && dateFieldRef.current) {
      const updatePosition = () => {
        const newPosition = calculatePosition();
        if (newPosition) {
          const prev = positionRef.current;
          if (
            !prev ||
            Math.abs(prev.left - newPosition.left) > 1 ||
            Math.abs(prev.top - newPosition.top) > 1
          ) {
            positionRef.current = newPosition;
            setTooltipPosition(newPosition);
          }
        }
      };

      const throttledScrollUpdate = throttle(updatePosition, 16);
      const throttledResizeUpdate = throttle(updatePosition, 100);

      updatePosition();

      window.addEventListener('resize', throttledResizeUpdate, {
        passive: true,
      });
      window.addEventListener('scroll', throttledScrollUpdate, {
        passive: true,
        capture: true,
      });

      return () => {
        window.removeEventListener('resize', throttledResizeUpdate);
        window.removeEventListener('scroll', throttledScrollUpdate, {
          capture: true,
        });
      };
    } else {
      setTooltipPosition(null);
      positionRef.current = null;
    }
  }, [shouldShow, dateTooltipDismissed, calculatePosition]);

  const handleDismissTooltip = useCallback(() => {
    setDateTooltipDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dateTooltipDismissed', 'true');
    }
  }, []);

  const handleTooltipClick = useCallback(() => {
    if (onTooltipClick) {
      onTooltipClick();
    }
  }, [onTooltipClick]);

  const isTooltipVisible =
    shouldShow && !dateTooltipDismissed && tooltipPosition !== null;

  const arrowPosition: 'top' | 'bottom' =
    memoizedConfig.verticalPosition === 'top' ? 'bottom' : 'top';

  const horizontalAlign = memoizedConfig.horizontalAlign || 'right';
  const arrowHorizontalAlign: 'left' | 'center' | 'right' = (
    horizontalAlign === 'custom' ? 'right' : horizontalAlign
  ) as 'left' | 'center' | 'right';

  return {
    dateFieldRef,
    tooltipPosition,
    isTooltipVisible,
    handleDismissTooltip,
    handleTooltipClick,
    arrowPosition: arrowPosition as 'top' | 'bottom',
    arrowHorizontalAlign: arrowHorizontalAlign as 'left' | 'center' | 'right',
  };
};
