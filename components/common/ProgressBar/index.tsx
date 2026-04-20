'use client';

import { Progress } from '@/components/ui/progress';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PageProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(20);
    const timer = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 10));
    }, 100);

    return () => {
      clearInterval(timer);
      setProgress(100);
      setTimeout(() => setProgress(0), 200);
    };
  }, [pathname]);

  return progress > 0 ? (
    <div className='fixed top-0 left-0 w-full z-50'>
      <Progress value={progress} />
    </div>
  ) : null;
}
