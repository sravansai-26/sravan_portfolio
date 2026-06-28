import { motion } from "framer-motion";

import Container from "../common/Container";
import SectionLabel from "../common/SectionLabel";
import { fadeUp } from "../common/animations";

export default function Identity() {
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
            Driven by the pursuit of turning complex, abstract engineering concepts into scalable,
            intuitive real-world applications. Every pixel must serve a function; every route must
            optimize a workflow.
          </p>
        </motion.div>
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="border-t border-[color:var(--hairline)] pt-6"
        >
          <div className="mono-label mb-3">The Creative Edge</div>
          <p className="text-[17px] leading-[1.7] text-ink">
            Deeply rooted in regional Indian cinema and creative storytelling. Viewing software
            architecture through the lens of a director — pacing, structural flow, emotional impact,
            and cohesive world-building translate directly into writing pristine, intentional code.
          </p>
        </motion.div>
      </div>
    </Container>
  );
}
