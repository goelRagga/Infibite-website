# Service Worker Implementation Guide

This guide explains how to use the Service Worker implementation for caching
static assets and improving performance.

## 🚀 Features

- **Static Asset Caching**: Automatically caches JS, CSS, images, fonts, and
  other static files
- **CDN Caching**: Caches content from your CloudFront CDN domains
- **Offline Support**: Provides offline functionality with fallback pages

## 📁 Files Structure

```
public/
├── sw.js                    # Service Worker file
└── offline/                 # Offline page

lib/
└── serviceWorker.ts         # Service Worker manager utility

hooks/
└── useServiceWorker.ts      # React hook for service worker

components/common/
└── ServiceWorkerRegistration/
    └── index.tsx           # React component for SW registration

app/
└── offline/
    └── page.tsx            # Offline page component
```

## 🔧 Installation

### 1. Service Worker Registration

Add the ServiceWorkerRegistration component to your root layout:

```tsx
// app/layout.tsx
import ServiceWorkerRegistration from '@/components/common/ServiceWorkerRegistration';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ServiceWorkerRegistration
          showUpdateNotification={true}
          autoUpdate={false}
        />
      </body>
    </html>
  );
}
```

### 2. Using the Hook

```tsx
import { useServiceWorker } from '@/hooks/useServiceWorker';

function MyComponent() {
  const {
    isSupported,
    isActive,
    hasUpdate,
    updateServiceWorker,
    cacheUrls,
    clearCaches,
  } = useServiceWorker();

  // Cache specific URLs
  const handleCacheUrls = async () => {
    await cacheUrls([
      '/api/data',
      '/images/hero.jpg',
      '/styles/main.css'
    ]);
  };

  return (
    <div>
      <p>Service Worker: {isActive ? 'Active' : 'Inactive'}</p>
      {hasUpdate && (
        <button onClick={updateServiceWorker}>
          Update Available
        </button>
      )}
    </div>
  );
}
```

## ⚙️ Configuration

### Cache Configuration

Edit `public/sw.js` to customize caching behavior:

```javascript
// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
];

// File extensions to cache
const CACHEABLE_EXTENSIONS = [
  '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg',
  '.webp', '.avif', '.woff', '.woff2', '.ttf', '.eot',
  '.ico', '.json', '.xml',
];

// Domains to cache (your CDN domains)
const CACHEABLE_DOMAINS = [
  'd4b28jbnqso5g.cloudfront.net',
  'd31za8na64dkj7.cloudfront.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];
```

### Next.js Configuration

The service worker is already configured in `next.config.mjs`:

```javascript
{
  source: '/sw.js',
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, max-age=0, must-revalidate',
    },
    {
      key: 'Service-Worker-Allowed',
      value: '/',
    },
  ],
}
```

## 🎯 Usage Examples

### 1. Cache Management

```tsx
import serviceWorkerManager from '@/lib/serviceWorker';

// Cache specific URLs
await serviceWorkerManager.cacheUrls([
  '/api/user-profile',
  '/images/logo.png',
  '/styles/theme.css'
]);

// Clear all caches
await serviceWorkerManager.clearCaches();

// Get cache statistics
const stats = await serviceWorkerManager.getCacheStats();
console.log('Cache stats:', stats);
```

### 2. Update Handling

```tsx
import { useServiceWorker } from '@/hooks/useServiceWorker';

function UpdateNotification() {
  const { hasUpdate, updateServiceWorker } = useServiceWorker();

  if (hasUpdate) {
    return (
      <div className="update-notification">
        <p>New version available!</p>
        <button onClick={updateServiceWorker}>
          Update Now
        </button>
      </div>
    );
  }

  return null;
}
```

### 3. Offline Detection

```tsx
import { useEffect, useState } from 'react';

function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return <div className="offline-indicator">You're offline</div>;
  }

  return null;
}
```

## 🔍 Debugging

### Development Debug Panel

In development mode, a debug panel will appear in the top-right corner showing:

- Service Worker status
- Installation progress
- Update availability
- Cache statistics

### Console Logs

The service worker logs important events to the console:

- Installation progress
- Cache operations
- Update notifications
- Error handling

### Chrome DevTools

1. Open Chrome DevTools
2. Go to Application tab
3. Click on Service Workers
4. View registration status and cache storage

## 📊 Performance Benefits

- **Faster Loading**: Cached assets load instantly
- **Reduced Bandwidth**: Fewer network requests
- **Offline Functionality**: App works without internet
- **Better UX**: Smooth updates and notifications

## 🚨 Important Notes

1. **HTTPS Required**: Service Workers only work over HTTPS (except localhost)
2. **Cache Invalidation**: Update cache names when deploying new versions
3. **Storage Limits**: Be mindful of browser storage limits
4. **Testing**: Test offline functionality thoroughly

## 🔄 Updating the Service Worker

When you update the service worker:

1. Change the cache version in `sw.js`:

   ```javascript
   const CACHE_NAME = 'elivaas-cache-v2'; // Increment version
   ```

2. Deploy the new version
3. Users will automatically receive update notifications
4. Old caches will be cleaned up automatically

## 🛠️ Troubleshooting

### Service Worker Not Registering

- Check if HTTPS is enabled
- Verify the service worker file is accessible at `/sw.js`
- Check browser console for errors

### Caching Not Working

- Verify cache names are correct
- Check if files are being served with correct headers
- Ensure URLs are accessible

### Update Notifications Not Showing

- Check if the ServiceWorkerRegistration component is mounted
- Verify the service worker is active
- Check browser console for errors

## 📚 Additional Resources

- [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web.dev Service Worker Guide](https://web.dev/service-worker-lifecycle/)
- [Next.js PWA Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/pwa)
