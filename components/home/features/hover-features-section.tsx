'use client';

import { HoverCardsSection } from '@/components/ui/hover-cards';

export function HoverFeaturesSection() {
  const features = [
    {
      label: "Análisis",
      title: "Zonas de Entrenamiento",
      description: "Monitorea las 5 zonas de intensidad de tus nadadores con análisis en tiempo real y métricas precisas.",
      image: "/card-01.png",
      hoverImage: "/card-01-hover.png"
    },
    {
      label: "Técnica",
      title: "Análisis de Estilo",
      description: "Evalúa y mejora la técnica de nado con análisis de brazada, patada y coordinación por nadador.",
      image: "/card-02.png",
      hoverImage: "/card-02-hover.png"
    },
    {
      label: "Progreso",
      title: "Seguimiento Avanzado",
      description: "Compara rendimientos, identifica tendencias y planifica entrenamientos basados en datos reales.",
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
            Todo lo que necesitas para
            <br />
            <span className="text-green-400">análisis profesional</span>
          </h2>
          <p className="text-xl text-slate-400 mt-6 max-w-3xl mx-auto">
            Herramientas avanzadas de análisis para entrenadores de natación que buscan maximizar el rendimiento de sus atletas
          </p>
        </div>

        {/* Hover Cards */}
        <HoverCardsSection cards={features} />
      </div>
    </section>
  );
}
