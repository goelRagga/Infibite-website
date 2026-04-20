import Svg from '@/components/common/Shared/Svg';
import { LoyaltyTierItem } from '@/components/modules/ProfilePage/loyalty/data/type';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/SharedProvider';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import useIsMobile from '@/hooks/useIsMobile';
import {
  blueMemberSvg,
  diamondMemberSvg,
  goldMemberSvg,
  LOYALTY_HOME_PAGE_CONTENT,
  ReservePlusTierMemberSvg,
  silverMemberSvg,
} from '@/lib/constants';
import { motion } from 'framer-motion';
import { LoyaltySectionHomeProps } from 'loyalty-section';
import { useState } from 'react';
import MembershipTierDetailsDialog from './MembershipTierDetailsDialog';

interface ExtendedLoyaltySectionHomeProps extends LoyaltySectionHomeProps {
  loyaltyTiers?: LoyaltyTierItem[];
}

const LoyaltySectionHome: React.FC<ExtendedLoyaltySectionHomeProps> = ({
  isHome = true,
  className,
  verticalPosition,
  loyaltyTiers = [],
}) => {
  const { setLoginOpen } = useAuth();
  const { joinThe, elivaasElite, program, content, ctaName } =
    LOYALTY_HOME_PAGE_CONTENT;

  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '50px',
    triggerOnce: true,
  });
  const isMobile = useIsMobile();
  const [selectedTier, setSelectedTier] = useState<LoyaltyTierItem | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const allTiers = loyaltyTiers as LoyaltyTierItem[];

  const getTierIconMap = () => {
    const iconMap: Record<string, string> = {
      'reserve plus': ReservePlusTierMemberSvg,
      reservePlus: ReservePlusTierMemberSvg,
      diamond: diamondMemberSvg,
      gold: goldMemberSvg,
      silver: silverMemberSvg,
      blue: blueMemberSvg,
    };

    const sortedTiers = [...allTiers].sort((a, b) => b.tier - a.tier);

    return sortedTiers.map((tier) => {
      const tierName =
        tier?.metadata?.membershipTiers?.name?.toLowerCase() || '';
      return {
        tier,
        src: iconMap[tierName] || blueMemberSvg,
        title: tier?.metadata?.membershipTiers?.name || 'Member',
      };
    });
  };

  const tierIconsWithData = getTierIconMap();

  const tierIcons = tierIconsWithData.length
    ? tierIconsWithData
    : [
        {
          tier: null,
          src: ReservePlusTierMemberSvg,
          title: 'Reserve Plus',
        },
        {
          tier: null,
          src: diamondMemberSvg,
          title: 'Diamond',
        },
        {
          tier: null,
          src: goldMemberSvg,
          title: 'Gold',
        },
        {
          tier: null,
          src: silverMemberSvg,
          title: 'Silver',
        },
        {
          tier: null,
          src: blueMemberSvg,
          title: 'Blue',
        },
      ];

  const handleTierClick = (tier: LoyaltyTierItem | null) => {
    if (tier) {
      setSelectedTier(tier);
      setIsDialogOpen(true);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setTimeout(() => setSelectedTier(null), 300);
    }
  };

  return (
    <div
      className={`${verticalPosition && `vertical-position-${verticalPosition}`} ${className ? className : 'px-[30px] py-12'} w-full`}
      ref={ref}
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center'>
        <div className='flex flex-col items-center md:items-start max-w-140'>
          <div
            className='rounded-[20px] rounded-tr-[60px] md:rounded-[18px] md:rounded-tr-[18px] p-[1px] w-full overflow-hidden bg-[linear-gradient(to_right,#D8DDFF_0%,#EDEDED_32.21%,#F5E9CE_68.75%,#E7DBFF_100%)]'
            style={{
              boxShadow: '0px 4px 10px 4px #7C7C7C4D',
            }}
          >
            <div className='rounded-[20px] rounded-tr-[60px] md:rounded-[18px] md:rounded-tr-[18px] overflow-hidden py-8 px-5 md:pt-6 md:pb-10 md:px-6 w-full relative bg-[var(--prive4)]'>
              <h3
                className={`${isHome ? 'text-base md:text-3xl' : 'text-base md:text-3xl'} font-serif mb-8 md:mb-12 font-normal  bg-clip-text text-[var(--white6)] text-center md:text-left md:text-transparent`}
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #D8DDFF 0%, #EDEDED 32.21%, #F5E9CE 68.75%, #E7DBFF 100%)',
                }}
              >
                {isMobile ? joinThe : 'Join'}
                <br />
                <span
                  className={`${isHome ? 'text-lg md:text-3xl' : 'text-lg md:text-3xl'} font-bold tracking-[2px] md:tracking-[3px]`}
                >
                  {elivaasElite}
                </span>
                <br />
                <span className='md:capitalize'>{program}</span>
              </h3>

              {/* Tier Icons */}
              <div className='flex md:justify-end justify-center items-center py-6 px-4 rounded-2xl'>
                {isIntersecting &&
                  tierIcons.map((tierItem, index) => (
                    <div
                      key={tierItem.tier?.id || index}
                      className={`absolute`}
                      style={{
                        right: isMobile
                          ? `${isHome ? index * 50 + 60 : index * 50 + 60}px`
                          : `${isHome ? index * 80 + 24 : index * 65 + 30}px`,
                        zIndex: tierIcons.length - index,
                      }}
                    >
                      <div className='relative rounded-full hover:scale-105 transition-transform duration-300'>
                        <div
                          className={` ${isHome ? 'w-[64px] h-[64px] md:w-[90px] md:h-[90px]' : 'w-[64px] h-[64px] md:w-[78px] md:h-[78px]'} rounded-full bg-[#111] flex items-center justify-center overflow-hidden`}
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.5 }}
                                onClick={() =>
                                  tierItem.tier &&
                                  handleTierClick(tierItem.tier)
                                }
                              >
                                <Svg
                                  src={tierItem.src}
                                  className={`object-contain w-full h-full ${tierItem.tier ? 'cursor-pointer' : 'cursor-default'}`}
                                />
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent className='font-semibold'>
                              {tierItem.title} Member
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {isMobile && (
                <div className='flex flex-col items-center md:items-start text-center md:text-left mt-8'>
                  <p className='text-[var(--prive8)] md:text-secondary-400 tracking-[0.6px] font-normal text-xs md:text-base mb-6 md:mb-8 max-w-md'>
                    {content}
                  </p>

                  <button
                    onClick={() => setLoginOpen(true)}
                    className='bg-[var(--white9)] text-[#2C1F1E] text-xs md:text-sm font-semibold py-0 px-8 rounded-full h-12 md:h-13 cursor-pointer hover:bg-gray-100 transition-colors'
                  >
                    {ctaName}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {!isMobile && (
          <div className='flex flex-col items-center md:items-start text-center md:text-left'>
            <p
              className={`text-secondary-400 font-normal ${isHome ? 'text-sm md:text-base' : 'text-sm md:text-sm'} mb-6 md:mb-8 max-w-xl`}
            >
              {content}
            </p>

            <button
              onClick={() => setLoginOpen(true)}
              className='bg-white text-[#2C1F1E] text-xs md:text-sm font-semibold py-0 px-8 rounded-full h-12 md:h-13 cursor-pointer hover:bg-gray-100 transition-colors'
            >
              {ctaName}
            </button>
          </div>
        )}
      </div>

      <MembershipTierDetailsDialog
        selectedTier={selectedTier}
        isOpen={isDialogOpen}
        onOpenChange={handleDialogChange}
      />
    </div>
  );
};

export default LoyaltySectionHome;
