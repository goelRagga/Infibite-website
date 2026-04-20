import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';
const FloatingCtaWrapper = dynamic(
  () => import('@/app/explore/FloatingCtaWrapper')
);
interface LayoutProps {
  children: any;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {children}
      {/* FLOATING CTA SECTION */}
      <Suspense fallback={''}>
        <FloatingCtaWrapper />
      </Suspense>
    </>
  );
};

export default Layout;
