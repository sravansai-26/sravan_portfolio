import { motion } from "framer-motion";

import Container from "../common/Container";
import SectionLabel from "../common/SectionLabel";
import { fadeUp } from "../common/animations";

import { ArrowRight, BlogIcon, MediumIcon, WritcoIcon } from "../Icons";

export default function Publications() {
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
          advocates for autonomous project ownership, deliberate architectural exploration, and
          prioritizing real-world software engineering deployments over passive learning patterns.
        </p>
        <a
          href="https://medium.com/@sravansaivuppula/the-uncharted-path-rewriting-the-rules-of-learning-for-a-life-of-true-worth-0f3b55c6befb"
          target="_blank"
          rel="noopener noreferrer"
          className="editorial-link mt-5 inline-flex items-center gap-2 text-[15px]"
        >
          <MediumIcon width={16} height={16} /> Open Publication Node{" "}
          <ArrowRight width={14} height={14} />
        </a>
      </motion.article>

      <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-[color:var(--hairline)] sm:grid-cols-2">
        <a
          href="https://writco.in/LYFSpot"
          target="_blank"
          rel="noopener noreferrer"
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
          <ArrowRight
            width={14}
            height={14}
            className="text-ink-muted transition-transform group-hover:translate-x-1"
          />
        </a>
        <a
          href="https://sailyfspot.blogspot.com"
          target="_blank"
          rel="noopener noreferrer"
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
          <ArrowRight
            width={14}
            height={14}
            className="text-ink-muted transition-transform group-hover:translate-x-1"
          />
        </a>
      </div>
    </Container>
  );
}
