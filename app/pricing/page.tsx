'use client';

import { HomePageBackground } from '@/components/gradients/home-page-background';
import { Footer } from '@/components/home/footer/footer';
import { MarketingNavbar } from '@/components/home/header/marketing-navbar';
import { Pricing } from '@/components/home/pricing/pricing';
import '../../styles/home-page.css';

export default function PricingPage() {
  return (
    <div className="dark marketing-page">
      <div>
        <HomePageBackground />
        <MarketingNavbar user={null} />
        
        {/* Pricing Section */}
        <section className="pt-64 pb-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Choose Your Plan
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Unlock the full potential of swimming training with our comprehensive platform. 
                Start with any plan and upgrade as your team grows.
              </p>
            </div>
            
            <Pricing country="US" />
          </div>
        </section>
        
        <Footer />
      </div>
    </div>
  );
}
