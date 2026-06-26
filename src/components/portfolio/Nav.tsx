import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Close } from "./Icons";

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Credentials", href: "#credentials" },
  { label: "Writing", href: "#writing" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          scrolled
            ? "backdrop-blur-md bg-[color:var(--background)]/85 border-b border-[color:var(--hairline)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5 md:px-12">
          <a href="#top" className="font-sans text-[15px] font-medium tracking-tight text-ink">
            Sravan Sai Vuppula
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative font-sans text-[14px] text-ink-secondary transition-colors hover:text-ink"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-200 ease-out group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
          <button
            className="md:hidden text-ink"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu width={22} height={22} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-background md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="font-sans text-[15px] font-medium">Sravan Sai Vuppula</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-ink">
                <Close width={22} height={22} />
              </button>
            </div>
            <nav className="mt-12 flex flex-col gap-8 px-8">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                  onClick={() => setOpen(false)}
                  className="font-display text-4xl font-semibold text-ink"
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
