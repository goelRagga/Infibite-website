import { Metadata } from 'next';
import { getBankCreditCardPage } from '@/lib/wordpress/api';
import { generatePageSeo } from '@/lib/wordpress/seo/generatePageSeo';
import BankPageDetail from '@/components/wordpressComponents/BankOfferPages';

export async function generateMetadata(): Promise<Metadata> {
  const { bankDetail } = await getBankCreditCardPage(
    '/applicable-idfc-first-credit-cards'
  );
  const page = bankDetail?.page?.seo;
  const slug = page?.slug || 'applicable-idfc-first-credit-cards';
  return await generatePageSeo({ page, slug });
}

export default async function BankPage() {
  const { bankDetail, error } = await getBankCreditCardPage(
    '/applicable-idfc-first-credit-cards'
  );

  const bankDetailData = bankDetail?.page?.template?.bankOffer;

  return (
    <div>
      <BankPageDetail
        template={bankDetailData}
        modalContentWidth='710'
        modalContentHeight='451'
      />
    </div>
  );
}
