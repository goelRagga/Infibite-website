'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Set initial state
    setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full mx-auto p-6'>
        <div className='text-center'>
          {/* Icon */}
          <div className='mb-6'>
            {isOnline ? (
              <Wifi className='h-16 w-16 text-green-500 mx-auto' />
            ) : (
              <WifiOff className='h-16 w-16 text-red-500 mx-auto' />
            )}
          </div>

          {/* Title */}
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            {isOnline ? "You're Back Online!" : "You're Offline"}
          </h1>

          {/* Description */}
          <p className='text-gray-600 mb-6'>
            {isOnline
              ? 'Great! Your connection has been restored. You can now continue browsing.'
              : "It looks like you've lost your internet connection. Don't worry, you can still access cached content."}
          </p>

          {/* Actions */}
          <div className='space-y-3'>
            {isOnline ? (
              <Button
                onClick={() => window.location.reload()}
                className='w-full flex items-center justify-center gap-2'
              >
                <RefreshCw className='h-4 w-4' />
                Refresh Page
              </Button>
            ) : (
              <Button
                onClick={() => window.location.reload()}
                className='w-full flex items-center justify-center gap-2'
                variant='outline'
              >
                <RefreshCw className='h-4 w-4' />
                Try Again
              </Button>
            )}

            <Link href='/'>
              <Button
                variant='outline'
                className='w-full flex items-center justify-center gap-2'
              >
                <Home className='h-4 w-4' />
                Go Home
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className='mt-8 text-xs text-gray-500'>
            <p>
              {isOnline
                ? 'Your cached content will be updated automatically.'
                : 'Some features may not be available while offline.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
