'use client';

import { memo } from 'react';
import { trackEvent } from '@/lib/mixpanel';
import { MessagesSquare } from 'lucide-react';

interface FloatingChatButtonProps {
  onClick: () => void;
  events?: any;
}

// Optimized animation variants
// const flashVariants = {
//   animate: {
//     x: ['-100%', '100%'],
//     y: ['-100%', '100%'],
//   },
//   transition: {
//     duration: 1,
//     repeat: Infinity,
//     repeatDelay: 3,
//     ease: [0.4, 0, 0.2, 1] as const,
//   },
// };

const FloatingChatButton: React.FC<FloatingChatButtonProps> = memo(
  ({ onClick, events }) => {
    return (
      <div
        className='fixed sm:bottom-12 bottom-38 sm:right-8 right-[24px] z-1 flex items-center'
        // initial={{ opacity: 0, scale: 1, y: 290 }}
        // animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={() => {
          onClick();
          trackEvent('ai_bot_clicked', events);
        }}
        // transition={{
        //   duration: 0.8,
        //   ease: 'easeOut',
        //   delay: 1,
        // }}
      >
        {/* Optimized Bot Image with Flash Effects */}
        <div className='relative z-50 border border-primary-100 bg-white flex item-center rounded-full shadow-md cursor-pointer h-12 w-12 sm:h-16 sm:w-16 overflow-hidden'>
          {/* Solid red flash behind */}
          {/* <motion.div
            className='absolute h-[50px] w-[100px] -rotate-45'
            animate={flashVariants.animate}
            transition={flashVariants.transition}
            style={{ background: '#800020' }}
          /> */}

          {/* White circle with gradient flash */}
          {/* <div className='absolute h-[90%] w-[90%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full overflow-hidden'>
            <motion.div
              className='absolute inset-0'
              animate={flashVariants.animate}
              transition={flashVariants.transition}
              style={{
                background:
                  'linear-gradient(135deg, transparent 0%, #fef2f2 50%, transparent 100%)',
              }}
            />
          </div> */}

          <MessagesSquare className='m-auto text-accent-red-900 scale-100 sm:scale-130' />
        </div>

        {/* Floating excitement bubbles */}
        {/* <motion.div
          className='absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full opacity-60'
          animate={{
            y: [0, -20, 0],
            opacity: [0.6, 0, 0.6],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeOut',
            delay: 0.5,
          }}
        />
        <motion.div
          className='absolute -top-4 -right-1 w-2 h-2 bg-blue-400 rounded-full opacity-60'
          animate={{
            y: [0, -15, 0],
            opacity: [0.6, 0, 0.6],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeOut',
            delay: 1.2,
          }}
        />
        <motion.div
          className='absolute -top-1 -right-4 w-2 h-2 bg-purple-400 rounded-full opacity-60'
          animate={{
            y: [0, -18, 0],
            opacity: [0.6, 0, 0.6],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeOut',
            delay: 0.8,
          }}
        /> */}
      </div>
    );
  }
);

FloatingChatButton.displayName = 'FloatingChatButton';

export default FloatingChatButton;
