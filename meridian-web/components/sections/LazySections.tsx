'use client';

import dynamic from 'next/dynamic';
import { SectionSkeleton } from './SectionSkeleton';

/**
 * Below-the-fold sections are loaded on the client only. They depend on
 * charting libraries (recharts) and Framer Motion, so deferring them with
 * `ssr: false` keeps that JS out of the initial, server-rendered payload
 * while a skeleton holds layout space until they hydrate.
 *
 * Above-the-fold sections (Hero, FocusSection) are intentionally NOT here —
 * they stay server-rendered in `app/page.tsx` for SEO and a fast LCP.
 */

export const StreamSectionLazy = dynamic(
  () => import('./StreamSection').then((m) => m.StreamSection),
  { ssr: false, loading: () => <SectionSkeleton /> },
);

export const PoolSectionLazy = dynamic(
  () => import('./PoolSection').then((m) => m.PoolSection),
  { ssr: false, loading: () => <SectionSkeleton /> },
);
