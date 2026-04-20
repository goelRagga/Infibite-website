'use client';
import { Button } from '@/components/ui/button';
import OtpInput from 'react-otp-input';
import { useEffect, useState, useTransition } from 'react';

import { Spinner } from '../../Spinner';

interface OtpVerificationFormProps {
  phoneNumber: string;
  countryCode: string;
  onOtpSubmit: (otp: string) => void;
  onResendOtp: () => void;
  isLoading: boolean;
  error: string | null;
}

export default function OtpVerificationForm({
  phoneNumber,
  countryCode,
  onOtpSubmit,
  onResendOtp,
  isLoading,
  error,
}: OtpVerificationFormProps) {
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    setCanResend(false);
    setResendTimer(30);

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpVerification = () => {
    onOtpSubmit(otp);
  };

  const handleResendOtp = () => {
    if (!canResend) return;

    setOtp('');
    setCanResend(false);
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    onResendOtp();
  };

  return (
    <div className='space-y-4 '>
      <OtpInput
        value={otp}
        onChange={(value) => {
          setOtp(value);
          if (value.length === 6) {
            onOtpSubmit(value);
          }
        }}
        numInputs={6}
        inputType='tel'
        renderInput={(props) => <input {...props} />}
        containerStyle={
          'w-full flex items-center justify-center gap-2 md:gap-4 '
        }
        inputStyle={`border w-[42px]! md:w-[48px]! h-[56px] rounded-lg bg-white dark:bg-[var(--grey8)] dark:outline-none  ${
          error
            ? 'border-accent-red-500 dark:border-[var(--accent-red-500)]'
            : 'border-primary-100 dark:border-[var(--dawnpink)]'
        }`}
      />

      {error && (
        <p className='text-xs text-center sm:text-left text-accent-red-500 dark:text-[var(--accent-red-500)] -mt-2 flex justify-center'>
          {error}
        </p>
      )}

      <div className='flex items-center justify-center  gap-2 text-xs  dark:text-white'>
        Haven't received OTP?
        <Button
          variant='link'
          className='p-0 text-accent-red-900 dark:text-[var(--accent-text)]'
          onClick={handleResendOtp}
          disabled={!canResend || isLoading}
        >
          {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
        </Button>
      </div>

      <Button
        onClick={handleOtpVerification}
        className='w-full h-12 bg-accent-red-900 hover:bg-accent-red-950 rounded-full font-medium disabled:bg-secondary-600 dark:disabled:bg-[var(--color-secondary-600)] cursor-not-allowed dark:bg-[var(--accent-text)] dark:text-white '
        disabled={otp.length !== 6 || isLoading}
      >
        {isLoading ? <Spinner /> : 'Verify OTP'}
      </Button>
    </div>
  );
}
