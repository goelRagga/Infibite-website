import {
  ClientPresets,
  graphqlClientManager,
  wordpressClient,
} from '../client/unified-client-manager';
import {
  GET_ALL_CATEGORY_SLUGS,
  GET_ALL_PAGE_SLUGS,
  GET_ALL_POSTS_SLUGS,
  GET_CATEGORIES,
  GET_DETAIL_ABOUT_PAGE,
  GET_DETAIL_BANK_CREDIT_CARD_PAGE,
  GET_DETAIL_CAMPAIGN_PAGE,
  GET_DETAIL_CAREER_PAGE,
  GET_DETAIL_CATEGORY,
  GET_DETAIL_CONTACT_PAGE,
  GET_DETAIL_CORPORATE_PAGE,
  GET_DETAIL_EVENTS_PAGE,
  GET_DETAIL_PAGE,
  GET_DETAIL_PARTNER_PAGE,
  GET_DETAIL_POST,
  GET_DETAIL_PRESS_RELEASE_PAGE,
  GET_DETAIL_PRIVACY_PAGE,
  GET_DETAIL_TEAM_PAGE,
  GET_DETAIL_TERMS_PAGE,
  GET_DETAIL_UPSELL_OFFERS_PAGE,
  GET_DETAIL_VISA,
  GET_DETAIL_VISA_PAGE,
  GET_EXPLORE,
  GET_LATEST_POSTS,
  GET_PAGE_DETAILS,
  GET_POSTS,
} from './queries';

export async function getAllPageSlugs() {
  try {
    const data = await wordpressClient.request<any>(GET_ALL_PAGE_SLUGS);
    return data?.pages?.nodes || [];
  } catch (error) {
    console.error('Failed to fetch page slugs:', error);
    throw error;
  }
}

export async function getPageDetails(slug: string) {
  try {
    const data = await wordpressClient.request<any>(GET_PAGE_DETAILS, { slug });
    return data?.page || null;
  } catch (error) {
    console.error('Failed to fetch page details:', error);
    throw error;
  }
}

export async function getPosts(first: number = 10, after?: string) {
  try {
    const data = await wordpressClient.request<any>(GET_POSTS, {
      first,
      after,
    });
    return data?.posts || null;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw error;
  }
}

export async function getPostsForPage(page: number, postsPerPage: number) {
  try {
    // For the first page, get postsPerPage + 1 to account for the featured post
    const first = page === 1 ? postsPerPage + 1 : postsPerPage;

    // For pages after the first, we need to calculate the cursor
    // This is a simplified approach - in production, you'd want to store cursor mappings
    let after: string | undefined;

    if (page > 1) {
      // Get the cursor for the start of the page
      // This is a simplified approach - you'd typically store cursor mappings
      const offset = (page - 1) * postsPerPage;
      const initialData = await getPosts(offset);
      if (initialData?.pageInfo?.endCursor) {
        after = initialData.pageInfo.endCursor;
      }
    }

    const data = await wordpressClient.request<any>(GET_POSTS, {
      first,
      after,
    });
    return data?.posts || null;
  } catch (error) {
    console.error('Failed to fetch posts for page:', error);
    throw error;
  }
}

// Optimized function for faster pagination
export async function getPostsWithPagination(
  page: number,
  postsPerPage: number
) {
  try {
    // Calculate the total number of posts to fetch
    const totalToFetch = page * postsPerPage;

    // Fetch all posts up to the current page
    const data = await wordpressClient.request<any>(GET_POSTS, {
      first: totalToFetch,
    });

    if (!data?.posts?.nodes) {
      return null;
    }

    const allPosts = data.posts.nodes;
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = page === 1 ? postsPerPage + 1 : startIndex + postsPerPage;

    // Return the posts for the current page
    return {
      ...data.posts,
      nodes: allPosts.slice(startIndex, endIndex),
    };
  } catch (error) {
    console.error('Failed to fetch posts with pagination:', error);
    throw error;
  }
}

// Cache for cursors to avoid expensive calculations
const cursorCache = new Map<number, string>();
const CURSOR_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Efficient cursor-based pagination
export async function getPostsEfficient(page: number, postsPerPage: number) {
  try {
    let after: string | undefined;

    if (page > 1) {
      // Check cache first
      const cachedCursor = cursorCache.get(page);
      if (cachedCursor) {
        after = cachedCursor;
      } else {
        // Calculate cursor efficiently
        const offset = (page - 1) * postsPerPage;
        const data = await wordpressClient.request<any>(GET_POSTS, {
          first: offset,
        });

        if (data?.posts?.pageInfo?.endCursor) {
          after = data.posts.pageInfo.endCursor;
          // Cache the cursor only if it's defined
          if (after) {
            cursorCache.set(page, after);

            // Clean old cache entries
            setTimeout(() => {
              cursorCache.delete(page);
            }, CURSOR_CACHE_DURATION);
          }
        }
      }
    }

    // Fetch posts for current page
    const first = page === 1 ? postsPerPage + 1 : postsPerPage;
    const data = await wordpressClient.request<any>(GET_POSTS, {
      first,
      after,
    });

    return data?.posts || null;
  } catch (error) {
    console.error('Failed to fetch posts efficiently:', error);
    throw error;
  }
}

