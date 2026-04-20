'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';

const SuspenseLoader = memo(function SuspenseLoader() {
  return (
    <motion.div
      className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100'
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1], // Custom easing for smoother motion
      }}
    >
      <motion.div
        className='text-center space-y-4 -mt-8'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {/* Loading Text */}
        <motion.div
          className='space-y-2'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            duration: 0.6,
            delay: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <p className='text-sm text-primary-600'>
            Preparing your experience...
          </p>
        </motion.div>

        {/* Loading Dots */}
        <motion.div
          className='flex justify-center space-x-1'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            duration: 0.6,
            delay: 0.6,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className='w-2 h-2 bg-primary-400 rounded-full'
              animate={{
                y: [0, -8, 0],
                scale: [1, 1.2, 1],
              }}
              exit={{
                opacity: 0,
                scale: 0,
                y: -10,
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
});

export default SuspenseLoader;
