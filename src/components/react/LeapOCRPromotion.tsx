export function LeapOCRPromotion() {
  return (
    <div className="w-full max-w-[320px] mx-auto max-[900px]:hidden">
      <div className="bg-linear-to-br from-orange-50 to-white border border-brand-black shadow-hard-lg">
        <div className="p-6 flex flex-col gap-8 max-[768px]:p-4 max-[768px]:gap-6 max-[480px]:p-3 max-[480px]:gap-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-mono text-xs font-bold text-gray-800 uppercase tracking-wide">
              New
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-lg leading-tight text-gray-900">
            Introducing LeapOCR
          </h3>

          {/* Description */}
          <p className="font-sans text-sm leading-relaxed text-gray-600">
            Convert Documents to Markdown Instantly with AI-powered OCR
          </p>

          {/* Discount Badge */}
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-lg font-bold text-green-600">
                22% OFF
              </span>
              <span className="font-mono text-xs text-gray-500">
                Limited Time
              </span>
            </div>
            <div className="font-mono text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded text-center">
              Use code:{" "}
              <span className="font-bold text-brand-orange">OFF22</span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-white rounded border border-gray-200">
              <div className="font-mono text-xs text-gray-600">Invoice</div>
              <div className="font-mono text-xs text-gray-400">Extraction</div>
            </div>
            <div className="text-center p-2 bg-white rounded border border-gray-200">
              <div className="font-mono text-xs text-gray-600">Handwriting</div>
              <div className="font-mono text-xs text-gray-400">Recognition</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-2">
            <a
              href="https://leapocr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-orange text-brand-black! border border-brand-black px-4 py-3 text-center font-mono text-xs font-bold uppercase cursor-pointer transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard active:translate-x-0 active:translate-y-0 active:shadow-none no-underline block"
            >
              Start for Free
            </a>

            <a
              href="https://leapocr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border border-gray-300 text-gray-600 px-4 py-2.5 text-center font-mono text-xs font-semibold hover:border-brand-black hover:text-brand-black transition-all no-underline block"
            >
              Book a Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
