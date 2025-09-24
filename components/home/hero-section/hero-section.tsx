
'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const words = [
    "tecnología",
    "data",
    "análisis",
    "inteligencia",
    "innovación"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentWord((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 1000); // Duración de la animación de salida más larga
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className={"mx-auto max-w-7xl px-[32px] relative pt-48 pb-12"}>
      {/* Fondo especial del hero con grid, verde y glow */}
      <div className="absolute inset-0 -z-10">
        <div className={'grain-blur background-base'} />
        <div className={'grain-background background-base'} />
        <div className={'grid-bg background-base'} />
        <div className={'large-blur background-base'} />
        <div className={'small-blur background-base'} />
      </div>
      
      <div className={"text-center w-full mb-16 relative z-50"}>
        <h1 className={"text-[48px] leading-[48px] md:text-[80px] md:leading-[80px] tracking-[-1.6px] font-medium text-white"}>
          Descubre el poder de la
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
            </span> en natación
          </span>
        </h1>
        <p className={"mt-6 text-[18px] leading-[27px] md:text-[20px] md:leading-[30px] text-gray-300 max-w-3xl mx-auto"}>
          Experimenta la revolución en el análisis de natación con nuestras herramientas más avanzadas
        </p>
      </div>
      
      {/* Dashboard Image */}
      <div className="flex justify-center relative z-50">
        <div className="relative max-w-6xl w-full">
          <Image
            src="/dashboard-dark.png"
            alt="DeckAPP Dashboard - Análisis de Natación"
            width={1200}
            height={800}
            className="rounded-2xl shadow-2xl border border-gray-700/50 relative z-50"
            priority
          />
        </div>
      </div>
    </section>
  );
}