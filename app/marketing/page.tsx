'use client';

import { HomePageBackground } from '@/components/gradients/home-page-background';
import { FeaturesSection } from '@/components/home/features/features-section';
import { HoverFeaturesSection } from '@/components/home/features/hover-features-section';
import { WaterfallFeaturesSection } from '@/components/home/features/waterfall-features-section';
import { Footer } from '@/components/home/footer/footer';
import Header from '@/components/home/header/header';
import { LocalizationBanner } from '@/components/home/header/localization-banner';
import { HeroSection } from '@/components/home/hero-section/hero-section';
import { useState } from 'react';
import '../../styles/home-page.css';

export default function MarketingPage() {
  const [country, setCountry] = useState('US');

  return (
    <div className="dark marketing-page">
      <LocalizationBanner country={country} onCountryChange={setCountry} />
      <div>
        <HomePageBackground />
        <Header user={null} />
            <HeroSection />
            <HoverFeaturesSection />
            <WaterfallFeaturesSection />
            <FeaturesSection />
            <Footer />
      </div>
    </div>
  );
}