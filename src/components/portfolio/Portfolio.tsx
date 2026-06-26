import { type ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import sravanImg from "@/assets/sravan-cutout.png";
import {
  ArrowRight,
  Plus,
  Minus,
  Close,
  GitHubIcon,
  LinkedInIcon,
  XIcon,
  MediumIcon,
  LinktreeIcon,
} from "./Icons";

/* ---------- motion helpers ---------- */
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
    <section
      id={id}
      className={`mx-auto w-full max-w-[1180px] px-6 md:px-12 ${className}`}
    >
      {children}
    </section>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section id="top" className="relative pt-28 md:pt-32">
      <div className="relative mx-auto grid min-h-[88vh] w-full max-w-[1400px] grid-cols-1 items-end gap-10 px-6 pb-16 md:grid-cols-[1.55fr_1fr] md:items-stretch md:gap-0 md:px-12 md:pb-0">
        {/* Headline column */}
        <div className="flex flex-col justify-center pt-10 md:pt-24 md:pb-28">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-black tracking-[-0.035em] text-ink leading-[0.98] text-[44px] sm:text-[60px] md:text-[78px] lg:text-[96px]"
          >
            I build products,
            <br />
            architect{" "}
            <span className="font-mono font-medium tracking-[-0.02em] text-[0.86em] align-baseline">
              systems()
            </span>
            ,
            <br />
            and ship things
            <br />
            that matter.
          </motion.h1>
        </div>

        {/* Portrait column - full-bleed right edge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.25 }}
          className="relative h-[60vh] min-h-[420px] w-full md:h-auto md:min-h-[88vh]"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 80% 20%, #EEF4F6 0%, #DCE5EA 55%, #C9D5DC 100%)",
            }}
          />
          <img
            src={sravanImg}
            alt="Sravan Sai Vuppula, Founder of LYFSpot"
            className="absolute bottom-0 right-0 h-[100%] w-auto max-w-none object-contain object-bottom"
            style={{ filter: "grayscale(0.25) contrast(1.02) brightness(1.02)" }}
            loading="eager"
            decoding="async"
          />
        </motion.div>
      </div>

      {/* Sub-block under hero, right-aligned like reference */}
      <Container className="pb-20 pt-8 md:pb-28">
        <motion.div
          {...fadeUp}
          className="ml-auto max-w-[520px] text-[16px] leading-[1.7] text-ink md:text-[17px]"
        >
          <p>
            Currently, I'm{" "}
            <span className="font-semibold">Founder &amp; Lead Developer</span> at{" "}
            <a className="editorial-link" href="#work">
              LYFSpot
            </a>
            , architecting a multi-sector product ecosystem — from civic tech and
            cinema systems to logistics intelligence and enterprise cloud.
          </p>
          <p className="mt-5">
            <a className="editorial-link" href="mailto:sai1234comon@gmail.com">
              Email me
            </a>
            , or shout over on{" "}
            <a
              className="editorial-link"
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>{" "}
            or{" "}
            <a
              className="editorial-link"
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </motion.div>
      </Container>
    </section>
  );
}

/* ---------- INTRO STATEMENT ---------- */
function Intro() {
  return (
    <Container className="py-20 md:py-32">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr] md:gap-20">
        <motion.h2
          {...fadeUp}
          className="font-display font-bold tracking-[-0.025em] text-ink leading-[1.08] text-[32px] md:text-[48px] lg:text-[56px]"
        >
          Over five years bridging engineering and design into products that
          quietly do the work.
        </motion.h2>
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.12 }}
          className="flex flex-col justify-end gap-3 text-[17px] leading-[1.6] text-ink-secondary"
        >
          <div>5+ years building.</div>
          <div>7 products shipped.</div>
          <div>From a single blog to a full conglomerate.</div>
        </motion.div>
      </div>
    </Container>
  );
}

