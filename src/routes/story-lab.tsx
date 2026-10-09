import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Nav } from "@/components/portfolio/Nav";
import Footer from "@/components/portfolio/Footer/Footer";
import Container from "@/components/portfolio/common/Container";
import { fadeUp } from "@/components/portfolio/common/animations";

export const Route = createFileRoute("/story-lab")({
  head: () => ({
    meta: [
      { title: "The Story Lab | Sravan Sai Vuppula" },
      {
        name: "description",
        content: "A character waiting to be discovered. A world waiting to be imagined. Stories that could begin with your idea.",
      },
    ],
  }),
  component: StoryLab,
});

function StoryLab() {
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    nickname: "",
    parentEmail: "",
    hasConsent: false,
  });

  useEffect(() => {
    import("@google/model-viewer").catch(console.error);
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");
  const [referenceId, setReferenceId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitState("idle");
    setErrorMessage("");

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value.toString());
      });

      const res = await fetch("/api/story-lab", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSubmitState("success");
      setReferenceId(data.referenceId || "");
      setFormData({
        category: "",
        title: "",
        description: "",
        nickname: "",
        parentEmail: "",
        hasConsent: false,
      });
    } catch (err: any) {
      console.error(err);
      setSubmitState("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("share-an-idea")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent-blue/20">
      {/* We reuse the Nav but we might need to handle onLaunchResume if it's required by Nav. 
          For simplicity, passing an empty function as resume isn't the focus here, but it prevents errors. */}
      <Nav onLaunchResume={() => { window.location.href = "/#resume"; }} />

      <main className="pt-24 pb-32">
        {/* SECTION A: THE INVITATION */}
        <Container className="pt-12 md:pt-20">
          <motion.div {...fadeUp} className="max-w-3xl">
            <div className="mono-label mb-6">A LYFSpot Creative Initiative</div>
            <h1 className="font-display text-[40px] font-bold leading-[1.05] tracking-tight text-ink md:text-[64px]">
              Every great story starts with an idea.
            </h1>
            <p className="mt-8 text-[18px] leading-relaxed text-ink-secondary md:text-[22px]">
              One character. An unexplored world. Endless possibilities.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-secondary md:text-[18px]">
              We're exploring who this character could become, the world it might live in, and the stories it could tell. Have an idea? Help us imagine what comes next.
              <br /><br />
              <span className="text-[14px] text-ink-muted italic">* Note: This is an early-stage creative concept, not a finalized production.</span>
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <button 
                onClick={() => document.getElementById("meet-the-character")?.scrollIntoView({ behavior: "smooth" })}
                className="rounded-full bg-ink px-6 py-3 text-[14px] font-semibold text-white transition-all hover:bg-ink-secondary"
              >
                Meet the Character
              </button>
              <button 
                onClick={scrollToForm}
                className="rounded-full border border-ink/20 bg-transparent px-6 py-3 text-[14px] font-semibold text-ink transition-all hover:bg-ink/5"
              >
                Share an Idea
              </button>
            </div>
          </motion.div>
        </Container>

        {/* SECTION B & C: MEET THE CHARACTER & 3D VIEWER */}
        <Container id="meet-the-character" className="mt-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            <motion.div {...fadeUp}>
              <h2 className="font-display text-[28px] font-bold tracking-tight text-ink md:text-[36px]">
                Who is under the hat?
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-secondary">
                The hat is on. The scarf has a story to tell. But who is this character, really? That's still part of the adventure. 
              </p>
              
              <div className="mt-10 rounded-2xl border border-[color:var(--hairline)] bg-surface/30 p-6 md:p-8">
                <h3 className="font-display text-[18px] font-semibold text-ink">Character Profile (Work in Progress)</h3>
                <ul className="mt-5 space-y-4">
                  {[
                    "Name — open for ideas.",
                    "Personality — open for ideas.",
                    "Home or story setting — open for ideas.",
                    "Friends and companions — open for ideas.",
                    "Strengths, quirks, and flaws — open for ideas.",
                    "Favourite adventures — open for ideas."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[15px] text-ink-secondary">
                      <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-accent-blue" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-[color:var(--hairline)] pt-4">
                  <p className="text-[13px] text-ink-muted">
                    These are brainstorming prompts. We invite you to suggest ideas that might shape the character's future!
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="flex flex-col">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[color:var(--hairline)] bg-white/50 shadow-sm md:aspect-square">
                {/* 
                  Using @google/model-viewer 
                  Fallback to neutral studio environment since the mesh doesn't have inherent colorful materials.
                */}
                <model-viewer
                  src="/src/assets/white_mesh.glb"
                  alt="A 3D model of the character"
                  auto-rotate
                  camera-controls
                  shadow-intensity="1"
                  environment-image="neutral"
                  exposure="0.8"
                  style={{ width: "100%", height: "100%", backgroundColor: "#f8fafc" }}
                  interaction-prompt="hover-2d"
                >
                  <div slot="poster" className="absolute inset-0 grid place-items-center bg-slate-50">
                    <span className="mono-label text-ink-muted">Loading Character Model...</span>
                  </div>
                </model-viewer>
              </div>
              <div className="mt-4 flex items-center justify-between px-2">
                <span className="mono-label">Interactive 3D Preview</span>
                <span className="text-[12px] text-ink-muted">Drag to rotate • Scroll to zoom</span>
              </div>
            </motion.div>
          </div>
        </Container>

        {/* SECTION D: BUILD THE STORY WORLD */}
        <Container className="mt-32">
          <motion.div {...fadeUp} className="mx-auto max-w-4xl text-center">
            <h2 className="font-display text-[28px] font-bold tracking-tight text-ink md:text-[36px]">
              Build the Story World
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-secondary">
              Imagine what surrounds the character. Every universe needs a setting, conflicts, and memorable moments.
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { q: "Where does the character live?", a: "A dusty desert town? A floating city? A quiet forest?" },
              { q: "Who might become a friend?", a: "A loyal robotic dog? A grumpy traveler? A magical creature?" },
              { q: "What is an unexpected adventure?", a: "Finding a lost map? Escaping a collapsing cave? Solving a town mystery?" },
              { q: "What are their quirks?", a: "Always loses their hat? Can't stop telling bad jokes? Terrified of spiders?" },
              { q: "What challenges await?", a: "A rival treasure hunter? A severe sandstorm? A broken time machine?" },
              { q: "What's a memorable episode?", a: "The great train chase. The festival of lanterns. The silent canyon." },
            ].map((prompt, i) => (
              <motion.div 
                key={i} 
                {...fadeUp} 
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-[color:var(--hairline)] bg-white/40 p-6 backdrop-blur-sm transition-all hover:bg-white/60"
              >
                <h4 className="font-display text-[18px] font-semibold text-ink">{prompt.q}</h4>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-secondary">{prompt.a}</p>
              </motion.div>
            ))}
          </div>
        </Container>

        {/* SECTION E: SHARE AN IDEA */}
        <Container id="share-an-idea" className="mt-32 max-w-3xl">
          <motion.div {...fadeUp} className="rounded-3xl border border-[color:var(--hairline)] bg-white/70 p-8 shadow-sm md:p-12">
            <div className="text-center">
              <h2 className="font-display text-[28px] font-bold tracking-tight text-ink md:text-[36px]">
                Share an Idea
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-secondary">
                Have a concept for the character, a name, or a story? Submit it below. <br/>
                We welcome creative minds of all ages.
              </p>
            </div>

            {submitState === "success" ? (
              <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-[22px] font-bold text-ink">Idea Successfully Shared!</h3>
                <p className="mt-3 text-[15px] text-ink-secondary">
                  Thank you for contributing to The Story Lab. Your idea has been safely recorded.
                </p>
                <div className="mt-4 font-mono text-[12px] text-ink-muted">
                  Reference ID: {referenceId}
                </div>
                <button 
                  onClick={() => setSubmitState("idle")}
                  className="mt-8 rounded-full border border-[color:var(--hairline)] bg-white px-6 py-2.5 text-[14px] font-medium text-ink transition-colors hover:bg-slate-50"
                >
                  Submit Another Idea
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                <div>
                  <label htmlFor="category" className="mono-label mb-2 block">Contribution Category <span className="text-red-500">*</span></label>
                  <select 
                    id="category" 
                    name="category" 
                    required 
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[color:var(--hairline)] bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                  >
                    <option value="" disabled>Select a category...</option>
                    <option value="Character Name & Personality">Character Name & Personality</option>
                    <option value="Storylines & Episodes">Storylines & Episode Ideas</option>
                    <option value="Dialogue & Screenplay">Dialogue & Screenplay Ideas</option>
                    <option value="Friends & Story World">Friends, Rivals & The World</option>
                    <option value="Other Creative Ideas">Other Creative Ideas</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="title" className="mono-label mb-2 block">Idea Title <span className="text-ink-muted/50 font-normal normal-case tracking-normal">(Optional)</span></label>
                  <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    placeholder="e.g., The Desert Train Chase"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={100}
                    className="w-full rounded-xl border border-[color:var(--hairline)] bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-accent-blue focus:ring-1 focus:ring-accent-blue placeholder:text-ink-muted"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="mono-label mb-2 block">Your Idea <span className="text-red-500">*</span></label>
                  <textarea 
                    id="description" 
                    name="description" 
                    required 
                    placeholder="Describe your idea in a few sentences..."
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={2000}
                    className="w-full resize-y rounded-xl border border-[color:var(--hairline)] bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-accent-blue focus:ring-1 focus:ring-accent-blue placeholder:text-ink-muted"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="nickname" className="mono-label mb-2 block">Your Nickname <span className="text-ink-muted/50 font-normal normal-case tracking-normal">(Optional)</span></label>
                    <input 
                      type="text" 
                      id="nickname" 
                      name="nickname" 
                      placeholder="e.g., StarExplorer99"
                      value={formData.nickname}
                      onChange={handleChange}
                      maxLength={50}
                      className="w-full rounded-xl border border-[color:var(--hairline)] bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-accent-blue focus:ring-1 focus:ring-accent-blue placeholder:text-ink-muted"
                    />
                  </div>
                  <div>
                    <label htmlFor="parentEmail" className="mono-label mb-2 block">Parent/Guardian Email <span className="text-red-500">*</span></label>
                    <input 
                      type="email" 
                      id="parentEmail" 
                      name="parentEmail" 
                      required 
                      placeholder="For confirmation & consent"
                      value={formData.parentEmail}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[color:var(--hairline)] bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-accent-blue focus:ring-1 focus:ring-accent-blue placeholder:text-ink-muted"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex items-center h-5">
                      <input 
                        id="hasConsent" 
                        name="hasConsent" 
                        type="checkbox" 
                        required
                        checked={formData.hasConsent}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-accent-blue focus:ring-accent-blue"
                      />
                    </div>
                    <label htmlFor="hasConsent" className="text-[13.5px] leading-relaxed text-ink-secondary">
                      <strong>Privacy & Consent:</strong> I confirm I am a parent/guardian (or over 18) providing consent for this submission. I understand that ideas shared here are for exploration and do not guarantee inclusion in a final product, nor are they publicly displayed automatically.
                    </label>
                  </div>
                </div>

                {submitState === "error" && (
                  <div className="rounded-lg bg-red-50 p-4 text-[14px] text-red-600">
                    {errorMessage}
                  </div>
                )}

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-4 text-[15px] font-semibold text-white transition-all hover:bg-ink-secondary disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting Idea...
                      </>
                    ) : (
                      "Submit Idea"
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </Container>

        {/* SECTION F: A QUIET PROGRESS AREA */}
        <Container className="mt-24 mb-10 text-center">
          <p className="text-[14px] text-ink-muted">
            The character, personality, and story world are currently being explored.<br/>
            Thank you for being part of the journey.
          </p>
        </Container>

      </main>
      <Footer />
    </div>
  );
}
