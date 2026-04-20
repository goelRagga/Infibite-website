/**
 * SEO Page API
 *
 * Fetches SEO-driven search page data from the listing service
 * (`GET {NEXT_PUBLIC_WINBACK_API_URL}/api/v1/seo-page`), e.g.
 * [bard-web-api SEO index](https://bard-web-api.elivaas.com/api/v1/seo-page).
 *
 * Per-page fetches use a sparse `fields` query (see `SEO_PAGE_DEFAULT_FIELDS`),
 * e.g. `GET .../seo-page/{category}/{slug}?fields=path.metaTitle,summary.title,...`.
 * The index returns a JSON array of lightweight items:
 * `{ path: { slug }, summary?: { title } }`. Legacy full documents
 * (with `properties[]`) are still supported when present in the array.
 *
 * @module seo-page
 */

import { cache } from 'react';

// ─── Domain Types ────────────────────────────────────────────────────────────

export interface SeoPageMedia {
  alt?: string;
  mobileUrl: string;
  type: string;
  url: string;
}

export interface SeoPageBanner {
  media?: SeoPageMedia[];
  subtitle?: string;
  title?: string;
}

export interface SeoPagePath {
  metaDescription?: string;
  metaTitle?: string;
  queryParams?: unknown[];
  /** Omitted when the API is called without `path.slug` in `fields`. */
  slug?: string;
}

export interface SeoPageProperty {
  city: string;
  id: string;
  image: string;
  location: string;
  name: string;
  state: string;
}

export interface SeoPageFooterSection {
  links: unknown[];
}

export interface SeoPageFooter {
  primarySection?: SeoPageFooterSection;
  secondarySection?: SeoPageFooterSection;
}

export interface SeoPageSeoContent {
  description?: string;
  title?: string;
}

export interface SeoPageResponse {
  banners?: SeoPageBanner[];
  footer?: SeoPageFooter;
  id?: string;
  path?: SeoPagePath;
  properties?: SeoPageProperty[];
  propertyIds?: string[];
  seoContent?: SeoPageSeoContent;
  status?: string;
  summary?: { title?: string };
}

/** One row from `GET /api/v1/seo-page` (minimal shape). */
export interface SeoPageListItem {
  path: SeoPagePath;
  summary?: { title?: string };
  banners?: SeoPageBanner[];
  seoContent?: SeoPageSeoContent;
}

export type SeoPageListEntry = SeoPageResponse | SeoPageListItem;

export type SeoPageListResponse = SeoPageListEntry[];

/** Matches bard-web-api sparse field selection for listing UX + metadata. */
export const SEO_PAGE_DEFAULT_FIELDS =
  'path.slug,path.metaTitle,path.metaDescription,summary.title,banners.title,banners.subtitle,banners,seoContent.title,seoContent.description';

export interface FetchSeoPageOptions {
  revalidate?: number;
  fields?: string;
}

export type SeoPageResult =
  | { data: SeoPageResponse; error: null }
  | { data: null; error: ApiError };

export type SeoPageSlugsResult =
  | { slugs: string[]; error: null }
  | { slugs: []; error: string };

interface ApiError {
  message: string;
  statusCode: number;
}

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    accept: 'application/json',
    'content-type': 'application/json',
  };

  const channelId = process.env.NEXT_PUBLIC_CHANNEL_ID;
  if (channelId) headers['channel-id'] = channelId;

  return headers;
}

async function extractErrorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body?.message ?? body?.error ?? `Request failed (${res.status})`;
  } catch {
    const text = await res.text().catch(() => '');
    return text || `Request failed (${res.status})`;
  }
}

