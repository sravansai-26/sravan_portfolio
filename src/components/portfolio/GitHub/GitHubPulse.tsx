import { motion } from "framer-motion";

import { ArrowRight, GitHubIcon } from "../Icons";

import Container from "../common/Container";
import SectionLabel from "../common/SectionLabel";
import { fadeUp } from "../common/animations";

export default function GitHubPulse() {
  return (
    <Container id="pulse" className="py-24 md:py-32">
      <SectionLabel>Live Engineering Pulse</SectionLabel>
      <motion.h2
        {...fadeUp}
        className="mb-12 max-w-225 font-display font-bold tracking-tight text-ink leading-[1.08] text-[30px] md:text-[44px]"
      >
        Real commits. Real cadence. Direct from{" "}
        <a
          className="editorial-link"
          href="https://github.com/sravansai-26"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/sravansai-26
        </a>
        .
      </motion.h2>

      <motion.div
        {...fadeUp}
        className="overflow-hidden rounded-sm border border-hairline bg-surface p-6 md:p-10"
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
            rel="noopener noreferrer"
            className="editorial-link inline-flex items-center gap-2 text-[14px]"
          >
            Open profile <ArrowRight width={14} height={14} />
          </a>
        </div>
        <div className="mt-6 overflow-x-auto">
          <img
            src="https://ghchart.rshah.org/2A6F8E/sravansai-26"
            alt="GitHub contribution graph for sravansai-26"
            className="w-full min-w-160"
            loading="lazy"
          />
        </div>
      </motion.div>
    </Container>
  );
}
