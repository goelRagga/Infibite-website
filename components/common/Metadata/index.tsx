// components/Meta.tsx
import type { Metadata } from 'next';

interface MetaProps extends Metadata {
  title: string;
  description?: string;
  keywords?: string;
  author?: string;
}

const Metadata: React.FC<MetaProps> = ({
  title,
  description,
  keywords,
  author,
}) => {
  return (
    <>
      <title>{title}</title>
      <meta
        name='description'
        content={
          description
            ? description
            : 'Luxury Villa Vacation Rental: Premium Holiday Homes & Weekend Getaways'
        }
      />
      <meta
        name='keywords'
        // content={keywords ? keywords : 'Luxury Villa, Luxury Villa in india'}
      />

      <meta name='author' content={author ? author : 'ELIVAAS'} />
      <meta property='og:title' content={title} />
      <meta property='og:site_name' content='www.elivaas.com' />
      <meta property='og:url' content='' />
      <meta property='og:description' content={description} />
      <meta property='og:type' content='website' />
      <meta property='og:image' content=''></meta>

      <meta
        name='robots'
        content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      />
      <meta name='theme-color' content='#fff' />
      <link
        rel='icon'
        type='image/png'
        href='https://www.elivaas.com/assets/images/icons/png/favicon.png'
      ></link>
      <link
        rel='alternate icon'
        className='js-site-favicon'
        type='image/png'
        href='https://www.elivaas.com/assets/images/icons/png/favicon.png'
      />
      <link
        rel='mask-icon'
        href='https://www.elivaas.com/assets/images/icons/png/favicon.svg'
        color='#000000'
      />
      <link
        rel='icon'
        sizes='any'
        type='image/svg+xml'
        href='https://www.elivaas.com/assets/images/icons/png/favicon.svg'
      />
      <link rel='apple-touch-icon' type='image/png' />

      {/* Add other dynamic meta tags here */}
    </>
  );
};

export default Metadata;
