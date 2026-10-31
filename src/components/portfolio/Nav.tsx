import { useEffect, useState, useRef, startTransition } from "react";
import { motion } from "framer-motion";
import { Menu, Close, DocIcon } from "./Icons";
import ssvLogo from "@/assets/ssv-name.webp";

const links = [
  { id: "top", label: "Home", href: "/#top" },
  { id: "about", label: "About", href: "/#about" },
  { id: "lyfspot", label: "LYFSpot", href: "/#lyfspot" },
  { id: "stack", label: "Matrix", href: "/#stack" },
  { id: "work", label: "Work", href: "/#work" },
  { id: "credentials", label: "Credentials", href: "/#credentials" },
  { id: "writing", label: "Writing", href: "/#writing" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

export function Nav({ onLaunchResume }: { onLaunchResume?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("top");
  const [isHomePage, setIsHomePage] = useState(true);
  const [isStoryLab, setIsStoryLab] = useState(false);
  const isClickScrollingRef = useRef(false);
  const clickTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const pathname = window.location.pathname;
    const isHome = pathname === "/" || pathname === "";
    const isStory = pathname.startsWith("/story-lab");

    setIsHomePage(isHome);
    setIsStoryLab(isStory);

    if (isStory) {
      setActiveId("story-lab");
      return;
    }

    if (!isHome) return;

    const initialHash = window.location.hash.replace("#", "");
    if (initialHash && links.some((l) => l.id === initialHash)) {
      setActiveId(initialHash);
    }

    const sectionIds = links.map((l) => l.id);

    const handleScroll = () => {
      setScrolled(window.scrollY > 8);

      // Suppress active tab jumping while smooth scroll from click is in progress
      if (isClickScrollingRef.current) return;

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Bottom of page detection (Contact section)
      if (scrollPosition + windowHeight >= documentHeight - 60) {
        setActiveId("contact");
        return;
      }

      // Top of page detection (Hero / Home section)
      if (scrollPosition < 150) {
        setActiveId("top");
        return;
      }

      // Viewport reading focus line: header height (~80px) + offset (~100px)
      const focalLine = 180;
      let currentSection = "top";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= focalLine) {
            currentSection = id;
          }
        }
      }

      setActiveId(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (clickTimeoutRef.current) {
        window.clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    if (typeof window === "undefined") return;

    const pathname = window.location.pathname;
    const isHome = pathname === "/" || pathname === "";

    if (isHome) {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        isClickScrollingRef.current = true;
        setActiveId(id);

        if (clickTimeoutRef.current) {
          window.clearTimeout(clickTimeoutRef.current);
        }

        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `#${id}`);

        // Re-enable scroll listener once smooth scroll transit settles
        clickTimeoutRef.current = window.setTimeout(() => {
          isClickScrollingRef.current = false;
        }, 850);
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === "undefined") return;
    const isHome = window.location.pathname === "/" || window.location.pathname === "";
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById("top");
      if (el) {
        isClickScrollingRef.current = true;
        setActiveId("top");
        if (clickTimeoutRef.current) {
          window.clearTimeout(clickTimeoutRef.current);
        }
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", "#top");
        clickTimeoutRef.current = window.setTimeout(() => {
          isClickScrollingRef.current = false;
        }, 850);
      }
    }
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          scrolled ? "bg-(--background)/30 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-375 items-center justify-between gap-6 px-6 py-4 md:px-10">
          <a href="/#top" onClick={handleLogoClick} className="flex items-center gap-3 group">
            <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full transition-transform group-hover:scale-105">
              <img
                src={ssvLogo}
                alt="Sravan Sai Vuppula"
                className="h-12 w-12 object-cover"
                loading="eager"
                decoding="async"
                width="48"
                height="48"
              />
            </span>
            <span className="font-display text-[19px] md:text-[22px] font-bold tracking-tight text-ink">
              Sravan Sai Vuppula
            </span>
          </a>

          {/* Glass tube nav */}
          <nav className="hidden lg:flex">
            <ul className="relative flex items-center gap-1 rounded-full border border-white/40 bg-white/30 px-2 py-1.5 shadow-[0_8px_24px_-12px_rgba(26,33,40,0.18)] backdrop-blur-xl">
              {links.map((l) => {
                const isActive = isHomePage && activeId === l.id;
                return (
                  <li key={l.href} className="relative">
                    <a
                      href={l.href}
                      onClick={(e) => handleLinkClick(e, l.href, l.id)}
                      className={`relative z-10 block rounded-full px-3.5 py-1.5 font-display text-[12.5px] transition-colors duration-200 select-none ${
                        isActive
                          ? "font-semibold text-ink"
                          : "font-medium text-ink-secondary hover:text-ink hover:bg-white/40"
                      }`}
                    >
                      {l.label}
                    </a>

                    {/* Animated Cover Label & Clean Underline */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 32,
                        }}
                        className="absolute inset-0 z-0 rounded-full bg-white/90 shadow-[0_2px_8px_-2px_rgba(26,33,40,0.12),0_1px_2px_rgba(26,33,40,0.06)] border border-black/5 flex flex-col justify-end items-center pb-0.5"
                      >
                        {/* Precision accent underline */}
                        <span className="h-[2px] w-3.5 rounded-full bg-accent-blue" />
                      </motion.div>
                    )}
                  </li>
                );
              })}

              {/* Story Lab Button */}
              <li className="relative">
                <a
                  href="/story-lab"
                  className={`relative z-10 ml-1 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-serif text-[12.5px] italic transition-all duration-300 ${
                    isStoryLab
                      ? "bg-linear-to-r from-slate-900 via-accent-blue/80 to-slate-900 text-white shadow-md shadow-accent-blue/20 ring-2 ring-accent-blue/50"
                      : "bg-linear-to-r from-slate-800 to-black text-white hover:scale-105 hover:shadow-lg hover:shadow-black/20"
                  }`}
                >
                  {isStoryLab && <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-pulse" />}
                  Story Lab
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchResume}
              className="hidden items-center gap-2 rounded-full border border-hairline bg-white/40 px-4 py-2 text-[12px] font-medium text-ink backdrop-blur transition-colors hover:bg-white/70 md:inline-flex"
            >
              <DocIcon width={14} height={14} /> View Resume
            </button>
            <button
              onClick={() => startTransition(() => setOpen(true))}
              className="grid h-12 w-12 place-items-center rounded-sm text-ink lg:hidden"
              aria-label="Open menu"
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background px-6 py-6 lg:hidden">
          <div className="flex items-center justify-between">
            <span className="font-display text-[14px] font-semibold text-ink">Menu</span>
            <button
              onClick={() => startTransition(() => setOpen(false))}
              className="grid h-12 w-12 place-items-center rounded-sm text-ink"
              aria-label="Close menu"
            >
              <Close />
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-5">
            {links.map((l) => {
              const isActive = isHomePage && activeId === l.id;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => {
                    startTransition(() => setOpen(false));
                    handleLinkClick(e, l.href, l.id);
                  }}
                  className={`flex items-center justify-between font-display text-[28px] font-bold tracking-tight transition-colors ${
                    isActive ? "text-accent-blue pl-2 border-l-2 border-accent-blue" : "text-ink"
                  }`}
                >
                  <span>{l.label}</span>
                  {isActive && <span className="h-2 w-2 rounded-full bg-accent-blue" />}
                </a>
              );
            })}
            <a
              href="/story-lab"
              onClick={() => startTransition(() => setOpen(false))}
              className={`font-serif text-[32px] font-bold italic tracking-tight flex items-center justify-between mt-2 ${
                isStoryLab ? "text-accent-blue" : "text-ink"
              }`}
            >
              <span>The Story Lab</span>
              {isStoryLab && <span className="h-2 w-2 rounded-full bg-accent-blue" />}
            </a>
            <button
              onClick={() => {
                startTransition(() => setOpen(false));
                onLaunchResume?.();
              }}
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-hairline bg-white/60 px-4 py-2 text-[13px] font-medium text-ink"
            >
              <DocIcon width={14} height={14} /> View Resume
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
