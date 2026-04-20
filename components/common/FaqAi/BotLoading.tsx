'use client';

import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface BotLoadingProps {
  label: string;
}

const BotLoading: React.FC<BotLoadingProps> = ({ label }) => {
  return (
    <div className='flex justify-start'>
      <div className='max-w-[80%] min-w-[60%] rounded-lg px-4 py-3 bg-primary-50'>
        <div className='flex items-center space-x-1'>
          <div className='flex space-x-1'>
            <Sparkles className='h-4 w-4 text-accent-red-900 mr-1 scale-92' />
          </div>
          <span className='text-xs text-gray-600'> {label}</span>
          <motion.div
            className='w-2 h-2 bg-accent-red-900 rounded-full'
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className='w-2 h-2 bg-accent-red-900 rounded-full'
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className='w-2 h-2 bg-accent-red-900 rounded-full'
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </div>
  );
};

export default BotLoading;
