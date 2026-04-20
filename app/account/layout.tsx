import ProfileCard from '@/components/modules/ProfilePage/ProfileCard/ProfileCard';
import SidebarMenu from '@/components/modules/ProfilePage/profilesidebarmenu/ProfileSideBarMenu';
import React from 'react';

export default function MyAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col lg:flex-row gap-2 md:p-10 '>
      <div className='lg:w-2/8 w-full hidden lg:block'>
        <ProfileCard />

        <div className='hidden md:block  '>
          <SidebarMenu />
        </div>
      </div>
      <div className='rounded-xl w-full lg:w-6/8 flex-1 '>{children}</div>
    </div>
  );
}
