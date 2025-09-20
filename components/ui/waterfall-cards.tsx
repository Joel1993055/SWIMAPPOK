'use client';

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface WaterfallCardProps {
  label: string;
  title: string;
  description: string;
  image: string;
  number: string;
  color: 'indigo' | 'sky' | 'teal';
  className?: string;
}

interface WaterfallCardsSectionProps {
  cards: Omit<WaterfallCardProps, 'color' | 'number'>[];
  className?: string;
}

export function WaterfallCard({
  label,
  title,
  description,
  image,
  number,
  color,
  className
}: WaterfallCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardIndex = parseInt(number) - 1;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    const element = document.getElementById(`waterfall-card-${number}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [number]);

  const colorClasses = {
    indigo: {
      label: 'text-indigo-500',
      svg: 'fill-indigo-500'
    },
    sky: {
      label: 'text-sky-500',
      svg: 'fill-sky-500'
    },
    teal: {
      label: 'text-teal-500',
      svg: 'fill-teal-500'
    }
  };

  return (
    <section 
      id={`waterfall-card-${number}`}
    >
      <div 
        className={cn(
          "relative rounded-2xl border border-gray-800/30 overflow-hidden transition-all duration-700 ease-in-out",
          "bg-[#0a0f0a]",
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
          className
        )}
        style={{ 
          zIndex: 3 - cardIndex
        } as React.CSSProperties}
      >
        <div className="md:flex justify-between items-center">
          <div className="shrink-0 px-12 py-14 max-md:pb-0 md:pr-0">
            <div className="md:max-w-md">
              <div className={cn(
                "font-['Nothing_You_Could_Do'] text-xl mb-2 relative inline-flex justify-center items-end",
                colorClasses[color].label
              )}>
                {label}
                <svg 
                  className={cn(
                    "absolute opacity-40 -z-10",
                    colorClasses[color].svg
                  )} 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="88" 
                  height="4" 
                  viewBox="0 0 88 4" 
                  aria-hidden="true" 
                  preserveAspectRatio="none"
                >
                  <path d="M87.343 2.344S60.996 3.662 44.027 3.937C27.057 4.177.686 3.655.686 3.655c-.913-.032-.907-1.923-.028-1.999 0 0 26.346-1.32 43.315-1.593 16.97-.24 43.342.282 43.342.282.904.184.913 1.86.028 1.999" />
                </svg>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-50 mb-4">{title}</h1>
              <p className="text-slate-400 mb-6">{description}</p>
              <a 
                className="text-sm font-medium inline-flex items-center justify-center px-3 py-1.5 border border-slate-700 rounded-lg tracking-normal transition text-slate-300 hover:text-slate-50 group" 
                href="#0"
              >
                Learn More 
                <span className="text-slate-600 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">→</span>
              </a>
            </div>
          </div>
          <img 
            className="mx-auto max-md:-translate-x-[5%]" 
            src={image} 
            width="519" 
            height="490" 
            alt={`Illustration ${number}`}
          />
        </div>
        <div className="absolute left-12 bottom-0 h-14 flex items-center text-xs font-medium text-slate-400">
          {number}
        </div>
      </div>
    </section>
  );
}

export function WaterfallCardsSection({ cards, className }: WaterfallCardsSectionProps) {
  const colors: ('indigo' | 'sky' | 'teal')[] = ['indigo', 'sky', 'teal'];

  return (
    <div className={cn("max-w-5xl mx-auto", className)}>
      <div className="relative z-0 space-y-14">
        {cards.map((card, index) => (
          <WaterfallCard
            key={index}
            {...card}
            number={String(index + 1).padStart(2, '0')}
            color={colors[index % colors.length]}
          />
        ))}
      </div>
    </div>
  );
}

// Example component for demonstration
export function ExampleWaterfallCards() {
  const cards = [
    {
      label: "Análisis",
      title: "Reportes Avanzados de Natación",
      description: "Obtén insights detallados sobre el rendimiento de tus nadadores con análisis predictivo y métricas en tiempo real.",
      image: "/card-01.png"
    },
    {
      label: "Seguridad",
      title: "Datos Completamente Protegidos",
      description: "Tus datos de entrenamiento están seguros con encriptación de nivel empresarial y cumplimiento GDPR.",
      image: "/card-02.png"
    },
    {
      label: "Innovación",
      title: "Tecnología de Vanguardia",
      description: "Utilizamos las últimas tecnologías en análisis deportivo para optimizar el rendimiento de tus atletas.",
      image: "/card-03.png"
    }
  ];

  return <WaterfallCardsSection cards={cards} />;
}
