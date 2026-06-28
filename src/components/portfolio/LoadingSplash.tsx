import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ssvMark from "@/assets/ssv-mark.png";

export function LoadingSplash() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1900);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-[color:var(--deep-ink)]"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.img
              src={ssvMark}
              alt="SSV"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="h-28 w-28 object-contain drop-shadow-[0_8px_30px_rgba(255,255,255,0.15)]"
            />
            <div className="overflow-hidden">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="font-display text-[13px] md:text-[15px] font-medium tracking-[0.18em] uppercase text-white/70"
              >
                The untapped potential is going to be tapped.
              </motion.p>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="h-px bg-white/40"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
