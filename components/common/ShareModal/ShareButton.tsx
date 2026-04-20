'use client';

import { Share } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  onClick: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  onClick,
  className,
  variant = 'outline',
  size = 'default',
  icon = <Share size={16} />,
  children = 'Share',
  disabled = false,
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'border shadow-none cursor-pointer rounded-md px-4 py-2 text-[#5A3A2E] border-[var(--color-disabled)] bg-[var(--white3)] hover:bg-[var(--white3)] dark:text-[var(--accent-text)] dark:border-[var(--accent-text)] dark:bg-background ',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {children}
    </Button>
  );
};

export default ShareButton;
