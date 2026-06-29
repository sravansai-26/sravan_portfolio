import { motion } from "framer-motion";

import Container from "../common/Container";
import SectionLabel from "../common/SectionLabel";
import { fadeUp } from "../common/animations";

import {
  ArrowRight,
  BlogIcon,
  LinkedInIcon,
  TelegramIcon,
  WhatsAppIcon,
  LinktreeIcon,
  InstagramIcon,
  YouTubeIcon,
  ThreadsIcon,
  FacebookIcon,
  SparkIcon,
} from "../Icons";

const timeline = [
  {
    year: "2020",
    title: "Origin",
    body: "Launched the primary digital footprint via the foundational blog network at sailyfspot.blogspot.com, establishing initial technical discourse and product ideation channels.",
  },
  {
    year: "2022",
    title: "Phase I Frameworks",
    body: "Initiated development on early business logic automation engines (IVOpt) and conversational knowledge bases (UneCust).",
  },
  {
    year: "2024",
    title: "Scaled Infrastructure",
    body: "Transitioned to complete MERN stack deployment pipelines, laying down the groundwork for production management platforms (Shotweave) and advanced deployment abstractions (DeployBridge).",
  },
  {
    year: "2026",
    title: "Conglomerate Maturity",
    body: "Full convergence of web, mobile applications (LoadMate), enterprise cloud environments, and emerging deep-tech research sectors.",
  },
];

const pipeline = [
  {
    name: "Philistine",
    body: "A strategic development gateway engineered for innovators, problem solvers, and upcoming entrepreneurs — providing critical technical architecture frameworks and moral execution support to launch raw concepts.",
  },
  {
    name: "IVOpt",
    body: "An enterprise billing and financial tracking engine meticulously optimized to streamline fiscal workflows for small-to-medium enterprises.",
  },
  {
    name: "UneCust",
    body: "An interactive conversational knowledge agent built for rapid information discovery and responsive instant answers.",
    cta: { label: "Visit UneCust's Demo", href: "https://unecust-bot-93c0a9.zapier.app/" },
  },
  {
    name: "Project Classified — Deep Tech Division",
    body: "An advanced project merging proprietary software with advanced hardware configurations, integrating hologram, AR, and VR wearable technologies intended to provide critical situational alert safety networks. Status: Architectural Schematics Phase.",
  },
];

const networks = [
  { Icon: BlogIcon, label: "Primary Web Node", href: "https://sailyfspot.blogspot.com" },
  {
    Icon: LinkedInIcon,
    label: "Corporate Hub",
    href: "https://www.linkedin.com/company/lyfspot",
  },
  { Icon: TelegramIcon, label: "Channel Matrix", href: "https://t.me/lyfspot" },
  {
    Icon: WhatsAppIcon,
    label: "Broadcast Node",
    href: "https://whatsapp.com/channel/0029Va74d5MCcW4puaVyRj2V",
  },
  { Icon: LinktreeIcon, label: "Unified Directory", href: "https://linktr.ee/lyfspot" },
  { Icon: InstagramIcon, label: "Creative Stream", href: "https://instagram.com/lyfspot" },
  { Icon: YouTubeIcon, label: "Video Directory", href: "https://youtube.com/@lyfspot" },
  { Icon: ThreadsIcon, label: "Dialogue Portal", href: "https://www.threads.net/@lyfspot" },
  {
    Icon: FacebookIcon,
    label: "Legacy Identity",
    href: "https://www.facebook.com/VuppulaSravanSai/",
  },
];

export default function LyfspotJourney() {
  return (
    <Container id="lyfspot" className="py-24 md:py-32">
      <SectionLabel>The LYFSpot Ecosystem · Oct 2020 – Present · 5y 9m</SectionLabel>
      <motion.h2
        {...fadeUp}
        className="max-w-[900px] font-display font-bold tracking-[-0.025em] text-ink leading-[1.08] text-[30px] md:text-[44px]"
      >
        A decentralized product ecosystem that refines, simplifies, and elevates corporate, civic,
        and creative operations.
      </motion.h2>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        <motion.div {...fadeUp} className="border-t border-[color:var(--hairline)] pt-6">
          <div className="mono-label mb-3">Mission</div>
          <p className="text-[17px] leading-[1.7] text-ink">
            Transforming complex computational patterns into accessible, high-performance digital
            utilities engineered for human well-being.
          </p>
        </motion.div>
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="border-t border-[color:var(--hairline)] pt-6"
        >
          <div className="mono-label mb-3">Vision</div>
          <p className="text-[17px] leading-[1.7] text-ink">
            Orchestrating a decentralized product ecosystem that refines, simplifies, and elevates
            corporate, civic, and creative operations with absolute precision.
          </p>
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="mt-20">
        <div className="mono-label mb-8">The 5-Year Evolution · 2020 → 2026</div>
        <div className="space-y-0">
          {timeline.map((t, i) => (
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.05 }}
              key={t.year}
              className="grid grid-cols-[80px_minmax(0,1fr)] gap-6 border-t border-[color:var(--hairline)] py-8 md:grid-cols-[120px_220px_minmax(0,1fr)] md:gap-12 md:py-10"
            >
              <div className="font-mono text-[13px] text-ink-muted md:pt-1">{t.year}</div>
              <div className="font-display text-[22px] font-semibold tracking-[-0.02em] text-ink md:text-[26px]">
                {t.title}
              </div>
              <div className="col-span-2 max-w-[640px] text-[16px] leading-[1.7] text-ink-secondary md:col-span-1">
                {t.body}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pipeline */}
      <div className="mt-20">
        <div className="mono-label mb-8">Future Pipelines · The Strategic Incubator</div>
        <div className="space-y-0">
          {pipeline.map((p, i) => (
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.05 }}
              key={p.name}
              className="border-t border-[color:var(--hairline)] py-8 md:py-10 last:border-b"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[280px_minmax(0,1fr)] md:gap-12">
                <div className="font-display text-[22px] font-semibold tracking-[-0.02em] text-ink md:text-[26px]">
                  {p.name}
                </div>
                <div>
                  <p className="max-w-[640px] text-[16px] leading-[1.7] text-ink-secondary">
                    {p.body}
                  </p>
                  {p.cta && (
                    <a
                      href={p.cta.href}
                      target="_blank"
                      rel="noreferrer"
                      className="editorial-link mt-4 inline-flex items-center gap-2 text-[15px]"
                    >
                      <SparkIcon width={14} height={14} /> {p.cta.label}{" "}
                      <ArrowRight width={14} height={14} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Network */}
      <div className="mt-20">
        <div className="mono-label mb-8">Executive Communication Network</div>
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-[color:var(--hairline)] sm:grid-cols-2 lg:grid-cols-3">
          {networks.map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between gap-4 bg-[color:var(--background)] px-5 py-5 outline outline-1 outline-[color:var(--hairline)] transition-colors hover:bg-[color:var(--surface)]"
            >
              <span className="flex items-center gap-3">
                <Icon width={18} height={18} className="text-ink-secondary" />
                <span className="text-[15px] text-ink">{label}</span>
              </span>
              <ArrowRight
                width={14}
                height={14}
                className="text-ink-muted transition-transform group-hover:translate-x-1"
              />
            </a>
          ))}
        </div>
      </div>
    </Container>
  );
}
