'use client';

import { HoverCardsSection } from '@/components/ui/hover-cards';

export function HoverFeaturesSection() {
  const features = [
    {
      label: "Análisis",
      title: "Reportes Diarios",
      description: "Análisis detallado de cada sesión de entrenamiento con métricas de rendimiento y progreso.",
      image: "/card-01.png",
      hoverImage: "/card-01-hover.png"
    },
    {
      label: "Seguridad",
      title: "Datos Protegidos",
      description: "Tus datos de entrenamiento están completamente seguros con encriptación de nivel empresarial.",
      image: "/card-02.png",
      hoverImage: "/card-02-hover.png"
    },
    {
      label: "Analytics",
      title: "Análisis Avanzado",
      description: "Herramientas de análisis predictivo para optimizar el rendimiento de tus nadadores.",
      image: "/card-03.png",
      hoverImage: "/card-03-hover.png"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Everything coaches need for
            <br />
            swimming analysis
          </h2>
          <p className="text-xl text-slate-400 mt-6 max-w-3xl mx-auto">
            Discover the powerful features that make our platform the perfect tool for swimming coaches
          </p>
        </div>

        {/* Hover Cards */}
        <HoverCardsSection cards={features} />
      </div>
    </section>
  );
}
