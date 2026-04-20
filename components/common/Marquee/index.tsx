import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  items: React.ReactNode[];
  speed?: number;
  className?: string;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
}

const Marquee: React.FC<MarqueeProps> = ({
  items,
  speed = 20,
  className = '',
  pauseOnHover = true,
  direction = 'left',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const progressRef = useRef<number>(0);
  const lastTimeRef = useRef<number | null>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [duplicatedItems, setDuplicatedItems] = useState<React.ReactNode[]>([]);

  // Duplicate items to create seamless loop
  useEffect(() => {
    if (!Array.isArray(items) || items.length === 0) {
      setDuplicatedItems([]);
      return;
    }
    setDuplicatedItems([...items, ...items]);
  }, [items]);

  // Measure content width
  useEffect(() => {
    if (!contentRef.current || duplicatedItems?.length === 0) return;

    const updateWidth = () => {
      if (contentRef.current) {
        setContentWidth(contentRef.current.scrollWidth / 2); // Divide by 2 since we duplicated
      }
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [duplicatedItems]);

  const animate = (timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    if (!containerRef.current || !contentRef.current || contentWidth === 0)
      return;

    const containerWidth = containerRef.current.offsetWidth;
    const pixelsPerSecond = containerWidth / speed;
    progressRef.current +=
      (direction === 'left' ? 1 : -1) * ((pixelsPerSecond * deltaTime) / 1000);

    // Reset position when we've scrolled one full content width
    if (Math.abs(progressRef.current) >= contentWidth) {
      progressRef.current = 0;
    }

    contentRef.current.style.transform = `translateX(${-progressRef.current}px)`;
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!containerRef.current || contentWidth === 0) return;

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [contentWidth, speed, direction]);

  const handleMouseEnter = () => {
    if (pauseOnHover && animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      lastTimeRef.current = null;
      animationRef.current = requestAnimationFrame((timestamp) => {
        lastTimeRef.current = timestamp;
        animationRef.current = requestAnimationFrame(animate);
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn('overflow-hidden relative w-full', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={contentRef}
        className='flex items-center justify-center gap-6 md:gap-10 whitespace-nowrap w-max'
      >
        {duplicatedItems.map((item, index) => (
          <div key={`${index}-${String(item)}`} className='shrink-0'>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
