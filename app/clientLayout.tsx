'use client';

import useIsTablet from '@/hooks/useIsTablet';
import { useAuth } from '@/contexts/SharedProvider';
import { initMixpanel } from '@/lib/mixpanel';
import { saveUTMParamsToLocalStorage } from '@/lib/utm';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import { useTransitionState } from 'react-transition-state';
import Cookies from 'js-cookie';
// import { SpeedInsights } from '@vercel/speed-insights/next';

const TopProgressBar = dynamic(
  () => import('@/components/common/TopProgressBar')
);
const BottomNavigation = dynamic(
  () => import('@/components/common/bottom-navigation'),
  {
    ssr: false,
  }
);

const Login = dynamic(() => import('@/components/common/Login'));
const Navbar = dynamic(() => import('@/components/common/Navbar'));
const Footer = dynamic(() => import('@/components/common/Footer'));
const LoyaltyModalCard = dynamic(
  () => import('@/components/common/Loyalty/LoyaltyModalCard'),
  {
    ssr: false,
  }
);

import { Analytics } from '@vercel/analytics/next';
const isAuthenticated = !!Cookies.get('accessToken');
export default function ClientSideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isTablet = useIsTablet();
  const [{ status, isMounted }, toggle] = useTransitionState({
    timeout: 300,
    preEnter: true,
    mountOnEnter: true,
    unmountOnExit: true,
  });

  useEffect(() => {
    Cookies.remove('isSaleChannel');
    // Wait 1 second before reading localStorage to ensure it's available
    const timeoutId = setTimeout(() => {
      // Get all UTM parameters from localStorage
      const utmSource = localStorage.getItem('utm_source');
      const utmMedium = localStorage.getItem('utm_medium');
      const utmCampaign = localStorage.getItem('utm_campaign');
      const utmTerm = localStorage.getItem('utm_term');

      // Build query string with all available UTM parameters
      const queryParams = new URLSearchParams();

      if (utmSource) {
        queryParams.append('utm_source', utmSource);
      }
      if (utmMedium) {
        queryParams.append('utm_medium', utmMedium);
      }
      if (utmCampaign) {
        queryParams.append('utm_campaign', utmCampaign);
      }
      if (utmTerm) {
        queryParams.append('utm_term', utmTerm);
      }

      // Generate unique user ID if not exists and add to query params
      const existingUserId = Cookies.get('user_unique_id');
      if (!existingUserId) {
        const uniqueId = `elivaas_web_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        queryParams.append('user_unique_id', uniqueId);
      }

      // Make API call if at least one parameter exists
      if (queryParams.toString()) {
        // console.log('Setting cookies:', {
        //   utm_source: utmSource,
        //   utm_medium: utmMedium,
        //   utm_campaign: utmCampaign,
        //   utm_term: utmTerm,
        //   user_unique_id: existingUserId ? 'already exists' : 'generating new',
        // });

        // Hit API to set cookies for all subdomains
        fetch(`/api/set-utm?${queryParams.toString()}`, { method: 'GET' });
      }
    }, 1000); // Wait 1 second

    // Cleanup timeout on unmount
    return () => clearTimeout(timeoutId);
  }, []);

  const { setLoginOpen } = useAuth();
  useEffect(() => {
    if (isAuthenticated) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === 'true') {
      setLoginOpen(true);

      params.delete('login');
      const newQuery = params.toString();
      const newUrl = `${window.location.pathname}${newQuery ? `?${newQuery}` : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [isAuthenticated, setLoginOpen]);

  const rawUserData = Cookies.get('userData');

  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const shouldShowLoyaltyModal =
      !rawUserData &&
      !Cookies.get('accessToken') &&
      localStorage.getItem('loyaltyModalFirstScreen') !== 'true';
    setShowLoyaltyModal(shouldShowLoyaltyModal);
  }, [rawUserData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!rawUserData) return;

      try {
        const parsed = JSON.parse(rawUserData) as { email?: string };
        const email = parsed?.email;
        if (
          typeof email === 'string' &&
          (email.toLowerCase().endsWith('@burnsmcd.in') ||
            email.toLowerCase().endsWith('@tbo.com'))
        ) {
          Cookies.set(
            'isCorporateChannel',
            process.env.NEXT_PUBLIC_CHANNEL_ID_CORPORATE_BNM || '',
            { expires: 1 } // 1 day
          );
        }
      } catch {
        // ignore parse errors
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [rawUserData]);

  const isVillasPage =
    pathname.includes('/villas') || pathname.includes('/villas/villas-in');

  const isAccountPage =
    pathname.startsWith('/account') ||
    pathname.startsWith('/my-bookings') ||
    pathname.startsWith('/booking_confirm') ||
    pathname.startsWith('/booking') ||
    pathname.startsWith('/explore/ey') ||
    pathname.startsWith('/explore/burnsmcd') ||
    pathname.startsWith('/explore/tbo') ||
    pathname.startsWith('/app-view');

  const isRemoveBottomNavitaion =
    pathname.startsWith('/account/my-profile') ||
    pathname.startsWith('/booking_confirm') ||
    pathname.startsWith('/explore/winback') ||
    pathname.startsWith('/app-view');

  // Exclude bottom navigation for specific pages
  const isVillaDetailPage = pathname.match(/\/villa-in-[^\/]+\/[^\/]+$/);
  const isBookingPage = pathname.match(/\/booking\/[^\/]+$/);
  const isEyPage = pathname.startsWith('/explore/ey');
  const isBurnsmcdPage = pathname.startsWith('/explore/burnsmcd');
  const isTboPage = pathname.startsWith('/explore/tbo');
  const isPrive = pathname.includes('/prive');
  const isTransparentNavbar =
    pathname.startsWith('/explore/event') ||
    pathname.startsWith('/explore/winback') ||
    pathname.startsWith('/explore/corporate-offsite');

  const shouldShowBottomNav =
    isTablet &&
    !isVillaDetailPage &&
    !isBookingPage &&
    !isEyPage &&
    !isBurnsmcdPage &&
    !isTboPage &&
    !isRemoveBottomNavitaion;
  const isPDP = isTablet && isVillaDetailPage;

  useEffect(() => {
    toggle(true);
    return () => toggle(false);
  }, [toggle, pathname]);

  useEffect(() => {
    saveUTMParamsToLocalStorage();
    initMixpanel();
  }, [pathname]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'instant',
      });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return (
    isMounted && (
      <div
        className={`transition ${status} ${
          isPDP ? 'pb-[116px]' : 'pb-[66px]'
        } md:pb-0`}
      >
        {!isTablet && (
          <Suspense fallback={''}>
            <Navbar
              behavior={isVillasPage ? 'sticky' : 'static'}
              variant={isVillasPage ? 'search' : 'default'}
              isPrive={isPrive}
              isTransparent={isTransparentNavbar}
            />
          </Suspense>
        )}
        <Suspense fallback={''}>
          <div
            className='elfsight-app-937cc9c4-b684-4fcb-b65e-fb9a078c3927'
            data-elfsight-app-lazy
          />
        </Suspense>
        <div
          className='elfsight-app-c1546c7a-0f49-43e9-ad4e-cab87bcd6e6f'
          data-elfsight-app-lazy
        />
        <div
          className='elfsight-app-362bc187-9616-4553-86e0-2f9782ffc733'
          data-elfsight-app-lazy
        />

        {children}
        {shouldShowBottomNav && (
          <Suspense fallback={''}>
            <BottomNavigation />
          </Suspense>
        )}
        {!isAccountPage && (
          <Suspense fallback={''}>
            <Footer />
          </Suspense>
        )}
        <Suspense fallback={''}>
          <Login />
        </Suspense>

        {showLoyaltyModal && (
          <Suspense fallback={''}>
            <LoyaltyModalCard />
          </Suspense>
        )}

        <Suspense fallback={''}>
          <Analytics />
        </Suspense>
        <Suspense fallback={''}>
          <TopProgressBar />
        </Suspense>
        {/* <Suspense fallback={''}>
          <SpeedInsights />
        </Suspense> */}
      </div>
    )
  );
}
