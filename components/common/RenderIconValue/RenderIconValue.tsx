import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  iconColor?: string;
  backgroundColor?: string;
  showDivider?: boolean;
  href?: string;
  rightValue?: {
    value: string | number;
    icon?: LucideIcon;
    iconBgColor?: string;
    iconColor?: string;
  };
  onClick?: () => void;
}

interface RenderIconValueProps {
  items: MenuItem[];
  className?: string;
  showHoverIndicator?: boolean;
  hoverIndicatorColor?: string;
  currentPath?: string;
  activeBackgroundColor?: string;
  activeTextColor?: string;
  activeFontWeight?: string;
}

export const RenderIconValue: React.FC<RenderIconValueProps> = ({
  items,
  className,
  showHoverIndicator = true,
  hoverIndicatorColor = 'bg-blue-500',
  currentPath,
  activeBackgroundColor = 'bg-red-100',
  activeTextColor = 'text-red-600',
  activeFontWeight = 'font-semibold',
}) => {
  return (
    <div
      className={cn(
        'w-full  mx-auto bg-[var(--color-primary-50)]',
        activeBackgroundColor,
        className
      )}
    >
      {items.map((item, index) => {
        const isActive = currentPath && item.href && currentPath === item.href;

        return (
          <div key={item.id}>
            <div
              className={cn(
                'relative flex items-center justify-between py-3 px-4 sm:py-4 sm:px-6 rounded-xl',
                'transition-all duration-200 group',
                item.onClick && 'cursor-pointer active:bg-gray-100',
                isActive
                  ? `${activeBackgroundColor} ${activeTextColor} ${activeFontWeight}`
                  : 'hover:bg-gray-50 text-gray-900'
              )}
              onClick={item.onClick}
            >
              {showHoverIndicator && (
                <div
                  className={cn(
                    'absolute left-0 top-0 bottom-0 w-1 transition-all duration-200',
                    'opacity-0 group-hover:opacity-100 transform scale-y-0 group-hover:scale-y-100',
                    hoverIndicatorColor
                  )}
                />
              )}

              <div className='flex items-center gap-3 sm:gap-4  flex-1'>
                {/* Icon Container */}
                <div
                  className={cn(
                    'w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0',
                    item.backgroundColor || 'bg-stone-400'
                  )}
                >
                  <item.icon
                    className={cn(
                      'w-5 h-5 sm:w-6 sm:h-6',
                      item.iconColor || 'text-white'
                    )}
                  />
                </div>

                {/* Label */}
                <span
                  className={cn(
                    'truncate font-light text-[12px] sm:text-lg font-poppins typography-label-regular',
                    isActive ? activeTextColor : 'text-gray-700'
                  )}
                >
                  {item.label}
                </span>
              </div>

              {/* Right side - Value with optional icon */}
              {item.rightValue && (
                <div className='flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2'>
                  {item.rightValue.icon && (
                    <div
                      className={cn(
                        'w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center',
                        item.rightValue.iconBgColor || 'bg-orange-400'
                      )}
                    >
                      <item.rightValue.icon
                        className={cn(
                          'w-3 h-3 sm:w-4 sm:h-4',
                          item.rightValue.iconColor || 'text-white'
                        )}
                      />
                    </div>
                  )}
                  <span
                    className={cn(
                      'font-semibold',
                      'text-base sm:text-lg',
                      isActive ? activeTextColor : 'text-gray-900'
                    )}
                  >
                    {typeof item.rightValue.value === 'number'
                      ? item.rightValue.value.toLocaleString()
                      : item.rightValue.value}
                  </span>
                </div>
              )}
            </div>

            {/* Divider */}
            {item.showDivider && index < items.length - 1 && (
              <div className='border-b border-gray-200 mx-4 sm:mx-6' />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RenderIconValue;
