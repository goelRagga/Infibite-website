'use client';

import React from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import SingleBlogPageForm from '../WPForms/SingleBlogPageForm';
import MobileHeader from '@/components/common/MobileHeader';
import SingleLargeCard from './SingleLargeCard';
import BlogList from '@/components/modules/Blog/BlogList';
import SingleBlogModalForm from './SingleBlogModalForm';

interface BlogDetailPageProps {
  post: any;
  postsData: any;
}

const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ post, postsData }) => {
  const isMobile = useIsMobile();

  // Process content to use original images (remove size suffixes)
  const processContent = (content: string) => {
    if (!content) return content;

    const baseDomain = process.env.NEXT_PUBLIC_IMAGE_DOMAIN || '';

    // Process src attributes - remove size suffixes and replace domain
    let processed = content.replace(
      /src="(https?:\/\/[^/]+)?\/explore\/wp-content\/uploads\/(\d{4}\/\d{2}\/[\w-]+?)(-\d+x\d+)?(\.\w+)"/gi,
      (match, protocol, path, sizeSuffix, ext) => {
        // Remove size suffix (e.g., -300x200) to get original image
        const originalPath = path + ext;
        return `src="${baseDomain}/wp-content/uploads/${originalPath}"`;
      }
    );

    // Process srcset attributes - remove size suffixes from all URLs and replace domain
    processed = processed.replace(
      /srcset="([^"]*)"/gi,
      (match, srcsetValue) => {
        // Process each entry in srcset (format: "url1 300w, url2 1024w, ...")
        const processedSrcset = srcsetValue
          .split(',')
          .map((entry: string) => {
            const trimmed = entry.trim();
            // Extract URL and width descriptor (if present)
            const parts = trimmed.split(/\s+/);
            const url = parts[0];
            const descriptor = parts[1] || '';

            // Remove size suffix from URL and replace domain
            const processedUrl = url
              .replace(
                /(https?:\/\/[^/]+)?\/explore\/wp-content\/uploads\//gi,
                `${baseDomain}/wp-content/uploads/`
              )
              .replace(/-\d+x\d+(\.\w+)$/i, '$1');

            return descriptor ? `${processedUrl} ${descriptor}` : processedUrl;
          })
          .join(', ');

        return `srcset="${processedSrcset}"`;
      }
    );

    return processed;
  };

  return (
    <>
      {isMobile && <MobileHeader title='Blog Article' />}
      <div className='min-h-screen '>
        <SingleLargeCard data={post} isBlogDetail={true} />
        <div className='singleBlogPostWrapper'>
          <div className=''>
            <div className='mx-auto px-5 py-4 md:px-10 lg:px-20 xl:px-30'>
              <article className=''>
                {post?.content ? (
                  <div
                    className='max-w-none text-sm md:text-base [&_h3]:py-2 [&_h3]:md:text-left [&_h2]:pb-3 [&_h2]:md:text-left [&_h2]:text-lg [&_h2]:md:pb-2 [&_h2]:md:text-2xl [&_p]:pb-2 [&_p]:md:text-left  [&_img]:w-full [&_img]:md:h-[600px] [&_img]:object-cover [&_img]:rounded-2xl [&_a]:text-accent-red-800'
                    dangerouslySetInnerHTML={{
                      __html: processContent(post?.content),
                    }}
                  />
                ) : (
                  <div className='text-gray-600 text-base leading-relaxed'>
                    {post?.excerpt?.replace(/<[^>]*>/g, '')}
                  </div>
                )}
              </article>
            </div>
            <div className=' px-5 py-4 md:px-10'>
              <SingleBlogModalForm
                title={'Need Help Finding the Perfect Stay?'}
                description={
                  'Need help picking the right place? ‘Contact Us’ and we’ll help you book the one that feels like home.'
                }
                ctaTitle={'Contact Us'}
                formTitle={'Assistance for Villa Search'}
                data={post}
                isBlogDetail={true}
                formComponent={
                  <div className='relative h-auto overflow-auto pt-0 mb-20 bottom-0'>
                    <SingleBlogPageForm />
                  </div>
                }
                className='min-h-[80dvh] h-[600px] sm:min-h-[550px]! max-h-[550px]! md:w-[600px]! bg-card gap-0! fixed! bottom-0! overflow-hidden'
              />
              <div className='px-0'>
                <h2 className='text-xl md:text-3xl font-serif mt-10'>
                  More to Discover
                </h2>
                <BlogList
                  initialPosts={postsData?.nodes}
                  showPagination={true}
                  postsPerPage={3}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetailPage;
