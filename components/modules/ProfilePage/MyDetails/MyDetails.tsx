'use client';

import React from 'react';
import ProfileCard from '@/components/modules/ProfilePage/ProfileCard/ProfileCard';
import { Button } from '@/components/ui';
import { ArrowLeft, LogOut } from 'lucide-react';

import useLogout from '@/hooks/useLogout';
import MobileMyProfileMenuPage from '../profilesidebarmenu/Mobile/MyProfileSideBar';
import MobileAboutUsMenuPage from '../profilesidebarmenu/Mobile/AboutUsSideBar';
import HeaderWithIcon from '@/components/common/HeaderWithIcon/HeaderWithIcon';

const MyDetails = () => {
  const handleLogout = useLogout();
  return (
    <>
      <div className='px-4 pt-4 lg:hidden block'>
        <HeaderWithIcon
          icon={<ArrowLeft className='text-black !h-6 !w-6' />}
          title='Profile'
          onIconClick={() => window.history.back()}
          titleClassName='text-[var(--secondary-950)] text-2xl font-dm-serif typography-title-regular md:px-3 w-full text-center md:text-left'
        />
      </div>
      <div className='w-full space-y-4 border-t border-gray-300  block lg:hidden p-4'>
        <ProfileCard />

        <div className='mt-6'>
          <MobileMyProfileMenuPage />
        </div>

        <div className='mt-6'>
          <MobileAboutUsMenuPage />
        </div>

        <div className='flex justify-center w-full'>
          <Button
            onClick={handleLogout}
            className='mt-2 flex items-center bg-white justify-center gap-2 rounded-full cursor-pointer
          border border-[var(--accent-red-700)] text-[var(--accent-red-700)] flex-1
          py-6 text-sm font-semibold transition-colors hover:bg-white hover:text-[var(--accent-red-700)] '
          >
            <LogOut className='w-5 h-7' />
            Log Out
          </Button>
        </div>
      </div>
    </>
  );
};

export default MyDetails;
