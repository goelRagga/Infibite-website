# INP (Interaction to Next Paint) Audit & Optimizations

## 1. Main Thread Blocking – Causes & Fixes

### Identified causes

- **Third-party scripts**: GTM and Mixpanel were loading with
  `afterInteractive`, competing with user interactions.
- **Sync analytics in click handlers**: `trackEvent()` ran on every card click
  and filter change, blocking the main thread.
- **Context re-renders**: `FilterProvider` created a new context value object
  every render, causing all filter consumers to re-render.
- **Heavy filter component**: `AdvanceListingFilters` loaded eagerly with the
  listing page, increasing initial JS and hydration.

### Applied fixes

- **Scripts**: GTM and Mixpanel use `strategy="lazyOnload"` in `app/layout.tsx`.
- **Analytics**: `trackEventDeferred()` in `lib/mixpanel/index.tsx` schedules
  tracking via `requestIdleCallback`; used in PropertyCard,
  AdvanceListingFilters, PropertyListing, CityDestinationCard.
- **FilterProvider**: Context value memoized with `useMemo`; callbacks
  (`updateFiltersFromParams`, `updateParams`, etc.) wrapped in `useCallback`;
  URL→state updates wrapped in `startTransition` in
  `contexts/filters/filter-provider.tsx`.
- **AdvanceListingFilters**: Loaded with `dynamic(..., { ssr: false })` in
  PropertyListing so it doesn’t block first paint/hydration.

---

## 2. Reducing Unnecessary Re-renders

### Applied

- **FilterProvider**: Stable context value and callbacks so only consumers that
  need changed state re-render.
- **PropertyCard**: Wrapped in `React.memo` so list re-renders (e.g. filter
  state) don’t re-render cards whose props are unchanged.

### Recommended next steps

- Split broad contexts (e.g. SharedProvider) into smaller contexts (auth, UI,
  destinations) so only affected trees re-render.
- Use `useMemo` for derived data in listing (e.g. filtered list, sort result) so
  references stay stable when deps don’t change.
- In modals/drawers (Login, filters sheet), ensure open/close state lives in a
  parent that doesn’t force the whole layout to re-render.

---

## 3. Client Component Optimization

### Applied

- **clientLayout**: Analytics/UTM init deferred with `requestIdleCallback`;
  pathname-driven transition wrapped in `startTransition`.
- **CityDestinationCard**: `contain: layout paint`, `willChange: transform`,
  `transition-transform` instead of `transition-all`; `trackEventDeferred`;
  `prefetch={false}` for the link.
- **PropertyListing**: Deferred tracking for edit dates, sort, and page view;
  state update before `trackEventDeferred` in click handlers so UI updates
  first.

### Recommended

- Mark as client only the components that need interactivity; keep static shells
  as Server Components.
- Lazy-load heavy UI (e.g. date picker, map) when the user opens the relevant
  panel.
- Use `content-visibility: auto` for off-screen sections (e.g. long listing) to
  reduce layout/paint cost.

---

## 4. Code Splitting & Dynamic Imports

### Already in use

- Home: SpotlightSection, SpecialCardSection, PriveCardSection, PartnerSection,
  BannersCarousel, CityDestinations, PropertyCard, etc. loaded with `dynamic()`.
- PropertyListing: LocationDetailsAccordion, SelectedFilterChip, FloatingCta,
  AdvanceListingFilters (now dynamic).
- clientLayout: Navbar, Footer, Login, BottomNavigation, TopProgressBar loaded
  with `dynamic()`.

### Recommended

- Dynamic-import PropertyDetails sub-sections (e.g. Image gallery, Info,
  PriceTag) with `ssr: false` or when in viewport.
- Dynamic-import ReviewBooking and booking steps so the payment/review bundle
  loads only when needed.
- Keep route-level boundaries so each page only loads the chunks it needs.

---

## 5. useTransition / useMemo / useCallback

### Applied

- **startTransition**: FilterProvider URL→state updates; clientLayout
  pathname→transition toggle.
