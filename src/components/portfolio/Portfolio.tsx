import Hero from "./Hero/Hero";
import Identity from "./Identity/Identity";
import LyfspotJourney from "./Journey/Journey";
import EngineeringMatrix from "./Engineering/EngineeringMatrix";
import Work from "./Projects/Projects";
import Experience from "./Experience/Experience";
import Credentials from "./Credentials/Credentials";
import Publications from "./Publications/Publications";
import GitHubPulse from "./GitHub/GitHubPulse";
import LifeQuestionnaire from "./Questionnaire/LifeQuestionnaire";
import Contact from "./Contact/Contact";
import Footer from "./Footer/Footer";

/* ---------- HERO ---------- */

/* ---------- IDENTITY ---------- */

/* ---------- LYFSPOT JOURNEY ---------- */

/* ---------- ENGINEERING MATRIX ---------- */

/* ---------- PROJECT REPOSITORY ---------- */

/* ---------- EXPERIENCE ---------- */

/* ---------- CREDENTIALS ---------- */

/* ---------- PUBLICATIONS ---------- */

/* ---------- GITHUB PULSE ---------- */

/* ---------- LIFE QUESTIONNAIRE ---------- */

/* ---------- CONTACT ---------- */

/* ---------- FOOTER ---------- */

/* ---------- ROOT ---------- */
export default function Portfolio({ onLaunchResume }: { onLaunchResume: () => void }) {
  return (
    <main>
      <Hero onLaunchResume={onLaunchResume} />
      <Identity />
      <LyfspotJourney />
      <EngineeringMatrix />
      <Work />
      <Experience />
      <Credentials />
      <Publications />
      <GitHubPulse />
      <LifeQuestionnaire />
      <Contact />
      <Footer />
    </main>
  );
}
