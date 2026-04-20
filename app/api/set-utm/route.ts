import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const searchParams = request.nextUrl.searchParams;

  // Get all UTM parameters from query string
  const utmSource = searchParams.get('utm_source') || searchParams.get('utm');
  const utmMedium = searchParams.get('utm_medium');
  const utmCampaign = searchParams.get('utm_campaign');
  const utmTerm = searchParams.get('utm_term');
  const userUniqueId = searchParams.get('user_unique_id');

  // Extract domain from request to set cookie for the correct domain
  // For cross-subdomain sharing: www.elivaas.com <-> agent.elivaas.com
  const host = request.headers.get('host') || '';
  let domain: string | undefined;

  if (host.includes('elivaas.com')) {
    // Set domain to .elivaas.com to allow sharing across all elivaas.com subdomains
    // This enables: www.elivaas.com, agent.elivaas.com, etc.
    domain = '.elivaas.com';
  } else if (host.includes('ivtpl.in')) {
    // For preprod.elivaas.ivtpl.in - note: cannot share with elivaas.com (different root domain)
    domain = '.ivtpl.in';
  }

  // Base cookie options for all UTM cookies
  const baseCookieOptions: Omit<
    Parameters<typeof cookieStore.set>[0],
    'name' | 'value'
  > = {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    secure: true, // Required when sameSite is 'none'
    sameSite: 'none', // Required for cross-subdomain cookie sharing
    httpOnly: false, // Allow client-side JavaScript access
    ...(domain && { domain }), // Only set domain if we have a valid one (for subdomain sharing)
  };

  const setCookies: string[] = [];
  const errors: string[] = [];

  try {
    // Set utm_source cookie if value exists
    if (utmSource) {
      try {
        cookieStore.set({
          ...baseCookieOptions,
          name: 'utm_source',
          value: utmSource,
        });
        setCookies.push('utm_source');
      } catch (error) {
        errors.push(
          `Failed to set utm_source: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    // Set utm_medium cookie if value exists
    if (utmMedium) {
      try {
        cookieStore.set({
          ...baseCookieOptions,
          name: 'utm_medium',
          value: utmMedium,
        });
        setCookies.push('utm_medium');
      } catch (error) {
        errors.push(
          `Failed to set utm_medium: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    // Set utm_campaign cookie if value exists
    if (utmCampaign) {
      try {
        cookieStore.set({
          ...baseCookieOptions,
          name: 'utm_campaign',
          value: utmCampaign,
        });
        setCookies.push('utm_campaign');
      } catch (error) {
        errors.push(
          `Failed to set utm_campaign: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    // Set utm_term cookie if value exists
    if (utmTerm) {
      try {
        cookieStore.set({
          ...baseCookieOptions,
          name: 'utm_term',
          value: utmTerm,
        });
        setCookies.push('utm_term');
      } catch (error) {
        errors.push(
          `Failed to set utm_term: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    // Set user_unique_id cookie if value exists
    if (userUniqueId) {
      try {
        // Check if user_unique_id already exists
        const existingUserId = cookieStore.get('user_unique_id');
        if (!existingUserId) {
          cookieStore.set({
            ...baseCookieOptions,
            maxAge: 60 * 60 * 24 * 365, // 1 year for user ID
            name: 'user_unique_id',
            value: userUniqueId,
          });
          setCookies.push('user_unique_id');
        }
      } catch (error) {
        errors.push(
          `Failed to set user_unique_id: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    if (setCookies.length === 0) {
      return Response.json(
        {
          success: false,
          error: 'No UTM parameters provided',
          message:
            'Please provide at least one UTM parameter (utm_source, utm_medium, utm_campaign, or utm_term)',
        },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      message: `Successfully set ${setCookies.length} cookie(s)`,
      domain: domain || 'current domain',
      cookiesSet: setCookies,
      ...(errors.length > 0 && { errors }),
    });
  } catch (error) {
    console.error('Error setting cookies:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to set cookies',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
