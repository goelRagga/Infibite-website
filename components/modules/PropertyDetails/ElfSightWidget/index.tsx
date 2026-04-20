'use client';

import { useEffect, useRef, useState } from 'react';
import './elfsight-widget.css';

interface ElfSightWidgetProps {
  widgetId?: any;
  reviewsList?: boolean;
}

const ElfSightWidget: React.FC<ElfSightWidgetProps> = ({
  widgetId,
  reviewsList,
}) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);

      if (isDark && window.ElfsightApp) {
        setTimeout(() => {
          window.ElfsightApp.init();
        }, 100);
      }
    };

    checkDarkMode();

    const observer = new MutationObserver(() => {
      checkDarkMode();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setLoading(true);
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          if (window.ElfsightApp) {
            window.ElfsightApp.init();
            setLoading(false);
          } else {
            const intervalId = setInterval(() => {
              if (window.ElfsightApp) {
                window.ElfsightApp.init();
                setLoading(false);
                clearInterval(intervalId);
              }
            }, 100);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (widgetRef.current) {
      observer.observe(widgetRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const containerClass = `elfsight-widget-container w-full overflow-hidden ${isDarkMode ? 'dark-mode' : ''}`;
  const widgetClass = `${widgetId} ${isDarkMode ? 'dark-mode' : ''}`;

  return (
    <div ref={widgetRef} className={containerClass}>
      {reviewsList ? (
        <div className={widgetClass} data-elfsight-app-lazy>
          {loading ? (
            ''
          ) : (
            <div className={widgetClass} data-elfsight-app-lazy></div>
          )}
        </div>
      ) : (
        <div className={widgetClass} data-elfsight-app-lazy>
          {loading ? (
            <div className='loading-text'>Loading...</div>
          ) : (
            <div className={widgetClass} data-elfsight-app-lazy></div>
          )}
        </div>
      )}
    </div>
  );
};

export default ElfSightWidget;
