'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { UserDetailsTypes } from '@/components/modules/ProfilePage/profilesidebarmenu/personaldetails/PersonalDetails';

const getDefaultUserData = (): UserDetailsTypes => ({
  id: '',
  firstName: '',
  lastName: '',
  salutation: '',
  email: '',
  phone: '',
  dob: '',
  countryCode: '',
  imageUrl: '',
});

interface UserContextType {
  userData: UserDetailsTypes | null;
  setUserData: React.Dispatch<React.SetStateAction<UserDetailsTypes | null>>;
  refreshUserData: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserDetailsTypes | null>(
    getDefaultUserData()
  );

  const refreshUserData = () => {
    const cookie = Cookies.get('userData');
    if (cookie) {
      try {
        setUserData(JSON.parse(cookie));
      } catch {
        setUserData(null);
      }
    } else {
      setUserData(null);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
