import { useEffect, useState } from "react";
import { Menu, Close, DocIcon } from "./Icons";
import ssvLogo from "@/assets/ssv-name.png";

const links = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "LYFSpot", href: "#lyfspot" },
  { label: "Matrix", href: "#stack" },
  { label: "Work", href: "#work" },
  { label: "Credentials", href: "#credentials" },
  { label: "Writing", href: "#writing" },
  { label: "Contact", href: "#contact" },
];

export function Nav({ onLaunchResume }: { onLaunchResume?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          scrolled ? "bg-[color:var(--background)]/30 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-6 py-4 md:px-10">
          <a href="#top" className="flex items-center gap-3 group">
            <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full transition-transform group-hover:scale-105">
              <img src={ssvLogo} alt="Sravan Sai Vuppula" className="h-12 w-12 object-cover" />
            </span>
            <span className="font-display text-[19px] md:text-[22px] font-bold tracking-[-0.02em] text-ink">
              Sravan Sai Vuppula
            </span>
          </a>

          {/* Glass tube nav */}
          <nav className="hidden lg:flex">
            <ul className="flex items-center gap-1 rounded-full border border-white/40 bg-white/30 px-2 py-1.5 shadow-[0_8px_24px_-12px_rgba(26,33,40,0.18)] backdrop-blur-xl">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="block rounded-full px-3.5 py-1.5 font-display text-[12.5px] font-medium text-ink-secondary transition-colors hover:bg-white/60 hover:text-ink"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchResume}
              className="hidden items-center gap-2 rounded-full border border-[color:var(--hairline)] bg-white/40 px-4 py-2 text-[12px] font-medium text-ink backdrop-blur transition-colors hover:bg-white/70 md:inline-flex"
            >
              <DocIcon width={14} height={14} /> Launch Resume
            </button>
            <button
              onClick={() => setOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-sm text-ink lg:hidden"
              aria-label="Open menu"
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[color:var(--background)] px-6 py-6 lg:hidden">
          <div className="flex items-center justify-between">
            <span className="font-display text-[14px] font-semibold text-ink">Menu</span>
            <button
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-sm text-ink"
              aria-label="Close menu"
            >
              <Close />
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-5">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-[28px] font-bold tracking-[-0.02em] text-ink"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                onLaunchResume?.();
              }}
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--hairline)] bg-white/60 px-4 py-2 text-[13px] font-medium text-ink"
            >
              <DocIcon width={14} height={14} /> Launch Resume
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
