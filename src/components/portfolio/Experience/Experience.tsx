import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";

import Container from "../common/Container";
import SectionLabel from "../common/SectionLabel";
import { fadeUp } from "../common/animations";

const experience = [
  {
    role: "Founder & Chief Technical Architect",
    org: "LYFSpot — Self-Employed / Hybrid Corporation",
    logo: "/experience/lyfspotlogo.png",
    width: 500,
    height: 500,
    tenure: "October 2020 – Present · 5 Years, 9 Months",
    bullets: [
      "Architected multi-sector technical frameworks across diverse production distributions including SaaS, Civic Tech, Logistics, and Fintech pipelines.",
      "Oversaw the end-to-end full-stack lifecycle of major custom enterprise software distributions, maximizing cross-platform uptime and code maintainability.",
    ],
  },
  {
    role: "DevCon Associate — Enterprise SAP Track",
    org: "Naxrita India — On-Site Internship Core, Hyderabad, TS",
    logo: "/experience/naxritalogo.png",
    width: 204,
    height: 192,
    tenure: "March 2026 – May 2026 · 3 Months",
    bullets: [
      "Acquired extensive practical skills across the SAP ABAP ecosystem, building scalable, modern custom extensions within SAP S/4HANA enterprise frameworks.",
      "Programmed custom Data Dictionary (DDIC) structures, optimized internal tables, executed complex modularization routines, and integrated backend debugging patterns.",
    ],
    project: {
      title: "Enterprise Supplier SLA & Penalty Settlement Engine",
      domain: "Clean Core Side-by-Side Extension | SAP BTP ABAP Environment",
      badges: [
        "ABAP Cloud",
        "RAP (Managed Draft)",
        "CDS & OData V4",
        "SAP Fiori Elements",
        "Clean Core",
      ],
      summary:
        "Engineered a full-lifecycle SAP BTP enterprise extension automating supply chain liquidated damages calculation without modifying standard S/4HANA core tables. Features dynamic delivery delay determinations (Delay × Rate), strict date integrity validations, and auditable EML-powered state machine transitions (Approve/Waive).",
      highlights: [
        "Managed RAP & Draft Persistency: Stateless draft lifecycle with active (ZSLARECORD) and draft (ZSLARECORD_D) dual-layer tables.",
        "Reactive Business Logic: Determinations triggered on modify for monetary fine evaluation; validations enforcing delivery-date integrity on save.",
        "Transactional State Machine: Custom RAP actions (approvePenalty, waivePenalty) implemented via ABAP EML local handler classes.",
        "Enterprise UI: Semantic CDS Metadata Extensions generating an SAP Fiori Elements List Report and Object Page over OData V4.",
      ],
      githubUrl: "https://github.com/sravansai-26/sap-btp-supplier-sla-engine",
      secondaryTag: "OData V4 Architecture & Clean Core Pattern",
    },
  },
];

export default function Experience() {
  return (
    <Container id="experience" className="py-24 md:py-32">
      <SectionLabel>Professional Experience & Internships</SectionLabel>

      <motion.h2
        {...fadeUp}
        className="mb-12 max-w-[900px] font-display text-[30px] font-bold leading-[1.08] tracking-[-0.025em] text-ink md:text-[44px]"
      >
        A corporate ledger of verified enterprise execution.
      </motion.h2>

      <div>
        {experience.map((e, i) => (
          <motion.div
            key={e.role}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.05 }}
            className="grid grid-cols-1 gap-6 border-t border-[color:var(--hairline)] py-10 md:grid-cols-[240px_minmax(0,1fr)] md:gap-12 last:border-b"
          >
            {/* Left Column */}
            <div>
              <div className="flex flex-col gap-4">
                <div className="flex min-h-[56px] items-center">
                  <img
                    src={e.logo}
                    alt={`${e.org} logo`}
                    className={`w-auto object-contain ${
                      e.org.includes("Naxrita") ? "h-14" : "h-11"
                    }`}
                    loading="lazy"
                    decoding="async"
                    width={e.width}
                    height={e.height}
                  />
                </div>

                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                  {e.tenure}
                </div>
              </div>
            </div>

            {/* Right Column */}
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

              {e.project && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#0070F2]/10 md:p-8"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h4 className="font-display text-[20px] font-bold text-white md:text-[24px]">
                        {e.project.title}
                      </h4>
                      <div className="mt-1 font-mono text-[13px] text-[#0A85EA]">
                        {e.project.domain}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {e.project.badges.map((badge) => (
                      <span
                        key={badge}
                        className={`rounded-full px-3 py-1 text-[12px] font-medium tracking-wide ${badge === "Clean Core" || badge === "Approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-[#0070F2]/10 text-[#0070F2] border border-[#0070F2]/20"}`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <p className="mt-5 text-[15px] leading-[1.6] text-slate-300">
                    {e.project.summary}
                  </p>

                  <div className="mt-6">
                    <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {e.project.highlights.map((highlight, idx) => {
                        const [boldPart, rest] = highlight.split(": ");
                        return (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-[14px] leading-[1.6] text-slate-400"
                          >
                            <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#0A85EA]" />
                            <span>
                              <strong className="text-slate-200">{boldPart}:</strong> {rest}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <a
                      href={e.project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 rounded-lg bg-[#0070F2] px-5 py-2.5 text-[14px] font-semibold text-white transition-all hover:bg-[#0A85EA]"
                      aria-label="View Project on GitHub"
                    >
                      <Github className="h-4 w-4" />
                      <span>View Repository</span>
                      <ExternalLink className="h-3 w-3 opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                    <div className="text-[13px] font-medium text-slate-500">
                      {e.project.secondaryTag}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Container>
  );
}
