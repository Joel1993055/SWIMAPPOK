"use client";

import Image from "next/image";

export function AnimatedCardsSection() {
  const cards = [
    {
      label: "Análisis",
      title: "Reportes Diarios",
      description: "Análisis detallado de cada sesión de entrenamiento con métricas de rendimiento y progreso.",
      image: "/dashboard-dark.png",
      hoverImage: "/app-dark.png"
    },
    {
      label: "Seguridad",
      title: "Datos Protegidos",
      description: "Tus datos de entrenamiento están completamente seguros con encriptación de nivel empresarial.",
      image: "/app-light.png",
      hoverImage: "/dashboard-light.png"
    },
    {
      label: "Analytics",
      title: "Análisis Avanzado",
      description: "Herramientas de análisis predictivo para optimizar el rendimiento de tus nadadores.",
      image: "/dashboard-dark.png",
      hoverImage: "/app-dark.png"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Animated Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-md:max-w-xs mx-auto">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-full border border-blue-500/30">
                    {card.label}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {card.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                  {card.description}
                </p>
                
                <div className="relative h-32 rounded-lg overflow-hidden bg-gray-800/50">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
