'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

const AspectHero = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const rotatingWords = [
    'intelligence',
    'data', 
    'analysis',
    'technology',
    'innovation'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => 
        (prevIndex + 1) % rotatingWords.length
      );
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="aspect-hero"
      className="bg-obsidian relative overflow-hidden px-2.5 lg:px-0"
    >
      <div className="border-r-dark-gray border-l-dark-gray relative container border px-5">
        <div className="group pointer-events-none absolute inset-0 flex size-full flex-col items-center justify-center self-start">
          <Image
            src="/images/homepage/hero-background.webp"
            alt={`hero background`}
            fill
            className="size-full object-cover"
          />
        </div>
        <div className="grid gap-12 py-12 lg:grid-cols-[1fr_auto] lg:py-20 lg:pl-12">
          <div className="flex flex-col items-start justify-center gap-5 lg:gap-8">
            <h1 className="text-foreground text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Discover the power of swimming{' '}
              <span className="text-blue-400 transition-all duration-500 ease-in-out">
                {rotatingWords[currentWordIndex]}
              </span>
            </h1>

            <p className="font-inter-tight text-mid-gray text-base md:text-lg lg:text-xl">
              Experience the revolution in swimming analysis with our most advanced training management platform
            </p>

            <div className="flex flex-wrap items-start gap-4">
              <Button aria-label="Get started">
                <Link href="/pricing">Start Free Trial</Link>
              </Button>
              <Button aria-label="Get started" variant={'secondary'}>
                <Link href="/pricing">Book a Demo</Link>
              </Button>
            </div>
          </div>
          <div className="bg-overlay-gray rounded-sm p-2 sm:p-3 md:p-4 lg:rounded-md">
            <div className="relative aspect-[522/572] size-full overflow-hidden rounded-sm lg:min-h-[572px] lg:min-w-[522px] lg:rounded-md">
              <Image
                src="/images/homepage/aspect-hero-image.webp"
                alt={`DECKapp swimming platform interface`}
                fill
                className="object-cover object-left-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AspectHero;
