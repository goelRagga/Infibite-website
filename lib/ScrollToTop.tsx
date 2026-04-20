'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ScrollToTop() {
  const pathname = usePathname();
  // const searchParams = useSearchParams();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'instant',
      });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
