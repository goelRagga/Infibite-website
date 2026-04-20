import Cookies from 'js-cookie';

export const useLoyaltyOptIn = () => {
  const getUserIdFromCookie = (): string | null => {
    if (typeof window === 'undefined') return null;

    try {
      const userDataStr = Cookies.get('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        return userData?.id || null;
      }
    } catch (error) {
      console.error('Error parsing userData cookie:', error);
    }
    return null;
  };

  return {
    getUserIdFromCookie,
  };
};
