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
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-white/20 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute -top-[20%] -left-[10%] h-[50vw] w-[50vw] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] h-[40vw] w-[40vw] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] h-[60vw] w-[60vw] rounded-full bg-slate-800/30 blur-[120px]" />
      </div>

      <Nav onLaunchResume={() => { window.location.href = "/#resume"; }} />

      <main className="relative z-10 pt-24 pb-32">
        {/* SECTION A: THE INVITATION */}
        <Container className="pt-12 md:pt-28">
          <motion.div {...fadeUp} className="mx-auto max-w-4xl text-center">
            <div className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-white/60 mb-8 backdrop-blur-md">
              A LYFSpot Creative Initiative
            </div>
            <h1 className="font-serif text-[48px] font-medium italic leading-[1.1] tracking-tight text-white md:text-[80px]">
              The Story Lab
            </h1>
            <p className="font-cursive mt-6 text-[32px] md:text-[48px] text-white/80 leading-none">
              Every great story starts with an idea...
            </p>
            <p className="mx-auto mt-8 max-w-2xl text-[16px] font-light leading-relaxed text-white/60 md:text-[18px]">
              One character. An unexplored world. Endless possibilities. We're exploring who this character could become, the world it might live in, and the stories it could tell. Have an idea? Help us imagine what comes next.
            </p>
            
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
              <button 
                onClick={() => document.getElementById("meet-the-character")?.scrollIntoView({ behavior: "smooth" })}
                className="group relative overflow-hidden rounded-full bg-white px-8 py-3.5 text-[14px] font-semibold text-black transition-all hover:scale-105"
              >
                <span className="relative z-10">Meet the Character</span>
                <div className="absolute inset-0 -translate-x-full bg-slate-200 transition-transform duration-300 ease-out group-hover:translate-x-0" />
              </button>
              <button 
                onClick={scrollToForm}
                className="rounded-full border border-white/20 bg-transparent px-8 py-3.5 text-[14px] font-medium text-white transition-all hover:bg-white/10"
              >
                Share an Idea
              </button>
            </div>
          </motion.div>
        </Container>

        {/* SECTION B & C: MEET THE CHARACTER & 3D VIEWER */}
        <Container id="meet-the-character" className="mt-40">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20 items-center">
            <motion.div {...fadeUp} className="order-2 lg:order-1 flex flex-col">
              <div className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#121214] to-[#0a0a0c] shadow-2xl">
                {/* Subtle grid background for the 3D viewer */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                {/* 
                  Using @google/model-viewer 
                  Dark background so the white mesh POPS. 
                */}
                <model-viewer
                  src="/src/assets/white_mesh.glb"
                  alt="A 3D model of the character"
                  auto-rotate
                  camera-controls
                  shadow-intensity="1.5"
                  shadow-softness="1"
                  environment-image="neutral"
                  exposure="0.9"
                  style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
                  interaction-prompt="hover-2d"
                >
                  <div slot="poster" className="absolute inset-0 grid place-items-center bg-[#121214]">
                    <span className="font-mono text-[12px] tracking-widest text-white/40 animate-pulse">Initializing Mesh...</span>
                  </div>
                </model-viewer>
                
                {/* Decorative UI elements for the viewer */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-md border border-white/10">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/70">Interactive</span>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="order-1 lg:order-2">
              <h2 className="font-serif text-[40px] italic text-white md:text-[52px]">
                Who is under the hat?
              </h2>
              <p className="mt-6 text-[16px] font-light leading-relaxed text-white/60">
                The hat is on. The scarf has a story to tell. But who is this character, really? That's still part of the adventure. The canvas is blank, and the mesh is pure. 
              </p>
              
              <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
                <h3 className="font-mono text-[12px] uppercase tracking-widest text-white/40 mb-6">Character Profile (Blank)</h3>
                <ul className="space-y-5">
                  {[
                    "Name — waiting to be spoken.",
                    "Personality — waiting to be defined.",
                    "Home — waiting to be built.",
                    "Strengths & Quirks — waiting to be discovered."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="font-cursive mt-1 text-[24px] text-white/30">{i + 1}.</span>
                      <span className="font-light text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </Container>

        {/* SECTION D: BUILD THE STORY WORLD */}
        <Container className="mt-40">
          <motion.div {...fadeUp} className="mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-[40px] italic text-white md:text-[52px]">
              Build the Universe
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[16px] font-light leading-relaxed text-white/60">
              Imagine what surrounds the character. Every universe needs a setting, conflicts, and memorable moments. Step into the director's chair.
            </p>
          </motion.div>

          <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { q: "The Setting", a: "A dusty desert town? A floating city? A quiet forest?" },
              { q: "The Companion", a: "A loyal robotic dog? A grumpy traveler? A magical creature?" },
              { q: "The Adventure", a: "Finding a lost map? Escaping a collapsing cave? Solving a mystery?" },
              { q: "The Quirks", a: "Always loses their hat? Can't stop telling bad jokes? Terrified of spiders?" },
              { q: "The Rival", a: "A treasure hunter? A severe sandstorm? A broken time machine?" },
              { q: "The Memory", a: "The great train chase. The festival of lanterns. The silent canyon." },
            ].map((prompt, i) => (
              <motion.div 
                key={i} 
                {...fadeUp} 
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10 hover:border-white/20"
              >
                <div className="absolute -right-4 -top-4 font-serif text-[120px] font-black italic text-white/5 transition-transform duration-500 group-hover:scale-110 group-hover:text-white/10">
                  {i + 1}
                </div>
                <h4 className="relative z-10 font-serif text-[24px] text-white">{prompt.q}</h4>
                <p className="relative z-10 mt-4 font-light text-white/60">{prompt.a}</p>
              </motion.div>
            ))}
          </div>
        </Container>

        {/* SECTION E: SHARE AN IDEA */}
        <Container id="share-an-idea" className="mt-40 max-w-4xl">
          <motion.div {...fadeUp} className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#121214]/80 p-8 shadow-2xl backdrop-blur-xl md:p-16">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10 text-center">
              <h2 className="font-cursive text-[48px] text-white md:text-[64px]">
                Share your imagination
              </h2>
              <p className="mt-2 text-[15px] font-light leading-relaxed text-white/60">
                Have a concept for the character, a name, or a story? Submit it below.
              </p>
            </div>

            {submitState === "success" ? (
              <div className="relative z-10 mt-12 rounded-3xl border border-green-500/20 bg-green-500/10 p-10 text-center backdrop-blur-md">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-[28px] italic text-white">Idea Successfully Shared!</h3>
                <p className="mt-4 text-[16px] font-light text-white/70">
                  Thank you for contributing to The Story Lab. Your idea has been safely recorded in the archives.
                </p>
                <div className="mt-6 font-mono text-[12px] text-white/40 bg-black/50 inline-block px-4 py-2 rounded-full border border-white/10">
                  Reference ID: {referenceId}
                </div>
                <div className="mt-10">
                  <button 
                    onClick={() => setSubmitState("idle")}
                    className="rounded-full bg-white px-8 py-3 text-[14px] font-semibold text-black transition-all hover:bg-slate-200"
                  >
                    Submit Another Idea
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-10 mt-16 space-y-8">
                <div>
                  <label htmlFor="category" className="font-mono text-[11px] uppercase tracking-widest text-white/60 mb-3 block">Contribution Category <span className="text-red-400">*</span></label>
                  <select 
                    id="category" 
                    name="category" 
                    required 
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-[16px] font-light text-white outline-none transition-all focus:border-white/30 focus:bg-white/10"
                  >
                    <option value="" disabled className="bg-[#121214] text-white">Select a category...</option>
                    <option value="Character Name & Personality" className="bg-[#121214] text-white">Character Name & Personality</option>
                    <option value="Storylines & Episodes" className="bg-[#121214] text-white">Storylines & Episode Ideas</option>
                    <option value="Dialogue & Screenplay" className="bg-[#121214] text-white">Dialogue & Screenplay Ideas</option>
                    <option value="Friends & Story World" className="bg-[#121214] text-white">Friends, Rivals & The World</option>
                    <option value="Other Creative Ideas" className="bg-[#121214] text-white">Other Creative Ideas</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="title" className="font-mono text-[11px] uppercase tracking-widest text-white/60 mb-3 block">Idea Title <span className="opacity-50 normal-case">(Optional)</span></label>
                  <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    placeholder="e.g., The Desert Train Chase"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={100}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-[16px] font-light text-white outline-none transition-all focus:border-white/30 focus:bg-white/10 placeholder:text-white/20"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="font-mono text-[11px] uppercase tracking-widest text-white/60 mb-3 block">Your Idea <span className="text-red-400">*</span></label>
                  <textarea 
                    id="description" 
                    name="description" 
                    required 
                    placeholder="Describe your idea in a few sentences..."
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={2000}
                    className="w-full resize-y rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-[16px] font-light text-white outline-none transition-all focus:border-white/30 focus:bg-white/10 placeholder:text-white/20"
                  />
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <label htmlFor="nickname" className="font-mono text-[11px] uppercase tracking-widest text-white/60 mb-3 block">Your Nickname <span className="opacity-50 normal-case">(Optional)</span></label>
                    <input 
                      type="text" 
                      id="nickname" 
                      name="nickname" 
                      placeholder="e.g., StarExplorer99"
                      value={formData.nickname}
                      onChange={handleChange}
                      maxLength={50}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-[16px] font-light text-white outline-none transition-all focus:border-white/30 focus:bg-white/10 placeholder:text-white/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="parentEmail" className="font-mono text-[11px] uppercase tracking-widest text-white/60 mb-3 block">Email <span className="text-red-400">*</span></label>
                    <input 
                      type="email" 
                      id="parentEmail" 
                      name="parentEmail" 
                      required 
                      placeholder="For confirmation (Parent/Guardian)"
                      value={formData.parentEmail}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-[16px] font-light text-white outline-none transition-all focus:border-white/30 focus:bg-white/10 placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 backdrop-blur-sm">
                  <div className="flex items-start gap-5">
                    <div className="mt-1 flex items-center h-5">
                      <input 
                        id="hasConsent" 
                        name="hasConsent" 
                        type="checkbox" 
                        required
                        checked={formData.hasConsent}
                        onChange={handleChange}
                        className="h-5 w-5 rounded border-white/20 bg-black/50 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-black"
                      />
                    </div>
                    <label htmlFor="hasConsent" className="text-[14px] font-light leading-relaxed text-white/70">
                      <strong>Privacy & Consent:</strong> I confirm I am a parent/guardian (or over 18) providing consent for this submission. I understand that ideas shared here are for exploration and do not guarantee inclusion in a final product, nor are they publicly displayed automatically.
                    </label>
                  </div>
                </div>

                {submitState === "error" && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-[14px] text-red-200">
                    {errorMessage}
                  </div>
                )}

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-white px-8 py-5 text-[16px] font-bold text-black transition-all hover:bg-slate-200 hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="h-5 w-5 animate-spin text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending to The Lab...
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
        <Container className="mt-32 mb-10 text-center">
          <div className="inline-block rounded-full border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-md">
            <p className="font-mono text-[12px] uppercase tracking-widest text-white/50">
              The story world is currently being explored. Thank you for your imagination.
            </p>
          </div>
        </Container>

      </main>
      
      {/* We need to ensure the Footer looks good on a dark page.
          The default Footer is designed for light mode. 
          We wrap it in a div that resets background so it fits or adapt it.
          We will just force the footer background to blend into the main site logic, or render it. */}
      <div className="bg-background text-foreground">
        <Footer />
      </div>
    </div>
  );
}
