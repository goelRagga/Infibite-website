import { useEffect, useState } from 'react';

export default function useIsLarge(): boolean {
  const [isLarge, setIsLarge] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkLarge = () => {
      setIsLarge(window.innerWidth < 1200);
    };

    checkLarge();
    window.addEventListener('resize', checkLarge);

    return () => {
      window.removeEventListener('resize', checkLarge);
    };
  }, []);

  return mounted ? isLarge : false;
}
