export function LeapOCRPromotionMobile() {
  return (
    <div className="hidden max-[900px]:block w-full">
      <div className="max-w-7xl mx-auto p-10 max-[1024px]:p-8 max-[900px]:p-4 max-[768px]:p-3 max-[480px]:p-2 mb-20 max-[768px]:mb-24 max-[600px]:mb-20 max-[480px]:mb-24">
        <div className="bg-gradient-to-br from-brand-paper to-white border border-brand-black shadow-hard-lg relative overflow-hidden">
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 border-t-[24px] border-r-[24px] border-t-brand-orange border-r-transparent z-10"></div>

          <div className="p-6 flex flex-col gap-8 max-[768px]:p-4 max-[768px]:gap-6 max-[480px]:p-3 max-[480px]:gap-4">
            {/* Header */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-brand-orange animate-pulse rounded-none"></div>
              <span className="font-mono text-xs font-bold text-brand-black uppercase tracking-widest">
                Limited Time
              </span>
              <span className="font-mono text-[10px] text-gray-400">
                Special Offer
              </span>
            </div>

            {/* Title */}
            <h3 className="font-display font-black text-xl leading-tight text-center text-brand-black mix-blend-multiply">
              Leap<span className="text-brand-orange">OCR</span>
            </h3>

            {/* Description */}
            <p className="font-mono text-sm leading-relaxed text-center text-gray-600 border-l-2 border-brand-orange pl-3 max-w-[280px] mx-auto">
              // Optical Character Recognition Protocol. Convert static docs to
              dynamic Markdown.
            </p>

            {/* Discount Badge */}
            <div className="bg-white p-4 rounded border-2 border-dashed border-brand-black max-w-[320px] mx-auto relative">
              {/* Ticket Notches */}
              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-brand-paper border-r-2 border-brand-black rounded-full"></div>
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-brand-paper border-l-2 border-brand-black rounded-full"></div>

              <div className="flex flex-col items-center gap-1 text-center">
                <span className="font-display text-2xl font-bold text-brand-orange -rotate-2 transform">
                  22% OFF
                </span>
                <div className="font-mono text-[10px] uppercase tracking-wide text-gray-500">
                  Code:{" "}
                  <span className="bg-brand-black text-white px-1.5 py-0.5 font-bold">
                    OFF22
                  </span>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-px bg-brand-black border border-brand-black max-w-[320px] mx-auto">
              <div className="bg-brand-paper p-3 text-center hover:bg-brand-orange hover:text-white transition-colors cursor-help">
                <div className="font-mono text-[9px] uppercase text-gray-500">
                  Target
                </div>
                <div className="font-bold text-xs uppercase tracking-tight">
                  Invoice Data
                </div>
              </div>
              <div className="bg-brand-paper p-3 text-center hover:bg-brand-orange hover:text-white transition-colors cursor-help">
                <div className="font-mono text-[9px] uppercase text-gray-500">
                  Mode
                </div>
                <div className="font-bold text-xs uppercase tracking-tight">
                  Handwriting
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 max-w-[320px] mx-auto">
              <a
                href="https://leapocr.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-black text-white border-2 border-brand-black px-4 py-3 text-center font-mono text-xs font-bold uppercase cursor-pointer transition-all duration-200 hover:bg-brand-orange hover:border-brand-orange hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none no-underline block"
              >
                Initialize Free Tier
              </a>

              <a
                href="https://leapocr.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border-2 border-gray-300 text-gray-500 px-4 py-2.5 text-center font-mono text-xs font-bold uppercase hover:border-brand-black hover:text-brand-black transition-all no-underline block"
              >
                Request Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
