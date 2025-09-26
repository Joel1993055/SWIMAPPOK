

const SwimmingCTASection = () => {
  return (
    <section className="py-32 px-4 bg-black">
      <div className="max-w-5xl mx-auto text-center">
        {/* Headline adapted for swimming */}
        <h2 className="text-5xl md:text-7xl font-medium mb-16 leading-tight">
          <span className="text-gray-400">Train with precision,</span>
          <br />
          <span className="text-white">compete with confidence</span>
        </h2>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {/* Primary Button */}
          <button className="bg-green-500 hover:bg-green-600 text-white font-medium px-10 py-4 rounded-md transition-colors duration-200 text-lg min-w-[220px]">
            Start Training
          </button>
          
          {/* Secondary Button */}
          <button className="border border-gray-600 hover:border-gray-500 text-white font-medium px-10 py-4 rounded-md transition-colors duration-200 text-lg min-w-[220px] bg-transparent">
            View Demo
          </button>
        </div>
        
        {/* Optional trust indicators */}
        <div className="mt-20 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500 mb-6">Used by professional swimmers</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-gray-400 font-medium">Spanish Federation</div>
            <div className="text-gray-400 font-medium">Royal Nautical Club</div>
            <div className="text-gray-400 font-medium">High Performance Center</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { SwimmingCTASection };
export default SwimmingCTASection;