- **useMemo**: FilterProvider context value.
- **useCallback**: FilterProvider `updateFiltersFromParams`, `updateParams`,
  `updateFilterParams`, `updateGuestParams`, `clearFilterParams`,
  `clearGuestParams`.

### Recommended

- Use `useTransition` when opening/closing modals or filters if the content is
  heavy (e.g. filter sheet content); keep the “open” state update synchronous so
  the sheet appears immediately, and defer heavy children if needed.
- Use `useDeferredValue` for search/filter input so the list can show a slightly
  stale value while the user types, reducing work during typing.
- Memoize list item render callbacks (e.g. `renderVillaCard`) with `useCallback`
  if they are passed to virtualized lists or memoized children.

---

## 6. Server Components

### Current

- Pages under App Router are Server Components by default; data fetching in
  `getPropertyData`, `getOffers`, etc. runs on the server.
- Client boundary is at `ClientSideLayout`, `AppProviders`, and components with
  `'use client'`.

### Recommended

- Keep passing server-fetched data (property, offers, list) as props into client
  modules so client components don’t refetch on mount where possible.
- Use Server Components for static parts of PDP/listing (e.g. breadcrumbs,
  static text, structured data) and wrap only interactive parts in client
  components.

---

## 7. Third-Party Scripts & Event Handlers

### Applied

- GTM and Mixpanel: `lazyOnload`.
- Elfsight, Hotelzify: already `lazyOnload`.
- All click-driven analytics: `trackEventDeferred` so handlers return quickly.

### Recommended

- Prefer `lazyOnload` or `afterInteractive` for any new script; avoid blocking
  the main thread during first interaction.
- For critical path clicks (e.g. “Book now”), ensure no sync work beyond minimal
  state update and navigation; run analytics and non-critical logic in
  `requestIdleCallback` or `trackEventDeferred`.
- Audit any `onScroll`/`onInput` handlers: use passive listeners where possible,
  debounce/throttle, and avoid layout thrashing (e.g. reading layout and then
  mutating DOM in the same handler).

---

## 8. Long Tasks & Heavy Handlers

### Mitigations

- Deferring analytics and non-critical init reduces long tasks during and right
  after clicks.
- Memoizing context and list items reduces redundant work on state changes.
- Dynamic-importing heavy filters and modals spreads load and improves INP for
  the first interaction.

### Recommended

- Use Chrome DevTools Performance panel and “Long tasks” to find remaining >50ms
  tasks; target those with decomposition or deferral.
- If listing grows (e.g. 100+ cards), consider virtualizing the list (e.g.
  `@tanstack/react-virtual` or `react-window`) so only visible items render.

---

## 9. Summary of File-Level Changes

| File                                                                 | Change                                                                                          |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `app/layout.tsx`                                                     | GTM, Mixpanel `strategy="lazyOnload"`                                                           |
| `app/clientLayout.tsx`                                               | `startTransition` for pathname transition; `requestIdleCallback` for initMixpanel/saveUTMParams |
| `lib/mixpanel/index.tsx`                                             | `trackEventDeferred()` added and used from handlers                                             |
| `contexts/filters/filter-provider.tsx`                               | `useMemo` context value; `useCallback` for all callbacks; `startTransition` for URL→state       |
| `components/common/PropertyCard/index.tsx`                           | `trackEventDeferred`; `React.memo` export                                                       |
| `components/modules/PropertyListing/index.tsx`                       | Dynamic import AdvanceListingFilters; `trackEventDeferred` for edit_dates, sort, page_view      |
| `components/modules/PropertyListing/AdvanceListingFilters/index.tsx` | All `trackEvent` → `trackEventDeferred`                                                         |
| `components/modules/Home/CityDestinationCard/index.tsx`              | `trackEventDeferred`; containment & transform optimizations; `prefetch={false}`                 |

---

## 10. Verification

- Measure INP in production (e.g. CrUX, PageSpeed Insights, or RUM)
  before/after.
- In DevTools: Performance → record while clicking cards, filters, and modals;
  confirm no long tasks dominate the click timeline.
- Ensure no functionality regressions: tracking still fires (deferred), filters
  and URL stay in sync, and modals/open states feel instant.
