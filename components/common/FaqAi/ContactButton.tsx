'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContactButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  title: string;
  className?: string;
}

const ContactButton: React.FC<ContactButtonProps> = ({
  icon: Icon,
  onClick,
  title,
  className = '',
}) => {
  return (
    <Button
      onClick={onClick}
      variant='outline'
      className={`h-8 w-8 rounded-full cursor-pointer border-white hover:bg-white transition-colors duration-200 flex items-center justify-center text-white  hover:shadow-md ${className}`}
      title={title}
    >
      <Icon className='h-4 w-4 text-red-900' />
    </Button>
  );
};

export default ContactButton;
