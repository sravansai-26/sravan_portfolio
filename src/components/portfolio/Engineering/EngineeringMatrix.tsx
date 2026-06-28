import { motion } from "framer-motion";

import Container from "../common/Container";
import SectionLabel from "../common/SectionLabel";

import { fadeUp } from "../common/animations";

import { ArchitecturePlayground } from "../ArchitecturePlayground";

const matrix = [
  {
    group: "Full-Stack & Backend Systems",
    items: [
      "MERN Stack",
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "Spring Framework",
      "Spring Boot",
      "FastAPI",
    ],
  },
  {
    group: "Mobile Architecture",
    items: ["React Native", "Expo CLI", "Expo Go", "Android Capacitor"],
  },
  {
    group: "Core Engineering & Scripts",
    items: ["C", "Java", "Python", "JavaScript", "HTML5", "CSS3"],
  },
  { group: "Cloud, DevOps & Data Storage", items: ["AWS", "GCP", "Cloudinary", "Git", "GitHub"] },
  {
    group: "Enterprise Software Suite",
    items: [
      "SAP ABAP",
      "SAP S/4HANA Cloud Backend",
      "ABAP RESTful Application Programming Model (RAP)",
    ],
  },
  {
    group: "System Engineering",
    items: [
      "Systems Architecture Design",
      "Workflow Optimization Pipelines",
      "Project Management Systems",
    ],
  },
];

export default function EngineeringMatrix() {
  return (
    <Container id="stack" className="py-24 md:py-32">
      <SectionLabel>The Engineering Matrix</SectionLabel>
      <motion.h2
        {...fadeUp}
        className="max-w-[900px] font-display font-bold tracking-[-0.025em] text-ink leading-[1.08] text-[30px] md:text-[44px]"
      >
        The verified stack — no exaggerations, no buzzwords.
      </motion.h2>

      <div className="mt-14 space-y-0">
        {matrix.map((m, i) => (
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.04 }}
            key={m.group}
            className="grid grid-cols-1 gap-4 border-t border-[color:var(--hairline)] py-7 md:grid-cols-[300px_minmax(0,1fr)] md:gap-12 last:border-b"
          >
            <div className="font-display text-[18px] font-semibold tracking-[-0.01em] text-ink">
              {m.group}
            </div>
            <div className="flex flex-wrap gap-2">
              {m.items.map((it) => (
                <span key={it} className="code-tag">
                  {it}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20">
        <SectionLabel>Enterprise Architecture Playground · Interactive Workflow Graph</SectionLabel>
        <ArchitecturePlayground />
      </div>
    </Container>
  );
}
