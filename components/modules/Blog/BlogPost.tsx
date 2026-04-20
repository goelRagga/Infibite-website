'use client';

import { WordPressPost } from '@/lib/wordpress/types';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { formatDateWithFullYear } from '@/components/common/Shared/FormatDate';

interface BlogPostProps {
  post: WordPressPost;
}

const BlogPost = ({ post }: BlogPostProps) => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <Link href='/blog'>
          <Button variant='ghost' className='flex items-center gap-2'>
            <ArrowLeft className='w-4 h-4' />
            Back to Blog
          </Button>
        </Link>
      </div>

      <article className='max-w-4xl mx-auto'>
        <header className='mb-8'>
          <h1 className='text-4xl md:text-5xl font-serif text-foreground mb-6'>
            {post?.title}
          </h1>

          <div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6'>
            <div className='flex items-center gap-2'>
              <Calendar className='w-4 h-4' />
              <span>{formatDateWithFullYear(post?.date)}</span>
            </div>
          </div>
        </header>

        <div className='prose prose-lg max-w-none'>
          <div
            dangerouslySetInnerHTML={{ __html: post?.content || '' }}
            className='text-foreground leading-relaxed'
          />
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
