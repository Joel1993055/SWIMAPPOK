'use client';

import { HomePageBackground } from '@/components/gradients/home-page-background';
import { AnimatedCardsSection } from '@/components/home/cards/animated-cards-section';
import { FeaturesSection } from '@/components/home/features/features-section';
import Header from '@/components/home/header/header';
import { LocalizationBanner } from '@/components/home/header/localization-banner';
import { HeroSection } from '@/components/home/hero-section/hero-section';
import { useState } from 'react';
import '../../styles/home-page.css';

export default function MarketingPage() {
  const [country, setCountry] = useState('US');

  return (
    <div className="dark">
      <LocalizationBanner country={country} onCountryChange={setCountry} />
      <div>
        <HomePageBackground />
        <Header user={null} />
        <HeroSection />
        <AnimatedCardsSection />
        <FeaturesSection />
      </div>
    </div>
  );
}