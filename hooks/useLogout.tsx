'use client';

import { resetLoyaltyDialogCookie } from '@/lib/loyaltyDialogUtils';
import { useAuth0 } from '@auth0/auth0-react';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';

const useLogout = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth0();

  const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('userData');
    Cookies.remove('isSaleChannel');
    Cookies.remove('isCorporateChannel');
    resetLoyaltyDialogCookie();

    logout({ logoutParams: { returnTo: window.location.origin } });

    router.push('/');

    setTimeout(() => {
      if (pathname === '/') {
        window.location.reload();
      }
    }, 500);
  };

  return handleLogout;
};

export default useLogout;
