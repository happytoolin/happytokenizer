interface LeapOCRPromotionProps {
  className?: string;
  layout?: "vertical" | "horizontal";
}

export function LeapOCRPromotion({
  className = "",
  layout = "vertical",
}: LeapOCRPromotionProps) {
  if (layout === "horizontal") {
    return (
      <div className={`w-full ${className}`}>
        {/* Horizontal Container - Full width banner */}
        <div className="bg-white border-2 border-brand-black shadow-[6px_6px_0px_var(--c-black)] relative overflow-hidden group transition-transform hover:-translate-y-1">
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 border-t-[32px] border-r-[32px] border-t-brand-orange border-r-transparent z-10"></div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Section - Title & Description */}
            <div className="lg:col-span-5 space-y-3">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-orange animate-pulse rounded-none"></div>
                <span className="font-mono text-[10px] font-bold text-brand-black uppercase tracking-widest">
                  Limited Time
                </span>
                <span className="font-mono text-[10px] text-gray-400">
                  Special Offer
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-2xl lg:text-3xl font-black uppercase leading-[0.85] tracking-tighter text-brand-black mix-blend-multiply">
                Leap<span className="text-brand-orange">OCR</span>
              </h3>

              <p className="font-mono text-xs leading-relaxed text-gray-600 border-l-2 border-brand-orange pl-3">
                // Optical Character Recognition Protocol. Convert static docs
                to dynamic Markdown.
              </p>
            </div>

            {/* Middle Section - Discount Ticket */}
            <div className="lg:col-span-3">
              <div className="bg-brand-paper border-2 border-dashed border-brand-black p-4 relative">
                {/* Ticket Notches */}
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-r-2 border-brand-black rounded-full"></div>
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-l-2 border-brand-black rounded-full"></div>

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
            </div>

            {/* Right Section - Features & CTA */}
            <div className="lg:col-span-4 space-y-4">
              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-px bg-brand-black border border-brand-black">
                <div className="bg-white p-2 text-center hover:bg-brand-orange hover:text-white transition-colors group/feat cursor-help">
                  <div className="font-mono text-[9px] uppercase text-gray-400 group-hover/feat:text-white/80">
                    Target
                  </div>
                  <div className="font-bold text-xs uppercase tracking-tight">
                    Invoice Data
                  </div>
                </div>
                <div className="bg-white p-2 text-center hover:bg-brand-orange hover:text-white transition-colors group/feat cursor-help">
                  <div className="font-mono text-[9px] uppercase text-gray-400 group-hover/feat:text-white/80">
                    Mode
                  </div>
                  <div className="font-bold text-xs uppercase tracking-tight">
                    Handwriting
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <a
                href="https://leapocr.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-black text-white border-2 border-brand-black px-4 py-3 text-center font-mono text-xs font-bold uppercase cursor-pointer transition-all duration-200 hover:bg-brand-orange hover:border-brand-orange hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none block no-underline w-full"
              >
                Initialize Free Tier
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vertical layout (default)
  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white border-2 border-brand-black shadow-[6px_6px_0px_var(--c-black)] relative overflow-hidden group transition-transform hover:-translate-y-1">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 border-t-[32px] border-r-[32px] border-t-brand-orange border-r-transparent z-10"></div>

        <div className="p-6 flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-brand-black pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-orange animate-pulse rounded-none"></div>
              <span className="font-mono text-[10px] font-bold text-brand-black uppercase tracking-widest">
                Limited Time
              </span>
            </div>
            <span className="font-mono text-[10px] text-gray-400">
              Special Offer
            </span>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h3 className="font-display text-3xl font-black uppercase leading-[0.85] tracking-tighter text-brand-black mix-blend-multiply">
              Leap<span className="text-brand-orange">OCR</span>
            </h3>
            <p className="font-mono text-xs leading-relaxed text-gray-600 border-l-2 border-brand-orange pl-3">
              // Optical Character Recognition Protocol. Convert static docs to
              dynamic Markdown.
            </p>
          </div>

          {/* Discount Ticket */}
          <div className="bg-brand-paper border-2 border-dashed border-brand-black p-4 relative">
            {/* Ticket Notches */}
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-r-2 border-brand-black rounded-full"></div>
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-l-2 border-brand-black rounded-full"></div>

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

          {/* Features - Technical Grid */}
          <div className="grid grid-cols-2 gap-px bg-brand-black border border-brand-black">
            <div className="bg-white p-2 text-center hover:bg-brand-orange hover:text-white transition-colors group/feat cursor-help">
              <div className="font-mono text-[9px] uppercase text-gray-400 group-hover/feat:text-white/80">
                Target
              </div>
              <div className="font-bold text-xs uppercase tracking-tight">
                Invoice Data
              </div>
            </div>
            <div className="bg-white p-2 text-center hover:bg-brand-orange hover:text-white transition-colors group/feat cursor-help">
              <div className="font-mono text-[9px] uppercase text-gray-400 group-hover/feat:text-white/80">
                Mode
              </div>
              <div className="font-bold text-xs uppercase tracking-tight">
                Handwriting
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 mt-1">
            <a
              href="https://leapocr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-black text-white border-2 border-brand-black px-4 py-3 text-center font-mono text-xs font-bold uppercase cursor-pointer transition-all duration-200 hover:bg-brand-orange hover:border-brand-orange hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none block no-underline"
            >
              Initialize Free Tier
            </a>

            <a
              href="https://leapocr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-gray-300 text-gray-500 px-4 py-2.5 text-center font-mono text-xs font-bold uppercase hover:border-brand-black hover:text-brand-black transition-all block no-underline"
            >
              Request Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
