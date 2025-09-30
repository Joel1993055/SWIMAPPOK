
const ExactCTASection = () => {
  return (
    <section className="py-32 px-4 bg-black">
      <div className="max-w-5xl mx-auto text-center">
        {/* Headline - Exactamente como en la imagen */}
        <h2 className="text-5xl md:text-7xl font-medium mb-16 leading-tight">
          <span className="text-gray-400">Build in a weekend,</span>
          <br />
          <span className="text-white">scale to millions</span>
        </h2>
        
        {/* CTA Buttons - Estilo exacto de la imagen */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {/* Primary Button - Verde sólido */}
          <button className="bg-green-500 hover:bg-green-600 text-white font-medium px-10 py-4 rounded-md transition-colors duration-200 text-lg min-w-[220px]">
            Start your project
          </button>
          
          {/* Secondary Button - Con borde gris */}
          <button className="border border-gray-600 hover:border-gray-500 text-white font-medium px-10 py-4 rounded-md transition-colors duration-200 text-lg min-w-[220px] bg-transparent">
            Request a demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExactCTASection;
