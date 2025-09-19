'use client';

import Image from 'next/image';

export function AnimatedCardsSection() {
  const cards = [
    {
      label: "Análisis",
      title: "Daily Reports",
      description: "Building truly great products is both art and science. It's part intuition and part data.",
      image: "/dashboard-dark.png",
      hoverImage: "/app-dark.png"
    },
    {
      label: "Seguridad",
      title: "Advanced Security",
      description: "Building truly great products is both art and science. It's part intuition and part data.",
      image: "/app-light.png",
      hoverImage: "/dashboard-light.png"
    },
    {
      label: "Analytics",
      title: "Powerful Analytics",
      description: "Building truly great products is both art and science. It's part intuition and part data.",
      image: "/dashboard-dark.png",
      hoverImage: "/app-dark.png"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Descubre el poder de la
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              tecnología en natación
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Experimenta la revolución en el análisis de natación con nuestras herramientas más avanzadas
          </p>
        </div>

        {/* Animated Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-md:max-w-xs mx-auto">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-transparent overflow-hidden"
              style={{
                background: 'linear-gradient(theme(colors.slate.900), theme(colors.slate.900)) padding-box, linear-gradient(45deg, theme(colors.slate.800), theme(colors.slate.600/.8), theme(colors.slate.800)) border-box'
              }}
            >
              {/* Noise texture overlay */}
              <div className="absolute inset-0 bg-[url('/assets/background/grain-bg.svg')] bg-[length:352px_382px] rounded-[inherit] opacity-30"></div>
              
              <div className="relative z-10">
                {/* Card Content */}
                <div className="px-6 py-5">
                  <div className="text-lg text-indigo-500 mb-1 font-medium" style={{ fontFamily: 'cursive' }}>{card.label}</div>
                  <div className="text-lg font-bold text-slate-200 mb-1">{card.title}</div>
                  <p className="text-sm text-slate-500 leading-relaxed">{card.description}</p>
                </div>
                
                {/* Image Container with Hover Animation */}
                <div className="relative group-hover:-translate-y-1 transition-transform duration-500 ease-in-out">
                  {/* Default Image */}
                  <Image
                    className="group-hover:opacity-0 transition-opacity duration-500 w-full h-auto"
                    src={card.image}
                    width={350}
                    height={240}
                    alt={card.title}
                  />
                  
                  {/* Hover Image */}
                  <Image
                    className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 w-full h-auto"
                    src={card.hoverImage}
                    width={350}
                    height={240}
                    alt={`${card.title} - Vista detallada`}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 text-lg mb-6">
            ¿Listo para revolucionar tu entrenamiento?
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25">
            Comenzar Ahora
          </button>
        </div>
      </div>
    </section>
  );
}
