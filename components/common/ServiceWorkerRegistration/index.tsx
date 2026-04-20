'use client';

import { useServiceWorker } from '@/hooks/useServiceWorker';
import { Button } from '@/components/ui/button';

interface ServiceWorkerRegistrationProps {
  showDebugPanel?: boolean;
}

export const ServiceWorkerRegistration: React.FC<
  ServiceWorkerRegistrationProps
> = ({ showDebugPanel = false }) => {
  const { isSupported, isActive, clearCaches, getCacheStats } =
    useServiceWorker();

  // Don't render anything if service worker is not supported
  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Debug Panel (only in development) */}
      {process.env.NODE_ENV === 'development' && showDebugPanel && (
        <div className='fixed top-4 right-4 z-50 bg-gray-900 text-white rounded-lg shadow-lg p-4 max-w-xs'>
          <h3 className='text-sm font-semibold mb-2'>Service Worker Debug</h3>
          <div className='text-xs space-y-1'>
            <div>Status: {isActive ? 'Active' : 'Inactive'}</div>
          </div>
          <div className='flex gap-2 mt-3'>
            <Button
              size='sm'
              variant='outline'
              onClick={async () => {
                const stats = await getCacheStats();
              }}
              className='text-xs'
            >
              Cache Stats
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={clearCaches}
              className='text-xs'
            >
              Clear Cache
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceWorkerRegistration;
