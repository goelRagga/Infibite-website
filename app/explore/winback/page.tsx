import { KEY_VALUE_KEYS } from '@/lib/constants';
import { getKeyValueData } from '@/lib/api';
import RedCarpetPage from '@/components/wordpressComponents/RedCarpetPage';
import { getWinbackDetails } from '@/lib/api/winback';
import { cookies } from 'next/headers';

export default async function RedCarpet({
  searchParams,
}: {
  searchParams?: Promise<{ bookingId?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const bookingId = resolvedSearchParams?.bookingId;

  const accessToken = (await cookies()).get('accessToken')?.value;

  let winbackData: any = undefined;
  let winbackError: { message: string; statusCode: number } | null = null;
  if (bookingId && accessToken) {
    const result = await getWinbackDetails(bookingId, accessToken);
    winbackData = result.data;
    winbackError = result.error;
  }

  const redCarpetPageContent = await getKeyValueData<any>(
    KEY_VALUE_KEYS.RED_CARPET_PAGE_CONTENT
  );

  return (
    <RedCarpetPage
      data={redCarpetPageContent}
      winbackData={winbackData}
      winbackError={winbackError}
    />
  );
}