/* ---------- JOURNEY ---------- */
type Entry = {
  num: number;
  range: string;
  role: string;
  org: string;
  body: string;
  impact: string;
  nested?: { range: string; role: string }[];
};

const entries: Entry[] = [
  {
    num: 1,
    range: "20–Present",
    role: "Founder & Chief Technical Architect",
    org: "LYFSpot",
    body:
      "Architecting a multi-sector product ecosystem from the ground up — spanning civic tech, cinema production systems, logistics intelligence, and enterprise cloud deployments.",
    impact:
      "7 shipped products across MERN, React Native, Spring Boot, and SAP ecosystems. From a single blog to a full conglomerate.",
  },
  {
    num: 2,
    range: "26",
    role: "DevCon Associate — SAP Track",
    org: "Naxrita India",
    body:
      "Production-grade SAP ABAP environments. Programmed custom Data Dictionary structures, optimized internal table architectures, shipped against the SAP S/4HANA Cloud backend.",
    impact:
      "SAP Certified Associate — ABAP Cloud. Production-ready in enterprise architecture within three months.",
  },
  {
    num: 3,
    range: "20–Present",
    role: "Founder",
    org: "Balcom & Nobody — LYFSpot Studio",
    body:
      "The studio arm of LYFSpot — incubating experiments, frameworks, and creative engineering bets that later graduate into the product portfolio.",
    impact:
      "A continuous lab where everything LYFSpot ships is first prototyped, broken, and re-built.",
    nested: [
      { range: "20", role: "Origin — first digital footprint" },
      { range: "22", role: "Phase I — IVOpt and UneCust framework initiation" },
      { range: "24", role: "Scale — Shotweave and DeployBridge pipelines" },
      { range: "26", role: "Convergence — mobile, cloud, enterprise, deep-tech research" },
    ],
  },
  {
    num: 4,
    range: "22–26",
    role: "B.Tech, Computer Science Engineering",
    org: "Independent Engineering Practice",
    body:
      "Self-directed full-stack practice in parallel with formal CS — shipping production code while completing the degree.",
    impact:
      "Built and deployed real products to real users before graduation.",
  },
];

