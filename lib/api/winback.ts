// Winback API functions
// ------------------------------

export interface WinbackOffer {
  id: number;
  title: string;
  description: string | null;
  icon: string | null;
  offerType: 'VOUCHER' | 'VALUE_ADDED_SERVICE' | 'TIER_UPGRADE' | string;
  voucherAmount?: number;
  tierId?: string;
}

export interface WinbackBooking {
  bookingId: string;
  properties: Array<{
    name: string;
    image: string;
  }>;
  paidAmount: string;
  checkinDate: string;
  checkoutDate: string;
  guestName: string;
  guestReview?: string;
  reviewReply?: string;
  rating?: number;
}

export interface WinbackClaim {
  id: number;
  guestId: string;
  offerId: number;
  bookingId: string;
  details: WinbackOffer;
  claimedAt: string;
}

export interface WinbackOffersResponse {
  shouldShow: boolean;
  message?: string;
}

export interface WinbackDetailsResponse {
  booking: WinbackBooking;
  offers: WinbackOffer[];
  claim?: WinbackClaim;
}

export interface WinbackDetailsResult {
  data: WinbackDetailsResponse | null;
  error: {
    message: string;
    statusCode: number;
  } | null;
}

const WINBACK_BASE_URL = process.env.NEXT_PUBLIC_WINBACK_API_URL;

if (!WINBACK_BASE_URL) {
  throw new Error('WINBACK API base URL is not defined');
}

/**
 * Get winback details for a booking (bookingId is optional)
 */
export async function getWinbackDetails(
  bookingId?: string,
  token?: string
): Promise<WinbackDetailsResult> {
  try {
    const headers: HeadersInit = {
      accept: '*/*',
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = bookingId
      ? `${WINBACK_BASE_URL}/winback/${bookingId}`
      : `${WINBACK_BASE_URL}/winback`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      let errorMessage = 'Unable to fetch winback details';
      let errorData: any = null;

      try {
        const errorText = await response.text();
        if (errorText) {
          try {
            errorData = JSON.parse(errorText);
            errorMessage = errorData.error;
          } catch {
            errorMessage = errorText || errorMessage;
          }
        }
      } catch (parseError) {
        // If parsing fails, use default message
      }

      return {
        data: null,
        error: {
          message: errorMessage || `An error occurred (${response.status})`,
          statusCode: response.status,
        },
      };
    }

    const data = await response.json();
    return {
      data: data as WinbackDetailsResponse,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching winback details:', error);
    return {
      data: null,
      error: {
        message: 'An unexpected error occurred. Please try again later.',
        statusCode: 500,
      },
    };
  }
}

/**
 * Claim a winback offer
 */
export async function claimWinbackOffer(
  offerId: number,
  bookingId?: string,
  token?: string
): Promise<WinbackClaim | null> {
  try {
    const headers: HeadersInit = {
      accept: '*/*',
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const body: any = { offerId };
    if (bookingId) {
      body.bookingId = bookingId;
    }

    const response = await fetch(`${WINBACK_BASE_URL}/winback/claim`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to claim offer';
      try {
        const errorData = await response.json();
        // Handle different error response formats
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `HTTP error! status: ${response.status}`;
      }

      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).response = response;
      throw error;
    }

    const data = await response.json();
    return data as WinbackClaim;
  } catch (error) {
    console.error('Error claiming winback offer:', error);
    throw error;
  }
}
