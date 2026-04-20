'use client';

import { UserDetailsTypes } from '@/components/modules/ProfilePage/profilesidebarmenu/personaldetails/PersonalDetails';
import Cookies from 'js-cookie';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

interface StateData {
  name: string;
  slug: string;
  cities: { name: string; slug: string }[];
}

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

interface SharedContextType {
  isLoginOpen: boolean;
  setLoginOpen: (
    open: boolean,
    type?: 'dialog' | 'drawer',
    redirectUrl?: string,
    hideCloseButton?: boolean
  ) => void;
  loginType: 'dialog' | 'drawer';
  loginRedirectUrl: string | null;
  hideLoginCloseButton: boolean;

  // User context
  userData: UserDetailsTypes | null;
  setUserData: Dispatch<SetStateAction<UserDetailsTypes | null>>;
  refreshUserData: () => void;

  // Phone context
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  countryCode: string;
  setCountryCode: (value: string) => void;

  // security deposit context
  depositPaymentDetail: any;
  setDepositPaymentDetail: Dispatch<SetStateAction<any[]>>;
  // refund
  isRefund: boolean | null;
  setIsRefund: Dispatch<SetStateAction<boolean | null>>;

  isLoading: boolean | null;
  setLoading: Dispatch<SetStateAction<boolean | null>>;

  // Destinations context
  destinationsList: StateData[];
  setDestinationsList: Dispatch<SetStateAction<StateData[]>>;

  // Loyalty dialog context
  isLoyaltyDialogOpen: boolean;
  setLoyaltyDialogOpen: (open: boolean) => void;
}

const SharedContext = createContext<SharedContextType | null>(null);

export const useShared = () => {
  const context = useContext(SharedContext);
  if (!context) throw new Error('useShared must be used within SharedProvider');
  return context;
};

export const useAuth = () => {
  const {
    isLoginOpen,
    setLoginOpen,
    loginType,
    loginRedirectUrl,
    hideLoginCloseButton,
  } = useShared();
  return {
    isLoginOpen,
    setLoginOpen,
    loginType,
    loginRedirectUrl,
    hideLoginCloseButton,
  };
};

export const useUserContext = () => {
  const { userData, setUserData, refreshUserData } = useShared();
  return { userData, setUserData, refreshUserData };
};

export const usePhoneContext = () => {
  const { phoneNumber, setPhoneNumber, countryCode, setCountryCode } =
    useShared();
  return { phoneNumber, setPhoneNumber, countryCode, setCountryCode };
};

export const useSecurityDepositContext = () => {
  const {
    depositPaymentDetail,
    setDepositPaymentDetail,
    isRefund,
    setIsRefund,
    isLoading,
    setLoading,
  } = useShared();

  return {
    depositPaymentDetail,
    setDepositPaymentDetail,
    isRefund,
    setIsRefund,
    isLoading,
    setLoading,
  };
};

// New hook for destinations context
export const useDestinationsContext = () => {
  const { destinationsList, setDestinationsList } = useShared();

  return {
    destinationsList,
    setDestinationsList,
  };
};

// Hook for loyalty dialog context
export const useLoyaltyDialog = () => {
  const { isLoyaltyDialogOpen, setLoyaltyDialogOpen } = useShared();

  return {
    isLoyaltyDialogOpen,
    setLoyaltyDialogOpen,
  };
};

export const SharedProvider = ({ children }: { children: ReactNode }) => {
  const [isLoginOpen, _setLoginOpen] = useState(false);
  const [loginType, setLoginType] = useState<'dialog' | 'drawer'>('dialog');
  const [loginRedirectUrl, setLoginRedirectUrl] = useState<string | null>(null);
  const [hideLoginCloseButton, setHideLoginCloseButton] = useState(false);

  const setLoginOpen = (
    open: boolean,
    type?: 'dialog' | 'drawer',
    redirectUrl?: string,
    hideCloseButton?: boolean
  ) => {
    if (type) setLoginType(type);
    if (redirectUrl !== undefined) setLoginRedirectUrl(redirectUrl);
    if (hideCloseButton !== undefined) setHideLoginCloseButton(hideCloseButton);
    if (!open) {
      setLoginRedirectUrl(null);
      setHideLoginCloseButton(false);
    }
    _setLoginOpen(open);
  };

  const [userData, setUserData] = useState<UserDetailsTypes | null>(
    getDefaultUserData()
  );

  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [depositPaymentDetail, setDepositPaymentDetail] = useState<any>(null);
  const [isRefund, setIsRefund] = useState<boolean | null>(false);
  const [isLoading, setLoading] = useState<boolean | null>(false);

  // Destinations state
  const [destinationsList, setDestinationsList] = useState<StateData[]>([]);

  // Loyalty dialog state
  const [isLoyaltyDialogOpen, setLoyaltyDialogOpen] = useState(false);

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
    <SharedContext.Provider
      value={{
        isLoginOpen,
        setLoginOpen,
        loginType,
        loginRedirectUrl,
        hideLoginCloseButton,
        userData,
        setUserData,
        refreshUserData,
        phoneNumber,
        setPhoneNumber,
        countryCode,
        setCountryCode,
        depositPaymentDetail,
        setDepositPaymentDetail,
        isRefund,
        setIsRefund,
        isLoading,
        setLoading,
        destinationsList,
        setDestinationsList,
        isLoyaltyDialogOpen,
        setLoyaltyDialogOpen,
      }}
    >
      {children}
    </SharedContext.Provider>
  );
};
