'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/lib/mixpanel';

interface Tab {
  name: string;
  id: string;
}

interface TopBarProps {
  tabs: Tab[];
  headerOffset?: number;
  onTabChange?: (activeIndex: number) => void;
}

export default function TabSlider({
  tabs,
  headerOffset = 80,
  onTabChange,
}: TopBarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: '0px', width: '0px' });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Scroll to section
  const handleTabClick = (index: number, name: string) => {
    const section = document.getElementById(tabs[index].id);
    if (section) {
      const elementPosition =
        section.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    setActiveIndex(index);
    onTabChange?.(index);
    trackEvent('top_nav_clicked', {
      page_name: 'property_details',
      cta_type: name,
    });
  };

  // Highlight on hover
  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  // Active tab indicator
  useEffect(() => {
    const activeElement = tabRefs.current[activeIndex];
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
      activeElement.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeIndex]);

  // Update active index on scroll
  useEffect(() => {
    const handleScroll = () => {
      const offsets = sectionRefs.current.map((el) =>
        el ? el.getBoundingClientRect().top : Infinity
      );

      const threshold = headerOffset + 10;
      const index = offsets.findIndex((top) => top >= 0 && top < threshold);

      if (index !== -1 && index !== activeIndex) {
        setActiveIndex(index);
        onTabChange?.(index);
      }
    };

    sectionRefs.current = tabs.map((tab) => document.getElementById(tab.id));

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeIndex, tabs, headerOffset, onTabChange]);

  return (
    <Card className='w-full m-0 bg-white dark:bg-[var(--prive4)] rounded-none sticky z-90 top-0 border-none overflow-x-auto scrollable-hide shadow-none flex items-left justify-between p-0 '>
      <CardContent className='p-0 sm:py-2 border-b border-b-2 dark:border-[#533d3b] border-white sm:border-[var(--primary-100)] '>
        <div className='relative '>
          <div
            className='absolute h-[30px] transition-all duration-300 ease-out bg-[#0e0f1114] dark:bg-[#ffffff1a] rounded-[6px] flex items-center'
            style={{ ...hoverStyle, opacity: hoveredIndex !== null ? 1 : 0 }}
          />
          <div
            className='absolute bottom-[-2px] sm:bottom-[-10px] h-[2px] bg-accent-red-900 dark:bg-[#EFBF8E] transition-all duration-400 ease-out'
            style={activeStyle}
          />
          <div className='relative flex space-x-[6px] items-center justify-between'>
            {tabs.map((tab, index) => (
              <div
                key={index}
                ref={(el: any) => (tabRefs.current[index] = el)}
                className={`px-3 py-2 cursor-pointer transition-colors duration-300 h-[35px] sm:h-[30px] ${
                  index === activeIndex
                    ? 'text-accent-red-900 dark:text-[#EFBF8E] font-medium font-semibold'
                    : 'text-[var(--secondary)] dark:text-primary-100'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleTabClick(index, tab.name)}
              >
                <div className='sm:text-sm text-xs leading-5 whitespace-nowrap flex items-center justify-center h-full'>
                  {tab.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
