import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Image as ImageIcon } from "lucide-react";

import { Nav } from "@/components/portfolio/Nav";
import Footer from "@/components/portfolio/Footer/Footer";
import Container from "@/components/portfolio/common/Container";
import { fadeUp } from "@/components/portfolio/common/animations";

import refImage from "@/assets/convert-this-image-into-a-3d-model.jpg";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        "auto-rotate"?: boolean;
        "camera-controls"?: boolean;
        "shadow-intensity"?: string;
        "shadow-softness"?: string;
        "environment-image"?: string;
        exposure?: string;
        "interaction-prompt"?: string;
      };
    }
  }
}

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

  const universePrompts = [
    { 
      q: "The Setting", 
      a: "A dusty desert town? A floating city? A quiet forest?", 
      img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      q: "The Companion", 
      a: "A loyal robotic dog? A grumpy traveler? A magical creature?", 
      img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      q: "The Adventure", 
      a: "Finding a lost map? Escaping a collapsing cave? Solving a mystery?", 
      img: "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      q: "The Quirks", 
      a: "Always loses their hat? Can't stop telling bad jokes? Terrified of spiders?", 
      img: "https://images.unsplash.com/photo-1514820402329-de527fdd2e6d?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      q: "The Rival", 
      a: "A treasure hunter? A severe sandstorm? A broken time machine?", 
      img: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      q: "The Memory", 
      a: "The great train chase. The festival of lanterns. The silent canyon.", 
      img: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=800" 
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent-blue/20 relative overflow-hidden">
      <Nav onLaunchResume={() => { window.location.href = "/#resume"; }} />

      <main className="relative z-10 pt-24 pb-32">
        {/* SECTION A: THE INVITATION */}
        <Container className="pt-16 md:pt-28">
          <motion.div {...fadeUp} className="mx-auto max-w-4xl text-center flex flex-col items-center">
            <img 
              src="/experience/lyfspotlogo.png"
              alt="LYFSpot" 
              className="w-auto h-16 mb-8 opacity-90"
              loading="eager"
            />
            <div className="mono-label mb-6 bg-hairline px-4 py-1.5 rounded-full inline-block">
              A LYFSpot Creative Initiative
            </div>
            <h1 className="font-serif text-[48px] font-medium italic leading-[1.1] tracking-tight text-ink md:text-[80px]">
              The Story Lab
            </h1>
            <p className="font-cursive mt-6 text-[32px] md:text-[48px] text-accent-blue leading-none">
              Every great story starts with an idea...
            </p>
            <p className="mx-auto mt-8 max-w-2xl text-[16px] leading-relaxed text-ink-secondary md:text-[18px]">
              One character. An unexplored world. Endless possibilities. We're exploring who this character could become, the world it might live in, and the stories it could tell. Have an idea? Help us imagine what comes next.
            </p>
            
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
              <button 
                onClick={() => document.getElementById("meet-the-character")?.scrollIntoView({ behavior: "smooth" })}
                className="group relative overflow-hidden rounded-full bg-ink px-8 py-3.5 text-[14px] font-semibold text-white transition-all hover:scale-105 shadow-xl shadow-ink/20"
              >
                <span className="relative z-10">Meet the Character</span>
                <div className="absolute inset-0 -translate-x-full bg-accent-blue transition-transform duration-300 ease-out group-hover:translate-x-0" />
              </button>
              <button 
                onClick={scrollToForm}
                className="rounded-full border border-hairline bg-white px-8 py-3.5 text-[14px] font-medium text-ink transition-all hover:bg-surface hover:shadow-lg"
              >
                Share an Idea
              </button>
            </div>
          </motion.div>
        </Container>

        {/* SECTION B & C: MEET THE CHARACTER & 3D VIEWER */}
        <Container id="meet-the-character" className="mt-40">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20 items-start">
            <motion.div {...fadeUp} className="order-2 lg:order-1 flex flex-col gap-6">
              {/* 3D Model Box - Light Ash/Grey */}
              <div className="group relative aspect-square w-full overflow-hidden rounded-4xl border-4 border-slate-200 bg-slate-100 shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
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
                  <div slot="poster" className="absolute inset-0 grid place-items-center bg-slate-100">
                    <span className="font-mono text-[12px] tracking-widest text-ink/40 animate-pulse">Initializing Canvas...</span>
                  </div>
                </model-viewer>
                <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 backdrop-blur-md border border-hairline">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-ink">Interactive</span>
                </div>
              </div>

              {/* Reference Image / Inspiration Board (Clickable) */}
              <a 
                href={refImage}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-4xl border border-hairline bg-surface/30 p-6 flex items-center gap-6 overflow-hidden relative group cursor-pointer hover:bg-surface/50 transition-colors"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl shadow-md">
                  <img 
                    src={refImage} 
                    alt="Character Reference" 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon className="text-white w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h4 className="font-serif text-[18px] italic text-ink font-semibold group-hover:text-accent-blue transition-colors">The 2D Blueprint</h4>
                  <p className="text-[14px] text-ink-secondary mt-1">
                    This original artwork sparked the initiative. Click to view and visualize the character in your mind as you build their story.
                  </p>
                </div>
              </a>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="order-1 lg:order-2 lg:sticky lg:top-32">
              <h2 className="font-serif text-[40px] italic text-ink md:text-[56px] leading-[1.1]">
                Who is under the hat?
              </h2>
              <p className="mt-6 text-[18px] leading-relaxed text-ink-secondary font-light">
                The hat is on. The scarf has a story to tell. But who is this character, really? That's still part of the adventure. The canvas is blank, and the mesh is pure. 
              </p>
              
              {/* Box style applied from Life Questionnaire */}
              <div className="mt-12 relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-[color:var(--accent-blue)]/12 via-white/30 to-white/10 p-10 backdrop-blur-2xl shadow-sm">
                <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[color:var(--accent-blue)]/25 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 -left-12 h-72 w-72 rounded-full bg-[color:var(--deep-ink)]/10 blur-3xl" />

                <h3 className="font-mono text-[13px] uppercase tracking-widest text-ink-muted mb-8 relative z-10">Character Profile (Blank)</h3>
                <ul className="space-y-6 relative z-10">
                  {[
                    "Name — waiting to be spoken.",
                    "Personality — waiting to be defined.",
                    "Home — waiting to be built.",
                    "Strengths & Quirks — waiting to be discovered."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-5">
                      <span className="font-cursive mt-0 text-[28px] text-accent-blue">{i + 1}.</span>
                      <span className="text-ink-secondary pt-2 text-[16px]">{item}</span>
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
            <h2 className="font-serif text-[40px] italic text-ink md:text-[56px]">
              Build the Universe
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-ink-secondary font-light">
              Imagine what surrounds the character. Every universe needs a setting, conflicts, and memorable moments. Step into the director's chair.
            </p>
          </motion.div>

          <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {universePrompts.map((prompt, i) => (
              <motion.div 
                key={i} 
                {...fadeUp} 
                transition={{ delay: i * 0.1 }}
                className="group relative h-80 overflow-hidden rounded-4xl shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Stunning HD Unsplash Background */}
                <div className="absolute inset-0">
                  <img 
                    src={prompt.img} 
                    alt={prompt.q} 
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-500 group-hover:from-black/95 group-hover:via-black/60" />
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <h4 className="font-serif text-[28px] font-medium italic translate-y-4 transition-transform duration-500 group-hover:translate-y-0">{prompt.q}</h4>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/80 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">{prompt.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>

        {/* SECTION E: SHARE AN IDEA */}
        <Container id="share-an-idea" className="mt-40 max-w-4xl">
          <motion.div {...fadeUp} className="relative overflow-hidden rounded-4xl border border-hairline bg-white p-8 shadow-2xl md:p-16">
            <div className="relative z-10 text-center">
              <h2 className="font-cursive text-[48px] text-ink md:text-[72px]">
                Share your imagination
              </h2>
              <p className="mt-2 text-[16px] leading-relaxed text-ink-secondary">
                Have a concept for the character, a name, or a story? Submit it below.
              </p>
            </div>

            {submitState === "success" ? (
              <div className="relative z-10 mt-12 rounded-3xl border border-emerald-200 bg-emerald-50/50 p-10 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-[28px] italic text-ink">Idea Successfully Shared!</h3>
                <p className="mt-4 text-[16px] text-ink-secondary">
                  Thank you for contributing to The Story Lab. Your idea has been safely recorded in the archives.
                </p>
                <div className="mt-6 font-mono text-[12px] text-ink-muted bg-white inline-block px-4 py-2 rounded-full border border-hairline">
                  Reference ID: {referenceId}
                </div>
                <div className="mt-10">
                  <button 
                    onClick={() => setSubmitState("idle")}
                    className="rounded-full border border-hairline bg-white px-8 py-3 text-[14px] font-medium text-ink transition-all hover:bg-slate-50 hover:scale-105"
                  >
                    Submit Another Idea
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-10 mt-16 space-y-8">
                <div>
                  <label htmlFor="category" className="mono-label mb-3 block">Contribution Category <span className="text-red-500">*</span></label>
                  <select 
                    id="category" 
                    name="category" 
                    required 
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-2xl border border-hairline bg-surface/30 px-6 py-4 text-[16px] text-ink outline-none transition-all focus:border-accent-blue focus:ring-1 focus:ring-accent-blue focus:bg-white"
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
                  <label htmlFor="title" className="mono-label mb-3 block">Idea Title <span className="text-ink-muted/50 font-normal normal-case tracking-normal">(Optional)</span></label>
                  <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    placeholder="e.g., The Desert Train Chase"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={100}
                    className="w-full rounded-2xl border border-hairline bg-surface/30 px-6 py-4 text-[16px] text-ink outline-none transition-all focus:border-accent-blue focus:ring-1 focus:ring-accent-blue focus:bg-white placeholder:text-ink-muted"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="mono-label mb-3 block">Your Idea <span className="text-red-500">*</span></label>
                  <textarea 
                    id="description" 
                    name="description" 
                    required 
                    placeholder="Describe your idea in a few sentences..."
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={2000}
                    className="w-full resize-y rounded-2xl border border-hairline bg-surface/30 px-6 py-4 text-[16px] text-ink outline-none transition-all focus:border-accent-blue focus:ring-1 focus:ring-accent-blue focus:bg-white placeholder:text-ink-muted"
                  />
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <label htmlFor="nickname" className="mono-label mb-3 block">Your Nickname <span className="text-ink-muted/50 font-normal normal-case tracking-normal">(Optional)</span></label>
                    <input 
                      type="text" 
                      id="nickname" 
                      name="nickname" 
                      placeholder="e.g., StarExplorer99"
                      value={formData.nickname}
                      onChange={handleChange}
                      maxLength={50}
                      className="w-full rounded-2xl border border-hairline bg-surface/30 px-6 py-4 text-[16px] text-ink outline-none transition-all focus:border-accent-blue focus:ring-1 focus:ring-accent-blue focus:bg-white placeholder:text-ink-muted"
                    />
                  </div>
                  <div>
                    <label htmlFor="parentEmail" className="mono-label mb-3 block">Email <span className="text-red-500">*</span></label>
                    <input 
                      type="email" 
                      id="parentEmail" 
                      name="parentEmail" 
                      required 
                      placeholder="For confirmation (Parent/Guardian)"
                      value={formData.parentEmail}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-hairline bg-surface/30 px-6 py-4 text-[16px] text-ink outline-none transition-all focus:border-accent-blue focus:ring-1 focus:ring-accent-blue focus:bg-white placeholder:text-ink-muted"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
                  <div className="flex items-start gap-5">
                    <div className="mt-1 flex items-center h-5">
                      <input 
                        id="hasConsent" 
                        name="hasConsent" 
                        type="checkbox" 
                        required
                        checked={formData.hasConsent}
                        onChange={handleChange}
                        className="h-5 w-5 rounded border-gray-300 text-accent-blue focus:ring-accent-blue"
                      />
                    </div>
                    <label htmlFor="hasConsent" className="text-[14px] leading-relaxed text-ink-secondary">
                      <strong>Privacy & Consent:</strong> I confirm I am a parent/guardian (or over 18) providing consent for this submission. I understand that ideas shared here are for exploration and do not guarantee inclusion in a final product, nor are they publicly displayed automatically.
                    </label>
                  </div>
                </div>

                {submitState === "error" && (
                  <div className="rounded-2xl bg-red-50 p-5 text-[14px] text-red-600">
                    {errorMessage}
                  </div>
                )}

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-3 rounded-[20px] bg-ink px-8 py-5 text-[16px] font-semibold text-white transition-all hover:bg-accent-blue hover:scale-[1.02] hover:shadow-xl hover:shadow-accent-blue/20 disabled:hover:scale-100 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

        {/* SECTION F: THE POWER OF IMAGINATION (NEW CREATIVE SECTION) */}
        <Container className="mt-40 mb-8">
          <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center border-y border-hairline py-16 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-6 text-accent-blue">
              <Sparkles className="w-8 h-8 opacity-50" />
            </div>
            <h2 className="font-serif text-[32px] italic text-ink md:text-[42px] mb-6">
              Why Imagination Matters
            </h2>
            <p className="font-light text-[17px] leading-relaxed text-ink-secondary mb-6">
              The world isn't shaped by those who simply accept what is—it is crafted by those who imagine what could be. 
              Storytelling is the oldest form of human collaboration. It transcends engineering, defies logic, and builds bridges 
              between the impossible and the real.
            </p>
            <p className="font-light text-[17px] leading-relaxed text-ink-secondary">
              When you share an idea, you aren't just typing words into a form. You are participating in a collective dream. 
              You are exercising the most powerful muscle in the human mind: <span className="font-cursive text-[24px] text-accent-blue">creativity</span>. 
              Here in the Story Lab, genuine thought and imaginative teamwork define the standards of tomorrow's narrative.
            </p>
          </motion.div>
        </Container>

        {/* SECTION G: A QUIET PROGRESS AREA */}
        <Container className="mb-10 text-center">
          <div className="inline-block rounded-full border border-hairline bg-surface/50 px-6 py-3">
            <p className="font-mono text-[12px] uppercase tracking-widest text-ink-muted">
              The story world is currently being explored. Thank you for your imagination.
            </p>
          </div>
        </Container>

      </main>
      
      <Footer />
    </div>
  );
}
