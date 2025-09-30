
const MinimalCTASection = () => {
  return (
    <section className="py-32 px-4 bg-black">
      <div className="max-w-5xl mx-auto text-center">
        {/* Headline - Exactamente como en la imagen */}
        <h2 className="text-5xl md:text-7xl font-medium text-gray-300 mb-16 leading-tight">
          <span className="text-gray-400">Entrena con precisión,</span>
          <br />
          <span className="text-white">compite con confianza</span>
        </h2>
        
        {/* CTA Buttons - Estilo minimalista */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {/* Primary Button - Verde como en la imagen */}
          <button className="bg-green-500 hover:bg-green-600 text-white font-medium px-10 py-4 rounded-md transition-colors duration-200 text-lg min-w-[220px]">
            Comenzar proyecto
          </button>
          
          {/* Secondary Button - Con borde como en la imagen */}
          <button className="border border-gray-600 hover:border-gray-500 text-white font-medium px-10 py-4 rounded-md transition-colors duration-200 text-lg min-w-[220px] bg-transparent">
            Solicitar demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default MinimalCTASection;
