import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Spinner({
  className = '',
  size = 'default',
}: {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
}

export function FullScreenLoader({ message = '' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}

export function InlineLoader({
  message = 'Loading...',
  className = '',
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Spinner size="sm" />
      <span className="text-sm text-gray-600">{message}</span>
    </div>
  );
}
