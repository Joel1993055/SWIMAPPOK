'use client';

import { WaterfallCardsSection } from '@/components/ui/waterfall-cards';

export function WaterfallFeaturesSection() {
  const features = [
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

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Descubre las características
            <br />
            que <span className="text-green-400">marcan la diferencia</span>
          </h2>
          <p className="text-xl text-slate-400 mt-6 max-w-3xl mx-auto">
            Explora las funcionalidades avanzadas que hacen de nuestra plataforma la herramienta perfecta para entrenadores de natación
          </p>
        </div>

        {/* Waterfall Cards */}
        <WaterfallCardsSection cards={features} />
      </div>
    </section>
  );
}