function encodeSeoPagePathSlug(slug: string): string {
  return slug
    .trim()
    .replace(/^\/+/, '')
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

async function fetchFromApi(
  pathAndQuery: string,
  options?: FetchSeoPageOptions
): Promise<Response> {
  const base = process.env.NEXT_PUBLIC_WINBACK_API_URL;
  if (!base) {
    throw new Error('NEXT_PUBLIC_WINBACK_API_URL is not defined');
  }
  const url = `${base}/api/v1/seo-page${pathAndQuery}`;

  return fetch(url, {
    method: 'GET',
    headers: buildHeaders(),
    ...(typeof options?.revalidate === 'number' && {
      next: { revalidate: options.revalidate },
    }),
  });
}

/** When the API omits `path.slug` (sparse `fields`), treat the response as matching the requested URL slug. */
export function seoPageResponseMatchesSlug(
  requestedSlug: string,
  data: SeoPageResponse
): boolean {
  const apiSlug = data.path?.slug?.trim().toLowerCase();
  const wanted = requestedSlug.trim().toLowerCase();
  if (!apiSlug) return true;
  return apiSlug === wanted;
}

function isLegacyFullSeoPage(
  entry: SeoPageListEntry
): entry is SeoPageResponse {
  return (
    typeof entry === 'object' &&
    entry !== null &&
    'properties' in entry &&
    Array.isArray((entry as SeoPageResponse).properties)
  );
}

/**
 * Turn a minimal list item into the `SeoPageResponse` shape the app expects
 * (metadata, DynamicSearchPage, etc.).
 */
export function normalizeSeoPageEntry(
  entry: SeoPageListEntry,
  requestedSlug?: string
): SeoPageResponse {
  if (isLegacyFullSeoPage(entry)) {
    return entry;
  }

  const slugFromUrl = requestedSlug?.trim().replace(/^\/+/, '') ?? '';
  const slug = entry.path?.slug?.trim() || slugFromUrl;
  const title =
    entry.summary?.title?.trim() || entry.path?.metaTitle?.trim() || undefined;

  const apiSeo = entry.seoContent;
  const hasApiSeo =
    Boolean(apiSeo?.title?.trim()) || Boolean(apiSeo?.description?.trim());
  const syntheticSeo =
    title != null || entry.path?.metaDescription
      ? {
          title: title ?? slug,
          description: entry.path?.metaDescription ?? '',
        }
      : undefined;

  return {
    path: {
      slug,
      metaTitle: entry.path?.metaTitle ?? title,
      metaDescription: entry.path?.metaDescription,
      queryParams: entry.path?.queryParams,
    },
    summary: entry.summary,
    banners: entry.banners,
    seoContent: hasApiSeo
      ? {
          title: apiSeo?.title?.trim() || syntheticSeo?.title,
          description:
            apiSeo?.description?.trim() ?? syntheticSeo?.description ?? '',
        }
      : syntheticSeo,
    properties: [],
  };
}

function seoListCacheKey(options?: FetchSeoPageOptions): string {
  return options?.revalidate != null ? String(options.revalidate) : 'default';
}

const loadSeoPageIndex = cache(async (cacheKey: string) => {
  const revalidate = cacheKey === 'default' ? undefined : Number(cacheKey);
  const res = await fetchFromApi(
    '',
    Number.isFinite(revalidate) ? { revalidate } : undefined
  );

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res));
  }

  const body: unknown = await res.json();

  if (!Array.isArray(body)) {
    if (
      body &&
      typeof body === 'object' &&
      'path' in body &&
      typeof (body as SeoPageListItem).path?.slug === 'string'
    ) {
      return [body as SeoPageListEntry];
    }
    return [];
  }

  return body as SeoPageListEntry[];
});

function resolvePageFromResponse(
  raw: SeoPageListResponse | SeoPageResponse,
  slug: string
): SeoPageListEntry | null {
  if (!Array.isArray(raw)) {
    if (!raw || typeof raw !== 'object') return null;
    return raw as SeoPageListEntry;
  }

  const normalized = slug.trim().replace(/^\/+/, '');
  return (
    raw.find((page) => page.path?.slug === normalized) ??
    raw.find((page) => page.path?.slug?.replace(/^\/+/, '') === normalized) ??
    raw[0] ??
    null
  );
}
/** Sparse row from `GET /api/v1/seo-page?fields=...` (sitemap / llms.txt). */
export interface SeoPageSitemapListRow {
  path?: {
    slug?: string;
    metaTitle?: string;
    metaDescription?: string;
  };
  banners?: { title?: string }[];
}

