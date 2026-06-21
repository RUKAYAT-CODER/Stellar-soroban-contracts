import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { FocusSection } from '@/components/sections/FocusSection';
import { Features } from '@/components/sections/Features';
import { CTA } from '@/components/sections/CTA';
// Below-the-fold, chart-heavy sections are client-only (ssr: false) to keep
// their JS out of the initial payload. See LazySections for the rationale.
import { StreamSectionLazy, PoolSectionLazy } from '@/components/sections/LazySections';

export default function Page() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Above the fold — server-rendered for SEO and LCP */}
        <Hero />
        <FocusSection />
        {/* Below the fold — lazy-loaded on the client */}
        <StreamSectionLazy />
        <PoolSectionLazy />
        <Features />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
