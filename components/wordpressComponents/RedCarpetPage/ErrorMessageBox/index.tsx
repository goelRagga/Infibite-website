import React from 'react';
import { RED_CARPET_PAGE_CONTENT } from '@/lib/constants';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageBoxProps {
  message?: string;
}

const ErrorMessageBox: React.FC<ErrorMessageBoxProps> = ({ message }) => {
  return (
    <div className='pt-10 md:pt-15 pb-4 px-5 sm:max-w-4xl mx-auto'>
      <div className='bg-foreground/10 border border-red-500/30 rounded-2xl p-6 md:p-8 text-center'>
        <AlertCircle className='text-accent-red-900 dark:text-accent-yellow-950 w-12 h-12 mx-auto mb-4' />
        <h2 className='text-white text-xl md:text-2xl font-serif mb-4'>
          {RED_CARPET_PAGE_CONTENT?.errorMessage?.title}
        </h2>
        <p className='text-white/80 text-sm md:text-base mb-6'>{message}</p>
        <p className='text-white/60 text-xs md:text-sm'>
          {RED_CARPET_PAGE_CONTENT?.errorMessage?.content}
        </p>
      </div>
    </div>
  );
};

export default ErrorMessageBox;
