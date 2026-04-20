import { SuccessNumbersProps, SuccessNumberItem } from 'success-numbers';
import { SectionTemplate } from '@/components/common/Shared/Section';
import IconCard from '@/components/common/Shared/IconCard';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const SuccessNumbers: React.FC<SuccessNumbersProps> = ({
  data,
  heading,
  description,
  verticalPosition,
  horizontalPosition,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <div ref={ref} className='w-full mx-auto'>
      <SectionTemplate
        textAlign='center'
        heading={heading}
        description={description}
        showDefaultArrows={false}
        verticalPosition={verticalPosition}
      />

      <motion.div
        className='grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-2 md:gap-x-6 md:gap-y-8 xl:grid-cols-4 xl:gap-x-6 xl:gap-y-8 mt-5'
        variants={containerVariants}
        initial='hidden'
        animate={isInView ? 'visible' : 'hidden'}
      >
        {data.map((num: SuccessNumberItem, index: number) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className={`relative overflow-visible bg-primary-50 xl:bg-transparent rounded-3xl p-4 py-5 sm:p-5 h-full ${
              index !== data.length - 1
                ? 'has-border border-secondary-200 xl:after:content-[""] xl:after:absolute xl:after:top-[30%] xl:after:bottom-[50%] xl:after:right-0 xl:after:w-px xl:after:h-20 xl:after:bg-secondary-200 xl:after:translate-x-1/2'
                : ''
            }`}
          >
            <IconCard
              iconUrl={num.icon}
              icon={true}
              countNumbers={num.countingNumbers}
              countFeature={num.countingFeature}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SuccessNumbers;
