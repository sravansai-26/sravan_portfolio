import { motion } from "framer-motion";

import sravanImg from "@/assets/sravan-cutout.png";

import { ArrowRight, DocIcon } from "../Icons";

import { fadeUp } from "../common/animations";

export default function Hero({ onLaunchResume }: { onLaunchResume: () => void }) {
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
            <a className="editorial-link" href="#lyfspot">
              LYFSpot
            </a>
            . Bridging the gap between robust system architecture, sleek MERN-stack applications,
            and deep-tech enterprise systems. Crafting digital products that reject rigid templates
            to elevate modern everyday lives.
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
            <a
              href="#contact"
              className="editorial-link inline-flex items-center gap-2 text-[14px]"
            >
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