export interface SeoPageSitemapEntry {
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  /** First banner title — used for human-facing sitemap link labels. */
  bannerTitle?: string;
}

/**
 * Field projection used by the listing API for lightweight sitemap + llms.txt data.
 * @see https://bard-web-api.elivaas.com/api/v1/seo-page
 */
const SEO_PAGE_SITEMAP_FIELDS =
  'path.metaTitle,path.metaDescription,banners.title,banners.title,path.slug';

const loadSeoPageSitemapList = cache(async (cacheKey: string) => {
  const revalidate = cacheKey === 'default' ? undefined : Number(cacheKey);
  const endpoint = `?fields=${encodeURIComponent(SEO_PAGE_SITEMAP_FIELDS)}`;
  const res = await fetchFromApi(
    endpoint,
    Number.isFinite(revalidate) ? { revalidate } : undefined
  );

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res));
  }

  const body: unknown = await res.json();
  if (!Array.isArray(body)) {
    return [];
  }
  return body as SeoPageSitemapListRow[];
});

/**
 * Single request: slugs, meta titles/descriptions (llms.txt), and banner titles (HTML sitemap labels).
 */
export async function getSeoPageSitemapEntries(
  options?: FetchSeoPageOptions
): Promise<SeoPageSitemapEntry[]> {
  try {
    const list = await loadSeoPageSitemapList(seoListCacheKey(options));
    const entries: SeoPageSitemapEntry[] = [];
    for (const row of list) {
      const slug = row.path?.slug?.trim();
      if (!slug) continue;
      entries.push({
        slug,
        metaTitle: row.path?.metaTitle?.trim(),
        metaDescription: row.path?.metaDescription?.trim(),
        bannerTitle: row.banners?.[0]?.title?.trim(),
      });
    }
    return entries;
  } catch (err) {
    console.error('[getSeoPageSitemapEntries] Unexpected error:', err);
    return [];
  }
}

function slugMatches(
  requested: string,
  entrySlug: string | undefined
): boolean {
  if (!entrySlug) return false;
  return entrySlug.trim().toLowerCase() === requested.trim().toLowerCase();
}

export async function getSeoPage(
  slug: string,
  options?: FetchSeoPageOptions
): Promise<SeoPageResult> {
  const normalizedSlug = slug?.trim();

  if (!normalizedSlug) {
    return {
      data: null,
      error: { message: 'Slug is required', statusCode: 400 },
    };
  }

  try {
    const pathSlug = encodeSeoPagePathSlug(normalizedSlug);
    const fields = options?.fields ?? SEO_PAGE_DEFAULT_FIELDS;
    const res = await fetchFromApi(
      `/${pathSlug}?fields=${encodeURIComponent(fields)}`,
      options
    );

    if (!res.ok) {
      const message = await extractErrorMessage(res);
      return { data: null, error: { message, statusCode: res.status } };
    }

    const raw = (await res.json()) as SeoPageListResponse | SeoPageResponse;
    const entry = resolvePageFromResponse(raw, normalizedSlug);

    if (!entry) {
      return {
        data: null,
        error: { message: 'SEO page not found', statusCode: 404 },
      };
    }

    return {
      data: normalizeSeoPageEntry(entry, normalizedSlug),
      error: null,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'An unexpected error occurred';
    console.error('[getSeoPage] Unexpected error:', err);
    return { data: null, error: { message, statusCode: 500 } };
  }
}

export async function getSeoPageSlugs(
  options?: FetchSeoPageOptions
): Promise<SeoPageSlugsResult> {
  try {
    const list = await loadSeoPageIndex(seoListCacheKey(options));
    const slugs = list
      .map((page) => page.path?.slug)
      .filter((s): s is string => Boolean(s));
    return { slugs, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[getSeoPageSlugs] Unexpected error:', err);
    return { slugs: [], error: message };
  }
}
