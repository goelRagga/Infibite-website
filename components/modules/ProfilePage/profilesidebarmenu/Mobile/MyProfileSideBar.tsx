'use client';

import RenderIconValue from '@/components/common/RenderIconValue/RenderIconValue';
import { trackEvent } from '@/lib/mixpanel';
import { Calendar, CreditCard, User, Wallet } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const MobileMyProfileMenuPage = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get current path

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const menuItems = [
    {
      id: 'personal-details',
      label: 'Personal Details',
      icon: User,
      iconColor: 'text-white',
      backgroundColor: 'bg-[var(--color-primary-400)]',
      showDivider: true,
      href: '/account/my-profile',
      onClick: () => handleNavigation('/account/my-profile'),
    },
    {
      id: 'my-bookings',
      label: 'My Bookings',
      icon: Calendar,
      iconColor: 'text-white',
      backgroundColor: 'bg-[var(--color-primary-400)]',
      showDivider: true,
      href: '/my-bookings',
      onClick: () => {
        handleNavigation('/my-bookings');
        trackEvent('bookings_clicked', {
          page_name: 'profile_page',
        });
      },
    },
    // {
    //   id: 'my-wishlist',
    //   label: 'My Wishlist',
    //   icon: Heart,
    //   iconColor: 'text-white',
    //   backgroundColor: 'bg-[var(--color-primary-400)]',
    //   showDivider: true,
    //   href: '/account/wishlist',
    //   onClick: () => handleNavigation('/account/wishlist'),
    // },
    // {
    //   id: 'refer-earn',
    //   label: 'Refer & Earn',
    //   icon: Gift,
    //   iconColor: 'text-white',
    //   backgroundColor: 'bg-[var(--color-primary-400)]',
    //   showDivider: true,
    //   href: '/account/refer-earn',
    //   onClick: () => handleNavigation('/account/refer-earn'),
    // },
    {
      id: 'my-wallet',
      label: 'My Wallet',
      icon: Wallet,
      iconColor: 'text-white',
      backgroundColor: 'bg-[var(--color-primary-400)]',
      showDivider: true,
      href: '/account/wallet',
      rightValue: undefined,
      onClick: () => {
        handleNavigation('/account/wallet');
        trackEvent('wallet_clicked', {
          page_name: 'profile_page',
        });
      },
    },
    {
      id: 'loyalty-membership',
      label: 'Loyalty Membership',
      icon: CreditCard,
      iconColor: 'text-white',
      backgroundColor: 'bg-[var(--color-primary-400)]',
      showDivider: false,
      href: '/account/loyalty',
      onClick: () => {
        handleNavigation('/account/loyalty');
        trackEvent('Loyalty_clicked', {
          page_name: 'profile_page',
        });
      },
    },
  ];

  return (
    <div className='space-y-4 sm:space-y-6 '>
      {/* Main Menu with Active State */}
      <div className=' rounded-lg  overflow-hidden'>
        <RenderIconValue
          items={menuItems}
          currentPath={pathname}
          showHoverIndicator={true}
          hoverIndicatorColor='bg-blue-500'
          activeBackgroundColor='bg-[var(--primary-10)]'
          activeTextColor='text-red-600'
          activeFontWeight='font-semibold'
        />
      </div>
    </div>
  );
};

export default MobileMyProfileMenuPage;
