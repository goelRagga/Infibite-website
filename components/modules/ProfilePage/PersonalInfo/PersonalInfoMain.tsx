'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { User, BookMarked, Bookmark, Info, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import AccountDetailsIcon from '@/assets/accountDetail.svg';
import MyBookings from '@/assets/myBookings.svg';
import whishList from '@/assets/wishList.svg';
import AboutIcon from '@/assets/aboutIcon.svg';
import LogoutIcon from '@/assets/logoutIcon.svg';

interface ProfileSidebarProps {
  name: string;
  joinedYear: string;
  avatarUrl: string;
  onLogout: () => void;
  closeDrawer: () => void;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    label: 'Account Details',
    icon: <AccountDetailsIcon />,
    href: '/account/my-profile',
  },
  {
    label: 'My Bookings',
    icon: <MyBookings />,
    href: '/my-bookings',
  },
  // {
  //   label: 'My Wishlist',
  //   icon: <whishList />,
  //   href: '/account/my-wishlist',
  // },
  {
    label: 'About Us',
    icon: <AboutIcon />,
    href: '/explore/about-us',
  },
];

const PersonalInfo: FC<ProfileSidebarProps> = ({
  name,
  joinedYear,
  avatarUrl,
  onLogout,
  closeDrawer,
}) => {
  const pathname = usePathname();

  const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  const initials = getInitials(name);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    // Check if we're already on the current route
    const isCurrentRoute =
      pathname === href ||
      (href === '/account/my-profile' &&
        pathname.startsWith('/account/my-profile'));

    if (isCurrentRoute) {
      e.preventDefault(); // Prevent navigation
      closeDrawer(); // Just close the drawer
    } else {
      closeDrawer(); // Close drawer and allow navigation
    }
  };

  return (
    <div className='border-none md:border md:shadow-sm dark:border-0 md:rounded-2xl flex flex-col gap-3 dark:bg-[var(--prive-background)]'>
      <div className='flex items-center gap-3 w-full pb-4 border-b h-16 px-2 py-3 bg-[var(--primary-10)] dark:border-secondary-950 dark:bg-[var(--prive-background)]  '>
        <div className='flex items-center gap-2 w-full px-4'>
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              width={50}
              height={50}
              className='rounded-full object-cover flex-shrink-0 '
            />
          ) : (
            <div className='w-10 h-10 rounded-full bg-[var(--primary-100)] text-[var(--primary-700)] flex items-center justify-center font-semibold flex-shrink-0 '>
              {initials}
            </div>
          )}
          <div className='flex flex-col min-w-0'>
            {' '}
            <h2 className='text-lg font-semibold text-neutral-900 dark:text-white truncate font-dm-serif typography-body-regular'>
              {name}
            </h2>
            {/* <p className='text-sm text-neutral-500'>Joined {joinedYear}</p> */}
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-3 pt-0 bg-white dark:bg-[var(--prive-background)]'>
        {menuItems.map((item, idx) => (
          <Link
            href={item.href}
            key={idx}
            onClick={(e) => handleLinkClick(e, item.href)}
            className={cn(
              'flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors h-12 typography-small-regular text-foreground hover:text-primary-700'
            )}
          >
            <div className='p-2 rounded-md text-primary-400 '>{item.icon}</div>
            <span className='text-sm text-foreground dark:text-white'>
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      <div className='border-t border-gray-200  bg-white dark:bg-[var(--prive-background)] h-14 p-4 dark:border-secondary-950 '>
        <Button
          // variant='ghost'
          onClick={onLogout}
          className='flex items-center justify-start gap-2 text-red-600 typography-label-semibold w-full bg-white dark:bg-[var(--prive-background)] hover:bg-white border-none shadow-none ring-0 focus-visible:ring-0 focus:ring-0 cursor-pointer '
        >
          <LogoutIcon />
          Log Out
        </Button>
      </div>

      <div className='w-full flex h-8 gap-3 text-xs md:text-sm text-muted-foreground border-t border-gray-200 bg-white dark:bg-[var(--prive-background)] pl-10 py-3 dark:border-secondary-950'>
        <Link
          href='/explore/privacy-policy'
          className='hover:underline typography-xs-regular text-[var(--secondary-700)] '
        >
          <span className='text-[var(--secondary-700)] dark:text-white'>
            {' '}
            Privacy Policy
          </span>
        </Link>
        <span className='hidden md:inline'>&bull;</span>{' '}
        <Link
          href='/explore/terms-and-conditions'
          className='hover:underline typography-xs-regular text-[var(--secondary-700)]'
        >
          <span className='text-[var(--secondary-700)] dark:text-white'>
            {' '}
            Terms & Conditions
          </span>
        </Link>
      </div>
    </div>
  );
};

export default PersonalInfo;
