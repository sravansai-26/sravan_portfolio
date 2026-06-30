import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { ArrowRight, Close, ExternalLink, DocIcon } from "../Icons";

import Container from "../common/Container";
import SectionLabel from "../common/SectionLabel";
import { fadeUp } from "../common/animations";

type Cred = {
  title: string;
  org: string;
  logo?: string;
  date?: string;
  gpa?: string;
  skills?: string;
  href?: string;
  meta?: string;
  file?: string;
  fileType?: "pdf" | "image";
};

const academic: Cred[] = [
  {
    title: "Bachelor of Technology — Computer Science and Engineering",
    org: "MLR Institute of Technology (MLRIT), Dundigal, Hyderabad",
    logo: "/projects/btechlogo.png",
    meta: "JNTUH Affiliated · AICTE Approved",
    date: "2024 – May 2027 · Expected Graduation",
    gpa: "Cumulative GPA · 8.23 / 10.0",
    skills:
      "Data Structures & Algorithms, MERN Stack Development, Cloud & DevOps, Artificial Intelligence, Deep Learning, Computer Networks, Database Management Systems, Software Engineering.",
    file: "/credentials/btechmarks.pdf",
    fileType: "pdf",
  },
  {
    title: "Diploma in Computer Science and Engineering",
    org: "Vathsalya Institute of Science and Technology, Anantharam, Bhongir",
    logo: "/projects/diplomalogo.png",
    meta: "SBTET Telangana · C21 Scheme",
    date: "2021 – 2024",
    gpa: "Cumulative GPA · 8.78 / 10.0",
    skills:
      "Programming in C, Python, Java, Database Management Systems, Computer Hardware & Networking, Data Structures, Web Designing, Artificial Intelligence, Industrial Training.",
    file: "/credentials/diplomamarks.pdf",
    fileType: "pdf",
  },
];

const certs: Cred[] = [
  {
    title: "SAP Certified Associate — Back-End Developer · ABAP Cloud",
    org: "SAP SE",
    meta: "Proctored Exam · C_P2WAB_2507",
    date: "Issued May 06, 2026 · Expires May 07, 2027",
    skills:
      "Advanced Business Application Programming (ABAP), ABAP RESTful Application Programming Model (RAP), Object-Oriented Design, SAP Business Technology Platform (SAP BTP), SAP S/4HANA Cloud Extensions.",
    href: "https://www.credly.com/badges/c777f4db-d3e0-440f-926a-a21b651b923a/linked_in_profile",
    file: "/credentials/sapcertificate.pdf",
    fileType: "pdf",
  },

  {
    title: "IBM SkillsBuild · Cloud Computing Fundamentals",
    org: "IBM SkillsBuild",
    meta: "Professional Credential · Credly Verified",
    date: "Issued May 09, 2026",
    skills:
      "Cloud Computing Fundamentals, Virtualization, Containerization (Docker), Infrastructure Architecture (IaaS, PaaS, SaaS), Kubernetes Orchestration.",
    href: "https://www.credly.com/badges/8de5d751-55f9-48cb-8f85-9de82ef3ae50/linked_in_profile",
    file: "/credentials/ibmcertificate.pdf",
    fileType: "pdf",
  },

  {
    title: "Infosys Springboard Virtual Internship 6.0 — Banking Simulation",
    org: "Infosys Springboard",
    meta: "Cohort ID · B13",
    date: "Verified June 2026",
    skills: "Enterprise Java Solutions, Spring Boot Integration, React Client-Side Interfacing.",
    file: "/credentials/infosys.pdf",
    fileType: "pdf",
  },
  {
    title: "ServiceNow Virtual Internship Program (AICTE Approved)",
    org: "ServiceNow Corporation",
    meta: "Credential ID · SNU2020716",
    date: "Verified May 2026",
    skills:
      "ServiceNow System Administration, Flow Designer, Automated Test Framework (ATF), Certified System Administrator (CSA) Core Foundations.",
    file: "/credentials/servicenow.pdf",
    fileType: "pdf",
  },
  {
    title: "SAP ABAP on S/4HANA Technical Track — Naxrita DevCon",
    org: "Naxrita India · Emax Technologies · MLRIT",
    date: "Awarded May 09, 2026",
    meta: "18-Day Industry Readiness Program",
    skills:
      "Modern SAP Enterprise Architecture, S/4HANA fundamentals, Core ABAP, CDS Views, OData exposure, professional delivery practices.",
    file: "/credentials/naxrita.pdf",
    fileType: "image",
  },
  {
    title: "NPTEL Elite Certification — Industry 4.0 and Internet of Things",
    org: "National Programme on Technology Enhanced Learning (NPTEL) · IIT Kharagpur",
    meta: "Elite Certification · SWAYAM",
    date: "2026",
    skills:
      "Industry 4.0, Industrial Internet of Things (IIoT), Smart Manufacturing, Cyber-Physical Systems (CPS), Industrial Automation, IoT Architecture, Sensor Networks, Edge Computing.",
    file: "/credentials/nptel-iot.pdf",
    fileType: "pdf",
  },
  {
    title: "NPTEL Elite Certification — Cloud Computing Paradigms",
    org: "National Programme on Technology Enhanced Learning (NPTEL) · IIT Kharagpur",
    meta: "Elite Certification · 12-Week Course · 4 Credits",
    date: "Jan–Apr 2026 · Score: 72%",
    skills:
      "Cloud Computing Architecture, Virtualization, Distributed Systems, Cloud Service Models (IaaS, PaaS, SaaS), Cloud Deployment Models, Resource Management, Scalability, Cloud Security.",
    file: "/credentials/nptel-cloud.pdf",
    fileType: "pdf",
  },
];

