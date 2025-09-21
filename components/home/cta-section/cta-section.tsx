
const CTASection = () => {
  return (
    <section className="py-24 px-4 bg-black">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h2 className="text-4xl md:text-6xl font-medium text-gray-300 mb-8 leading-tight">
          <span className="text-gray-400">Entrena con precisión,</span>
          <br />
          <span className="text-white">compite con confianza</span>
        </h2>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Descubre cómo la inteligencia artificial puede transformar tu técnica de natación 
          y llevarte al siguiente nivel competitivo.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Primary Button */}
          <button className="bg-green-500 hover:bg-green-600 text-white font-medium px-8 py-4 rounded-lg transition-colors duration-200 text-lg min-w-[200px]">
            Comenzar ahora
          </button>
          
          {/* Secondary Button */}
          <button className="border border-gray-600 hover:border-gray-500 text-white font-medium px-8 py-4 rounded-lg transition-colors duration-200 text-lg min-w-[200px] bg-transparent">
            Ver demostración
          </button>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500 mb-6">Confían en nosotros</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-gray-400 font-medium">Federación Española de Natación</div>
            <div className="text-gray-400 font-medium">Real Club Náutico</div>
            <div className="text-gray-400 font-medium">Centro de Alto Rendimiento</div>
            <div className="text-gray-400 font-medium">Universidad del Deporte</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
