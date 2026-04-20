const STATIC_CACHE_NAME = 'elivaas-static-v1';
const DYNAMIC_CACHE_NAME = 'elivaas-dynamic-v1';

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
  '.js',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.webp',
  '.avif',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.ico',
  '.json',
  '.xml',
];

// Domains to cache (your CDN domains)
const CACHEABLE_DOMAINS = [
  'd4b28jbnqso5g.cloudfront.net',
  'd31za8na64dkj7.cloudfront.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Error caching static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME
            ) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isAPIRequest(url)) {
    event.respondWith(handleAPIRequest(request));
  } else {
    event.respondWith(handlePageRequest(request));
  }
});

// Check if request is for a static asset
function isStaticAsset(url) {
  return (
    STATIC_ASSETS.includes(url.pathname) ||
    CACHEABLE_EXTENSIONS.some((ext) => url.pathname.endsWith(ext))
  );
}

// Check if request is for an image
function isImageRequest(request) {
  const url = new URL(request.url);
  const isImage = /\.(png|jpg|jpeg|gif|svg|webp|avif|ico)$/i.test(url.pathname);
  const isFromCDN = CACHEABLE_DOMAINS.some((domain) =>
    url.hostname.includes(domain)
  );
  return isImage || isFromCDN;
}

// Check if request is for API
function isAPIRequest(url) {
  return (
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('graphql') ||
    url.pathname.includes('graphql')
  );
}

// Handle static assets (JS, CSS, fonts, etc.)
async function handleStaticAsset(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fetch from network
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Error handling static asset:', error);
    // Return offline page for critical assets
    if (request.url.includes('.js') || request.url.includes('.css')) {
      return caches.match('/offline');
    }
    throw error;
  }
}

// Handle image requests
async function handleImageRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fetch from network
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Error handling image request:', error);
    // Return a placeholder image or fallback
    return new Response('', {
      status: 404,
      statusText: 'Image not found',
    });
  }
}

// Handle API requests
async function handleAPIRequest(request) {
  try {
    // For API requests, always try network first
    const networkResponse = await fetch(request);

    // Cache successful responses for a short time
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Error handling API request:', error);
    // Try to return cached response if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Handle page requests
async function handlePageRequest(request) {
  try {
    // Try network first for pages
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Error handling page request:', error);

    // Try to return cached response
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page
    return caches.match('/offline');
  }
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});
