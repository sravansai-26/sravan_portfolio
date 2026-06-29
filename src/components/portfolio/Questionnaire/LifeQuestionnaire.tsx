import { useState } from "react";
import { motion } from "framer-motion";

import Container from "../common/Container";
import SectionLabel from "../common/SectionLabel";
import { fadeUp } from "../common/animations";

import { SparkIcon, Send } from "../Icons";

type FieldProps = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
};

function Field({ name, label, type = "text", required = false }: FieldProps) {
  return (
    <label className="block">
      <span className="mono-label mb-2 block">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-[color:var(--hairline)] bg-white/80 px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-ink"
      />
    </label>
  );
}

export default function LifeQuestionnaire() {
  const [submitted, setSubmitted] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const FORMSPREE = import.meta.env.VITE_FORMSPREE_QUESTION as string;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch(FORMSPREE, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setSubmitted(true);
        form.reset();
        setAnswer("");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Unable to submit your response. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container id="questionnaire" className="py-24 md:py-32">
      <SectionLabel>Open Call · A One-Question Audition for LYFSpot Creative</SectionLabel>

      <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-[color:var(--accent-blue)]/12 via-white/30 to-white/10 p-7 backdrop-blur-2xl md:p-14">
        {/* decorative gradient orbs */}
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[color:var(--accent-blue)]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-12 h-72 w-72 rounded-full bg-[color:var(--deep-ink)]/10 blur-3xl" />

        <motion.div
          {...fadeUp}
          className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16"
        >
          <div>
            <div
              className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-accent"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              One word. One thought. One opportunity.
            </div>
            <h2 className="mt-4 font-display text-[34px] font-black leading-[1.04] tracking-[-0.025em] text-ink md:text-[56px]">
              What is the first thing that comes to your mind when you hear the word{" "}
              <span className="relative inline-block">
                <span className="relative z-10 italic">LIFE</span>
                <span className="absolute inset-x-0 bottom-1 z-0 h-3 bg-[color:var(--accent-blue)]/35" />
              </span>
              ?
            </h2>
            <p className="mt-6 max-w-[520px] text-[15.5px] leading-[1.7] text-ink-secondary">
              No formula. No right answer. Selected, meaningful responses get an invitation to
              collaborate inside the creative wing of LYFSpot — writing, cinema, product, or
              research. Share your raw instinct.
            </p>
            <div
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] bg-white/60 px-4 py-2 text-[12px] text-ink-secondary"
              style={{ fontFamily: "Roboto, sans-serif", letterSpacing: "0.08em" }}
            >
              <SparkIcon width={14} height={14} className="text-accent" />
              Reviewed personally by the founder
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="relative rounded-2xl border border-white/50 bg-white/65 p-6 shadow-[0_20px_60px_-30px_rgba(26,33,40,0.35)] backdrop-blur-xl md:p-8"
          >
            {submitted ? (
              <div className="flex h-full min-h-[280px] flex-col items-start justify-center">
                <div className="mono-label mb-3">Response Logged</div>
                <h3 className="font-display text-[26px] font-bold tracking-[-0.02em] text-ink">
                  Thank you — your word is heard.
                </h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-ink-secondary">
                  Selected entries will receive a personal reply at the email you provided.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] bg-white px-4 py-2 text-[13px] text-ink hover:bg-[color:var(--surface)]"
                >
                  Submit another response
                </button>
              </div>
            ) : (
              <>
                <label className="block">
                  <span className="mono-label mb-2 block">Your Word, Phrase or Thought</span>
                  <textarea
                    name="life_answer"
                    required
                    rows={3}
                    maxLength={400}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="LIFE is…"
                    className="w-full resize-none rounded-xl border border-[color:var(--hairline)] bg-white/80 p-4 font-display text-[22px] font-semibold leading-[1.3] tracking-[-0.01em] text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-ink"
                  />
                  <div
                    className="mt-1 text-right text-[11px] text-ink-muted"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {answer.length} / 400
                  </div>
                </label>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field name="entrant_name" label="Your Name" required />
                  <Field name="entrant_email" label="Email Address" type="email" required />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[14px] font-medium text-background transition-colors hover:bg-deep-ink disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send width={16} height={16} />
                  {loading ? "Submitting..." : "Submit my response"}
                </button>

                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

                <p
                  className="mt-3 text-[11px] text-ink-muted"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    letterSpacing: "0.06em",
                  }}
                >
                  Your email is used only for follow-up — never shared or listed.
                </p>
              </>
            )}
          </form>
        </motion.div>
      </div>
    </Container>
  );
}
