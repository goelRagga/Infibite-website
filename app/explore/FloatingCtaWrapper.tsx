'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { usePathname } from 'next/navigation';

const FloatingCta = dynamic(() => import('@/components/common/FloatingCta'));

const getPageNameFromPath = (pathname: string): string | undefined => {
  if (pathname === '/explore/corporate-offsite') return 'corporate';
  if (pathname === '/explore/visa-offers') return 'visa';
  return undefined;
};

const FloatingCtaWrapper = () => {
  const pathname = usePathname();
  const isCorporateOffsite = pathname === '/explore/corporate-offsite';
  const page = getPageNameFromPath(pathname);

  if (
    pathname === '/explore/winback' ||
    pathname === '/explore/burnsmcd' ||
    pathname === '/explore/tbo'
  ) {
    return null;
  }

  return (
    <Suspense fallback={''}>
      <FloatingCta
        isPhone={true}
        isWhatsApp={!isCorporateOffsite}
        bottom={'90px'}
        page={page}
      />
    </Suspense>
  );
};

export default FloatingCtaWrapper;
