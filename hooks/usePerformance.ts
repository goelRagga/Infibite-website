import { useCallback, useEffect, useRef, useState } from 'react';

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;

    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 ${componentName} rendered ${renderCount.current} times`);
    }
  });

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(
        `⚠️ ${componentName} took ${renderTime.toFixed(2)}ms to render (target: <16ms)`
      );
    }

    startTime.current = performance.now();
  });

  return { renderCount: renderCount.current };
};

// Debounced state hook
export const useDebouncedState = <T>(
  initialValue: T,
  delay: number = 300
): [T, T, (value: T) => void] => {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return [value, debouncedValue, setValue];
};

// Memoized callback hook with dependency tracking
export const useMemoizedCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  dependencies: unknown[],
  callbackName?: string
): T => {
  const memoizedCallback = useCallback(callback, dependencies);

  const prevDeps = useRef(dependencies);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const changed = dependencies.some(
        (dep, index) => dep !== prevDeps.current[index]
      );
      if (changed) {
        console.log(`🔄 ${callbackName || 'Callback'} dependencies changed`);
      }
    }
    prevDeps.current = dependencies;
  });

  return memoizedCallback;
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options, hasIntersected]);

  return { elementRef, isIntersecting, hasIntersected };
};

// Virtual scrolling hook
export const useVirtualScroll = (
  itemCount: number,
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    itemCount
  );

  const visibleItems = Array.from(
    { length: endIndex - startIndex },
    (_, index) => startIndex + index
  );

  const totalHeight = itemCount * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop,
  };
};
