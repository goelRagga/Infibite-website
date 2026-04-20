'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Villa city page error:', error);
  }, [error]);

  return (
    <div className='min-h-screen bg-background flex items-center justify-center'>
      <div className='text-center space-y-6 px-5'>
        <div className='space-y-2'>
          <h1 className='text-2xl font-bold text-foreground'>
            Something went wrong!
          </h1>
          <p className='text-muted-foreground max-w-md'>
            We're having trouble loading the villa listings. Please try again or
            contact support if the problem persists.
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Button onClick={reset} variant='default'>
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant='outline'
          >
            Go to homepage
          </Button>
        </div>
      </div>
    </div>
  );
}
