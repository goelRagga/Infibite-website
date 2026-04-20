'use client';

import RenderIconValue from '@/components/common/RenderIconValue/RenderIconValue';
import { Calendar, Heart, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const MobileAboutUsMenuPage = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get current path

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const menuItems = [
    {
      id: 'about-us',
      label: 'About Us',
      icon: User,
      iconColor: 'text-white',
      backgroundColor: 'bg-[var(--color-primary-400)]',
      showDivider: true,
      href: '/explore/about-us',
      onClick: () => handleNavigation('/explore/about-us'),
    },
    {
      id: 'privacy-policy',
      label: 'Privacy Policy',
      icon: Calendar,
      iconColor: 'text-white',
      backgroundColor: 'bg-[var(--color-primary-400)]',
      showDivider: true,
      href: '/explore/privacy-policy',
      onClick: () => handleNavigation('/explore/privacy-policy'),
    },
    {
      id: 'terms-conditions',
      label: 'Terms & Conditions',
      icon: Heart,
      iconColor: 'text-white',
      backgroundColor: 'bg-[var(--color-primary-400)]',
      showDivider: true,
      href: '/explore/terms-and-conditions',
      onClick: () => handleNavigation('/explore/terms-and-conditions'),
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

export default MobileAboutUsMenuPage;
