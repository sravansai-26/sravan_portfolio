import { motion, AnimatePresence } from "framer-motion";
import { Close, ExternalLink, DocIcon } from "./Icons";

export function ResumeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] grid place-items-center bg-black/55 px-3 py-6 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[90vh] w-full max-w-[1000px] flex-col overflow-hidden rounded-2xl border border-white/30 bg-white/80 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-[color:var(--hairline)] px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--deep-ink)] text-white">
                  <DocIcon width={16} height={16} />
                </div>
                <div>
                  <div className="font-display text-[15px] font-semibold text-ink">
                    Interactive Resume · Sravan Sai Vuppula
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    Read-only preview
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/sravan-resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="hidden items-center gap-1.5 rounded-full border border-[color:var(--hairline)] bg-white/70 px-3 py-1.5 text-[12px] text-ink hover:bg-white sm:inline-flex"
                >
                  Open in tab <ExternalLink width={12} height={12} />
                </a>
                <button
                  onClick={onClose}
                  className="grid h-9 w-9 place-items-center rounded-full text-ink-secondary hover:bg-white hover:text-ink"
                  aria-label="Close"
                >
                  <Close />
                </button>
              </div>
            </div>
            <iframe
              src="/sravan-resume.pdf#toolbar=0&view=FitH"
              title="Sravan Sai Vuppula Resume"
              className="h-full w-full flex-1 bg-white"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
