'use client';

import { WaterfallCardsSection } from '@/components/ui/waterfall-cards';

export function WaterfallFeaturesSection() {
  const features = [
    {
      label: "Analysis",
      title: "Advanced Swimming Reports",
      description: "Get detailed insights into your swimmers' performance with predictive analysis and real-time metrics.",
      image: "/card-01.png"
    },
    {
      label: "Security",
      title: "Fully Protected Data",
      description: "Your training data is secure with enterprise-level encryption and GDPR compliance.",
      image: "/card-02.png"
    },
    {
      label: "Innovation",
      title: "Cutting-Edge Technology",
      description: "We use the latest technologies in sports analysis to optimize your athletes' performance.",
      image: "/card-03.png"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Discover the features
            <br />
            that <span className="text-green-400">make the difference</span>
          </h2>
          <p className="text-xl text-slate-400 mt-6 max-w-3xl mx-auto">
            Explore the advanced functionalities that make our platform the perfect tool for swimming coaches
          </p>
        </div>

        {/* Waterfall Cards */}
        <WaterfallCardsSection cards={features} />
      </div>
    </section>
  );
}
