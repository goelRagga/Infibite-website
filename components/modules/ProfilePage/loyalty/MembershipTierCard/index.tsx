'use client';

import { Check, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import CustomImage from '@/components/common/CustomImage';
import { getTierConfig } from '@/lib/utils';
import { colorClasses, glowColorClasses } from '@/lib/constants';
import Svg from '@/components/common/Shared/Svg';

interface Benefit {
  id: string;
  category: string;
  benefitType: string;
  isRedeemable: boolean;
  maxRedeemPerYear: number;
  metadata?: {
    icon?: string;
  };
}

interface MembershipTierCardProps {
  name: string;
  subtitle: string;
  color: 'blue' | 'silver' | 'gold' | 'diamond';
  benefits?: Benefit[];
  icon?: string;
  className?: string;
  showAllBenefits?: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export default function MembershipTierCard({
  name,
  subtitle,
  color,
  benefits,
  icon,
  className = '',
  showAllBenefits = false,
  showCloseButton = false,
  onClose,
}: MembershipTierCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only animate once
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the card is visible
        rootMargin: '0px 0px -50px 0px', // Start animation slightly before fully in view
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const displayedBenefits = showAllBenefits
    ? benefits
    : showAll
      ? benefits
      : benefits?.slice(0, 3);
  const tierData = getTierConfig(color);

  return (
    <>
      <style jsx>{`
        @keyframes cardEntrance {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        
        @keyframes glowMove1 {
          0% { 
            transform: translateX(-50%) translateY(0px) translateX(-10px) scale(1);
          }
          25% { 
            transform: translateX(-50%) translateY(-12px) translateX(5px) scale(1.1);
          }
          50% { 
            transform: translateX(-50%) translateY(-8px) translateX(-5px) scale(1.05);
          }
          75% { 
            transform: translateX(-50%) translateY(6px) translateX(8px) scale(0.95);
          }
          100% { 
            transform: translateX(-50%) translateY(0px) translateX(-10px) scale(1);
          }
        }
        
        @keyframes glowMove2 {
          0% { 
            transform: translateX(-50%) translateY(0px) translateX(8px) scale(1);
          }
          25% { 
            transform: translateX(-50%) translateY(10px) translateX(-6px) scale(0.9);
          }
          50% { 
            transform: translateX(-50%) translateY(6px) translateX(4px) scale(1.08);
          }
          75% { 
            transform: translateX(-50%) translateY(-8px) translateX(-3px) scale(0.92);
          }
          100% { 
            transform: translateX(-50%) translateY(0px) translateX(8px) scale(1);
          }
        }
        
        @keyframes glowBrightness1 {
          0% { 
            opacity: 0.6;
            filter: brightness(1.0) blur(60px);
          }
          25% { 
            opacity: 0.95;
            filter: brightness(1.8) blur(60px);
          }
          50% { 
            opacity: 0.8;
            filter: brightness(1.4) blur(60px);
          }
          75% { 
            opacity: 0.9;
            filter: brightness(1.6) blur(60px);
          }
          100% { 
            opacity: 0.6;
            filter: brightness(1.0) blur(60px);
          }
        }
        
        @keyframes glowBrightness2 {
          0% { 
            opacity: 0.5;
            filter: brightness(0.9) blur(60px);
          }
          25% { 
            opacity: 0.9;
            filter: brightness(1.8) blur(60px);
          }
          50% { 
            opacity: 0.7;
            filter: brightness(1.3) blur(60px);
          }
          75% { 
            opacity: 0.95;
            filter: brightness(1.5) blur(60px);
          }
          100% { 
            opacity: 0.5;
            filter: brightness(0.9) blur(60px);
          }
        }
      `}</style>

      <div
        ref={cardRef}
        className={`relative rounded-[20px] overflow-hidden p-[1px] ${className} ${
          isVisible && !isMobile
            ? 'animate-card-entrance'
            : isMobile
              ? 'opacity-100'
              : 'opacity-0'
        }`}
        style={{
          background: glowColorClasses[color].borderGradient,
          boxShadow: isMobile ? glowColorClasses[color].boxShadow : 'none',
          padding: isMobile ? '2px' : '2.5px',
        }}
      >
        {/* Glow Overlay for Soft Radiance */}
        <div
          className='absolute inset-0 rounded-[20px] blur-[25px] opacity-60'
          style={{
            background: glowColorClasses[color].borderGradient,
            zIndex: 0,
          }}
        ></div>

        {/* Inner Card */}
        <div
          className={`relative z-10 bg-[var(--prive4)] h-full ${glowColorClasses[color].className} flex flex-col rounded-[18px] p-4 md:p-6`}
          style={{
            minHeight: isMobile ? '270px' : '250px',
          }}
        >
          {/* Close Button */}
          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              className='absolute top-4 right-4 z-[9999] text-white hover:opacity-70 transition-opacity cursor-pointer outline-none focus:outline-none focus:ring-0'
              aria-label='Close'
              style={{ zIndex: 9999 }}
            >
              <X className='w-5 h-5 md:w-6 md:h-6' strokeWidth={1} />
            </button>
          )}
          {/* Glow effects */}
          <div
            className={`absolute w-96 h-6 rounded-full blur-[60px] rotate-90 mt-28 left-1/2 -translate-x-1/2`}
            style={{
              background: glowColorClasses[color].borderGradient,
              zIndex: 0,
              animation:
                isVisible && !isMobile
                  ? 'glowMove1 6s ease-in-out infinite, glowBrightness1 4s ease-in-out infinite'
                  : 'none',
            }}
          />
          <div
            className={`absolute w-84 h-4 rounded-full blur-[60px] top-0 left-1/2 -translate-x-1/2`}
            style={{
              animation:
                isVisible && !isMobile
                  ? 'glowMove2 7s ease-in-out infinite, glowBrightness2 5s ease-in-out infinite'
                  : 'none',
            }}
          />

          {/* Header */}
          <div
            className={`flex items-center justify-between mb-3 md:mb-6 relative z-10 mt-2 md:mt-0 ${showCloseButton ? 'pr-10 md:pr-12' : ''}`}
            style={{
              animation: isVisible
                ? `cardEntrance 0.3s ease-out ${isMobile ? '0.1s' : '0.15s'} both`
                : 'none',
            }}
          >
            {/* Left Content */}
            <div className='flex-1 pr-0'>
              <h3
                className='text-xl font-serif md:text-2xl text-left tracking-[0.6px] mb-0.5 bg-clip-text text-transparent'
                style={{
                  backgroundImage: `linear-gradient(270deg, ${tierData?.textGradient?.from}, ${tierData?.textGradient?.to})`,
                }}
              >
                {name} Member
              </h3>
              <p className='text-[10px] md:text-xs text-[var(--white8)] md:mt-2 mt-1 text-left'>
                {subtitle}
              </p>
            </div>

            {/* Right Icon */}
            {icon && (
              <div className='flex-shrink-0 flex justify-end'>
                <Svg
                  src={icon}
                  className='w-12 md:w-16 h-12 md:h-16 object-contain'
                />
              </div>
            )}
          </div>

          {/* Benefits */}
          <div
            className='space-y-4 relative z-10 flex-1 flex flex-col mt-3'
            style={{
              animation: isVisible
                ? `cardEntrance 0.3s ease-out ${isMobile ? '0.2s' : '0.25s'} both`
                : 'none',
            }}
          >
            {Array.isArray(benefits) && benefits.length > 0 ? (
              <>
                {displayedBenefits?.map((benefit, index) => {
                  const benefitText =
                    typeof benefit === 'string' ? benefit : benefit?.category;
                  const benefitIcon =
                    typeof benefit === 'object' && benefit?.metadata?.icon
                      ? benefit?.metadata?.icon
                      : null;

                  return (
                    <div
                      key={typeof benefit === 'string' ? index : benefit?.id}
                      className='flex md:items-center items-start gap-3'
                    >
                      <div
                        className='flex-shrink-0 w-[13px] h-[13px] rounded-full flex items-center justify-center mt-1 overflow-hidden'
                        style={{
                          background: colorClasses[color],
                        }}
                      >
                        <Check className='w-[8px] h-[8px] text-black flex-shrink-0' />
                      </div>

                      <p className='text-xs leading-relaxed text-white md:text-[var(--prive8)] font-normal'>
                        {benefitText}
                      </p>
                      {benefitIcon && (
                        <CustomImage
                          quality={99}
                          src={benefitIcon}
                          className='w-4 h-4'
                          width={4}
                          height={4}
                          alt={benefitText}
                        />
                      )}
                    </div>
                  );
                })}
                {benefits.length > 3 && !showAllBenefits && (
                  <div className='text-center mt-3'>
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className='text-white cursor-pointer text-xs underline underline-offset-4 hover:text-gray-300 transition-colors'
                    >
                      {showAll ? 'Show Less' : 'Read More'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className='text-xs leading-relaxed text-[var(--white7)]'>
                {'No benefits available for this tier.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
