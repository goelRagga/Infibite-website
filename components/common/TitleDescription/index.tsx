import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';

interface TitleDescriptionProps {
  title?: string;
  titleClassName?: string;
  description?: string;
  descriptionClassName?: string;
  className?: string;
  lineClamp?: number;
}

const TitleDescription: React.FC<TitleDescriptionProps> = ({
  title,
  titleClassName,
  description,
  descriptionClassName,
  className,
  lineClamp = 1,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLSpanElement>(null);

  const shouldClamp = !expanded;

  useEffect(() => {
    if (!description || !shouldClamp || !contentRef.current) return;
    const el = contentRef.current;
    const check = () => setIsTruncated(el.scrollHeight > el.clientHeight);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [description, shouldClamp, lineClamp]);

  const showToggle = isTruncated;

  return (
    <div className={cn('border border-primary-50 rounded-xl p-4', className)}>
      {title && (
        <h3
          className={cn(
            'text-base text-foreground font-serif pb-1',
            titleClassName
          )}
        >
          {title}
        </h3>
      )}

      {description && (
        <div className={cn('text-xs text-secondary-800', descriptionClassName)}>
          <span
            ref={contentRef}
            className={cn(
              shouldClamp &&
                'overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical]'
            )}
            style={shouldClamp ? { WebkitLineClamp: lineClamp } : undefined}
          >
            {description}
          </span>{' '}
          {showToggle && (
            <button
              type='button'
              className='text-secondary-950 cursor-pointer font-semibold mt-0.5'
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Less' : 'More'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TitleDescription;