export async function getLatestPosts() {
  try {
    const data = await wordpressClient.request<any>(GET_LATEST_POSTS);
    return data?.posts?.nodes || [];
  } catch (error) {
    console.error('Failed to fetch latest posts:', error);
    throw error;
  }
}

export async function getCategories() {
  try {
    const data = await wordpressClient.request<any>(GET_CATEGORIES);
    return data?.categories?.nodes || [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
}

export async function getExplorePage() {
  try {
    const data = await wordpressClient.request<any>(GET_EXPLORE);
    return data?.page || null;
  } catch (error) {
    console.error('Failed to fetch explore page:', error);
    throw error;
  }
}

export async function getAllPostSlugs(first: number = 100) {
  try {
    const data = await wordpressClient.request<any>(GET_ALL_POSTS_SLUGS, {
      first,
    });
    return data?.posts?.nodes || [];
  } catch (error) {
    console.error('Failed to fetch post slugs:', error);
    throw error;
  }
}

export async function getAllCategorySlugs(first: number = 100) {
  try {
    const data = await wordpressClient.request<any>(GET_ALL_CATEGORY_SLUGS, {
      first,
    });
    return data?.categories?.nodes || [];
  } catch (error) {
    console.error('Failed to fetch category slugs:', error);
    throw error;
  }
}

export async function getDetailPost(slug: string) {
  try {
    const data = await wordpressClient.request<any>(GET_DETAIL_POST, { slug });
    return data?.post || null;
  } catch (error) {
    console.error('Failed to fetch post details:', error);
    throw error;
  }
}

export async function getDetailCategory(slug: string) {
  try {
    const data = await wordpressClient.request<any>(GET_DETAIL_CATEGORY, {
      slug,
    });
    return data?.category || null;
  } catch (error) {
    console.error('Failed to fetch category details:', error);
    throw error;
  }
}

// Page-specific functions
export async function getAboutPage(slug: string) {
  try {
    const data = await wordpressClient.request<any>(GET_DETAIL_ABOUT_PAGE, {
      slug,
    });
    return { aboutPage: data, error: null };
  } catch (error) {
    console.error('Failed to fetch about page:', error);
    throw error;
  }
}

export async function getPartnerPage(slug: string) {
  try {
    const data = await wordpressClient.request<any>(GET_DETAIL_PARTNER_PAGE, {
      slug,
    });
    return { partnerDetail: data, error: null };
  } catch (error) {
    console.error('Failed to fetch partner page:', error);
    throw error;
  }
}

export async function getPrivacyPage(slug: string) {
  try {
    const data = await wordpressClient.request<any>(GET_DETAIL_PRIVACY_PAGE, {
      slug,
    });
    return { privacyDetail: data, error: null };
  } catch (error) {
    console.error('Failed to fetch privacy page:', error);
    throw error;
  }
}

export async function getEventsPage(slug: string) {
  try {
    const data = await wordpressClient.request<any>(GET_DETAIL_EVENTS_PAGE, {
      slug,
    });
    return { eventsDetail: data, error: null };
  } catch (error) {
    console.error('Failed to fetch events page:', error);
    throw error;
  }
}

export async function getCorporatePage(slug: string) {
  try {
    const data = await wordpressClient.request<any>(GET_DETAIL_CORPORATE_PAGE, {
      slug,
    });
    return { corporateDetail: data, error: null };
  } catch (error) {
    console.error('Failed to fetch corporate page:', error);
    throw error;
  }
}

export async function getUpsellOffersPage(slug: string) {
  try {
    const data = await wordpressClient.request<any>(
      GET_DETAIL_UPSELL_OFFERS_PAGE,
      { slug }
    );
    return data?.page || null;
  } catch (error) {
    console.error('Failed to fetch upsell offers page:', error);
    throw error;
  }
}

export async function getBankCreditCardPage(slug: string) {
  try {
    const data = await wordpressClient.request<any>(
      GET_DETAIL_BANK_CREDIT_CARD_PAGE,
      {
        slug,
      }
    );
    return { bankDetail: data, error: null };
  } catch (error) {
    console.error('Failed to fetch bank credit card page:', error);
    throw error;
  }
}

export async function getTermsPage(slug: string) {
  try {
    const data = await wordpressClient.request<any>(GET_DETAIL_TERMS_PAGE, {
      slug,
    });
    return { termDetail: data, error: null };
  } catch (error) {
    console.error('Failed to fetch terms page:', error);
    throw error;
  }
}

export async function getPressReleasePage(slug: string) {
  try {
    const data = await wordpressClient.request<any>(
      GET_DETAIL_PRESS_RELEASE_PAGE,
      { slug }
    );
    return { pressReleaseDetail: data, error: null };
  } catch (error) {
    console.error('Failed to fetch press release page:', error);
    throw error;
  }
}

export async function getContactPage(slug: string) {
  try {
    const data = await wordpressClient.request<any>(GET_DETAIL_CONTACT_PAGE, {
      slug,
    });
    return { contactDetail: data, error: null };
  } catch (error) {
    console.error('Failed to fetch contact page:', error);
    throw error;
  }
}

export async function getCareerPage(slug: string) {
  try {
    const data = await wordpressClient.request<any>(GET_DETAIL_CAREER_PAGE, {
      slug,
    });
    return data?.page || null;
  } catch (error) {
    console.error('Failed to fetch career page:', error);
    throw error;
  }
}

export async function getTeamPage(slug: string) {
  try {
    const data = await wordpressClient.request<any>(GET_DETAIL_TEAM_PAGE, {
      slug,
    });
    return { teamDetail: data, error: null };
  } catch (error) {
    console.error('Failed to fetch team page:', error);
    throw error;
  }
}

export async function getVisaPage(slug: string) {
  try {
    const data = await wordpressClient.request<any>(GET_DETAIL_VISA_PAGE, {
      slug,
    });
    return { visaDetail: data, error: null };
  } catch (error) {
    console.error('Failed to fetch visa page:', error);
    throw error;
  }
}

export async function getVisa(slug: string) {
  try {
    const data = await wordpressClient.request<any>(GET_DETAIL_VISA, { slug });
    return data?.page || null;
  } catch (error) {
    console.error('Failed to fetch visa:', error);
    throw error;
  }
}

export async function getCampaignPage(slug: string) {
  try {
    const data = await wordpressClient.request<any>(GET_DETAIL_CAMPAIGN_PAGE, {
      slug,
    });
    return data?.page || null;
  } catch (error) {
    console.error('Failed to fetch campaign page:', error);
    throw error;
  }
}

export async function getDetailPage(slug: string) {
  try {
    const data = await wordpressClient.request<any>(GET_DETAIL_PAGE, { slug });
    return { pageDetail: data, error: null };
  } catch (error) {
    console.error('Failed to fetch page details:', error);
    throw error;
  }
}

// Utility function to get page by template type
export async function getPageByTemplate(slug: string, templateType?: string) {
  try {
    let query;

    switch (templateType) {
      case 'about':
        query = GET_DETAIL_ABOUT_PAGE;
        break;
      case 'partner':
        query = GET_DETAIL_PARTNER_PAGE;
        break;
      case 'privacy':
        query = GET_DETAIL_PRIVACY_PAGE;
        break;
      case 'events':
        query = GET_DETAIL_EVENTS_PAGE;
        break;
      case 'corporate':
        query = GET_DETAIL_CORPORATE_PAGE;
        break;
      case 'upsell-offers':
        query = GET_DETAIL_UPSELL_OFFERS_PAGE;
        break;
      case 'bank-credit-card':
        query = GET_DETAIL_BANK_CREDIT_CARD_PAGE;
        break;
      case 'terms':
        query = GET_DETAIL_TERMS_PAGE;
        break;
      case 'press-release':
        query = GET_DETAIL_PRESS_RELEASE_PAGE;
        break;
      case 'contact':
        query = GET_DETAIL_CONTACT_PAGE;
        break;
      case 'career':
        query = GET_DETAIL_CAREER_PAGE;
        break;
      case 'team':
        query = GET_DETAIL_TEAM_PAGE;
        break;
      case 'visa':
        query = GET_DETAIL_VISA_PAGE;
        break;
      default:
        query = GET_DETAIL_PAGE;
    }

    const data = await wordpressClient.request<any>(query, { slug });
    return data?.page || null;
  } catch (error) {
    console.error('Failed to fetch page by template:', error);
    throw error;
  }
}

// Optional: Add authentication support for functions that might need it
export async function getDetailPostWithAuth(
  slug: string,
  token?: string
): Promise<{
  post: any;
  error: string | null;
  statusCode: number | null;
}> {
  try {
    const client = graphqlClientManager.getClient(
      ClientPresets.WORDPRESS,
      token ? { token } : undefined
    );
    const variables = { slug };
    const data = await client.request<any>(GET_DETAIL_POST, variables);
    return {
      post: data?.post || null,
      error: null,
      statusCode: null,
    };
  } catch (error: any) {
    return {
      post: null,
      statusCode: error?.response?.status || null,
      error:
        error?.message || 'Unknown error occurred while fetching post details',
    };
  }
}

export async function getPostsWithAuth(
  first: number = 10,
  after?: string,
  token?: string
): Promise<{
  posts: any;
  error: string | null;
  statusCode: number | null;
}> {
  try {
    const client = graphqlClientManager.getClient(
      ClientPresets.WORDPRESS,
      token ? { token } : undefined
    );
    const variables = { first, after };
    const data = await client.request<any>(GET_POSTS, variables);
    return {
      posts: data?.posts || null,
      error: null,
      statusCode: null,
    };
  } catch (error: any) {
    return {
      posts: null,
      statusCode: error?.response?.status || null,
      error: error?.message || 'Unknown error occurred while fetching posts',
    };
  }
}