const honors: Cred[] = [
  {
    title: "National Level Cinema Hackathon Delegate & Presenter",
    org: "FISAT, Kerala · in coordination with Pauly Jr. Pictures",
    skills:
      "Pitch-presented and modeled Shotweave, leading multi-disciplinary software squads under strict hackathon timeline constraints.",
    file: "/credentials/cinehack.pdf",
    fileType: "pdf",
  },
  {
    title: "Executive Public Speaking Leadership Certification",
    org: "Elite Impact Foundation · endorsed by Sri Gampa Nageshwar Rao Garu",
    skills:
      "Master-level verbal communications, group leadership capabilities, and strategic venture delivery skills.",
    file: "/credentials/eps-impact.pdf",
    fileType: "pdf",
  },
];

function CredentialRow({ c, onOpen }: { c: Cred; onOpen: () => void }) {
  return (
    <motion.button
      {...fadeUp}
      onClick={onOpen}
      className="group grid w-full grid-cols-[1fr_auto] items-start gap-6 border-t border-[color:var(--hairline)] py-7 text-left last:border-b"
    >
      <div>
        <div className="font-display text-[18px] font-semibold tracking-[-0.01em] text-ink md:text-[20px]">
          {c.title}
        </div>

        <div className="mt-3 flex items-center gap-4">
          {c.logo && (
            <img
              src={c.logo}
              alt={`${c.org} logo`}
              className="h-14 w-auto shrink-0 object-contain"
              loading="lazy"
            />
          )}

          <div className="text-[14px] leading-relaxed text-ink-secondary">{c.org}</div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
          {c.date && <span>{c.date}</span>}
          {c.gpa && <span>{c.gpa}</span>}
          {c.meta && <span>{c.meta}</span>}
        </div>
      </div>
      <ArrowRight
        width={16}
        height={16}
        className="mt-2 text-ink-muted transition-transform group-hover:translate-x-1"
      />
    </motion.button>
  );
}

