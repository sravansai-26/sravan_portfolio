import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-[color:var(--background)]/70 border-b border-[color:var(--hairline)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-center px-6 py-5">
        <a
          href="#top"
          className="font-sans text-[15px] font-semibold tracking-tight text-ink"
        >
          Sravan Sai Vuppula
        </a>
      </div>
    </header>
  );
}
