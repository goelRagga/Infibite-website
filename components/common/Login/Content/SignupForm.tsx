'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserContext } from '@/contexts/SharedProvider';
import { trackEvent } from '@/lib/mixpanel';
import { USER_SIGNUP } from '@/lib/queries';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useClient } from 'urql';
import PhoneNumberInput from '../../PhoneInputField';

interface SignupFormProps {
  onSignupComplete: (userData: {
    firstName: string;
    lastName: string;
    email: string;
  }) => void;
  onError?: (error: string) => void;
  fetchUserDetails?: (
    accessToken: string,
    refreshToken: string
  ) => Promise<any>;
  handleUrqlError?: (error: any) => void;
  handleHubspotSubmit?: (data: any) => void;
}

interface UserData {
  id: string;
  countryCode?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  firstLoginIntent?: string;
}

export default function SignupForm({
  onSignupComplete,
  onError,
  fetchUserDetails,
  handleUrqlError,
  handleHubspotSubmit,
}: SignupFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const { userData, setUserData } = useUserContext();
  const client = useClient();

  // Get user data from cookies
  const userDetailsString = Cookies.get('userData');
  const userDetails: UserData | null = userDetailsString
    ? JSON.parse(userDetailsString)
    : null;
  const userLoginIntent = userDetails?.firstLoginIntent;

  const handleSignupMutation = async (signupData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  }) => {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    if (!userDetails?.id) throw new Error('User ID not found');

    try {
      setIsSignupLoading(true);

      const result = await client
        .mutation(USER_SIGNUP, {
          id: userDetails.id,
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          ...(signupData.email && { email: signupData.email }),
          ...(signupData.phoneNumber && {
            phone: `${countryCode}${signupData.phoneNumber}`,
          }),
        })
        .toPromise();

      if (result.error) throw result.error;

      const data = result.data;
      const updatedUserData = {
        ...userDetails,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        ...(signupData.phoneNumber && {
          phone: signupData.phoneNumber,
          countryCode: countryCode,
        }),
        ...data?.userSignup,
      };

      Cookies.set('userData', JSON.stringify(updatedUserData), { expires: 30 });
      if (accessToken && fetchUserDetails) {
        try {
          const freshUserData = await fetchUserDetails(
            accessToken,
            refreshToken || ''
          );
          const syncedData = { ...updatedUserData, ...freshUserData };
          Cookies.set('userData', JSON.stringify(syncedData), { expires: 30 });
          setUserData(syncedData);
        } catch {
          console.warn('Could not refresh user details');
        }
      }

      if (handleHubspotSubmit) handleHubspotSubmit(signupData);

      onSignupComplete({
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
      });

      return updatedUserData;
    } catch (error: any) {
      console.error('Signup error:', error);
      const message = error?.message || 'Signup failed. Please try again.';
      if (onError) onError(message);
      else toast.error(message, { duration: 4000, position: 'top-right' });
      throw error;
    } finally {
      setIsSignupLoading(false);
    }
  };

  const handleSignupComplete = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      return;
    }

    const signupData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      ...(phoneNumber.trim() && { phoneNumber: phoneNumber.trim() }),
    };

    try {
      await handleSignupMutation(signupData);
    } catch (error) {
      // Error is already handled in handleSignupMutation
      console.error('Signup process failed:', error);
    }
  };

  const isFormValid = firstName.trim() && lastName.trim() && email.trim();

  useEffect(() => {
    if (!userData) return;

    const { firstName, lastName, email } = userData;

    if (firstName) setFirstName(firstName);
    if (lastName) setLastName(lastName);
    if (email) setEmail(email);
  }, [userData]);

  return (
    <div className='space-y-4'>
      <Input
        type='text'
        placeholder='First Name'
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className='w-full h-14 rounded-lg border-primary-100 bg-gray-50 placeholder:text-gray-400 dark:border-[var(--dawnpink)] dark:placeholder:text-white dark:bg-[var(--grey8)]'
        disabled={isSignupLoading}
      />

      <Input
        type='text'
        placeholder='Last Name'
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className='w-full h-14 rounded-lg border-primary-100 bg-gray-50 placeholder:text-gray-400 dark:border-[var(--dawnpink)] dark:placeholder:text-white dark:bg-[var(--grey8)]'
        disabled={isSignupLoading}
      />

      <Input
        type='email'
        placeholder='Email Address'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='w-full h-14 rounded-lg border-primary-100 bg-gray-50 placeholder:text-gray-400 dark:border-[var(--dawnpink)] dark:placeholder:text-white dark:bg-[var(--grey8)]'
        disabled={isSignupLoading}
      />

      {userLoginIntent === 'email' && (
        <PhoneNumberInput
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          disabled={isSignupLoading}
        />
      )}

      <Button
        onClick={handleSignupComplete}
        className='w-full h-12 bg-accent-red-900 dark:bg-[var(--accent-background)] hover:bg-accent-red-950 rounded-full font-medium disabled:bg-secondary-600 dark:disabled:bg-[var(--accent-text)] dark:text-white'
        disabled={!isFormValid || isSignupLoading}
      >
        {isSignupLoading ? 'Processing...' : 'Continue'}
      </Button>
    </div>
  );
}
