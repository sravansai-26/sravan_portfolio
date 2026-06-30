import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Container from "../common/Container";
import SectionLabel from "../common/SectionLabel";
import { fadeUp } from "../common/animations";

import { ArrowRight, ExternalLink, WebIcon, GitHubIcon, GatewayIcon, DesignIcon } from "../Icons";

type Project = {
  num: string;
  name: string;
  classification: string;
  stack: string;
  description: string;
  note?: string;
  logo?: string; // image placeholder path under /public
  links: { Icon: typeof WebIcon; label: string; href: string }[];
};

const projects: Project[] = [
  {
    num: "01",
    name: "Resolveit",
    classification: "Civic Tech · Startup Core Platform (LYFSpot Ecosystem)",
    logo: "/projects/resolveit.png",
    stack: "MERN Stack — MongoDB, Express.js, React.js, Node.js",
    description:
      "A highly secure, public issue-solving infrastructure built to transparently log, track, and resolve community and civic discrepancies through streamlined administrator dashboards.",
    links: [
      {
        Icon: GitHubIcon,
        label: "Code Repository",
        href: "https://github.com/sravansai-26/resolveit",
      },
      { Icon: WebIcon, label: "Live Platform Node", href: "http://resolveit-community.me" },
      {
        Icon: GatewayIcon,
        label: "Digital Download Gateway",
        href: "http://resolveit-gateway.vercel.app",
      },
    ],
  },
  {
    num: "02",
    name: "Smart LoadMate",
    classification: "Academic Innovation · Minor Project Board (MLRIT)",
    logo: "/projects/loadmate.png",
    stack: "React Native, Expo, Python FastAPI, MongoDB",
    description:
      "An intelligent, dual-interface logistics delivery and route optimization mobile application designed to seamlessly coordinate tasks between commercial haulers and drivers.",
    note: "System Note: The current preview link serves as an interactive Web Layout Preview. Full native distribution packages for Google Play Store and Apple App Store are undergoing active development. For optimal interface rendering on mobile viewports, toggle Desktop Mode View within your mobile browser.",
    links: [
      {
        Icon: GitHubIcon,
        label: "Code Repository",
        href: "https://github.com/sravansai-26/LoadMate-App",
      },
      {
        Icon: WebIcon,
        label: "Live Web Preview Matrix",
        href: "https://smart-loadmate.vercel.app/",
      },
    ],
  },
  {
    num: "03",
    name: "Shotweave",
    classification: "National Level Cinema Hackathon Feature",
    logo: "/projects/shotweave.png",
    stack: "React.js, Python Backend Framework, MongoDB",
    description:
      "A powerful AI-driven operations dashboard engineered specifically for cinema production houses. Provides real-time financial tracking, predictive analytics for rolling film budgets, daily expense sheet optimization, dynamic script breakdowns, and cross-department scheduling syncs.",
    links: [
      {
        Icon: GitHubIcon,
        label: "Code Repository",
        href: "https://github.com/sravansai-26/shotweavep",
      },
      {
        Icon: WebIcon,
        label: "Live System Dashboard",
        href: "https://shotweave.vercel.app/",
      },
    ],
  },
  {
    num: "04",
    name: "DreamLaunch",
    classification: "Media Distribution Systems (LYFSpot Ecosystem)",
    logo: "/projects/dreamlaunch.png",
    stack: "MERN Stack — MongoDB, Express.js, React.js, Node.js",
    description:
      "A content orchestration platform built for filmmakers, screenwriters, and independent producers. Empowers creators to centrally manage major promotional assets — teasers, trailers, script previews — and safely deploy them simultaneously across major social API endpoints.",
    links: [
      {
        Icon: GitHubIcon,
        label: "Code Repository",
        href: "https://github.com/sravansai-26/dreamlaunch-client",
      },
    ],
  },
  {
    num: "05",
    name: "VaultBank",
    classification: "Enterprise Simulation · Infosys Virtual Internship Program",
    logo: "/projects/vaultbank.png",
    stack: "Java Enterprise Architecture, Spring, Spring Boot, MySQL, React.js",
    description:
      "A financial transaction and ledger simulation framework providing authenticated account controls, real-time balance sheets, automated bank statements, secure transaction notifications, and integrated analytical spreadsheets.",
    links: [
      {
        Icon: GitHubIcon,
        label: "Code Repository",
        href: "https://github.com/sravansai-26/VaultBank",
      },
    ],
  },
  {
    num: "06",
    name: "DeployBridge",
    classification: "National Level Technical Hackathon · Zignasa Platform Entry",
    logo: "/projects/deploybridge.png",
    stack: "MERN Stack — MongoDB, Express.js, React.js, Node.js",
    description:
      "An intelligent deployment orchestration engine that analyzes repositories, detects framework dependencies, resolves build failures, recommends optimal cloud infrastructure, and automates deployment workflows across modern hosting platforms including Vercel, Render, and Netlify.",
    links: [
      {
        Icon: GitHubIcon,
        label: "Code Repository",
        href: "https://github.com/sravansai-26/DeployBridge",
      },
    ],
  },
  {
    num: "07",
    name: "Sri-Wedding System Architecture",
    classification: "High-Fidelity Professional UX Contract Design",
    logo: "/projects/sri-wedding.png",
    stack: "AI Stack Execution Engine",
    description:
      "An elite digital ordering, product showcase, and fulfillment interface engineered for a premium Ethical Center business. Features minimalist UI structures optimized for rapid conversion metrics. Status: Contract Negotiation Phase / Expanding Advanced Client Core Engine.",
    links: [
      {
        Icon: DesignIcon,
        label: "Interactive UI/UX Canvas",
        href: "https://sri-wedding.lovable.app",
      },
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
        className="group grid w-full grid-cols-[40px_minmax(0,1fr)_28px] items-center gap-4 py-7 text-left md:grid-cols-[60px_56px_minmax(0,1fr)_minmax(0,1fr)_28px] md:gap-8"
      >
        <span className="font-mono text-[13px] text-ink-muted">{p.num}.</span>
        {p.logo ? (
          <span className="hidden h-12 w-12 shrink-0 overflow-hidden rounded-md bg-[color:var(--surface)] ring-1 ring-[color:var(--hairline)] md:block">
            <img src={p.logo} alt={`${p.name} logo`} className="h-full w-full object-cover" />
          </span>
        ) : (
          <span className="hidden md:block" aria-hidden />
        )}
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

export default function Work() {
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
