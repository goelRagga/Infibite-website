'use client';

import { useCallback } from 'react';
import Cookies from 'js-cookie';

interface LoggedInUserResult {
  isLoggedIn: boolean;
  firstName?: string;
}

interface UseLoggedInUserReturn {
  getLoggedInUser: () => LoggedInUserResult;
}

export const useLoggedInUser = (): UseLoggedInUserReturn => {
  const getLoggedInUser = useCallback((): LoggedInUserResult => {
    try {
      const cookie = Cookies.get('userData');
      if (cookie) {
        const data = JSON.parse(cookie);
        if (data?.firstName) {
          return { isLoggedIn: true, firstName: data.firstName };
        }
      }
      return { isLoggedIn: false };
    } catch {
      return { isLoggedIn: false };
    }
  }, []);

  return { getLoggedInUser };
};

export default useLoggedInUser;
