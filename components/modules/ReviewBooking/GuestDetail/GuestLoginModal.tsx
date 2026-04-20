'use client';

import OtpVerificationForm from '@/components/common/Login/Content/OTPVerificationForm';

import { useUserContext } from '@/contexts/SharedProvider';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui';
import {
  CHECK_AUTHENTICATION,
  GENERATE_OTP,
  GET_USER_DETAILS,
} from '@/lib/queries';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useClient } from 'urql';

interface GuestLoginModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  initialPhoneNumber?: string;
  initialCountryCode?: string;
  onLoginSuccess?: () => void;
  startWithOtp?: boolean;
}

async function generateOtpRequest(
  client: ReturnType<typeof useClient>,
  phone: string
) {
  const result = await client.query(GENERATE_OTP, { phone }).toPromise();

  if (result.error) {
    throw new Error(
      `Failed to generate OTP due to GraphQL errors: ${result.error.message}`
    );
  }

  if (result.data?.generateOtp?.success) {
    return true;
  } else {
    throw new Error('OTP generation failed: No data or success indicator.');
  }
}

async function authenticateOtpRequest(
  client: ReturnType<typeof useClient>,
  phone: string,
  code: string
) {
  const result = await client
    .query(CHECK_AUTHENTICATION, { phone, code })
    .toPromise();

  if (result.error) {
    throw new Error(
      `Authentication failed due to GraphQL errors: ${result.error.message}`
    );
  }

  if (result.data?.authenticate?.accessToken) {
    return {
      accessToken: result.data.authenticate.accessToken,
      refreshToken: result.data.authenticate.refreshToken,
      isNewUser: result.data.authenticate.isNewUser || false,
    };
  } else {
    throw new Error(
      'Authentication failed: Invalid OTP or no tokens received.'
    );
  }
}

async function fetchUserDetails(
  client: ReturnType<typeof useClient>,
  accessToken: string
) {
  const result = await client
    .query(
      GET_USER_DETAILS,
      {},
      {
        fetchOptions: {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      }
    )
    .toPromise();

  if (result.error) {
    throw new Error(`Failed to fetch user details: ${result.error.message}`);
  }

  if (result.data?.me) {
    return result.data.me;
  } else {
    throw new Error('Failed to fetch user details: No user data received.');
  }
}

export default function GuestLoginModal({
  open,
  setOpen,
  initialPhoneNumber = '',
  initialCountryCode = '+91',
  onLoginSuccess,
  startWithOtp = false,
}: GuestLoginModalProps) {
  const client = useClient();
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [countryCode, setCountryCode] = useState(initialCountryCode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  const { setUserData } = useUserContext();

  useEffect(() => {
    if (initialPhoneNumber !== phoneNumber) {
      setPhoneNumber(initialPhoneNumber);
    }
    if (initialCountryCode !== countryCode) {
      setCountryCode(initialCountryCode);
    }
  }, [initialPhoneNumber, initialCountryCode]);

  useEffect(() => {
    if (open && startWithOtp && phoneNumber && !otpSent) {
      handleSendOtp();
    }
  }, [open, startWithOtp, phoneNumber, otpSent]);

  const handleSendOtp = async () => {
    setIsLoading(true);
    setError(null);
    const fullPhoneNumber = countryCode + phoneNumber;
    try {
      await generateOtpRequest(client, fullPhoneNumber);
      setOtpSent(true);
    } catch (err: any) {
      console.error('OTP generation error:', err);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerified = async (otp: string) => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError(null);
    const fullPhoneNumber = countryCode + phoneNumber;

    try {
      const authResult = await authenticateOtpRequest(
        client,
        fullPhoneNumber,
        otp
      );

      Cookies.set('accessToken', authResult.accessToken, { expires: 30 });
      Cookies.set('refreshToken', authResult.refreshToken, { expires: 30 });

      const userDetails = await fetchUserDetails(
        client,
        authResult.accessToken
      );

      const userDataObj = {
        ...userDetails,
        countryCode,
        phone: phoneNumber,
      };

      Cookies.set('userData', JSON.stringify(userDataObj), { expires: 30 });
      setUserData(userDataObj);

      setOpen(false);
      onLoginSuccess?.();
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError('OTP entered is invalid. Please enter a valid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError(null);
    const fullPhoneNumber = countryCode + phoneNumber;

    try {
      await generateOtpRequest(client, fullPhoneNumber);
    } catch (err: any) {
      console.error('Resend OTP error:', err);
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setOtpSent(false);
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogOverlay className={'backdrop-blur-[2px]!'} />
      <DialogContent className=' md:max-w-[450px] p-6 dark:bg-background dark:border-none'>
        <DialogTitle className='text-center -mt-1  '>
          Verify Your Phone Number
        </DialogTitle>

        <div className='space-y-4'>
          <div className='text-center'>
            <p className='text-sm text-gray-600 dark:text-[var(--accent-text)]'>
              We've sent an OTP to {countryCode} {phoneNumber}{' '}
            </p>
          </div>

          <OtpVerificationForm
            phoneNumber={phoneNumber}
            countryCode={countryCode}
            onOtpSubmit={handleOtpVerified}
            onResendOtp={handleResendOtp}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
