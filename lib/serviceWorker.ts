// Service Worker Registration Utility

interface ServiceWorkerMessage {
  type: string;
  data?: any;
}

class ServiceWorkerManager {
  private registration: globalThis.ServiceWorkerRegistration | null = null;
  private swSupported = 'serviceWorker' in navigator;

  // Register the service worker
  async register(): Promise<globalThis.ServiceWorkerRegistration | null> {
    if (!this.swSupported) {
      console.warn('[SW] Service Worker not supported');
      return null;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none', // Always check for updates
      });

      console.log(
        '[SW] Service Worker registered successfully:',
        this.registration
      );

      // Handle service worker messages
      this.handleMessages();

      return this.registration;
    } catch (error) {
      console.error('[SW] Service Worker registration failed:', error);
      return null;
    }
  }

  // Handle messages from service worker
  private handleMessages(): void {
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, data } = event.data as ServiceWorkerMessage;

      switch (type) {
        case 'CACHE_UPDATED':
          console.log('[SW] Cache updated:', data);
          break;
        case 'OFFLINE_MODE':
          console.log('[SW] Offline mode activated');
          break;
        default:
          console.log('[SW] Received message:', type, data);
      }
    });
  }

  // Send message to service worker
  async sendMessage(message: ServiceWorkerMessage): Promise<void> {
    if (!this.registration?.active) {
      console.warn('[SW] No active service worker');
      return;
    }

    try {
      await this.registration.active.postMessage(message);
    } catch (error) {
      console.error('[SW] Failed to send message:', error);
    }
  }

  // Cache specific URLs
  async cacheUrls(urls: string[]): Promise<void> {
    await this.sendMessage({
      type: 'CACHE_URLS',
      data: { urls },
    });
  }

  // Unregister service worker
  async unregister(): Promise<boolean> {
    if (!this.registration) return false;

    try {
      const result = await this.registration.unregister();
      console.log('[SW] Service Worker unregistered:', result);
      return result;
    } catch (error) {
      console.error('[SW] Failed to unregister service worker:', error);
      return false;
    }
  }

  // Check if service worker is active
  isActive(): boolean {
    return !!this.registration?.active;
  }

  // Get service worker registration
  getRegistration(): globalThis.ServiceWorkerRegistration | null {
    return this.registration;
  }

  // Check if service worker is supported
  isSupported(): boolean {
    return this.swSupported;
  }

  // Clear all caches
  async clearCaches(): Promise<void> {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
      console.log('[SW] All caches cleared');
    } catch (error) {
      console.error('[SW] Failed to clear caches:', error);
    }
  }

  // Get cache statistics
  async getCacheStats(): Promise<Record<string, number>> {
    try {
      const cacheNames = await caches.keys();
      const stats: Record<string, number> = {};

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        stats[cacheName] = keys.length;
      }

      return stats;
    } catch (error) {
      console.error('[SW] Failed to get cache stats:', error);
      return {};
    }
  }
}

// Create singleton instance
const serviceWorkerManager = new ServiceWorkerManager();

export default serviceWorkerManager;

// Export individual functions for convenience
export const {
  register,
  sendMessage,
  cacheUrls,
  unregister,
  isActive,
  getRegistration,
  isSupported,
  clearCaches,
  getCacheStats,
} = serviceWorkerManager;
