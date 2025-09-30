
'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const words = [
    "technology",
    "data",
    "analysis",
    "intelligence",
    "innovation"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentWord((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 1000); // Longer exit animation duration
    }, 5000); // Changes every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className={"mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative pt-64 sm:pt-56 md:pt-64 pb-12 sm:pb-16"}>
      {/* Special hero background with grid, green and glow */}
      <div className="absolute inset-0 -z-10">
        <div className={'grain-blur background-base'} />
        <div className={'grain-background background-base'} />
        <div className={'grid-bg background-base'} />
        <div className={'large-blur background-base'} />
        <div className={'small-blur background-base'} />
      </div>
      
      <div className={"text-center w-full mb-8 sm:mb-12 md:mb-16 relative z-10"}>
        <h1 className={"text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[90px] leading-tight sm:leading-tight md:leading-tight lg:leading-tight xl:leading-[90px] tracking-[-0.5px] sm:tracking-[-0.8px] md:tracking-[-1.2px] lg:tracking-[-1.6px] font-medium text-white px-4"}>
          Discover the power of
          <br />
          <span className="text-gray-200">
            <span 
              className={`text-green-400 transition-all duration-1000 ease-in-out inline-block ${
                isAnimating 
                  ? 'opacity-0 scale-95 translate-y-1' 
                  : 'opacity-100 scale-100 translate-y-0'
              }`}
            >
              {words[currentWord]}
            </span> in swimming
          </span>
        </h1>
        <p className={"mt-6 sm:mt-8 text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed sm:leading-relaxed md:leading-relaxed lg:leading-relaxed text-gray-300 max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto px-4"}>
          Experience the revolution in swimming analysis with our most advanced tools
        </p>
      </div>
      
      {/* Dashboard Image - Hidden on mobile */}
      <div className="hidden sm:flex justify-center relative z-50 px-4 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
          <Image
            src="/dashboard-dark.png"
            alt="DeckAPP Dashboard - Swimming Analysis"
            width={1200}
            height={800}
            className="w-full h-auto rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl sm:shadow-2xl border border-gray-700/50 relative z-10"
            priority
          />
        </div>
      </div>
    </section>
  );
}