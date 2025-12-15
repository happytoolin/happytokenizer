// Performance monitoring script
// Use this to measure the improvements made to the site

const performanceMetrics = {
  // Key metrics to track
  largestContentfulPaint: 0,
  firstInputDelay: 0,
  cumulativeLayoutShift: 0,
  firstContentfulPaint: 0,
  timeToInteractive: 0,

  // Custom metrics for the tokenizer app
  tokenizerLoadTime: 0,
  statusDisplayLoadTime: 0,
  forcedReflowTime: 0,

  startTimer(name) {
    this[`${name}Start`] = performance.now();
  },

  endTimer(name) {
    if (this[`${name}Start`]) {
      this[name] = performance.now() - this[`${name}Start`];
      delete this[`${name}Start`];
    }
  },

  measureBundleSize() {
    const scripts = document.querySelectorAll('script[src*="_astro"]');
    let totalSize = 0;

    scripts.forEach((script) => {
      const match = script.src.match(/\/([^/]+\.js)/);
      if (match) {
        console.log(`Bundle: ${match[1]} - ${script.src}`);
      }
    });

    return totalSize;
  },

  logMetrics() {
    console.group("🚀 Performance Metrics");
    console.log("LCP:", this.largestContentfulPaint.toFixed(2) + "ms");
    console.log("FID:", this.firstInputDelay.toFixed(2) + "ms");
    console.log("CLS:", this.cumulativeLayoutShift.toFixed(4));
    console.log("FCP:", this.firstContentfulPaint.toFixed(2) + "ms");
    console.log("TTI:", this.timeToInteractive.toFixed(2) + "ms");
    console.log("Tokenizer Load:", this.tokenizerLoadTime.toFixed(2) + "ms");
    console.log(
      "Status Display Load:",
      this.statusDisplayLoadTime.toFixed(2) + "ms",
    );
    console.log("Forced Reflow Time:", this.forcedReflowTime.toFixed(2) + "ms");
    console.groupEnd();
  },
};

// Monitor Core Web Vitals
if ("PerformanceObserver" in window) {
  // LCP
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    performanceMetrics.largestContentfulPaint = lastEntry.startTime;
  }).observe({ entryTypes: ["largest-contentful-paint"] });

  // FID
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      performanceMetrics.firstInputDelay =
        entry.processingStart - entry.startTime;
    }
  }).observe({ entryTypes: ["first-input"] });

  // CLS
  new PerformanceObserver((entryList) => {
    let clsValue = 0;
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    performanceMetrics.cumulativeLayoutShift = clsValue;
  }).observe({ entryTypes: ["layout-shift"] });
}

// Monitor custom metrics
performanceMetrics.startTimer("tokenizer");
const tokenizerObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.target.querySelector("[data-tokenizer-loaded]")) {
      performanceMetrics.endTimer("tokenizer");
      tokenizerObserver.disconnect();
    }
  });
});

tokenizerObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

// Log metrics when page is fully loaded
window.addEventListener("load", () => {
  setTimeout(() => {
    performanceMetrics.logMetrics();
    performanceMetrics.measureBundleSize();
  }, 1000);
});

// Export for global access
window.performanceMetrics = performanceMetrics;
