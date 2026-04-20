'use client';

import ElicashIcon from '@/assets/elicash.svg';
import { Button } from '@/components/ui';
import useLogout from '@/hooks/useLogout';
import { useWallet } from '@/hooks/useWallet';
import { Calendar, CreditCard, LogOut, User, Wallet } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    label: 'Personal Details',
    icon: <User className='w-5 h-5' />,
    href: '/account/my-profile',
  },
  {
    label: 'My Bookings',
    icon: <Calendar className='w-5 h-5' />,
    href: '/my-bookings',
  },

  {
    label: 'Wallet',
    icon: <Wallet className='w-5 h-5' />,
    href: '/account/wallet',
  },
  {
    label: 'Loyalty Membership',
    icon: <CreditCard className='w-5 h-5' />,
    href: '/account/loyalty',
  },
];

const SidebarMenu: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { wallet } = useWallet();
  const amount = wallet?.amount ?? 0;
  const handleLogout = useLogout();
  return (
    <div className='w-full rounded-3xl mx-auto mb-4 p-6 bg-[var(--primary-10)] '>
      <div className='flex flex-col gap-5'>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          if (item.label === 'Wallet') {
            return (
              <div
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`flex items-center h-[52px] justify-between gap-4  rounded-xl cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-[var(--accent-red-50)] text-[var(--highlight-text)] font-semibold'
                    : 'text-[var(--black3)]'
                }`}
              >
                <div className='flex items-center gap-2 pl-6  '>
                  <Wallet className='w-5 h-5' />
                  <span className='text-sm'>My Wallet</span>
                </div>

                <div className='flex items-center gap-1 bg-white px-2 py-1 rounded-full mr-2'>
                  {/* <CustomImage
                    src={`${process.env.IMAGE_DOMAIN}/Elicash_Icon_d070aca13e.svg`}
                    alt='coin'
                    className='w-5 h-5'
                    width={20}
                    height={20}
                  /> */}
                  <ElicashIcon />

                  <span className='text-sm font-semibold text-[var(--dawnpink-200)] typography-label-semibold'>
                    {amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex items-center gap-2 px-6 py-4 rounded-xl cursor-pointer transition-colors   ${
                isActive
                  ? 'bg-[var(--accent-red-50)] text-[var(--accent-red-950)] typography-label-semibold '
                  : 'text-[var(--black3)] typography-label-regular'
              }`}
            >
              {item.icon}
              <span className='text-sm '>{item.label}</span>
            </div>
          );
        })}

        <Button
          className='mt-2 w-[234px] h-[52px] flex items-center bg-white justify-center cursor-pointer rounded-full 
    border border-[var(--accent-red-700)] text-[var(--accent-red-700)] hover:bg-white
    px-6 py-4 gap-2 text-sm font-semibold transition-colors hover:text-[var(--accent-red-700)]
    lg:w-full'
          onClick={handleLogout}
        >
          <LogOut className='typography-label-semibold' />
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default SidebarMenu;
