'use client';

import PointerAsset from '@/assets/pointer.svg';
import { useAuth } from '@/contexts/SharedProvider';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import { cn, getUserInitials } from '@/lib/utils';
import Cookies from 'js-cookie';
import { Compass, Home, ToggleRight, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '@/lib/mixpanel';

const isPathActive = (pathname: string, matches: string[]) =>
  matches.some((path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path)
  );

const BottomNavigation = () => {
  const pathname = usePathname();
  const { setLoginOpen } = useAuth();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const navItems = [
    {
      href: '/prive',
      label: 'Privé',
      icon: ToggleRight,
      match: ['/prive'],
    },
    {
      href: '/',
      label: 'Home',
      icon: Home,
      match: ['/', '/'],
    },
    { href: '/villas', label: 'Explore', icon: Compass, match: ['/villas'] },
    { href: '/account', label: 'Profile', icon: User, match: ['/account'] }, // Keep User here as a default
  ];

  // Scroll detection state and refs
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const isAuthenticated = !!Cookies.get('accessToken');

  const userDetails = Cookies.get('userData')
    ? JSON.parse(Cookies.get('userData') as string)
    : null;

  const userInitials = userDetails
    ? getUserInitials(userDetails.firstName, userDetails.lastName)
    : null;

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const isAtBottom = currentScrollY + windowHeight >= documentHeight - 80;

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      if (isAtBottom) {
        setIsNavVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsNavVisible(false);
      } else if (
        currentScrollY < lastScrollY.current &&
        lastScrollY.current - currentScrollY >= 10
      ) {
        setIsNavVisible(true);
      }
      lastScrollY.current = currentScrollY;
    }, 10);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = undefined;
      }
    };
  }, [isMobile, handleScroll]);

  const handleProfileClick = (e: React.MouseEvent) => {
    trackEvent('bottom_navigation_clicked', {
      cta_type: 'profile',
    });
    if (!isAuthenticated) {
      e.preventDefault();
      setLoginOpen(true); // open login modal
    }
  };

  return (
    <AnimatePresence>
      {(!isTablet || isNavVisible) && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration: 0.3,
          }}
          className={cn(
            'fixed w-full bottom-0 inset-x-0 z-50 bg-white shadow-t border-t-2 border-t-accent-red-900 dark:bg-[var(--prive4)] dark:border-t-1 dark:border-primary-400'
          )}
        >
          <div className='flex justify-around items-center h-16 relative'>
            {navItems.map((item) => {
              const isActive = isPathActive(pathname, item.match);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  // prefetch={false}
                  onClick={
                    item.label === 'Profile'
                      ? handleProfileClick
                      : () =>
                          trackEvent('bottom_navigation_clicked', {
                            cta_type: item.label,
                          })
                  }
                  className='flex flex-col items-center justify-center gap-1 relative focus:outline-none w-full'
                >
                  {isActive && (
                    <div className='absolute w-full -top-[13px] w-full flex justify-center'>
                      <PointerAsset className={'h-10'} />
                    </div>
                  )}

                  {/* Conditional rendering for Profile icon/avatar */}
                  {item.label === 'Profile' && userInitials ? (
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-accent-red-900 text-white'
                      )}
                    >
                      {userInitials ? (
                        <span className='text-xs'>{userInitials}</span>
                      ) : (
                        <User className='w-4 h-4' />
                      )}
                    </div>
                  ) : (
                    <item.icon
                      className={cn(
                        'w-6 h-6',
                        isActive
                          ? 'text-[var(--accent-red-900)]'
                          : 'text-[var(--primary-500)]'
                      )}
                      strokeWidth={1.5}
                    />
                  )}

                  <span
                    className={cn(
                      'typography-xs-regular font-medium',
                      isActive
                        ? 'text-[var(--accent-red-900)] font-semibold!'
                        : 'text-[var(--primary-500)]'
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default BottomNavigation;
