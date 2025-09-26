'use client';

export function Footer() {
  return (
    <footer className="text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section - Built with */}
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm mb-6">Built with</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {/* Paddle */}
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-4 h-4 flex items-center justify-center">
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 0L7.5 3H4.5L6 0Z" />
                  <path d="M6 12L4.5 9H7.5L6 12Z" />
                  <path d="M0 6L3 4.5V7.5L0 6Z" />
                  <path d="M12 6L9 7.5V4.5L12 6Z" />
                </svg>
              </div>
              <span className="text-sm font-medium">paddle</span>
            </div>

            {/* Tailwind CSS */}
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-4 h-4 flex items-center justify-center">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624C13.666,10.438,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C16.337,6.562,14.976,5,12.001,5z"/>
                </svg>
              </div>
              <span className="text-sm font-medium">tailwindcss</span>
            </div>

            {/* Supabase */}
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-4 h-4 flex items-center justify-center">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z"/>
                </svg>
              </div>
              <span className="text-sm font-medium">supabase</span>
            </div>

            {/* Next.js */}
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-sm font-medium">NEXT.js</span>
            </div>

            {/* shadcn/ui */}
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-sm font-medium">// shadcn/ui</span>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-gray-700 mb-8"></div>

        {/* Bottom Section - Copyright and Links */}
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">DeckAPP - Professional analysis for swimming coaches</p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors flex items-center gap-1">
              Explore features
              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors flex items-center gap-1">
              Terms of use
              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors flex items-center gap-1">
              Privacy
              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
