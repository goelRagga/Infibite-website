'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';
import { useEffect, useState } from 'react';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      toastOptions={{
        style: {
          backgroundColor: isDark ? '#151515' : '#fbfaf9',
          color: isDark ? '#f8f5f4' : '#2c1f1e',
          border: isDark
            ? '1px solid rgba(248, 245, 244, 0.1)'
            : '1px solid #ede7e3',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
