import { useEffect, useState } from "react";
import { Menu, Close, DocIcon } from "./Icons";

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

export function Nav() {
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
          scrolled
            ? "backdrop-blur bg-[color:var(--background)]/75 border-b border-[color:var(--hairline)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-4 md:px-12">
          <a href="#top" className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-sm border border-[color:var(--hairline)] bg-[color:var(--surface)] font-mono text-[11px] font-bold text-ink">
              LS
            </span>
            <span className="font-display text-[14px] font-semibold tracking-tight text-ink">
              Sravan Sai Vuppula
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-secondary transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#resume"
              className="hidden items-center gap-2 rounded-full border border-[color:var(--hairline)] px-4 py-2 text-[12px] font-medium text-ink transition-colors hover:bg-[color:var(--surface)] md:inline-flex"
            >
              <DocIcon width={14} height={14} /> Launch Resume
            </a>
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
          </nav>
        </div>
      )}
    </>
  );
}
