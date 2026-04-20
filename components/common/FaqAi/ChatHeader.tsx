'use client';

import { ChevronDown } from 'lucide-react';
import SparklesSvg from '@/assets/Sparkles.svg';
interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
  return (
    <div className='flex items-center justify-between rounded-t-3xl -mt-6 mb-2 bg-[#fbf7f6] px-4 sm:px-4 py-2 border-b border-[#efe9e7]'>
      {/* Left: Avatar + Titles */}
      <div className='flex items-center gap-2 sm:gap-3'>
        {/* Avatar with online dot */}
        <div className='relative'>
          <div className='h-10 w-10 sm:h-10 sm:w-10 rounded-full bg-accent-red-900 flex items-center justify-center shadow-inner'>
            {/* Simple sparkle mark */}
            <span className='text-white text-xl sm:text-2xl'>
              {' '}
              <SparklesSvg className='m-auto text-white scale-80 fill-white [&_path]:fill-white' />
            </span>
          </div>
          <span className='absolute -bottom-0 -right-0 h-3 w-3 rounded-full bg-white flex items-center justify-center'>
            <span className='h-2 w-2 rounded-full bg-emerald-500' />
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className='leading-tight'>
          <div className='flex items-center gap-1'>
            <h3 className='text-sm sm:text-md font-semibold text-[#1e1e1e]'>
              Eli
            </h3>
          </div>
          <p className='text-xs text-[#6b6b6b]'>AI Chatbot</p>
        </div>
      </div>

      {/* Right: Chevron Button */}
      <button
        type='button'
        aria-label='Close chat'
        onClick={onClose}
        className='h-10 w-10 sm:h-8 sm:w-8 rounded-full bg-white border border-primary-100 hover:bg-primary-100 flex items-center justify-center transition-colors cursor-pointer'
      >
        <ChevronDown className='h-5 w-5 text-[#2b2b2b]' />
      </button>
    </div>
  );
};

export default ChatHeader;
