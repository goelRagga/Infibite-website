import type React from 'react';
import {
  Coffee,
  Headphones,
  Beer,
  CalendarCheck,
  ArrowUp,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureItem {
  icon: React.ElementType;
  label: string;
  title: string;
  description: string;
  className?: string;
  labelClassName?: string;
  titleClassName?: string;
  iconClassName?: string;
  descriptionClassName?: string;
}

interface FeatureListProps {
  features: FeatureItem[];
}

export default function FeatureList({ features }: FeatureListProps) {
  return (
    <div className='w-full max-w-md mx-auto bg-white rounded-lg shadow-sm overflow-hidden'>
      {features.map((feature, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0',
            feature.className
          )}
        >
          <div
            className={cn(
              'flex-shrink-0 w-12 h-12 rounded-full bg-primary-maroon flex items-center justify-center',
              feature.iconClassName
            )}
          >
            <feature.icon className='w-6 h-6 text-white' />
          </div>
          <div className='flex flex-col'>
            <span
              className={cn('text-sm text-gray-500', feature.labelClassName)}
            >
              {feature.label}
            </span>
            <h3
              className={cn(
                'text-lg font-bold text-primary-maroon leading-tight',
                feature.titleClassName
              )}
            >
              {feature.title}
            </h3>
            <p
              className={cn(
                'text-sm text-gray-700',
                feature.descriptionClassName
              )}
            >
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
