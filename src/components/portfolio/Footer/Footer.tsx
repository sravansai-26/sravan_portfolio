import ssvLogo from "@/assets/ssv-name.png";
import catImg from "@/assets/footer-cat.jpeg";

import {
  LinkedInIcon,
  XIcon,
  MediumIcon,
  LinktreeIcon,
  GitHubIcon,
  InstagramIcon,
  TelegramIcon,
} from "../Icons";

import Container from "../common/Container";

export default function Footer() {
  const socials = [
    {
      Icon: LinkedInIcon,
      href: "https://www.linkedin.com/in/sravan-sai-vuppula-753b711ba",
      label: "LinkedIn",
    },
    { Icon: XIcon, href: "https://twitter.com/vuppula_sai", label: "X" },
    { Icon: MediumIcon, href: "https://medium.com/@sravansaivuppula", label: "Medium" },
    { Icon: LinktreeIcon, href: "https://linktr.ee/uneducatedcustomer", label: "Linktree" },
    { Icon: GitHubIcon, href: "https://github.com/sravansai-26", label: "GitHub" },
    { Icon: InstagramIcon, href: "https://instagram.com/beinguneducated", label: "Instagram" },
    { Icon: TelegramIcon, href: "https://t.me/uneducated26", label: "Telegram" },
  ];
  return (
    <footer className="mt-20 border-t border-[color:var(--hairline)]">
      <Container className="py-16 md:py-20">
        {/* Philosophy quote */}
        <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-white/60 to-white/15 backdrop-blur-xl shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]">
          <div className="grid min-h-[420px] grid-cols-1 md:grid-cols-[0.85fr_1.15fr]">
            {/* Left Content */}
            <div className="relative z-20 flex flex-col justify-center p-8 md:px-12 md:py-14">
              <div className="mono-label mb-6">Philosophy · The Founder's Mantra</div>

              <p className="font-display text-[38px] font-black leading-[1.04] tracking-[-0.035em] text-ink md:text-[60px] lg:text-[76px]">
                Work <span className="text-ink-muted">&amp;</span>{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">Enjoy!</span>
                  <span className="absolute inset-x-0 bottom-2 z-0 h-2.5 rounded-full bg-[color:var(--accent-blue)]/30" />
                </span>{" "}
                <span className="text-ink-muted">:)</span>
              </p>

              <div className="mt-10 flex items-center gap-3 text-[13px] text-ink-secondary md:text-[14px]">
                <span className="h-px w-12 bg-ink-muted" />
                <span className="font-display font-semibold tracking-tight">
                  Sravan Sai Vuppula
                </span>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-[340px] overflow-hidden md:h-full">
              <img
                src={catImg}
                alt="Work & Enjoy"
                className="absolute inset-0 h-full w-full object-cover object-center scale-[1.12] transition-transform duration-700"
              />

              {/* Soft blend into text */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/18 to-transparent md:from-white/95 md:via-white/12 md:to-transparent" />

              {/* Premium vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5" />

              {/* Soft highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
            </div>
          </div>
        </div>
        {/* Bottom strip */}
        <div className="mt-12 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-[color:var(--hairline)]">
              <img src={ssvLogo} alt="Sravan Sai Vuppula" className="h-14 w-14 object-cover" />
            </span>
            <div>
              <div className="font-display text-[16px] font-bold text-ink">Sravan Sai Vuppula</div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                Designed and Engineered by LYFSpot for its Originator
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-12 w-12 place-items-center rounded-full border border-[color:var(--hairline)] bg-white/40 text-ink-secondary backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white hover:text-ink"
              >
                <Icon width={20} height={20} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-[color:var(--hairline)] pt-6 text-center">
          <div
            className="text-[12px] uppercase tracking-[0.18em] text-ink-muted"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            © 2026 Sravan Sai Vuppula. All rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  );
}
