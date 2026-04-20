import { Metadata } from 'next';
import { getTeamPage } from '@/lib/wordpress/api';
import { generatePageSeo } from '@/lib/wordpress/seo/generatePageSeo';
import TeamPage from '@/components/wordpressComponents/TeamPage';

export async function generateMetadata(): Promise<Metadata> {
  const { teamDetail } = await getTeamPage('/team');
  const page = teamDetail?.page?.seo;
  const slug = page?.slug || 'team';
  return await generatePageSeo({ page, slug });
}

export default async function PrivacyPolicyPage() {
  const { teamDetail, error } = await getTeamPage('/team');
  const teamPage = teamDetail?.page;

  return (
    <>
      <TeamPage template={teamPage?.template} seo={teamPage?.seo} />
    </>
  );
}
