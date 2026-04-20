import CustomImage from '@/components/common/CustomImage';
import StatCard from '@/components/common/StatCard';
import { Button } from '@/components/ui';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import useIsMobile from '@/hooks/useIsMobile';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { PartnerSectionProps } from 'partner-section';
import { useRef } from 'react';

const PartnerSection: React.FC<PartnerSectionProps> = ({
  partnerSectionData: {
    sectionTitle,
    description,
    cta,
    ctaLink,
    imageSrc,
    imageSrcMobile,
    sectionHeading,
    imageAlt,
    totalStays,
    occupancy,
    earnings,
    isPetFriendlyPage = false,
  },
  verticalPosition,
}) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const isMobile = useIsMobile();

  const { ref: imageRef, isIntersecting: isImageVisible } =
    useIntersectionObserver({
      threshold: 0.1,
      rootMargin: '100px',
      triggerOnce: true,
    });

  // In-view animation for content section
  const isContentInView = useInView(contentRef, {
    once: true,
    margin: '-100px',
  });
  // Parallax scroll effect for stat cards
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Enhanced parallax scroll effects with movement and scale
  const totalStaysY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const totalStaysScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 1.05, 1]
  );

  const occupancyY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const occupancyScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 1.1, 1]
  );

  const earningsY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const earningsScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 1.03, 1]
  );

  const statCardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <div
      className={`w-full mx-auto pt-13 pl-9 pr-9 pb-13 xl:pt-9 xl:pb-9 xl:pl-16 xl:pr-0 xl:py-8 flex flex-col-reverse overflow-hidden 
      ${verticalPosition && `vertical-position-${verticalPosition}`} xl:flex-row xl:rounded-3xl items-center gap-8 xl:border xl:border-primary-100`}
      style={{ background: 'var(--backgroundGradient1)' }}
    >
      <motion.div
        ref={contentRef}
        className='w-full xl:w-1/2 xl:text-left text-center'
        initial={{ opacity: 0, y: 50 }}
        animate={isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 0.2,
        }}
      >
        <motion.h5
          className='text-sm md:text-base font-semibold md:mb-8 mb-4 text-foreground'
          initial={{ opacity: 0, y: 30 }}
          animate={
            isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {sectionTitle}
        </motion.h5>
        <div className='w-[100%] xl:w-[70%]'>
          <motion.h2
            className='text-2xl md:text-4xl font-serif text-foreground mb-6'
            initial={{ opacity: 0, y: 40 }}
            animate={
              isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {sectionHeading}
          </motion.h2>
          <motion.p
            className='text-xs md:text-base mb-6 md:mb-8'
            initial={{ opacity: 0, y: 30 }}
            animate={
              isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {description}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={
            isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            ref={ref}
            asChild
            className='bg-foreground text-white px-6 py-3 rounded-full h-[52px]'
          >
            <Link href={ctaLink || '/explore/partner'}>{cta}</Link>
          </Button>
        </motion.div>
      </motion.div>

      <div className='w-full md:w-1/2 relative flex justify-center'>
        <div
          ref={(node) => {
            (
              containerRef as React.MutableRefObject<HTMLDivElement | null>
            ).current = node;
            (
              imageRef as React.MutableRefObject<HTMLDivElement | null>
            ).current = node;
          }}
          className='relative md:w-[450px] w-full md:h-[440px] h-[260px]'
        >
          {isImageVisible ? (
            <CustomImage
              src={imageSrc || ''}
              srcMobile={imageSrcMobile}
              alt={imageAlt}
              width={isMobile ? 600 : 900}
              height={isMobile ? 600 : 900}
              className='rounded-3xl shadow-lg md:h-[450px] h-[260px] md:w-full w-full md:object-none object-cover'
              quality={40}
            />
          ) : (
            <div className='rounded-3xl bg-gray-200 animate-pulse md:h-[450px] h-[260px] w-full' />
          )}
          <motion.div
            className='absolute md:top-20 top-15 md:left-[40px] -left-6 md:-translate-x-full'
            variants={statCardVariants}
            initial='visible'
            transition={{ delay: 0.2 }}
            style={{
              y: totalStaysY,
              scale: totalStaysScale,
            }}
          >
            <StatCard stat={totalStays} />
          </motion.div>
          <motion.div
            className='absolute top-40 md:top-50 -right-5 md:-right-20'
            variants={statCardVariants}
            initial='visible'
            transition={{ delay: 0.4 }}
            style={{
              y: occupancyY,
              scale: occupancyScale,
            }}
          >
            <StatCard stat={occupancy} />
          </motion.div>
          <motion.div
            className='absolute bottom-2 md:bottom-10 md:left-24 -left-6 md:-translate-x-full'
            variants={statCardVariants}
            initial='visible'
            transition={{ delay: 0.6 }}
            style={{
              y: earningsY,
              scale: earningsScale,
            }}
          >
            <StatCard stat={earnings} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PartnerSection;
