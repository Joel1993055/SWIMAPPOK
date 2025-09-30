'use client';

import { HoverCardsSection } from '@/components/ui/hover-cards';

export function HoverFeaturesSection() {
  const features = [
    {
      label: "Analysis",
      title: "Training Zones",
      description: "Monitor your swimmers' 5 intensity zones with real-time analysis and precise metrics.",
      image: "/card-01.png",
      hoverImage: "/card-01-hover.png"
    },
    {
      label: "Technique",
      title: "Style Analysis",
      description: "Evaluate and improve swimming technique with stroke, kick and coordination analysis per swimmer.",
      image: "/card-02.png",
      hoverImage: "/card-02-hover.png"
    },
    {
      label: "Progress",
      title: "Advanced Tracking",
      description: "Compare performances, identify trends and plan training based on real data.",
      image: "/card-03.png",
      hoverImage: "/card-03-hover.png"
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Everything you need for
            <br />
            <span className="text-green-400">professional analysis</span>
          </h2>
          <p className="text-xl text-slate-400 mt-6 max-w-3xl mx-auto">
            Advanced analysis tools for swimming coaches looking to maximize their athletes' performance
          </p>
        </div>

        {/* Hover Cards */}
        <HoverCardsSection cards={features} />
      </div>
    </section>
  );
}
