import { useEffect, useState } from 'react';

export default function useIsTablet(): boolean {
  const [isTablet, setIsTablet] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkTablet = () => {
      setIsTablet(window.innerWidth < 1024);
    };

    checkTablet();
    window.addEventListener('resize', checkTablet);

    return () => {
      window.removeEventListener('resize', checkTablet);
    };
  }, []);

  return mounted ? isTablet : false;
}
