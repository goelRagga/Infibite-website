import BlogDetailPage from '@/components/wordpressComponents/Blogs/BlogDetailPage';
import { getDetailPost, getAllPostSlugs, getPosts } from '@/lib/wordpress/api';
import { generatePageSeo } from '@/lib/wordpress/seo/generatePageSeo';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const post = await getDetailPost((await params)?.slug);
  const seo = post?.page?.seo || post?.seo || {};
  const slug = post?.slug || (await params)?.slug;
  const fullSlug = `${process.env.NEXT_PUBLIC_SITE_URL}blog/${slug}`;

  return await generatePageSeo({ page: seo, slug: fullSlug });
}

// ISR: Revalidate every 30 minutes
export const revalidate = 1800;

export async function generateStaticParams() {
  try {
    const posts = await getAllPostSlugs(1000);

    return (posts || [])
      .filter((post: { slug?: string }) => post?.slug)
      .map((post: { slug: string }) => ({ slug: post.slug }));
  } catch (error) {
    console.error('Error generating static paths for blog:', error);
    return [];
  }
}

export default async function BlogPostPage(props: BlogPageProps) {
  try {
    const params = await props?.params;
    const slug = params?.slug;
    const post = await getDetailPost(slug);

    if (!post) return notFound();

    const [postsData] = await Promise.all([getPosts(3)]);

    return (
      <>
        <BlogDetailPage post={post} postsData={postsData} />
      </>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-800 mb-4'>
            Error Loading Blog Post
          </h1>
          <p className='text-gray-600 mb-6'>
            We&apos;re having trouble loading this blog post. Please try again
            later.
          </p>
          <Link
            href='/blog'
            className='inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors'
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }
}
