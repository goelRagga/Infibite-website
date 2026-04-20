'use client';
import Google from '@/assets/Google.svg';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/mixpanel';
import { useAuth0 } from '@auth0/auth0-react';

interface GoogleLoginFormProps {
  onGoogleLoginClick: () => void;
  isLoading: boolean;
  error: string | null;
}

export default function GoogleLoginForm({
  onGoogleLoginClick,
  isLoading,
  error,
}: GoogleLoginFormProps) {
  const handleGoogleLogin = () => {
    trackEvent('google_login_clicked');
    onGoogleLoginClick();
  };

  return (
    <>
      <div className='flex items-center gap-4 py-2'>
        <div className='flex-grow border-t border-gray-300' />
        <p className='text-xs text-gray-500 tracking-wider whitespace-nowrap dark:text-white'>
          OTHER LOGIN OPTIONS
        </p>
        <div className='flex-grow border-t border-gray-300' />
      </div>

      <div className='space-y-3'>
        <Button
          onClick={handleGoogleLogin}
          variant='outline'
          className='w-full h-12 flex items-center justify-center gap-3 rounded-full border-gray-200 hover:bg-gray-50 dark:border-primary-400 dark:bg-[var(--grey8)] dark:hover:bg-[var(--grey8)]'
          disabled={isLoading}
        >
          <span className='h-12 flex items-center justify-center'>
            <Google className='h-12 w-12' />
          </span>
          <span className='text-gray-700 dark:text-white'>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </span>
        </Button>
        {error && (
          <p className='text-xs text-accent-red-500 font-medium text-center mt-2'>
            {error}
          </p>
        )}
      </div>
    </>
  );
}
