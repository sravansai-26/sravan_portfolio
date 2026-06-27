import { type ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import sravanImg from "@/assets/sravan-cutout.png";
import ssvMark from "@/assets/ssv-mark.png";
import {
  ArrowRight,
  Close,
  Send,
  ExternalLink,
  WebIcon,
  BlogIcon,
  GatewayIcon,
  DesignIcon,
  DocIcon,
  ShieldIcon,
  SparkIcon,
  GitHubIcon,
  LinkedInIcon,
  XIcon,
  MediumIcon,
  LinktreeIcon,
  TelegramIcon,
  WhatsAppIcon,
  InstagramIcon,
  YouTubeIcon,
  ThreadsIcon,
  FacebookIcon,
  WritcoIcon,
} from "./Icons";
import { ArchitecturePlayground } from "./ArchitecturePlayground";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6 },
};

function Container({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto w-full max-w-[1180px] px-6 md:px-12 ${className}`}>
      {children}
    </section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="mono-label mb-6">{children}</div>;
}

/* ---------- HERO ---------- */
function Hero({ onLaunchResume }: { onLaunchResume: () => void }) {
  return (
    <section id="top" className="relative pt-28 md:pt-32">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-12 px-6 pb-10 md:grid-cols-[1.3fr_1fr] md:gap-16 md:px-12 md:pb-0">
        <div className="flex flex-col justify-center md:pt-16 md:pb-24">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-black tracking-[-0.035em] text-ink leading-[1.02] text-[40px] sm:text-[52px] md:text-[64px] lg:text-[78px]"
          >
            Engineering full-stack digital{" "}
            <span className="font-mono font-medium tracking-[-0.02em] text-[0.78em] align-baseline">
              ecosystems()
            </span>{" "}
            with architectural precision and human-centric purpose.
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="mt-8 max-w-[560px] text-[16px] leading-[1.7] text-ink-secondary md:text-[17px]"
          >
            Founder and Lead Developer of{" "}
            <a className="editorial-link" href="#lyfspot">LYFSpot</a>. Bridging the gap
            between robust system architecture, sleek MERN-stack applications, and
            deep-tech enterprise systems. Crafting digital products that reject rigid
            templates to elevate modern everyday lives.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={onLaunchResume}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[14px] font-medium text-background transition-colors hover:bg-deep-ink"
            >
              <DocIcon width={16} height={16} /> Launch Interactive Resume
            </button>
            <a href="#contact" className="editorial-link inline-flex items-center gap-2 text-[14px]">
              Get in touch <ArrowRight width={14} height={14} />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.0, delay: 0.25 }}
          className="relative mx-auto w-full max-w-[460px] md:max-w-none md:translate-x-10 lg:translate-x-16"
        >
          <div className="relative aspect-[4/5] w-full">
            <div
              className="absolute inset-0 rounded-[2px]"
              style={{
                background:
                  "radial-gradient(120% 80% at 70% 30%, rgba(238,244,246,0.6) 0%, rgba(220,229,234,0.3) 55%, rgba(194,208,216,0) 100%)",
              }}
            />
            <img
              src={sravanImg}
              alt="Sravan Sai Vuppula, Founder of LYFSpot"
              className="absolute inset-x-0 bottom-0 mx-auto h-[110%] w-auto max-w-none object-contain object-bottom"
              loading="eager"
              decoding="async"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- IDENTITY ---------- */
function Identity() {
  return (
    <Container id="about" className="py-24 md:py-32">
      <SectionLabel>The Founder's Identity</SectionLabel>
      <motion.h2
        {...fadeUp}
        className="max-w-[900px] font-display font-bold tracking-[-0.025em] text-ink leading-[1.08] text-[30px] md:text-[44px]"
      >
        Two disciplines, one practice — the professional engineer and the creative storyteller.
      </motion.h2>

      <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        <motion.div {...fadeUp} className="border-t border-[color:var(--hairline)] pt-6">
          <div className="mono-label mb-3">Philosophy</div>
          <p className="text-[17px] leading-[1.7] text-ink">
            Driven by the pursuit of turning complex, abstract engineering concepts into
            scalable, intuitive real-world applications. Every pixel must serve a function;
            every route must optimize a workflow.
          </p>
        </motion.div>
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="border-t border-[color:var(--hairline)] pt-6"
        >
          <div className="mono-label mb-3">The Creative Edge</div>
          <p className="text-[17px] leading-[1.7] text-ink">
            Deeply rooted in regional Indian cinema and creative storytelling. Viewing
            software architecture through the lens of a director — pacing, structural flow,
            emotional impact, and cohesive world-building translate directly into writing
            pristine, intentional code.
          </p>
        </motion.div>
      </div>
    </Container>
  );
}

/* ---------- LYFSPOT JOURNEY ---------- */
const timeline = [
  {
    year: "2020",
    title: "Origin",
    body:
      "Launched the primary digital footprint via the foundational blog network at sailyfspot.blogspot.com, establishing initial technical discourse and product ideation channels.",
  },
  {
    year: "2022",
    title: "Phase I Frameworks",
    body:
      "Initiated development on early business logic automation engines (IVOpt) and conversational knowledge bases (UneCust).",
  },
  {
    year: "2024",
    title: "Scaled Infrastructure",
    body:
      "Transitioned to complete MERN stack deployment pipelines, laying down the groundwork for production management platforms (Shotweave) and advanced deployment abstractions (DeployBridge).",
  },
  {
    year: "2026",
    title: "Conglomerate Maturity",
    body:
      "Full convergence of web, mobile applications (LoadMate), enterprise cloud environments, and emerging deep-tech research sectors.",
  },
];

const pipeline = [
  {
    name: "Philistine",
    body:
      "A strategic development gateway engineered for innovators, problem solvers, and upcoming entrepreneurs — providing critical technical architecture frameworks and moral execution support to launch raw concepts.",
  },
  {
    name: "IVOpt",
    body:
      "An enterprise billing and financial tracking engine meticulously optimized to streamline fiscal workflows for small-to-medium enterprises.",
  },
  {
    name: "UneCust",
    body:
      "An interactive conversational knowledge agent built for rapid information discovery and responsive instant answers.",
    cta: { label: "Execute UneCust Agent", href: "https://unecust-bot-93c0a9.zapier.app/" },
  },
  {
    name: "Project Classified — Deep Tech Division",
    body:
      "An advanced project merging proprietary software with advanced hardware configurations, integrating hologram, AR, and VR wearable technologies intended to provide critical situational alert safety networks. Status: Architectural Schematics Phase.",
  },
];

const networks = [
  { Icon: BlogIcon, label: "Primary Web Node", href: "https://sailyfspot.blogspot.com" },
  { Icon: LinkedInIcon, label: "Corporate Hub", href: "https://www.linkedin.com/company/lyfspot" },
  { Icon: TelegramIcon, label: "Channel Matrix", href: "https://t.me/lyfspot" },
  { Icon: WhatsAppIcon, label: "Broadcast Node", href: "https://whatsapp.com/channel/0029Va74d5MCcW4puaVyRj2V" },
  { Icon: LinktreeIcon, label: "Unified Directory", href: "https://linktr.ee/lyfspot" },
  { Icon: InstagramIcon, label: "Creative Stream", href: "https://instagram.com/lyfspot" },
  { Icon: YouTubeIcon, label: "Video Directory", href: "https://youtube.com/@lyfspot" },
  { Icon: ThreadsIcon, label: "Dialogue Portal", href: "https://www.threads.net/@lyfspot" },
  { Icon: FacebookIcon, label: "Legacy Identity", href: "https://www.facebook.com/VuppulaSravanSai/" },
];

function LyfspotJourney() {
  return (
    <Container id="lyfspot" className="py-24 md:py-32">
      <SectionLabel>The LYFSpot Ecosystem · Oct 2020 – Present · 5y 9m</SectionLabel>
      <motion.h2
        {...fadeUp}
        className="max-w-[900px] font-display font-bold tracking-[-0.025em] text-ink leading-[1.08] text-[30px] md:text-[44px]"
      >
        A decentralized product ecosystem that refines, simplifies, and elevates
        corporate, civic, and creative operations.
      </motion.h2>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        <motion.div {...fadeUp} className="border-t border-[color:var(--hairline)] pt-6">
          <div className="mono-label mb-3">Mission</div>
          <p className="text-[17px] leading-[1.7] text-ink">
            Transforming complex computational patterns into accessible, high-performance
            digital utilities engineered for human well-being.
          </p>
        </motion.div>
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="border-t border-[color:var(--hairline)] pt-6"
        >
          <div className="mono-label mb-3">Vision</div>
          <p className="text-[17px] leading-[1.7] text-ink">
            Orchestrating a decentralized product ecosystem that refines, simplifies, and
            elevates corporate, civic, and creative operations with absolute precision.
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

/* ---------- ENGINEERING MATRIX ---------- */
const matrix = [
  {
    group: "Full-Stack & Backend Systems",
    items: ["MERN Stack", "MongoDB", "Express.js", "React.js", "Node.js", "Spring Framework", "Spring Boot", "FastAPI"],
  },
  { group: "Mobile Architecture", items: ["React Native", "Expo CLI", "Expo Go", "Android Capacitor"] },
  { group: "Core Engineering & Scripts", items: ["C", "Java", "Python", "JavaScript", "HTML5", "CSS3"] },
  { group: "Cloud, DevOps & Data Storage", items: ["AWS", "GCP", "Cloudinary", "Git", "GitHub"] },
  {
    group: "Enterprise Software Suite",
    items: ["SAP ABAP", "SAP S/4HANA Cloud Backend", "ABAP RESTful Application Programming Model (RAP)"],
  },
  {
    group: "System Engineering",
    items: ["Systems Architecture Design", "Workflow Optimization Pipelines", "Project Management Systems"],
  },
];

function EngineeringMatrix() {
  return (
    <Container id="stack" className="py-24 md:py-32">
      <SectionLabel>The Engineering Matrix</SectionLabel>
      <motion.h2
        {...fadeUp}
        className="max-w-[900px] font-display font-bold tracking-[-0.025em] text-ink leading-[1.08] text-[30px] md:text-[44px]"
      >
        The verified stack — no exaggerations, no buzzwords.
      </motion.h2>

      <div className="mt-14 space-y-0">
        {matrix.map((m, i) => (
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.04 }}
            key={m.group}
            className="grid grid-cols-1 gap-4 border-t border-[color:var(--hairline)] py-7 md:grid-cols-[300px_minmax(0,1fr)] md:gap-12 last:border-b"
          >
            <div className="font-display text-[18px] font-semibold tracking-[-0.01em] text-ink">
              {m.group}
            </div>
            <div className="flex flex-wrap gap-2">
              {m.items.map((it) => (
                <span key={it} className="code-tag">{it}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20">
        <SectionLabel>Enterprise Architecture Playground · Interactive Workflow Graph</SectionLabel>
        <ArchitecturePlayground />
      </div>
    </Container>
  );
}

/* ---------- PROJECT REPOSITORY ---------- */
type Project = {
  num: string;
  name: string;
  classification: string;
  stack: string;
  description: string;
  note?: string;
  links: { Icon: typeof WebIcon; label: string; href: string }[];
};

const projects: Project[] = [
  {
    num: "01",
    name: "Resolveit",
    classification: "Civic Tech · Startup Core Platform (LYFSpot Ecosystem)",
    stack: "MERN Stack — MongoDB, Express.js, React.js, Node.js",
    description:
      "A highly secure, public issue-solving infrastructure built to transparently log, track, and resolve community and civic discrepancies through streamlined administrator dashboards.",
    links: [
      { Icon: GitHubIcon, label: "Code Repository", href: "https://github.com/sravansai-26/resolveit" },
      { Icon: WebIcon, label: "Live Platform Node", href: "http://resolveit-community.me" },
      { Icon: GatewayIcon, label: "Digital Download Gateway", href: "http://resolveit-gateway.vercel.app" },
    ],
  },
  {
    num: "02",
    name: "Smart LoadMate",
    classification: "Academic Innovation · Minor Project Board (MLRIT)",
    stack: "React Native, Expo, Python FastAPI, MongoDB",
    description:
      "An intelligent, dual-interface logistics delivery and route optimization mobile application designed to seamlessly coordinate tasks between commercial haulers and drivers.",
    note:
      "System Note: The current preview link serves as an interactive Web Layout Preview. Full native distribution packages for Google Play Store and Apple App Store are undergoing active development. For optimal interface rendering on mobile viewports, toggle Desktop Mode View within your mobile browser.",
    links: [
      { Icon: GitHubIcon, label: "Code Repository", href: "https://github.com/sravansai-26/LoadMate-App" },
      { Icon: WebIcon, label: "Live Web Preview Matrix", href: "https://smart-loadmate.vercel.app/" },
    ],
  },
  {
    num: "03",
    name: "Shotweave",
    classification: "National Level Cinema Hackathon Feature",
    stack: "React.js, Python Backend Framework, MongoDB",
    description:
      "A powerful AI-driven operations dashboard engineered specifically for cinema production houses. Provides real-time financial tracking, predictive analytics for rolling film budgets, daily expense sheet optimization, dynamic script breakdowns, and cross-department scheduling syncs.",
    links: [
      { Icon: GitHubIcon, label: "Code Repository", href: "https://github.com/sravansai-26/shotweavep" },
      { Icon: WebIcon, label: "Live System Dashboard", href: "https://shotweave.vercel.app/" },
    ],
  },
  {
    num: "04",
    name: "DreamLaunch",
    classification: "Media Distribution Systems (LYFSpot Ecosystem)",
    stack: "MERN Stack — MongoDB, Express.js, React.js, Node.js",
    description:
      "A content orchestration platform built for filmmakers, screenwriters, and independent producers. Empowers creators to centrally manage major promotional assets — teasers, trailers, script previews — and safely deploy them simultaneously across major social API endpoints.",
    links: [
      { Icon: GitHubIcon, label: "Code Repository", href: "https://github.com/sravansai-26/dreamlaunch-client" },
    ],
  },
  {
    num: "05",
    name: "VaultBank",
    classification: "Enterprise Simulation · Infosys Virtual Internship Program",
    stack: "Java Enterprise Architecture, Spring, Spring Boot, MySQL, React.js",
    description:
      "A financial transaction and ledger simulation framework providing authenticated account controls, real-time balance sheets, automated bank statements, secure transaction notifications, and integrated analytical spreadsheets.",
    links: [
      { Icon: GitHubIcon, label: "Code Repository", href: "https://github.com/sravansai-26/VaultBank" },
    ],
  },
  {
    num: "06",
    name: "DeployBridge",
    classification: "National Level Technical Hackathon · Zignasa Platform Entry",
    stack: "MERN Stack — MongoDB, Express.js, React.js, Node.js",
    description:
      "An all-in-one build orchestration engine that accepts raw repository paths, automatically parses stack dependencies, identifies build syntax irregularities, isolates deployment barriers, selects optimal host structures (Vercel, Render, Netlify), and outputs fully operational live URLs.",
    links: [
      { Icon: GitHubIcon, label: "Code Repository", href: "https://github.com/sravansai-26/DeployBridge" },
    ],
  },
  {
    num: "07",
    name: "Sri-Wedding System Architecture",
    classification: "High-Fidelity Professional UX Contract Design",
    stack: "Lovable AI Stack Execution Engine",
    description:
      "An elite digital ordering, product showcase, and fulfillment interface engineered for a premium Ethical Center business. Features minimalist UI structures optimized for rapid conversion metrics. Status: Contract Negotiation Phase / Expanding Advanced Client Core Engine.",
    links: [
      { Icon: DesignIcon, label: "Interactive UX Canvas", href: "https://sri-wedding.lovable.app" },
    ],
  },
];

function ProjectRow({ p, idx }: { p: Project; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay: idx * 0.03 }}
      className="border-t border-[color:var(--hairline)] last:border-b"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="group grid w-full grid-cols-[40px_minmax(0,1fr)_28px] items-baseline gap-4 py-7 text-left md:grid-cols-[60px_minmax(0,1fr)_minmax(0,1fr)_28px] md:gap-8"
      >
        <span className="font-mono text-[13px] text-ink-muted">{p.num}.</span>
        <div className="min-w-0">
          <div className="font-display text-[24px] font-bold tracking-[-0.02em] text-ink md:text-[30px]">
            {p.name}
          </div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            {p.classification}
          </div>
        </div>
        <div className="hidden text-[15px] text-ink-secondary md:block">{p.stack}</div>
        <ArrowRight
          width={18}
          height={18}
          className={`shrink-0 text-ink-secondary transition-transform duration-200 ${
            open ? "rotate-90 text-ink" : "group-hover:translate-x-1"
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-8 pb-10 pl-11 pr-2 md:grid-cols-[1.4fr_1fr] md:gap-12 md:pl-[68px]">
              <div>
                <p className="text-[16px] leading-[1.75] text-ink-secondary">{p.description}</p>
                {p.note && (
                  <p className="mt-4 border-l-2 border-[color:var(--hairline)] pl-4 text-[14px] italic leading-[1.7] text-ink-muted">
                    {p.note}
                  </p>
                )}
                <div className="mt-5 md:hidden">
                  <span className="code-tag">{p.stack}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="mono-label">Engineering Gateways</div>
                {p.links.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-3 border-t border-[color:var(--hairline)] pt-3 text-[15px] text-ink transition-colors hover:text-accent"
                  >
                    <span className="flex items-center gap-3">
                      <Icon width={16} height={16} />
                      {label}
                    </span>
                    <ExternalLink
                      width={14}
                      height={14}
                      className="text-ink-muted transition-transform group-hover:translate-x-0.5"
                    />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Work() {
  return (
    <Container id="work" className="py-24 md:py-32">
      <SectionLabel>Project Repository · Interactive Showcases</SectionLabel>
      <motion.h2
        {...fadeUp}
        className="mb-10 max-w-[900px] font-display font-bold tracking-[-0.025em] text-ink leading-[1.08] text-[30px] md:text-[44px]"
      >
        Seven shipped products — civic, cinema, logistics, fintech, devops, and enterprise.
      </motion.h2>
      <div>
        {projects.map((p, i) => (
          <ProjectRow key={p.num} p={p} idx={i} />
        ))}
      </div>
    </Container>
  );
}

/* ---------- EXPERIENCE ---------- */
const experience = [
  {
    role: "Founder & Chief Technical Architect",
    org: "LYFSpot — Self-Employed / Hybrid Corporation",
    tenure: "October 2020 – Present · 5 Years, 9 Months",
    bullets: [
      "Architected multi-sector technical frameworks across diverse production distributions including SaaS, Civic Tech, Logistics, and Fintech pipelines.",
      "Oversaw the end-to-end full-stack lifecycle of major custom enterprise software distributions, maximizing cross-platform uptime and code maintainability.",
    ],
  },
  {
    role: "DevCon Associate — Enterprise SAP Track",
    org: "Naxrita India — On-Site Internship Core, Hyderabad, TS",
    tenure: "March 2026 – May 2026 · 3 Months",
    bullets: [
      "Acquired extensive practical skills across the SAP ABAP ecosystem, building scalable, modern custom extensions within SAP S/4HANA enterprise frameworks.",
      "Programmed custom Data Dictionary (DDIC) structures, optimized internal tables, executed complex modularization routines, and integrated backend debugging patterns.",
    ],
  },
];

function Experience() {
  return (
    <Container id="experience" className="py-24 md:py-32">
      <SectionLabel>Professional Experience & Internships</SectionLabel>
      <motion.h2
        {...fadeUp}
        className="mb-12 max-w-[900px] font-display font-bold tracking-[-0.025em] text-ink leading-[1.08] text-[30px] md:text-[44px]"
      >
        A corporate ledger of verified enterprise execution.
      </motion.h2>

      <div>
        {experience.map((e, i) => (
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.05 }}
            key={e.role}
            className="grid grid-cols-1 gap-6 border-t border-[color:var(--hairline)] py-10 md:grid-cols-[260px_minmax(0,1fr)] md:gap-12 last:border-b"
          >
            <div>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-sm border border-[color:var(--hairline)] bg-[color:var(--surface)]">
                  <ShieldIcon width={16} height={16} className="text-ink-secondary" />
                </div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                  {e.tenure}
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-display text-[24px] font-bold tracking-[-0.02em] text-ink md:text-[30px]">
                {e.role}
              </h3>
              <div className="mt-2 font-display text-[18px] font-semibold text-ink-secondary">
                {e.org}
              </div>
              <ul className="mt-5 space-y-3">
                {e.bullets.map((b) => (
                  <li
                    key={b}
                    className="grid grid-cols-[14px_1fr] gap-3 text-[16px] leading-[1.7] text-ink-secondary"
                  >
                    <span className="mt-[10px] block h-[2px] w-[10px] bg-ink-muted" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </Container>
  );
}

/* ---------- CREDENTIALS ---------- */
type Cred = {
  title: string;
  org: string;
  date?: string;
  gpa?: string;
  skills?: string;
  href?: string;
  meta?: string;
  file?: string; // path under /public for viewer (pdf or image)
  fileType?: "pdf" | "image";
};

const academic: Cred[] = [
  {
    title: "Bachelor of Technology — Computer Science and Engineering",
    org: "MLR Institute of Technology (MLRIT), Dundigal, Hyderabad",
    date: "2024 – May 2027 · Expected Graduation",
    gpa: "Cumulative GPA · 8.23 / 10.0",
  },
  {
    title: "Diploma in Computer Science and Engineering",
    org: "Vathsalya Institute of Science and Technology, Anantharam, Bhongir",
    date: "2021 – 2024",
    gpa: "Cumulative GPA · 8.78 / 10.0",
  },
];

const certs: Cred[] = [
  {
    title: "SAP Certified Associate — Back-End Developer · ABAP Cloud",
    org: "SAP SE",
    meta: "Proctored Exam C_P2WAB_2507",
    date: "Verified May 6, 2026",
    skills:
      "Advanced Business Application Programming, ABAP RESTful Application Programming Model (RAP), Object-Oriented Design, SAP BTP.",
    href: "https://www.credly.com/badges/c777f4db-d3e0-440f-926a-a21b651b923a/linked_in_profile",
  },
  {
    title: "IBM SkillsBuild · Cloud Computing Fundamentals",
    org: "IBM Corporation",
    skills:
      "Virtualization, Containerization (Docker), Infrastructure Architecture (IaaS, PaaS, SaaS), Kubernetes Orchestration.",
  },
  {
    title: "Infosys Springboard Virtual Internship 6.0 — Banking Simulation",
    org: "Infosys Springboard",
    meta: "Cohort ID · B 13",
    date: "Verified June 2026",
    skills: "Enterprise Java Solutions, Spring Boot Integration, React Client-Side Interfacing.",
    file: "/credentials/infosys.pdf",
    fileType: "pdf",
  },
  {
    title: "ServiceNow Virtual Internship Program (AICTE Approved)",
    org: "ServiceNow Corporation",
    meta: "Credential ID · SNU2020716",
    date: "Verified May 2026",
    skills:
      "ServiceNow System Administration, Flow Designer, Automated Test Framework (ATF), Certified System Administrator (CSA) Core Foundations.",
    file: "/credentials/servicenow.pdf",
    fileType: "pdf",
  },
  {
    title: "SAP ABAP on S/4HANA Technical Track — Naxrita DevCon",
    org: "Naxrita India · Emax Technologies · MLRIT",
    date: "Awarded May 09, 2026",
    meta: "18-Day Industry Readiness Program",
    skills:
      "Modern SAP Enterprise Architecture, S/4HANA fundamentals, Core ABAP, CDS Views, OData exposure, professional delivery practices.",
    file: "/credentials/naxrita.png",
    fileType: "image",
  },
  {
    title: "NPTEL Elite Certification — Industry 4.0 and Internet of Things",
    org: "National Programme on Technology Enhanced Learning (India)",
    file: "/credentials/nptel-iot.pdf",
    fileType: "pdf",
  },
  {
    title: "NPTEL Elite Certification — Cloud Computing Paradigms",
    org: "National Programme on Technology Enhanced Learning (India)",
    file: "/credentials/nptel-cloud.pdf",
    fileType: "pdf",
  },
];

const honors: Cred[] = [
  {
    title: "National Level Cinema Hackathon Delegate & Presenter",
    org: "FISAT, Kerala · in coordination with Pauly Jr. Pictures",
    skills:
      "Pitch-presented and modeled Shotweave, leading multi-disciplinary software squads under strict hackathon timeline constraints.",
  },
  {
    title: "Executive Public Speaking Leadership Certification",
    org: "Elite Impact Foundation · endorsed by Sri Gampa Nageshwar Rao Garu",
    skills:
      "Master-level verbal communications, group leadership capabilities, and strategic venture delivery skills.",
  },
];

function CredentialRow({ c, onOpen }: { c: Cred; onOpen: () => void }) {
  return (
    <motion.button
      {...fadeUp}
      onClick={onOpen}
      className="group grid w-full grid-cols-[1fr_auto] items-start gap-6 border-t border-[color:var(--hairline)] py-7 text-left last:border-b"
    >
      <div>
        <div className="font-display text-[18px] font-semibold tracking-[-0.01em] text-ink md:text-[20px]">
          {c.title}
        </div>
        <div className="mt-1 text-[14px] text-ink-secondary">{c.org}</div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
          {c.date && <span>{c.date}</span>}
          {c.gpa && <span>{c.gpa}</span>}
          {c.meta && <span>{c.meta}</span>}
        </div>
      </div>
      <ArrowRight
        width={16}
        height={16}
        className="mt-2 text-ink-muted transition-transform group-hover:translate-x-1"
      />
    </motion.button>
  );
}

function CredentialModal({ c, onClose }: { c: Cred | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {c && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-[color:var(--deep-ink)]/55 px-6 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[680px] rounded-sm border border-[color:var(--hairline)] bg-[color:var(--background)] p-8 md:p-10"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-ink-secondary transition-colors hover:bg-[color:var(--surface)] hover:text-ink"
              aria-label="Close"
            >
              <Close />
            </button>
            <div className="mono-label mb-3">Verified Credential</div>
            <h3 className="font-display text-[24px] font-bold tracking-[-0.02em] text-ink md:text-[30px]">
              {c.title}
            </h3>
            <div className="mt-2 text-[15px] text-ink-secondary">{c.org}</div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              {c.date && <span>{c.date}</span>}
              {c.meta && <span>{c.meta}</span>}
              {c.gpa && <span>{c.gpa}</span>}
            </div>

            <div className="mt-6 grid aspect-[4/3] place-items-center rounded-sm border border-dashed border-[color:var(--hairline)] bg-[color:var(--surface)] text-center">
              <div>
                <DocIcon width={28} height={28} className="mx-auto text-ink-muted" />
                <div className="mt-3 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                  Certificate frame · upload PDF to render here
                </div>
              </div>
            </div>

            {c.skills && (
              <div className="mt-6">
                <div className="mono-label mb-2">Verified Skill Matrix</div>
                <p className="text-[15px] leading-[1.7] text-ink-secondary">{c.skills}</p>
              </div>
            )}

            {c.href && (
              <a
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="editorial-link mt-6 inline-flex items-center gap-2 text-[15px]"
              >
                Verify externally <ExternalLink width={14} height={14} />
              </a>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Credentials() {
  const [active, setActive] = useState<Cred | null>(null);
  return (
    <Container id="credentials" className="py-24 md:py-32">
      <SectionLabel>Credentials & Academic Background</SectionLabel>
      <motion.h2
        {...fadeUp}
        className="mb-12 max-w-[900px] font-display font-bold tracking-[-0.025em] text-ink leading-[1.08] text-[30px] md:text-[44px]"
      >
        Every credential, verifiable. Tap any row to open the native viewer.
      </motion.h2>

      <div className="mono-label mb-4">Academic Milestones</div>
      <div>
        {academic.map((c) => (
          <CredentialRow key={c.title} c={c} onOpen={() => setActive(c)} />
        ))}
      </div>

      <div className="mono-label mb-4 mt-16">Professional Enterprise Certifications</div>
      <div>
        {certs.map((c) => (
          <CredentialRow key={c.title} c={c} onOpen={() => setActive(c)} />
        ))}
      </div>

      <div className="mono-label mb-4 mt-16">Major Honors & Leadership Accolades</div>
      <div>
        {honors.map((c) => (
          <CredentialRow key={c.title} c={c} onOpen={() => setActive(c)} />
        ))}
      </div>

      <CredentialModal c={active} onClose={() => setActive(null)} />
    </Container>
  );
}

/* ---------- PUBLICATIONS ---------- */
function Publications() {
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
          advocates for autonomous project ownership, deliberate architectural exploration,
          and prioritizing real-world software engineering deployments over passive learning
          patterns.
        </p>
        <a
          href="https://medium.com/@sravansaivuppula/the-uncharted-path-rewriting-the-rules-of-learning-for-a-life-of-true-worth-0f3b55c6befb"
          target="_blank"
          rel="noreferrer"
          className="editorial-link mt-5 inline-flex items-center gap-2 text-[15px]"
        >
          <MediumIcon width={16} height={16} /> Open Publication Node <ArrowRight width={14} height={14} />
        </a>
      </motion.article>

      <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-[color:var(--hairline)] sm:grid-cols-2">
        <a
          href="https://writco.in/LYFSpot"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between gap-4 bg-[color:var(--background)] px-5 py-6 outline outline-1 outline-[color:var(--hairline)] transition-colors hover:bg-[color:var(--surface)]"
        >
          <span className="flex items-center gap-3">
            <WritcoIcon width={18} height={18} className="text-ink-secondary" />
            <span>
              <div className="text-[15px] text-ink">Official Writco Portal</div>
              <div className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                Telugu poetry · cultural prose · reflections
              </div>
            </span>
          </span>
          <ArrowRight width={14} height={14} className="text-ink-muted transition-transform group-hover:translate-x-1" />
        </a>
        <a
          href="https://sailyfspot.blogspot.com"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between gap-4 bg-[color:var(--background)] px-5 py-6 outline outline-1 outline-[color:var(--hairline)] transition-colors hover:bg-[color:var(--surface)]"
        >
          <span className="flex items-center gap-3">
            <BlogIcon width={18} height={18} className="text-ink-secondary" />
            <span>
              <div className="text-[15px] text-ink">Literary Reflections</div>
              <div className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                sailyfspot.blogspot.com
              </div>
            </span>
          </span>
          <ArrowRight width={14} height={14} className="text-ink-muted transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </Container>
  );
}

/* ---------- GITHUB PULSE ---------- */
function GitHubPulse() {
  return (
    <Container id="pulse" className="py-24 md:py-32">
      <SectionLabel>Live Engineering Pulse</SectionLabel>
      <motion.h2
        {...fadeUp}
        className="mb-12 max-w-[900px] font-display font-bold tracking-[-0.025em] text-ink leading-[1.08] text-[30px] md:text-[44px]"
      >
        Real commits. Real cadence. Direct from{" "}
        <a className="editorial-link" href="https://github.com/sravansai-26" target="_blank" rel="noreferrer">
          github.com/sravansai-26
        </a>
        .
      </motion.h2>

      <motion.div
        {...fadeUp}
        className="overflow-hidden rounded-sm border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6 md:p-10"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <GitHubIcon width={22} height={22} className="text-ink" />
            <div>
              <div className="font-display text-[18px] font-semibold text-ink">@sravansai-26</div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                Contribution matrix · last 12 months
              </div>
            </div>
          </div>
          <a
            href="https://github.com/sravansai-26"
            target="_blank"
            rel="noreferrer"
            className="editorial-link inline-flex items-center gap-2 text-[14px]"
          >
            Open profile <ArrowRight width={14} height={14} />
          </a>
        </div>
        <div className="mt-6 overflow-x-auto">
          <img
            src="https://ghchart.rshah.org/2A6F8E/sravansai-26"
            alt="GitHub contribution graph for sravansai-26"
            className="w-full min-w-[640px]"
            loading="lazy"
          />
        </div>
      </motion.div>
    </Container>
  );
}

/* ---------- CONTACT ---------- */
function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const FORMSPREE = "https://formspree.io/f/your-formspree-endpoint"; // placeholder

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      const data = new FormData(e.currentTarget);
      const res = await fetch(FORMSPREE, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      setStatus(res.ok ? "sent" : "error");
      if (res.ok) e.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <Container id="contact" className="py-24 md:py-32">
      <SectionLabel>Get in Touch · Direct Communication</SectionLabel>
      <motion.h2
        {...fadeUp}
        className="mb-14 max-w-[900px] font-display font-bold tracking-[-0.025em] text-ink leading-[1.08] text-[34px] md:text-[56px]"
      >
        Let's build something{" "}
        <span className="font-mono font-medium tracking-[-0.02em] text-[0.78em] align-baseline">
          real()
        </span>
        .
      </motion.h2>

      <div className="grid grid-cols-1 gap-14 md:grid-cols-[1fr_1.1fr] md:gap-20">
        <motion.div {...fadeUp}>
          <div className="mono-label mb-4">Direct Channels</div>
          <div className="space-y-5">
            {[
              { label: "Personal Engineering Office", email: "sai1234comon@gmail.com" },
              { label: "LYFSpot Corporate Desk", email: "lyfspot@zohomail.in" },
              { label: "LYFSpot Inbound Desk", email: "lyfspot26@gmail.com" },
            ].map((c) => (
              <a
                key={c.email}
                href={`mailto:${c.email}`}
                className="group block border-t border-[color:var(--hairline)] pt-4 last:border-b last:pb-4"
              >
                <div className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                  {c.label}
                </div>
                <div className="mt-1 flex items-center justify-between gap-3 font-display text-[18px] font-semibold text-ink transition-colors group-hover:text-accent">
                  <span>{c.email}</span>
                  <ArrowRight width={14} height={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        <motion.form
          {...fadeUp}
          onSubmit={onSubmit}
          className="space-y-5 rounded-sm border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6 md:p-8"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field name="name" label="Full Name" required />
            <Field name="email" label="Email Address" type="email" required />
          </div>
          <SelectField
            name="subject"
            label="Subject"
            options={[
              "Collaboration Inquiry",
              "Project Discussion",
              "Job Opportunity",
              "Feedback",
              "General Query",
              "Other",
            ]}
          />
          <TextAreaField name="message" label="Message" required />

          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[14px] font-medium text-background transition-colors hover:bg-deep-ink disabled:opacity-60"
          >
            <Send width={16} height={16} />
            {status === "sending" ? "Sending…" : status === "sent" ? "Message sent" : "Send Message"}
          </button>
          {status === "error" && (
            <div className="font-mono text-[12px] text-ink-muted">
              Endpoint not configured — replace the Formspree URL in Contact.tsx.
            </div>
          )}
        </motion.form>
      </div>
    </Container>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mono-label mb-2 block">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full border-b border-[color:var(--hairline)] bg-transparent py-2 text-[15px] text-ink outline-none transition-colors focus:border-ink"
      />
    </label>
  );
}

function SelectField({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mono-label mb-2 block">{label}</span>
      <select
        name={name}
        defaultValue=""
        className="w-full border-b border-[color:var(--hairline)] bg-transparent py-2 text-[15px] text-ink outline-none transition-colors focus:border-ink"
      >
        <option value="" disabled>
          Select a subject
        </option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  name,
  label,
  required,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mono-label mb-2 block">{label}</span>
      <textarea
        name={name}
        required={required}
        rows={5}
        className="w-full resize-none border border-[color:var(--hairline)] bg-transparent p-3 text-[15px] text-ink outline-none transition-colors focus:border-ink"
      />
    </label>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  const socials = [
    { Icon: LinkedInIcon, href: "https://www.linkedin.com/in/sravan-sai-vuppula-753b711ba" },
    { Icon: XIcon, href: "https://twitter.com/vuppula_sai" },
    { Icon: MediumIcon, href: "https://medium.com/@sravansaivuppula" },
    { Icon: LinktreeIcon, href: "https://linktr.ee/uneducatedcustomer" },
    { Icon: GitHubIcon, href: "https://github.com/sravansai-26" },
  ];
  return (
    <footer className="mt-20 border-t border-[color:var(--hairline)]">
      <Container className="flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-sm border border-[color:var(--hairline)] bg-[color:var(--surface)] font-mono text-[11px] font-bold text-ink">
            LS
          </div>
          <div className="font-mono text-[12px] uppercase tracking-wider text-ink-muted">
            © 2026 Sravan Sai Vuppula · Designed and Engineered by LYFSpot for its Originator
          </div>
        </div>
        <div className="flex items-center gap-2">
          {socials.map(({ Icon, href }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-full text-ink-secondary transition-colors hover:bg-[color:var(--surface)] hover:text-ink"
            >
              <Icon width={16} height={16} />
            </a>
          ))}
        </div>
      </Container>
    </footer>
  );
}

/* ---------- ROOT ---------- */
export default function Portfolio() {
  return (
    <main>
      <Hero />
      <Identity />
      <LyfspotJourney />
      <EngineeringMatrix />
      <Work />
      <Experience />
      <Credentials />
      <Publications />
      <GitHubPulse />
      <Contact />
      <Footer />
    </main>
  );
}
