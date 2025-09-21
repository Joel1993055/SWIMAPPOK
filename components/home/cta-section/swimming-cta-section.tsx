

const SwimmingCTASection = () => {
  return (
    <section className="py-32 px-4 bg-black">
      <div className="max-w-5xl mx-auto text-center">
        {/* Headline adaptado para natación */}
        <h2 className="text-5xl md:text-7xl font-medium mb-16 leading-tight">
          <span className="text-gray-400">Entrena con precisión,</span>
          <br />
          <span className="text-white">compite con confianza</span>
        </h2>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {/* Primary Button */}
          <button className="bg-green-500 hover:bg-green-600 text-white font-medium px-10 py-4 rounded-md transition-colors duration-200 text-lg min-w-[220px]">
            Comenzar entrenamiento
          </button>
          
          {/* Secondary Button */}
          <button className="border border-gray-600 hover:border-gray-500 text-white font-medium px-10 py-4 rounded-md transition-colors duration-200 text-lg min-w-[220px] bg-transparent">
            Ver demostración
          </button>
        </div>
        
        {/* Trust indicators opcionales */}
        <div className="mt-20 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500 mb-6">Usado por nadadores profesionales</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-gray-400 font-medium">Federación Española</div>
            <div className="text-gray-400 font-medium">Real Club Náutico</div>
            <div className="text-gray-400 font-medium">Centro de Alto Rendimiento</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { SwimmingCTASection };
export default SwimmingCTASection;
