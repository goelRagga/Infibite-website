'use client';

import { useAuth, useLoyaltyDialog } from '@/contexts/SharedProvider';
import { markLoyaltyDialogAsShown } from '@/lib/loyaltyDialogUtils';
import React from 'react';
import LoginModal from './LoginModal';
import LoyaltyMembershipDialog from '@/components/common/Loyalty/LoyaltyMembershipDialog';

interface LoginProps {
  trigger?: React.ReactNode;
  type?: 'drawer' | 'dialog';
}

const Login = ({ trigger, type }: LoginProps) => {
  const {
    isLoginOpen,
    setLoginOpen,
    loginType,
    loginRedirectUrl,
    hideLoginCloseButton,
  } = useAuth();
  const { isLoyaltyDialogOpen, setLoyaltyDialogOpen } = useLoyaltyDialog();

  const handleLoyaltyDialogClose = (value: boolean) => {
    setLoyaltyDialogOpen(value);
    if (!value) {
      markLoyaltyDialogAsShown();
    }
  };

  return (
    <>
      {isLoginOpen && (
        <LoginModal
          open={isLoginOpen}
          setOpen={(value) => setLoginOpen(value)}
          type={loginType}
          loggedInUrl={loginRedirectUrl || undefined}
          isCloseButton={hideLoginCloseButton}
        />
      )}
      {isLoyaltyDialogOpen && (
        <LoyaltyMembershipDialog
          isModalOpen={isLoyaltyDialogOpen}
          setIsModalOpen={handleLoyaltyDialogClose}
        />
      )}
    </>
  );
};

export default Login;