function CredentialModal({ c, onClose }: { c: Cred | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {c && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-3 py-6 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-2xl border border-white/30 bg-white/75 shadow-2xl backdrop-blur-2xl md:flex-row"
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/70 text-ink-secondary backdrop-blur transition-colors hover:bg-white hover:text-ink"
              aria-label="Close"
            >
              <Close />
            </button>

            {/* Metadata panel */}
            <div className="flex w-full flex-col gap-3 overflow-y-auto p-6 md:w-[380px] md:shrink-0 md:border-r md:border-white/40 md:p-7">
              <div className="mono-label">System Live · Verified Credential</div>
              <h3 className="font-display text-[20px] font-bold tracking-[-0.02em] text-ink md:text-[24px]">
                {c.title}
              </h3>
              <div className="text-[14px] text-ink-secondary">{c.org}</div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-wider text-ink-muted">
                {c.date && <span>{c.date}</span>}
                {c.meta && <span>{c.meta}</span>}
                {c.gpa && <span>{c.gpa}</span>}
              </div>
              {c.skills && (
                <div className="mt-3 rounded-xl border border-white/50 bg-white/50 p-4">
                  <div className="mono-label mb-1.5">Verified Skill Matrix</div>
                  <p className="text-[13.5px] leading-[1.65] text-ink-secondary">{c.skills}</p>
                </div>
              )}
              <div className="mt-auto flex flex-wrap gap-2 pt-3">
                {c.href && (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-medium text-background hover:bg-deep-ink"
                  >
                    Verify externally <ExternalLink width={12} height={12} />
                  </a>
                )}
                {c.file && (
                  <a
                    href={c.file}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--hairline)] bg-white/70 px-3.5 py-1.5 text-[12px] text-ink hover:bg-white"
                  >
                    Open file <ExternalLink width={12} height={12} />
                  </a>
                )}
              </div>
            </div>

            {/* Document viewer */}
            <div className="grid min-h-[320px] flex-1 place-items-center bg-gradient-to-br from-white/40 to-white/10 p-3 md:min-h-0">
              {c.file && c.fileType === "image" && (
                <img
                  src={c.file}
                  alt={c.title}
                  className="max-h-[80vh] w-full rounded-lg object-contain shadow-lg"
                />
              )}
              {c.file && c.fileType === "pdf" && (
                <iframe
                  src={`${c.file}#toolbar=0&view=FitH`}
                  title={c.title}
                  className="h-[78vh] w-full rounded-lg border border-white/40 bg-white"
                />
              )}
              {!c.file && (
                <div className="text-center">
                  <DocIcon width={32} height={32} className="mx-auto text-ink-muted" />
                  <div className="mt-3 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                    Document placeholder · attach a file to render here
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Credentials() {
  const [active, setActive] = useState<Cred | null>(null);
  return (
    <Container id="credentials" className="py-24 md:py-32">
      <SectionLabel>Credentials · System-Live Verification Dashboard</SectionLabel>
      <motion.h2
        {...fadeUp}
        className="mb-12 max-w-[900px] font-display font-bold tracking-[-0.025em] text-ink leading-[1.08] text-[30px] md:text-[44px]"
      >
        Every credential is verifiable. Click any certification to inspect its live metadata and
        original document.
      </motion.h2>

      <div className="mono-label mb-4">Academic Milestones</div>
      <div>
        {academic.map((c) => (
          <CredentialRow key={c.title} c={c} onOpen={() => setActive(c)} />
        ))}
      </div>

      <div className="mono-label mb-4 mt-16">Professional Enterprise Certifications</div>
      <div>
        {certs.map((c) => (
          <CredentialRow key={c.title} c={c} onOpen={() => setActive(c)} />
        ))}
      </div>

      <div className="mono-label mb-4 mt-16">Major Honors & Leadership Accolades</div>
      <div>
        {honors.map((c) => (
          <CredentialRow key={c.title} c={c} onOpen={() => setActive(c)} />
        ))}
      </div>

      <CredentialModal c={active} onClose={() => setActive(null)} />
    </Container>
  );
}

export default Credentials;