function JourneyEntry({ e, detailed }: { e: Entry; detailed: boolean }) {
  return (
    <motion.article
      {...fadeUp}
      className="grid grid-cols-[auto_minmax(0,1fr)] gap-6 border-t border-[color:var(--hairline)] py-12 md:grid-cols-[80px_120px_minmax(0,1fr)] md:gap-12"
    >
      <div className="font-mono text-[13px] tracking-wide text-ink-muted">
        {e.num}.
      </div>
      <div className="font-mono text-[13px] tracking-wide text-ink-muted md:pt-[2px]">
        {e.range}
      </div>
      <div className="col-span-2 md:col-span-1">
        <h3 className="font-display font-bold tracking-[-0.02em] text-ink text-[26px] md:text-[34px] leading-[1.1]">
          {e.role}
        </h3>
        <div className="mt-2 font-display text-[20px] font-semibold text-ink-secondary md:text-[22px]">
          {e.org}
        </div>

        <AnimatePresence initial={false}>
          {detailed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden"
            >
              <p className="mt-6 max-w-[640px] text-[17px] leading-[1.7] text-ink-secondary">
                {e.body}
              </p>
              {e.nested && (
                <ul className="mt-5 space-y-2 border-l border-[color:var(--hairline)] pl-5">
                  {e.nested.map((n) => (
                    <li
                      key={n.range}
                      className="flex gap-4 text-[15px] text-ink-secondary"
                    >
                      <span className="font-mono text-[12px] text-ink-muted">
                        {n.range}
                      </span>
                      <span>{n.role}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-6 max-w-[640px] text-[16px] leading-[1.7] text-ink">
                <span className="font-semibold">Bottom Line →</span>{" "}
                <span className="text-ink-secondary">{e.impact}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

function Journey() {
  const [detailed, setDetailed] = useState(false);
  return (
    <Container id="about" className="py-20 md:py-28">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="font-display text-[22px] font-bold tracking-tight text-ink md:text-[26px]">
          The Journey.
        </h2>
        <div className="inline-flex items-center gap-1 rounded-full border border-[color:var(--hairline)] bg-[color:var(--surface)] p-1 text-[13px]">
          <button
            onClick={() => setDetailed(false)}
            className={`rounded-full px-4 py-1.5 transition-colors ${
              !detailed
                ? "bg-ink text-background"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            Simple
          </button>
          <button
            onClick={() => setDetailed(true)}
            className={`rounded-full px-4 py-1.5 transition-colors ${
              detailed
                ? "bg-ink text-background"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            Detailed
          </button>
        </div>
      </div>

      <div>
        {entries.map((e) => (
          <JourneyEntry key={e.num} e={e} detailed={detailed} />
        ))}
      </div>

      <div className="mt-10 flex justify-center text-ink-muted">↓</div>
    </Container>
  );
}

/* ---------- WORK ---------- */
type Project = {
  num: string;
  name: string;
  blurb: string;
  year: string;
  category: string;
  details: string;
  stack: string[];
  links: { label: string; href: string }[];
};

const projects: Project[] = [
  {
    num: "01",
    name: "Resolveit",
    blurb: "Civic issue resolution infrastructure",
    year: "23",
    category: "MERN · Civic Tech",
    details:
      "A civic platform connecting citizens with municipal bodies through structured issue routing, status escalation, and transparent resolution timelines.",
    stack: ["MongoDB", "Express", "React", "Node"],
    links: [{ label: "GitHub", href: "#" }],
  },
  {
    num: "02",
    name: "Smart LoadMate",
    blurb: "AI logistics & route optimization",
    year: "24",
    category: "React Native · FastAPI",
    details:
      "Mobile-first logistics intelligence — load-matching, AI-driven route optimization, and operational telemetry for fleet operators.",
    stack: ["React Native", "Expo", "FastAPI", "Python"],
    links: [{ label: "Live", href: "#" }],
  },
  {
    num: "03",
    name: "Shotweave",
    blurb: "Cinema production operations dashboard",
    year: "24",
    category: "React · Python",
    details:
      "An operations layer for film sets — call sheets, shot tracking, and crew choreography for production houses that ship.",
    stack: ["React", "Python", "PostgreSQL"],
    links: [{ label: "Case study", href: "#" }],
  },
  {
    num: "04",
    name: "DreamLaunch",
    blurb: "Distribution engine for filmmakers",
    year: "24",
    category: "MERN · Media",
    details:
      "Distribution pipelines for independent filmmakers — release scheduling, asset packaging, and audience analytics.",
    stack: ["MongoDB", "Express", "React", "Node"],
    links: [{ label: "Live", href: "#" }],
  },
  {
    num: "05",
    name: "VaultBank",
    blurb: "Banking simulator & financial ledger",
    year: "25",
    category: "Spring Boot · Java",
    details:
      "A double-entry ledger and banking simulator built on Spring Boot, exploring transactional integrity at scale.",
    stack: ["Spring Boot", "Java", "PostgreSQL"],
    links: [{ label: "GitHub", href: "#" }],
  },
  {
    num: "06",
    name: "DeployBridge",
    blurb: "Multi-cloud deployment engine",
    year: "25",
    category: "MERN · DevOps",
    details:
      "Provisioning and orchestration across cloud providers with a clean operator-grade UI.",
    stack: ["Node", "React", "AWS", "GCP"],
    links: [{ label: "GitHub", href: "#" }],
  },
  {
    num: "07",
    name: "Sri-Wedding System",
    blurb: "Elite digital ordering interface",
    year: "26",
    category: "TanStack · Cloud",
    details:
      "A premium digital ordering surface for an end-to-end wedding services operator.",
    stack: ["TanStack", "React", "Cloud"],
    links: [{ label: "Live", href: "#" }],
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
        className="group grid w-full grid-cols-[40px_minmax(0,1fr)_auto] items-baseline gap-4 py-7 text-left transition-colors hover:opacity-90 md:grid-cols-[60px_minmax(0,1fr)_minmax(0,1fr)_auto_28px] md:gap-8"
      >
        <span className="font-mono text-[13px] text-ink-muted">{p.num}.</span>
        <div className="min-w-0">
          <div className="font-display text-[26px] font-bold tracking-[-0.02em] text-ink md:text-[32px]">
            {p.name}
          </div>
          <div className="mt-1 text-[14px] text-ink-secondary md:hidden">
            {p.blurb}
          </div>
        </div>
        <div className="hidden text-[16px] text-ink-secondary md:block">
          {p.blurb}
        </div>
        <div className="hidden font-mono text-[12px] uppercase tracking-wider text-ink-muted md:block">
          '{p.year} · {p.category}
        </div>
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
            <div className="grid grid-cols-1 gap-4 pb-8 pl-11 pr-2 md:grid-cols-[1fr_auto] md:gap-12 md:pl-[68px]">
              <div>
                <p className="text-[16px] leading-[1.7] text-ink-secondary">
                  {p.details}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span key={s} className="code-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2 md:items-end">
                {p.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="editorial-link inline-flex items-center gap-2 text-[15px]"
                  >
                    {l.label} <ArrowRight width={14} height={14} />
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
    <Container id="work" className="py-20 md:py-28">
      <h2 className="mb-10 font-display text-[22px] font-bold tracking-tight text-ink md:text-[26px]">
        Selected Work.
      </h2>
      <div>
        {projects.map((p, i) => (
          <ProjectRow key={p.num} p={p} idx={i} />
        ))}
      </div>
    </Container>
  );
}

/* ---------- STACK ---------- */
function Stack() {
  const groups: { label: string; items: string[] }[] = [
    {
      label: "Full-Stack",
      items: ["MongoDB", "Express", "React", "Node", "Spring Boot", "FastAPI"],
    },
    { label: "Mobile", items: ["React Native", "Expo", "Capacitor"] },
    { label: "Languages", items: ["C", "Java", "Python", "JavaScript", "TypeScript"] },
    { label: "Cloud", items: ["AWS", "GCP", "Cloudinary", "Git", "GitHub"] },
    { label: "Enterprise", items: ["SAP ABAP", "S/4HANA Cloud", "ABAP RAP"] },
  ];

  return (
    <Container className="py-20 md:py-28">
      <h2 className="mb-10 font-display text-[22px] font-bold tracking-tight text-ink md:text-[26px]">
        What I Build With.
      </h2>
      <div className="space-y-8">
        {groups.map((g, i) => (
          <motion.div
            key={g.label}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.04 }}
            className="grid grid-cols-1 gap-2 border-t border-[color:var(--hairline)] pt-6 md:grid-cols-[200px_1fr] md:gap-8"
          >
            <div className="font-display text-[18px] font-semibold text-ink md:text-[20px]">
              {g.label}
            </div>
            <div className="flex flex-wrap gap-2">
              {g.items.map((t) => (
                <span key={t} className="code-tag">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Container>
  );
}

/* ---------- CREDENTIALS ---------- */
type Cred = { title: string; issuer: string; date: string };
const certifications: Cred[] = [
  { title: "SAP Certified Associate — ABAP Cloud", issuer: "SAP / Naxrita India", date: "26" },
  { title: "Full-Stack Web Development", issuer: "Self-Directed", date: "21 — Present" },
  { title: "Cloud Foundations", issuer: "AWS / GCP", date: "24" },
];

function Credentials() {
  const [active, setActive] = useState<Cred | null>(null);
  return (
    <Container id="credentials" className="py-20 md:py-28">
      <h2 className="mb-10 font-display text-[22px] font-bold tracking-tight text-ink md:text-[26px]">
        Credentials.
      </h2>
      <div>
        {certifications.map((c) => (
          <motion.div
            key={c.title}
            {...fadeUp}
            className="grid grid-cols-1 items-baseline gap-2 border-t border-[color:var(--hairline)] py-6 md:grid-cols-[1.4fr_1fr_auto] md:gap-8"
          >
            <div className="font-display text-[20px] font-semibold text-ink">
              {c.title}
            </div>
            <div className="font-mono text-[12px] uppercase tracking-wider text-ink-muted">
              {c.issuer} · '{c.date}
            </div>
            <button
              onClick={() => setActive(c)}
              className="inline-flex items-center gap-2 justify-self-start text-[14px] text-ink-secondary transition-colors hover:text-ink md:justify-self-end"
            >
              View <ArrowRight width={14} height={14} />
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(21,25,30,0.55)" }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[640px] border border-[color:var(--hairline)] bg-background p-8"
            >
              <button
                onClick={() => setActive(null)}
                className="absolute right-4 top-4 text-ink-secondary hover:text-ink"
              >
                <Close width={20} height={20} />
              </button>
              <div className="mono-label mb-3">Certificate</div>
              <h3 className="font-display text-[26px] font-bold tracking-tight text-ink">
                {active.title}
              </h3>
              <div className="mt-1 font-mono text-[12px] uppercase tracking-wider text-ink-muted">
                {active.issuer} · '{active.date}
              </div>
              <div className="mt-6 grid aspect-[4/3] w-full place-items-center border border-dashed border-[color:var(--hairline)] bg-surface text-ink-muted">
                <div className="text-center">
                  <div className="font-display text-[18px] font-semibold">
                    Document preview
                  </div>
                  <div className="mt-2 text-[13px]">
                    PDF / image placeholder.
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}

/* ---------- THIS & THAT ---------- */
function ThisAndThat() {
  const round = [
    "🎬  Telugu cinema over Bollywood. Always.",
    "✈️  Window seat or nothing.",
    "☕  Filter coffee. Non-negotiable.",
    "🎵  A.R. Rahman's Roja over everything.",
    "🛣️  The Uncharted Path over the well-trodden road.",
    "🤟  The rest is negotiable.",
  ];
  return (
    <Container className="py-20 md:py-28">
      <h2 className="mb-10 font-display text-[22px] font-bold tracking-tight text-ink md:text-[26px]">
        This &amp; That.
      </h2>
      <motion.p
        {...fadeUp}
        className="max-w-[820px] font-display font-bold tracking-[-0.02em] text-ink leading-[1.15] text-[28px] md:text-[40px]"
      >
        A lifelong builder chasing the product that changes everything. Telugu
        cinema obsessive, guitarist in theory, golfer in ambition. Based in{" "}
        <span className="font-mono font-medium tracking-tight text-[0.78em] align-baseline">
          Hyderabad
        </span>{" "}
        with a head full of roadmaps.
      </motion.p>

      <motion.div {...fadeUp} className="mt-16">
        <div className="mono-label mb-5">Lightning Round ⚡️</div>
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {round.map((r) => (
            <li key={r} className="text-[17px] text-ink">
              {r}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        {...fadeUp}
        className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        <div className="border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6">
          <div className="mono-label mb-3">Now Reading</div>
          <p className="font-display text-[20px] font-semibold leading-snug text-ink">
            The well-trodden road is comfortable. The uncharted one is honest.
          </p>
          <div className="mt-3 text-[13px] text-ink-muted">
            — from a 2025 essay
          </div>
        </div>
        <div className="border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6">
          <div className="mono-label mb-3">Now Building</div>
          <p className="font-display text-[20px] font-semibold leading-snug text-ink">
            IVOpt — in active development
          </p>
          <div className="mt-3 text-[13px] text-ink-muted">
            Internal LYFSpot framework · 2026
          </div>
        </div>
      </motion.div>
    </Container>
  );
}

/* ---------- WRITING ---------- */
function Writing() {
  return (
    <Container id="writing" className="py-20 md:py-28">
      <h2 className="mb-10 font-display text-[22px] font-bold tracking-tight text-ink md:text-[26px]">
        Words.
      </h2>
      <motion.article
        {...fadeUp}
        className="border-t border-[color:var(--hairline)] py-10"
      >
        <div className="font-mono text-[12px] uppercase tracking-wider text-ink-muted">
          Medium · '25
        </div>
        <h3 className="mt-3 max-w-[820px] font-display text-[28px] font-bold leading-snug tracking-[-0.02em] text-ink md:text-[36px]">
          The Uncharted Path — rewriting the rules of learning for a life of
          true worth.
        </h3>
        <p className="mt-5 max-w-[680px] text-[17px] leading-[1.7] text-ink-secondary">
          An analytical dissection of why traditional education paths fail
          independent thinkers — and what the alternative looks like.
        </p>
        <a
          href="https://medium.com/"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-[15px] text-ink transition-colors hover:text-[color:var(--accent-blue)]"
        >
          Read on Medium <ArrowRight width={14} height={14} />
        </a>
      </motion.article>
    </Container>
  );
}

/* ---------- CONTACT ---------- */
function Contact() {
  return (
    <Container id="contact" className="py-20 md:py-32">
      <motion.h2
        {...fadeUp}
        className="max-w-[900px] font-display font-black tracking-[-0.03em] text-ink leading-[1.02] text-[42px] md:text-[72px] lg:text-[88px]"
      >
        Let's build
        <br />
        something{" "}
        <span className="font-mono font-medium text-[0.78em] tracking-tight align-baseline">
          real()
        </span>
        .
      </motion.h2>

      <motion.ul
        {...fadeUp}
        className="mt-14 space-y-4 border-t border-[color:var(--hairline)] pt-10"
      >
        {[
          { mail: "sai1234comon@gmail.com", label: "Personal" },
          { mail: "lyfspot@zohomail.in", label: "LYFSpot Corporate" },
          { mail: "lyfspot26@gmail.com", label: "General Inquiries" },
        ].map((e) => (
          <li
            key={e.mail}
            className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-6"
          >
            <a
              className="editorial-link font-mono text-[15px]"
              href={`mailto:${e.mail}`}
            >
              {e.mail}
            </a>
            <span className="text-[14px] text-ink-muted">— {e.label}</span>
          </li>
        ))}
      </motion.ul>
    </Container>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  const socials = [
    { Icon: LinkedInIcon, href: "https://www.linkedin.com/", label: "LinkedIn" },
    { Icon: XIcon, href: "https://x.com/", label: "Twitter" },
    { Icon: MediumIcon, href: "https://medium.com/", label: "Medium" },
    { Icon: GitHubIcon, href: "https://github.com/", label: "GitHub" },
    { Icon: LinktreeIcon, href: "https://linktr.ee/", label: "Linktree" },
  ];
  return (
    <footer className="border-t border-[color:var(--hairline)] mt-12">
      <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="text-[13px] text-ink-muted">
          © 2026 Sravan Sai Vuppula · LYFSpot
        </div>
        <div className="flex flex-wrap items-center gap-5">
          {socials.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="flex items-center gap-2 text-[13px] text-ink-secondary transition-colors hover:text-ink"
            >
              <Icon width={15} height={15} />
              <span>{label}</span>
            </a>
          ))}
        </div>
      </Container>
    </footer>
  );
}

/* ---------- ROOT EXPORT ---------- */
export default function Portfolio() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <Intro />
      <Journey />
      <Work />
      <Stack />
      <Credentials />
      <ThisAndThat />
      <Writing />
      <Contact />
      <Footer />
    </main>
  );
}
