import { useRef } from 'react';

interface ScriptConfig {
  src?: string;
  id: string;
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload';
  async?: boolean;
  defer?: boolean;
  crossOrigin?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const useOptimizedScripts = () => {
  const loadedScripts = useRef<Set<string>>(new Set());

  const loadScript = (config: ScriptConfig) => {
    const {
      src,
      id,
      strategy = 'lazyOnload',
      async = true,
      defer = false,
      crossOrigin,
      onLoad,
      onError,
    } = config;

    // Check if script is already loaded
    if (loadedScripts.current.has(id)) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      // Check if script already exists in DOM
      const existingScript = document.getElementById(id) as HTMLScriptElement;
      if (existingScript) {
        loadedScripts.current.add(id);
        resolve();
        return;
      }

      const script = document.createElement('script');

      if (src) {
        script.src = src;
      }

      script.id = id;
      script.async = async;
      script.defer = defer;

      if (crossOrigin) {
        script.crossOrigin = crossOrigin;
      }

      // Add cache-busting for external scripts with short cache times
      if (
        src &&
        (src.includes('facebook.net') || src.includes('googleapis.com'))
      ) {
        const url = new URL(script.src);
        url.searchParams.set('v', Date.now().toString());
        script.src = url.toString();
      }

      script.onload = () => {
        loadedScripts.current.add(id);
        onLoad?.();
        resolve();
      };

      script.onerror = () => {
        onError?.();
        reject(new Error(`Failed to load script: ${src}`));
      };

      // Load based on strategy
      if (strategy === 'beforeInteractive') {
        document.head.insertBefore(script, document.head.firstChild);
      } else if (strategy === 'afterInteractive') {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            document.head.appendChild(script);
          });
        } else {
          document.head.appendChild(script);
        }
      } else {
        // lazyOnload - load when page is idle
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            document.head.appendChild(script);
          });
        } else {
          // Fallback for browsers without requestIdleCallback
          setTimeout(() => {
            document.head.appendChild(script);
          }, 1000);
        }
      }
    });
  };

  const preloadScript = (src: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = src;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  };

  return { loadScript, preloadScript };
};
