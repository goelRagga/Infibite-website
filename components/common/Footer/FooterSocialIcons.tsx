import { FOOTER_DATA } from '@/lib/constants';
import Link from 'next/link';

const FooterSocialIcons = ({ size = 18 }: { size?: number }) => {
  return (
    <div className='flex space-x-3'>
      {FOOTER_DATA.social.platforms.map((platform, index) => {
        const Icon = platform.icon;
        const link = platform.link;
        return (
          <Link
            key={`social-${index}`}
            href={link}
            className='text-xs md:text-sm hover:text-gray-300'
            aria-label={platform.name}
          >
            <Icon size={size} />
          </Link>
        );
      })}
    </div>
  );
};

export default FooterSocialIcons;
