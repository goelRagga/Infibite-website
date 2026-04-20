import useIsMobile from '@/hooks/useIsMobile';
import React, { useRef, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface TooltipCommonProps {
  className?: string;
  icon?: React.ReactNode;
  tooltipText: string;
}

const TooltipCommon: React.FC<TooltipCommonProps> = ({
  className,
  icon,
  tooltipText,
}) => {
  const isMobile = useIsMobile();
  const [showMobileTooltip, setShowMobileTooltip] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTooltipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowMobileTooltip(true);
    timeoutRef.current = setTimeout(() => {
      setShowMobileTooltip(false);
    }, 2000);
  };

  return (
    <div>
      {isMobile ? (
        <span
          ref={tooltipRef}
          className='relative cursor-pointer'
          onClick={handleTooltipClick}
        >
          <span>{icon}</span>

          {showMobileTooltip && (
            <span
              className={`absolute bottom-full mb-1 left-1/2 -translate-x-1/2
                        bg-primary text-white font-semibold text-[11px] rounded-md px-3 py-2
                        whitespace-nowrap z-20 shadow-md ${className}`}
            >
              {tooltipText}
            </span>
          )}
        </span>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className='cursor-pointer flex items-center'>{icon}</span>
          </TooltipTrigger>
          <TooltipContent className='font-semibold text-xs dark:text-white'>
            {tooltipText}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default TooltipCommon;
