import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import Container from "../common/Container";
import SectionLabel from "../common/SectionLabel";
import { fadeUp } from "../common/animations";

import { ArrowRight, BlogIcon, MediumIcon } from "../Icons";

export default function Publications() {
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // PDF path - place your PDF in the public/credentials/ folder
  const pdfPath = "/credentials/ayn-rand.pdf";
  const youtubeVideoUrl = "https://youtu.be/cBhe-F_o9go?si=Gl0wrLzyoZB4kmKi";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleViewPdf = () => {
    if (isMobile) {
      window.open(pdfPath, "_blank");
    } else {
      setShowPdfViewer(!showPdfViewer);
    }
  };

  return (
    <Container id="writing" className="py-24 md:py-32">
      <SectionLabel>Publications & Literary Chronicles</SectionLabel>
      <motion.h2
        {...fadeUp}
        className="mb-12 max-w-[900px] font-display font-bold tracking-[-0.025em] text-ink leading-[1.08] text-[30px] md:text-[44px]"
      >
        Written philosophy, industry essays, and creative pursuits.
      </motion.h2>

      <motion.article
        {...fadeUp}
        className="border-t border-[color:var(--hairline)] py-10 last:border-b"
      >
        <div className="mono-label mb-3">Featured Professional Essay · Medium</div>
        <h3 className="max-w-[820px] font-display text-[24px] font-bold tracking-[-0.02em] text-ink md:text-[32px]">
          The Uncharted Path — Rewriting the Rules of Learning for a Life of True Worth.
        </h3>
        <p className="mt-4 max-w-[760px] text-[16px] leading-[1.75] text-ink-secondary">
          An analytical dissection challenging rigid, traditional education paths. The essay
          advocates for autonomous project ownership, deliberate architectural exploration, and
          prioritizing real-world software engineering deployments over passive learning patterns.
        </p>
        <a
          href="https://medium.com/@sravansaivuppula/the-uncharted-path-rewriting-the-rules-of-learning-for-a-life-of-true-worth-0f3b55c6befb"
          target="_blank"
          rel="noopener noreferrer"
          className="editorial-link mt-5 inline-flex items-center gap-2 text-[15px]"
        >
          <MediumIcon width={16} height={16} /> Open Publication Node{" "}
          <ArrowRight width={14} height={14} />
        </a>
      </motion.article>

      {/* Ayn Rand - Objectivism Special Section */}
      <motion.div
        {...fadeUp}
        className="mt-16 overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-white/60 to-white/15 backdrop-blur-xl shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]"
      >
        <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr]">
          {/* Left - Clear & Perfect Image Block */}
          <div className="relative min-h-[400px] overflow-hidden md:min-h-[500px]">
            <img
              src="credentials/ayn-rand-landscape.jpg"
              alt="Ayn Rand"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          {/* Right - Content */}
          <div className="relative z-10 flex flex-col justify-center p-8 md:p-12 lg:p-14">
            <div className="mono-label mb-4">Special Feature · Objectivism</div>

            <h3 className="font-display text-[32px] font-black leading-[1.08] tracking-[-0.025em] text-ink md:text-[44px]">
              Ayn Rand's{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Philosophy</span>
                <span className="absolute inset-x-0 bottom-2 z-0 h-2.5 rounded-full bg-[color:var(--accent-blue)]/30" />
              </span>
            </h3>

            <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-ink-secondary">
              <p>
                Ayn Rand, a visionary writer and philosopher, is renowned for her advocacy of
                individualism, reason, and rational self-interest. Her philosophy, known as
                Objectivism, champions the power of the individual to shape their own destiny
                happiness unapologetically.
              </p>
              <p className="italic text-ink">"If it's worth doing, it's worth doing well."</p>
              <p className="font-mono text-[12px] text-ink-muted">— Ayn Rand</p>
            </div>

            {/* Links Row - PDF + YouTube */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {/* PDF Button */}
              <button
                onClick={handleViewPdf}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14px] font-medium text-background transition-all hover:bg-deep-ink hover:scale-[1.02]"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {showPdfViewer && !isMobile
                  ? "Close Collection"
                  : isMobile
                    ? "Open PDF Collection"
                    : "Explore Her Collection"}
              </button>

              {/* YouTube Link */}
              <a
                href={youtubeVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] bg-white/50 px-6 py-3 text-[14px] font-medium text-ink transition-all hover:bg-white hover:shadow-md hover:scale-[1.02] group"
              >
                <svg className="h-4 w-4 text-ink" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Watch Presentation
                <ArrowRight
                  width={14}
                  height={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
            </div>

            {/* Divider & Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="h-px w-8 bg-[color:var(--hairline)]" />
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-ink-muted">
                <span>PDF Collection</span>
                <span className="opacity-30">·</span>
                <span>12 Works</span>
                <span className="opacity-30">·</span>
                <span>Video Presentation</span>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Viewer - Desktop Only */}
        <AnimatePresence>
          {showPdfViewer && !isMobile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-white/20 bg-black/5 backdrop-blur-sm"
            >
              <div className="p-6">
                <div className="overflow-hidden rounded-xl border border-white/20 bg-white/90 dark:bg-gray-900">
                  <iframe
                    src={`${pdfPath}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
                    className="h-[600px] w-full"
                    title="Ayn Rand - Objectivism Collection"
                    style={{ border: "none" }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="font-mono text-[11px] text-ink-muted">
                    Use the toolbar to navigate, zoom, or download
                  </p>
                  <button
                    onClick={() => window.open(pdfPath, "_blank")}
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-ink transition-colors hover:text-deep-ink"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Open in New Tab
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Notice */}
        {isMobile && (
          <div className="border-t border-white/20 bg-black/5 px-6 py-4">
            <p className="flex items-center gap-2 text-[13px] text-ink-secondary">
              <svg
                className="h-5 w-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span>
                Tap <strong>"Open PDF Collection"</strong> to view all works in a new tab.
              </span>
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-white/20 px-8 py-4 text-center">
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            Crafted with care by <b>Sravan Sai Vuppula</b> for a cause that matters
          </p>
        </div>
      </motion.div>

      {/* Premium Redesigned Literary Reflections Section */}
      <motion.div
        {...fadeUp}
        className="mt-12 overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-white/60 to-white/15 backdrop-blur-xl shadow-[0_20px_50px_-30px_rgba(15,23,42,0.2)]"
      >
        <a
          href="https://sailyfspot.blogspot.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col md:flex-row md:items-center justify-between gap-6 px-8 py-8 md:py-10 bg-[color:var(--background)]/40 transition-all duration-300 hover:bg-[color:var(--surface)]/60"
        >
          <div className="flex items-start md:items-center gap-5">
            <div className="flex-shrink-0 rounded-2xl bg-ink/5 p-4 text-ink-secondary transition-all duration-300 group-hover:bg-ink group-hover:text-background shadow-sm">
              <BlogIcon width={24} height={24} />
            </div>
            <div>
              <div className="mono-label mb-1.5 opacity-80">Chronicle Hub · Personal Blog</div>
              <h4 className="font-display text-[22px] md:text-[26px] font-bold tracking-[-0.02em] text-ink leading-tight flex items-center gap-2">
                Literary Reflections
              </h4>
              <p className="mt-1.5 text-[14px] text-ink-secondary max-w-[600px] leading-relaxed hidden md:block">
                A curated digital canvas exploring written cultural critique, architectural essays,
                and creative expressions.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[color:var(--hairline)] pt-4 md:pt-0 md:border-0">
            <div className="flex flex-col items-start md:items-end md:mr-4">
              <span className="font-mono text-[13px] font-medium tracking-wide text-ink">
                sailyfspot.blogspot.com
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-ink-muted mt-0.5">
                Node Link
              </span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-background transition-all duration-300 group-hover:translate-x-1 group-hover:border-ink group-hover:bg-ink group-hover:text-background">
              <ArrowRight width={16} height={16} />
            </div>
          </div>
        </a>
      </motion.div>
    </Container>
  );
}
