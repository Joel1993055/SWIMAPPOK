'use client';

import { SwimmingCTASection } from '@/components/home/cta-section/swimming-cta-section';
import { FeaturesSection } from '@/components/home/features/features-section';
import { HoverFeaturesSection } from '@/components/home/features/hover-features-section';
import { TabsFeaturesSection } from '@/components/home/features/tabs-features-section';
import { WaterfallFeaturesSection } from '@/components/home/features/waterfall-features-section';
import { Footer } from '@/components/home/footer/footer';
import { MarketingNavbar } from '@/components/home/header/marketing-navbar';
import { HeroSection } from '@/components/home/hero-section/hero-section';
import '../styles/home-page.css';

export default function Home() {
  return (
    <div className="dark marketing-page bg-slate-900 min-h-screen">
      <MarketingNavbar user={null} />
      <HeroSection />
      <TabsFeaturesSection />
      <HoverFeaturesSection />
      <FeaturesSection />
      <WaterfallFeaturesSection />
      <SwimmingCTASection />
      <Footer />
    </div>
  );
}
