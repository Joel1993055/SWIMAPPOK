
const CTASection = () => {
  return (
    <section className="py-24 px-4 bg-black">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h2 className="text-4xl md:text-6xl font-medium text-gray-300 mb-8 leading-tight">
          <span className="text-gray-400">Train with precision,</span>
          <br />
          <span className="text-white">compete with confidence</span>
        </h2>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Discover how artificial intelligence can transform your swimming technique 
          and take you to the next competitive level.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Primary Button */}
          <button className="bg-green-500 hover:bg-green-600 text-white font-medium px-8 py-4 rounded-lg transition-colors duration-200 text-lg min-w-[200px]">
            Start Now
          </button>
          
          {/* Secondary Button */}
          <button className="border border-gray-600 hover:border-gray-500 text-white font-medium px-8 py-4 rounded-lg transition-colors duration-200 text-lg min-w-[200px] bg-transparent">
            View Demo
          </button>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500 mb-6">Trusted by</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-gray-400 font-medium">Spanish Swimming Federation</div>
            <div className="text-gray-400 font-medium">Royal Nautical Club</div>
            <div className="text-gray-400 font-medium">High Performance Center</div>
            <div className="text-gray-400 font-medium">Sports University</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
