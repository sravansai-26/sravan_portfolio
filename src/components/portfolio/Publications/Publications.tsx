import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef, startTransition } from "react";

import Container from "../common/Container";
import SectionLabel from "../common/SectionLabel";
import { fadeUp } from "../common/animations";

import { ArrowRight, BlogIcon, MediumIcon } from "../Icons";

export default function Publications() {
  const [showStartupPdf, setShowStartupPdf] = useState(false);
  const [isPlayingTeaser, setIsPlayingTeaser] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // File Paths & Links (located in public/credentials/)
  const aynRandPdfPath = "/credentials/ayn-rand.pdf";
  const startupGuidePdfPath = "/credentials/startup-guide.pdf#toolbar=0&navpanes=0&scrollbar=0";
  const aynRandYoutubeUrl = "https://youtu.be/cBhe-F_o9go?si=Gl0wrLzyoZB4kmKi";

  // Teaser Media Assets & External Links (Hosted via Vercel Blob CDN)
  const storyTeaserVideoUrl =
    "https://im6emjdg0usbvzpe.public.blob.vercel-storage.com/teaser-glimpse.mp4";
  const storyTeaserThumbnailPath = "/credentials/thumbnail.webp";
  const dlLogoPath = "/credentials/dl-logo.png";
  const storyTeaserYoutubeUrl = "https://youtu.be/FEP1wO878wA?si=58EHiohJStZxWq8b";
  const divyaPriyaYoutubeUrl = "https://youtube.com/@divyapriyadegala638?si=3c-Q4DRnpcweUNi7";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleViewAynRandPdf = () => {
    window.open(aynRandPdfPath, "_blank");
  };

  const handleOpenStartupGuide = () => {
    startTransition(() => setShowStartupPdf(true));
  };

  const handleStartInlineVideo = () => {
    setIsPlayingTeaser(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleScrollToDreamLaunch = () => {
    // Searches for specific DreamLaunch element ID first, falls back to general work section
    const targetElement = document.getElementById("dreamlaunch") || document.getElementById("work");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Container id="writing" className="py-24 md:py-32">
      <SectionLabel>Publications &amp; Literary Chronicles</SectionLabel>
      <motion.h2
        {...fadeUp}
        className="mb-12 max-w-[900px] font-display font-bold tracking-[-0.025em] text-ink leading-[1.08] text-[30px] md:text-[44px]"
      >
        Written philosophy, industry essays, and creative pursuits.
      </motion.h2>

      {/* SPECIAL LITERARY FEATURE: "కథలో..." STORY TEASER & DREAMLAUNCH */}
      <motion.div
        {...fadeUp}
        className="mb-16 overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-white/60 to-white/15 backdrop-blur-xl shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] p-8 md:p-12 lg:p-14"
      >
        {/* 1. TOP SECTION: Horizontal 16:9 Cinema Video Player with YouTube Thumbnail Overlay */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/20 bg-slate-950 shadow-2xl">
          <video
            ref={videoRef}
            src={storyTeaserVideoUrl}
            poster={storyTeaserThumbnailPath}
            controls={isPlayingTeaser}
            preload="metadata"
            className="h-full w-full object-cover"
            onPlay={() => setIsPlayingTeaser(true)}
            onPause={() => setIsPlayingTeaser(false)}
          >
            <track kind="captions" srcLang="en" label="English captions" src="/credentials/empty-captions.vtt" default={false} />
          </video>

          {/* Initial Poster & Play Badge Overlay */}
          {!isPlayingTeaser && (
            <div
              onClick={handleStartInlineVideo}
              className="absolute inset-0 flex flex-col justify-between p-6 bg-slate-950/30 transition-all duration-300 hover:bg-slate-950/10 cursor-pointer group"
            >
              {/* Top Header Labels */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-white/90 bg-slate-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                  Official Book Teaser
                </span>
                <span className="font-mono text-xs text-white/90 bg-slate-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                  Story by సాయి
                </span>
              </div>

              {/* Center Play Circle */}
              <div className="my-auto self-center">
                <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full border border-white/40 bg-slate-950/60 text-white shadow-2xl backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-slate-950">
                  <svg className="h-8 w-8 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Bottom Instruction Tag */}
              <div className="font-mono text-xs text-white/90 bg-slate-950/70 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 w-fit">
                Click to play teaser video directly
              </div>
            </div>
          )}
        </div>

        {/* 2. BOTTOM SECTION: Narrative Details & Context */}
        <div className="mt-8 max-w-4xl">
          <div className="mono-label mb-3">Literary Chronicle · Original Story</div>

          <h3 className="font-display text-[32px] font-black leading-[1.08] tracking-[-0.025em] text-ink md:text-[44px]">
            కథలో... —{" "}
            <span className="relative inline-block">
              <span className="relative z-10">The Way It Actually Happens</span>
              <span className="absolute inset-x-0 bottom-1.5 z-0 h-2.5 rounded-full bg-[color:var(--accent-blue)]/30" />
            </span>
          </h3>

          {/* Telugu Excerpt Banner */}
          <div className="mt-5 rounded-2xl border border-[color:var(--hairline)] bg-white/40 p-5 backdrop-blur-sm">
            <p className="font-serif text-[16px] italic leading-relaxed text-ink md:text-[17px]">
              "మాటలు రాని ప్రేమకి, మౌనం రాసిన కథ ఇది... వస్తారని కాదు, కానీ మరచిపోవడం ఎలా అన్న ఆలోచన
              మాత్రమే అలానే మిగిలిపోయింది."
            </p>
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-ink-secondary md:text-[16px]">
            A glimpse into an essence that feels more like real life than fiction. Not drama. Not
            fantasy. Just something that stayed — even when it didn't have to. Brought to life
            through the interwoven journeys of{" "}
            <strong className="text-ink font-semibold">Sai, Kumudha, Chinni, and Amrutha</strong>.
          </p>

          {/* DreamLaunch Section with Original Logo & Creator Link */}
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-[color:var(--hairline)] bg-white/30 p-4 backdrop-blur-sm">
            {/* Clickable DreamLaunch Navigation Group */}
            <div
              onClick={handleScrollToDreamLaunch}
              className="flex items-center gap-3 cursor-pointer group transition-opacity hover:opacity-80"
            >
              <img
                src="/credentials/dl-logo.webp"
                alt="DreamLaunch Logo"
                className="h-10 md:h-12 w-auto object-contain"
                loading="lazy"
                decoding="async"
                width={120}
                height={48}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="font-display font-bold text-[15px] text-ink transition-colors group-hover:text-ink-secondary">
                DreamLaunch Platform
              </span>
            </div>

            <span className="text-ink-muted">·</span>

            {/* Divya Priya Degala YouTube Channel Link */}
            <span className="text-[13.5px] text-ink-secondary">
              First official launch presented &amp; unveiled by{" "}
              <a
                href={divyaPriyaYoutubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-ink transition-colors hover:text-ink-secondary"
              >
                Divya Priya Degala
              </a>
            </span>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--hairline)] pt-6">
          <div className="flex flex-wrap items-center gap-4">
            {!isPlayingTeaser ? (
              <button
                onClick={handleStartInlineVideo}
                className="inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-3.5 text-[14px] font-medium text-background transition-all hover:bg-deep-ink hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play Teaser Video
              </button>
            ) : (
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.pause();
                    setIsPlayingTeaser(false);
                  }
                }}
                className="inline-flex items-center gap-2.5 rounded-full border border-[color:var(--hairline)] bg-white/50 px-7 py-3.5 text-[14px] font-medium text-ink transition-all hover:bg-white cursor-pointer"
              >
                Pause Video
              </button>
            )}

            {/* Navigation Link to YouTube */}
            <a
              href={storyTeaserYoutubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] bg-white/50 px-6 py-3.5 text-[14px] font-medium text-ink transition-all hover:bg-white hover:shadow-md hover:scale-[1.02] group"
            >
              <svg className="h-4 w-4 text-ink" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              Watch on YouTube
              <ArrowRight
                width={14}
                height={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>

          <div className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            Book Coming Soon · #somethingthatstays
          </div>
        </div>
      </motion.div>

      {/* Featured Essay Article */}
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
          <div className="relative min-h-[400px] overflow-hidden md:min-h-[500px]">
            <img
              src="credentials/ayn-rand-landscape.jpg"
              alt="Ayn Rand"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
              loading="lazy"
              decoding="async"
              width={800}
              height={500}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

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
                Objectivism, champions the power of the individual to shape their own destiny &amp;
                happiness unapologetically.
              </p>
              <p className="italic text-ink">"If it's worth doing, it's worth doing well."</p>
              <p className="font-mono text-[12px] text-ink-muted">— Ayn Rand</p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={handleViewAynRandPdf}
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
                Open PDF Collection
              </button>

              <a
                href={aynRandYoutubeUrl}
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
      </motion.div>

      {/* STARTUP UNLOCKED - FEATURED PUBLICATION */}
      <motion.div
        {...fadeUp}
        className="mt-12 overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-white/60 to-white/15 backdrop-blur-xl shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative z-10 flex flex-col justify-center p-8 md:p-12 lg:p-14">
            <div className="mono-label mb-4">Foundational Knowledge · LYFSpot Reference</div>

            <h3 className="font-display text-[32px] font-black leading-[1.08] tracking-[-0.025em] text-ink md:text-[42px]">
              From Zero to Scale —{" "}
              <span className="relative inline-block">
                <span className="relative z-10">A Real-World Startup Compendium</span>
                <span className="absolute inset-x-0 bottom-1.5 z-0 h-2.5 rounded-full bg-[color:var(--accent-blue)]/30" />
              </span>
            </h3>

            <p className="mt-4 text-[15px] leading-relaxed text-ink-secondary">
              A comprehensive field guide written for ambitious creators, builders, and aspiring
              entrepreneurs. Covers core legal foundations, product development cycles, unit
              metrics, fundraising strategies, and scaling mechanics.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 font-mono text-[12px] text-ink-secondary">
              <div className="flex items-center gap-2 rounded-xl border border-[color:var(--hairline)] bg-white/40 p-2.5">
                <span className="font-bold text-ink">01</span> Incorporation &amp; Legal
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[color:var(--hairline)] bg-white/40 p-2.5">
                <span className="font-bold text-ink">02</span> Building the MVP
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[color:var(--hairline)] bg-white/40 p-2.5">
                <span className="font-bold text-ink">03</span> Unit Economics &amp; Moats
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[color:var(--hairline)] bg-white/40 p-2.5">
                <span className="font-bold text-ink">04</span> A–Z Founder Glossary
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={handleOpenStartupGuide}
                className="inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-3.5 text-[14px] font-medium text-background transition-all hover:bg-deep-ink hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Open Guide
                <ArrowRight width={14} height={14} />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[color:var(--hairline)] pt-4">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                37 Pages
              </span>
              <span className="opacity-30">·</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                Interactive Reader
              </span>
              <span className="opacity-30">·</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                View Only
              </span>
            </div>
          </div>

          <div className="relative flex flex-col justify-between overflow-hidden bg-ink p-8 text-background lg:p-12">
            <div className="relative z-10 flex items-center justify-between gap-4">
              <span className="font-mono text-[11px] uppercase tracking-widest text-background/60">
                LYFSpot Editions
              </span>
              <img
                src="credentials/lyfspot-logo.webp"
                alt="LYFSpot Logo"
                className="h-10 w-10 rounded-full object-contain bg-white p-0.5 shadow-sm"
                loading="lazy"
                decoding="async"
                width={40}
                height={40}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <div className="relative z-10 my-auto py-8">
              <div className="font-mono text-xs uppercase tracking-widest text-background/70 mb-2">
                A Founder's Field Guide
              </div>
              <h4 className="font-display text-3xl font-black tracking-tight text-background md:text-5xl leading-tight">
                STARTUP
                <br />
                UNLOCKED
              </h4>
              <p className="mt-4 text-xs md:text-sm text-background/80 max-w-[320px] leading-relaxed">
                Everything a first-time founder needs to know — from legal registration to Series A
                and global scaling.
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-4 font-mono text-[11px] text-background/60">
              <span>Sravan Sai Vuppula</span>
              <span>Legal &amp; Funding</span>
            </div>
          </div>
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

      {/* READ-ONLY VIEW-ONLY PDF MODAL */}
      <AnimatePresence>
        {showStartupPdf && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 md:p-8 backdrop-blur-md"
            onClick={() => startTransition(() => setShowStartupPdf(false))}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/20 bg-slate-900 shadow-2xl"
            >
              {/* Modal Header Bar */}
              <div className="flex items-center justify-between border-b border-white/10 bg-slate-950 px-6 py-4 text-white">
                <span className="font-display font-semibold text-sm md:text-base tracking-wide">
                  Startup Unlocked — LYFSpot Founder Guide
                </span>

                <div className="flex items-center gap-3">
                  <span className="hidden md:inline-block font-mono text-[11px] uppercase tracking-wider text-slate-400 bg-white/5 px-3 py-1 rounded-full">
                    Read-Only Digital Edition
                  </span>
                  <button
                    onClick={() => startTransition(() => setShowStartupPdf(false))}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 cursor-pointer"
                    aria-label="Close PDF Viewer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Secure Embed View Container */}
              <div className="relative flex-1 bg-slate-950">
                <object data={startupGuidePdfPath} type="application/pdf" className="h-full w-full">
                  <iframe
                    src={startupGuidePdfPath}
                    className="h-full w-full border-0"
                    title="Startup Unlocked Guide Viewer"
                  />
                </object>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}
