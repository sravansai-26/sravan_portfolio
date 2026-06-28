import { motion } from "framer-motion";

import Container from "../common/Container";
import SectionLabel from "../common/SectionLabel";
import { fadeUp } from "../common/animations";

const experience = [
  {
    role: "Founder & Chief Technical Architect",
    org: "LYFSpot — Self-Employed / Hybrid Corporation",
    logo: "/experience/lyfspotlogo.png",
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
    tenure: "March 2026 – May 2026 · 3 Months",
    bullets: [
      "Acquired extensive practical skills across the SAP ABAP ecosystem, building scalable, modern custom extensions within SAP S/4HANA enterprise frameworks.",
      "Programmed custom Data Dictionary (DDIC) structures, optimized internal tables, executed complex modularization routines, and integrated backend debugging patterns.",
    ],
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
                <div className="flex h-11 items-center">
                  <img
                    src={e.logo}
                    alt={`${e.org} logo`}
                    className="h-11 w-auto object-contain"
                    loading="lazy"
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
            </div>
          </motion.div>
        ))}
      </div>
    </Container>
  );
}
