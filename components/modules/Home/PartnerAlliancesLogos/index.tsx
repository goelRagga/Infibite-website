import Svg from '@/components/common/Shared/Svg';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import useIsMobile from '@/hooks/useIsMobile';
import { easeOut, motion } from 'framer-motion';
import { PartnerAlliancesLogosProps } from 'partner-alliances';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const logoVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

const PartnerAlliancesLogos: React.FC<PartnerAlliancesLogosProps> = ({
  data,
  heading,
  verticalPosition,
}) => {
  const isMobile = useIsMobile();
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true,
  });

  return (
    <div
      className={`w-full mx-auto ${verticalPosition && `vertical-position-${verticalPosition}`}`}
    >
      <h5 className='text-center text-lg sm:text-xl mb-10 sm:mb-15'>
        {heading}
      </h5>
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial='hidden'
        animate={isIntersecting ? 'visible' : 'hidden'}
        className='flex flex-wrap justify-center items-center'
      >
        {isIntersecting &&
          data
            ?.filter((logo: any) => logo?.img)
            ?.map((logo: any, index: number) => (
              <motion.div
                key={index}
                variants={logoVariants}
                className='w-1/3 md:w-1/4 lg:w-1/6 gap-1.5 flex justify-center mb-15 md:mb-10'
              >
                <div>
                  <Svg
                    src={logo?.img}
                    title={logo?.alt || 'Partner logo'}
                    width={isMobile ? '74px' : '100px'}
                  />
                </div>
              </motion.div>
            ))}
      </motion.div>
    </div>
  );
};

export default PartnerAlliancesLogos;
