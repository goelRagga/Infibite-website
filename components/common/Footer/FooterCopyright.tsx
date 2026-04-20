import { FOOTER_DATA } from '@/lib/constants';
import Link from 'next/link';

const FooterCopyright = ({ center = false }: { center?: boolean }) => {
  return (
    <div
      className={`text-xs text-gray-400 ${
        center
          ? 'text-center space-y-4 mt-8'
          : 'mt-8 md:mt-16 pt-4  flex flex-col md:flex-row justify-end gap-6'
      }`}
    >
      <div>{FOOTER_DATA.copyright.text}</div>
      <div
        className={`flex ${center ? 'justify-center space-x-6' : 'space-x-6'}`}
      >
        {FOOTER_DATA.copyright.links.map((link, index) => (
          <Link
            key={`copyright-${index}`}
            href={link.url}
            className='text-xs text-gray-400'
          >
            {link.text}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FooterCopyright;
