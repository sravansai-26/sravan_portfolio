import { useState } from "react";
import { motion } from "framer-motion";

import { ArrowRight, Send } from "../Icons";

import Container from "../common/Container";
import SectionLabel from "../common/SectionLabel";
import { fadeUp } from "../common/animations";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const FORMSPREE = import.meta.env.VITE_FORMSPREE_CONTACT; // using env variable

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      const form = e.currentTarget;
      const data = new FormData(form);

      const response = await fetch(FORMSPREE, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        form.reset();
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <Container id="contact" className="py-24 md:py-32">
      <SectionLabel>Get in Touch · Direct Communication</SectionLabel>
      <motion.h2
        {...fadeUp}
        className="mb-14 max-w-[900px] font-display font-bold tracking-[-0.025em] text-ink leading-[1.08] text-[34px] md:text-[56px]"
      >
        Let's build something{" "}
        <span className="font-mono font-medium tracking-[-0.02em] text-[0.78em] align-baseline">
          real()
        </span>
        .
      </motion.h2>

      <div className="grid grid-cols-1 gap-14 md:grid-cols-[1fr_1.1fr] md:gap-20">
        <motion.div {...fadeUp}>
          <div className="mono-label mb-4">Direct Channels</div>
          <div className="space-y-5">
            {[
              {
                label: "Personal Engineering Office",
                email: "sai1234comon@gmail.com",
              },
              { label: "LYFSpot Corporate Desk", email: "lyfspot@zohomail.in" },
              { label: "LYFSpot Inbound Desk", email: "lyfspot26@gmail.com" },
            ].map((c) => (
              <a
                key={c.email}
                href={`mailto:${c.email}`}
                className="group block border-t border-[color:var(--hairline)] pt-4 last:border-b last:pb-4"
              >
                <div className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                  {c.label}
                </div>
                <div className="mt-1 flex items-center justify-between gap-3 font-display text-[18px] font-semibold text-ink transition-colors group-hover:text-accent">
                  <span>{c.email}</span>
                  <ArrowRight
                    width={14}
                    height={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        <motion.form
          {...fadeUp}
          onSubmit={onSubmit}
          className="space-y-5 rounded-sm border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6 md:p-8"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field name="name" label="Full Name" required />
            <Field name="email" label="Email Address" type="email" required />
          </div>
          <SelectField
            name="subject"
            label="Subject"
            options={[
              "Collaboration Inquiry",
              "Project Discussion",
              "Job Opportunity",
              "Feedback",
              "General Query",
              "Other",
            ]}
          />
          <TextAreaField name="message" label="Message" required />

          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[14px] font-medium text-background transition-colors hover:bg-deep-ink disabled:opacity-60"
          >
            <Send width={16} height={16} />
            {status === "sending"
              ? "Sending…"
              : status === "sent"
                ? "✓ Message Sent"
                : "Send Message"}
          </button>

          {status === "error" && (
            <div className="font-mono text-[12px] text-red-600">
              Unable to send your message. Please try again in a moment.
            </div>
          )}
          {status === "sent" && (
            <div className="font-mono text-[12px] text-ink-muted">
              ✓ Message Sent
              <br />
              Thank you for reaching out.
              <br />
              Your message has been successfully delivered. I'll get back to you as soon as
              possible.
            </div>
          )}
        </motion.form>
      </div>
    </Container>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mono-label mb-2 block">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full border-b border-[color:var(--hairline)] bg-transparent py-2 text-[15px] text-ink outline-none transition-colors focus:border-ink"
      />
    </label>
  );
}

function SelectField({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="mono-label mb-2 block">{label}</span>
      <select
        name={name}
        defaultValue=""
        className="w-full border-b border-[color:var(--hairline)] bg-transparent py-2 text-[15px] text-ink outline-none transition-colors focus:border-ink"
      >
        <option value="" disabled>
          Select a subject
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  name,
  label,
  required,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mono-label mb-2 block">{label}</span>
      <textarea
        name={name}
        required={required}
        rows={5}
        className="w-full resize-none border border-[color:var(--hairline)] bg-transparent p-3 text-[15px] text-ink outline-none transition-colors focus:border-ink"
      />
    </label>
  );
}
