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
  PlaceholderMark,
} from "./Icons";

/* ---------- shared motion helpers ---------- */
const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

function Section({
  id,
  label,
  children,
  className = "",
}: {
  id?: string;
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-[720px] px-6 md:px-0 ${className}`}
    >
      {label && (
        <motion.div {...fadeUp} className="mono-label mb-10">
          {label}
        </motion.div>
      )}
      {children}
    </section>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  const lines = [
    <>I build products,</>,
    <>architect systems,</>,
    <>
      and{" "}
      <span className="code-tag align-middle text-[0.78em]">ship</span> things
    </>,
    <>that matter.</>,
  ];

  return (
    <section id="top" className="pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-6 md:grid-cols-[1.4fr_1fr] md:gap-16 md:px-12 lg:gap-24">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mono-label mb-8"
          >
            Founder &amp; Lead Developer · LYFSpot · Hyderabad
          </motion.div>

          <h1 className="font-display text-[44px] font-bold leading-[1.05] tracking-[-0.02em] text-ink md:text-[68px] lg:text-[78px]">
            {lines.map((l, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.15 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="block"
              >
                {l}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-10 max-w-[520px] text-[18px] leading-[1.8] text-ink-secondary md:text-[19px]"
          >
            Founder and Lead Developer of LYFSpot. Bridging robust system
            architecture, MERN-stack applications, and enterprise deep-tech.
            Building digital products that reject rigid templates and elevate
            modern everyday lives.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 text-[16px] text-ink-secondary"
          >
            Email me at{" "}
            <a className="editorial-link" href="mailto:sai1234comon@gmail.com">
              sai1234comon@gmail.com
            </a>
            , or connect on{" "}
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
              href="https://x.com/"
              target="_blank"
              rel="noreferrer"
            >
              Twitter
            </a>
            .
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[420px] md:mx-0"
        >
          <div
            className="relative overflow-hidden rounded-[4px] border border-[color:var(--hairline)]"
            style={{
              aspectRatio: "3/4",
              background:
                "linear-gradient(180deg, #EDE8DE 0%, #D9D0C0 100%)",
            }}
          >
            <img
              src={sravanImg}
              alt="Sravan Sai Vuppula, Founder of LYFSpot"
              className="absolute inset-x-0 bottom-0 mx-auto h-[108%] w-auto object-contain object-bottom"
              loading="eager"
              decoding="async"
            />
          </div>
          <div className="mono-label mt-4 text-right">
            Hyderabad — 2026
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- STAT BAR ---------- */
function StatBar() {
  const stats = ["5+ Years Building.", "7 Shipped Products.", "Startups to Enterprise."];
  return (
    <Section className="py-20 md:py-28">
      <motion.div
        {...fadeUp}
        className="flex flex-col items-start gap-4 text-ink-secondary md:flex-row md:flex-wrap md:items-center md:gap-6"
      >
        {stats.map((s, i) => (
          <div key={s} className="flex items-center gap-6">
            <span className="font-display text-[20px] italic text-ink md:text-[22px]">
              {s}
            </span>
            {i < stats.length - 1 && (
              <span className="hidden h-4 w-px bg-[color:var(--hairline)] md:inline-block" />
            )}
          </div>
        ))}
      </motion.div>
      <motion.p
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
        className="mt-10 max-w-[640px] text-[18px] leading-[1.8] text-ink md:text-[19px]"
      >
        Over five years bridging design and development into products that
        solve real problems — from civic tech to cinema systems, from logistics
        to enterprise SAP environments.
      </motion.p>
    </Section>
  );
}

/* ---------- JOURNEY ---------- */
type Entry = {
  num: string;
  range: string;
  role: string;
  org: string;
  orgMeta?: string;
  body: string;
  impact: string;
  nested?: { year: string; text: string }[];
};

const entries: Entry[] = [
  {
    num: "01",
    range: "Oct 2020 — Present",
    role: "Founder & Chief Technical Architect",
    org: "LYFSpot",
    orgMeta: "Self-Founded · Hybrid Corporation",
    body:
      "Architecting a multi-sector product ecosystem from the ground up — spanning civic tech, cinema production systems, logistics intelligence, and enterprise cloud deployments. Every product engineered for human utility, not vanity metrics.",
    impact:
      "7 shipped products across MERN, React Native, Spring Boot, and SAP ecosystems. From a blog network to a full conglomerate.",
  },
  {
    num: "02",
    range: "Mar 2026 — May 2026",
    role: "DevCon Associate — Enterprise SAP Track",
    org: "Naxrita India",
    orgMeta: "On-Site · Hyderabad, TS",
    body:
      "Immersed in production-grade SAP ABAP environments. Programmed custom Data Dictionary structures, optimized internal table architectures, and acquired hands-on depth in the SAP S/4HANA Cloud backend ecosystem.",
    impact:
      "SAP Certified Associate — ABAP Cloud. Production-ready in enterprise architecture within 3 months.",
  },
  {
    num: "03",
    range: "Oct 2020 — Present",
    role: "Founder",
    org: "Balcom & Nobody",
    orgMeta: "equivalent: LYFSpot Studio Wing",
    body:
      "The studio arm of LYFSpot — incubating experiments, frameworks, and creative engineering bets that later graduate into the product portfolio.",
    impact: "A continuous lab where everything LYFSpot ships is first prototyped.",
    nested: [
      { year: "2020", text: "Origin — sailyfspot.blogspot.com — first digital footprint." },
      { year: "2022", text: "Phase I — IVOpt and UneCust framework initiation." },
      { year: "2024", text: "Scale — full MERN deployment pipelines for Shotweave and DeployBridge." },
      { year: "2026", text: "Convergence — Mobile (LoadMate), cloud, enterprise, deep tech research." },
    ],
  },
];

function JourneyEntry({ e, index }: { e: Entry; index: number }) {
  const [open, setOpen] = useState(false);
  const hasNested = !!e.nested?.length;
  // Icon for org
  const OrgMark = e.org === "LYFSpot" ? PlaceholderMark : PlaceholderMark;

  return (
    <motion.article
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay: index * 0.04 }}
      className="border-t border-[color:var(--hairline)] py-12 first:border-t-0 first:pt-0"
    >
      <div className="mono-label mb-3 flex items-center gap-4">
        <span>{e.num}</span>
        <span className="h-px w-8 bg-[color:var(--hairline)]" />
        <span>{e.range}</span>
      </div>

      <div className="flex items-start gap-4">
        <div className="mt-1.5 grid h-10 w-10 shrink-0 place-items-center rounded-[4px] border border-[color:var(--hairline)] bg-surface text-ink-secondary">
          <OrgMark width={18} height={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[22px] font-semibold leading-tight text-ink md:text-[24px]">
            {e.role}
          </h3>
          <p className="mt-1 text-[17px] text-gold">
            {e.org}
            {e.orgMeta && (
              <span className="ml-2 text-[14px] text-ink-muted">· {e.orgMeta}</span>
            )}
          </p>
        </div>
      </div>

      <p className="mt-5 text-[17px] leading-[1.8] text-ink-secondary">{e.body}</p>

      <p className="mt-5 text-[17px] leading-[1.8] text-ink">
        <span className="font-semibold">The Impact →</span>{" "}
        <span className="text-ink-secondary">{e.impact}</span>
      </p>

      {hasNested && (
        <>
          <button
            onClick={() => setOpen((o) => !o)}
            className="mt-6 inline-flex items-center gap-2 text-[13px] text-ink-secondary transition-colors hover:text-gold"
          >
            {open ? <Minus width={14} height={14} /> : <Plus width={14} height={14} />}
            <span className="font-mono uppercase tracking-[0.12em]">
              {open ? "Hide phases" : "Show phases"}
            </span>
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 overflow-hidden"
              >
                <div className="space-y-3 border-l border-[color:var(--hairline)] pl-5">
                  {e.nested!.map((n) => (
                    <li key={n.year} className="flex gap-4 text-[16px]">
                      <span className="font-mono text-[12px] tracking-wider text-ink-muted">
                        {n.year}
                      </span>
                      <span className="text-ink-secondary">{n.text}</span>
                    </li>
                  ))}
                </div>
              </motion.ul>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.article>
  );
}

function Journey() {
  return (
    <Section id="about" label="The Journey" className="py-20 md:py-28">
      {entries.map((e, i) => (
        <JourneyEntry key={e.num} e={e} index={i} />
      ))}
    </Section>
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
    year: "2023",
    category: "MERN · Civic Tech",
    details:
      "A civic platform connecting citizens with municipal bodies through structured issue routing, status escalation, and transparent resolution timelines.",
    stack: ["MongoDB", "Express.js", "React.js", "Node.js"],
    links: [{ label: "GitHub", href: "#" }],
  },
  {
    num: "02",
    name: "Smart LoadMate",
    blurb: "AI logistics & route optimization mobile app",
    year: "2024",
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
    year: "2024",
    category: "React · Python",
    details:
      "An operations layer for film sets — call sheets, shot tracking, and crew choreography for production houses that ship.",
    stack: ["React", "Python", "PostgreSQL"],
    links: [{ label: "Case study", href: "#" }],
  },
  {
    num: "04",
    name: "DreamLaunch",
    blurb: "Content distribution engine for filmmakers",
    year: "2024",
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
    year: "2025",
    category: "Spring Boot · Java",
    details:
      "A double-entry ledger and banking simulator built on Spring Boot, exploring transactional integrity at scale.",
    stack: ["Spring Boot", "Java", "PostgreSQL"],
    links: [{ label: "GitHub", href: "#" }],
  },
  {
    num: "06",
    name: "DeployBridge",
    blurb: "Multi-cloud automated deployment engine",
    year: "2025",
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
    year: "2026",
    category: "Lovable AI Stack",
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
        className="group grid w-full grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-4 py-6 text-left transition-colors hover:bg-[rgba(193,127,62,0.04)] md:grid-cols-[36px_minmax(0,1.4fr)_minmax(0,1.4fr)_auto_28px] md:gap-6"
      >
        <span className="font-mono text-[12px] text-ink-muted">{p.num}</span>
        <div className="min-w-0">
          <div className="font-display text-[22px] font-semibold text-ink md:text-[24px]">
            {p.name}
          </div>
          <div className="mt-1 text-[14px] text-ink-secondary md:hidden">{p.blurb}</div>
        </div>
        <div className="hidden text-[15px] text-ink-secondary md:block">{p.blurb}</div>
        <div className="hidden font-mono text-[12px] uppercase tracking-wider text-ink-muted md:block">
          {p.year} · {p.category}
        </div>
        <ArrowRight
          width={18}
          height={18}
          className={`shrink-0 text-ink-secondary transition-transform duration-200 ${
            open ? "rotate-90 text-gold" : "group-hover:translate-x-1"
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-4 pb-8 pl-7 pr-2 md:grid-cols-[1fr_auto] md:gap-12 md:pl-[60px]">
              <div>
                <p className="text-[17px] leading-[1.8] text-ink-secondary">{p.details}</p>
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
    <Section id="work" label="Selected Work" className="py-20 md:py-28">
      <div>
        {projects.map((p, i) => (
          <ProjectRow key={p.num} p={p} idx={i} />
        ))}
      </div>
    </Section>
  );
}

/* ---------- STACK ---------- */
function Stack() {
  const groups: { label: string; items: string[] }[] = [
    {
      label: "Full-Stack",
      items: ["MongoDB", "Express.js", "React.js", "Node.js", "Spring Boot", "FastAPI"],
    },
    { label: "Mobile", items: ["React Native", "Expo CLI", "Android Capacitor"] },
    { label: "Languages", items: ["C", "Java", "Python", "JavaScript", "HTML5", "CSS3"] },
    { label: "Cloud & DevOps", items: ["AWS", "GCP", "Cloudinary", "Git", "GitHub"] },
    { label: "Enterprise", items: ["SAP ABAP", "SAP S/4HANA Cloud", "ABAP RAP"] },
  ];

  return (
    <Section label="What I Build With" className="py-20 md:py-28">
      <div className="space-y-7">
        {groups.map((g, i) => (
          <motion.div
            key={g.label}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.04 }}
            className="text-[17px] leading-[2] text-ink"
          >
            <span className="font-display text-[20px] italic text-ink">{g.label}:</span>{" "}
            <span className="inline-flex flex-wrap gap-2 align-middle">
              {g.items.map((t) => (
                <span key={t} className="code-tag">
                  {t}
                </span>
              ))}
            </span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- CREDENTIALS ---------- */
type Cred = { title: string; issuer: string; date: string };
const academic: Cred[] = [
  { title: "B.Tech, Computer Science Engineering", issuer: "(Institute Placeholder)", date: "2022 — 2026" },
  { title: "Intermediate / Pre-University, MPC", issuer: "(Board Placeholder)", date: "2020 — 2022" },
];
const certifications: Cred[] = [
  { title: "SAP Certified Associate — ABAP Cloud", issuer: "SAP / Naxrita India", date: "2026" },
  { title: "Full-Stack Web Development", issuer: "Self-Directed / Open Source", date: "2021 — Present" },
  { title: "Cloud Foundations", issuer: "AWS / GCP", date: "2024" },
];
const honors: Cred[] = [
  { title: "Founder, LYFSpot", issuer: "Independent Recognition", date: "2020 — Present" },
];

function CredRow({ c, onOpen }: { c: Cred; onOpen: () => void }) {
  return (
    <motion.div
      {...fadeUp}
      className="grid grid-cols-1 items-center gap-2 border-t border-[color:var(--hairline)] py-5 md:grid-cols-[1.4fr_1fr_auto] md:gap-6"
    >
      <div className="font-sans text-[18px] font-semibold text-ink">{c.title}</div>
      <div className="font-mono text-[12px] uppercase tracking-wider text-ink-muted">
        {c.issuer} · {c.date}
      </div>
      <button
        onClick={onOpen}
        className="inline-flex items-center gap-2 justify-self-start text-[14px] text-gold transition-colors hover:text-ink md:justify-self-end"
      >
        View Certificate <ArrowRight width={14} height={14} />
      </button>
    </motion.div>
  );
}

function Credentials() {
  const [active, setActive] = useState<Cred | null>(null);
  const section = (title: string, items: Cred[]) => (
    <div className="mt-10 first:mt-0">
      <div className="mono-label mb-4">{title}</div>
      <div>
        {items.map((c) => (
          <CredRow key={c.title} c={c} onOpen={() => setActive(c)} />
        ))}
      </div>
    </div>
  );
  return (
    <Section id="credentials" label="Verified Credentials" className="py-20 md:py-28">
      {section("Academic", academic)}
      {section("Certifications", certifications)}
      {section("Honors", honors)}

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(26,22,18,0.45)" }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[640px] rounded-[6px] border border-[color:var(--hairline)] bg-background p-8"
            >
              <button
                onClick={() => setActive(null)}
                className="absolute right-4 top-4 text-ink-secondary hover:text-ink"
              >
                <Close width={20} height={20} />
              </button>
              <div className="mono-label mb-3">Certificate</div>
              <h3 className="font-display text-[26px] font-semibold text-ink">{active.title}</h3>
              <div className="mt-1 font-mono text-[12px] uppercase tracking-wider text-ink-muted">
                {active.issuer} · {active.date}
              </div>
              <div
                className="mt-6 grid aspect-[4/3] w-full place-items-center rounded-[4px] border border-dashed border-[color:var(--hairline)] bg-surface text-ink-muted"
              >
                <div className="text-center">
                  <div className="font-display text-[20px] italic">Document preview</div>
                  <div className="mt-2 text-[13px]">
                    PDF / image embed placeholder — wire to your asset URL.
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

/* ---------- THIS & THAT ---------- */
function ThisAndThat() {
  const round = [
    "Always Telugu cinema over Bollywood.",
    "Always window seat.",
    "Filter coffee. Non-negotiable.",
    "A.R. Rahman's Roja over everything.",
    "The Uncharted Path over the well-trodden road.",
    "The rest is negotiable.",
  ];
  return (
    <Section label="This & That" className="py-20 md:py-28">
      <motion.p {...fadeUp} className="text-[18px] leading-[1.85] text-ink-secondary md:text-[19px]">
        A lifelong builder chasing the product that changes everything. Telugu
        cinema obsessive — watching films the way engineers read system
        architecture. Guitarist in theory, golfer in ambition. Writing Telugu
        poetry and philosophical essays when the compiler is behaving.
      </motion.p>
      <motion.p
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.08 }}
        className="mt-5 text-[18px] leading-[1.85] text-ink-secondary md:text-[19px]"
      >
        Based in Hyderabad with a head full of roadmaps and a tab open on every
        interesting problem.
      </motion.p>

      <motion.div {...fadeUp} className="mt-12">
        <div className="mono-label mb-4">Lightning Round</div>
        <ul className="space-y-3">
          {round.map((r) => (
            <li key={r} className="flex gap-3 text-[17px] text-ink">
              <span className="text-gold">—</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        {...fadeUp}
        className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <div className="rounded-[4px] border border-[color:var(--hairline)] bg-surface p-6">
          <div className="mono-label mb-2">Now Reading</div>
          <p className="font-display text-[18px] italic leading-snug text-ink">
            "The well-trodden road is comfortable. The uncharted one is honest."
          </p>
          <div className="mt-3 text-[13px] text-ink-muted">— from a 2025 Medium essay</div>
        </div>
        <div className="rounded-[4px] border border-[color:var(--hairline)] bg-surface p-6">
          <div className="mono-label mb-2">Now Building</div>
          <p className="font-display text-[18px] italic leading-snug text-ink">
            IVOpt — In Active Development
          </p>
          <div className="mt-3 text-[13px] text-ink-muted">
            Internal LYFSpot framework · 2026
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

/* ---------- WRITING ---------- */
function Writing() {
  return (
    <Section id="writing" label="Words" className="py-20 md:py-28">
      <motion.article
        {...fadeUp}
        className="border-t border-[color:var(--hairline)] py-8"
      >
        <h3 className="font-display text-[22px] italic font-semibold leading-snug text-ink md:text-[24px]">
          The Uncharted Path: Rewriting the Rules of Learning for a Life of True Worth
        </h3>
        <div className="mt-2 font-mono text-[12px] uppercase tracking-wider text-ink-muted">
          Medium · 2025
        </div>
        <p className="mt-4 text-[17px] leading-[1.8] text-ink-secondary">
          An analytical dissection of why traditional education paths fail
          independent thinkers — and what the alternative looks like.
        </p>
        <a
          href="https://medium.com/"
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-[15px] text-gold transition-colors hover:text-ink"
        >
          Read on Medium <ArrowRight width={14} height={14} />
        </a>
      </motion.article>
    </Section>
  );
}

/* ---------- CONTACT ---------- */
function Contact() {
  return (
    <Section id="contact" label="Let's Talk" className="py-20 md:py-28">
      <motion.p
        {...fadeUp}
        className="text-[18px] leading-[1.85] text-ink-secondary md:text-[19px]"
      >
        Open to product conversations, collaboration, and ambitious ideas.
        Reach me directly:
      </motion.p>

      <motion.ul {...fadeUp} className="mt-8 space-y-4">
        {[
          { mail: "sai1234comon@gmail.com", label: "Personal Engineering Office" },
          { mail: "lyfspot@zohomail.in", label: "LYFSpot Corporate Desk" },
          { mail: "lyfspot26@gmail.com", label: "General Inquiries" },
        ].map((e) => (
          <li key={e.mail} className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-6">
            <a className="editorial-link font-mono text-[15px]" href={`mailto:${e.mail}`}>
              {e.mail}
            </a>
            <span className="text-[14px] text-ink-muted">— {e.label}</span>
          </li>
        ))}
      </motion.ul>

      <motion.form
        {...fadeUp}
        action="https://formspree.io/f/your-id-here"
        method="POST"
        className="mt-14 grid grid-cols-1 gap-4"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mono-label mb-2 block">Name</span>
            <input
              required
              name="name"
              type="text"
              className="w-full border border-[color:var(--hairline)] bg-transparent px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-gold"
            />
          </label>
          <label className="block">
            <span className="mono-label mb-2 block">Email</span>
            <input
              required
              name="email"
              type="email"
              className="w-full border border-[color:var(--hairline)] bg-transparent px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-gold"
            />
          </label>
        </div>
        <label className="block">
          <span className="mono-label mb-2 block">Message</span>
          <textarea
            required
            name="message"
            rows={6}
            className="w-full resize-none border border-[color:var(--hairline)] bg-transparent px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-gold"
          />
        </label>
        <div className="mt-2">
          <button
            type="submit"
            className="group inline-flex items-center gap-3 border border-ink bg-ink px-6 py-3 text-[14px] font-medium text-background transition-colors hover:bg-gold hover:border-gold"
          >
            Send message
            <ArrowRight width={16} height={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.form>
    </Section>
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
    <footer
      className="mt-24"
      style={{ background: "var(--deep-ink)", color: "var(--surface)" }}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-14 md:flex-row md:items-center md:justify-between md:px-12">
        <div className="text-[14px] text-[color:var(--surface)]/80">
          © 2026 Sravan Sai Vuppula · Designed &amp; Engineered by LYFSpot
        </div>
        <div className="flex flex-wrap items-center gap-5">
          {socials.map(({ Icon, href, label }, i) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="group flex items-center gap-2 text-[14px] text-[color:var(--surface)]/80 transition-colors hover:text-gold"
            >
              <Icon width={16} height={16} />
              <span>{label}</span>
              {i < socials.length - 1 && (
                <span className="ml-3 hidden h-3 w-px bg-[color:var(--surface)]/20 md:inline-block" />
              )}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ---------- ROOT EXPORT ---------- */
export default function Portfolio() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <StatBar />
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
