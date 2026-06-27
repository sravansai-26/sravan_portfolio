import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Portfolio from "@/components/portfolio/Portfolio";
import { Nav } from "@/components/portfolio/Nav";
import { LoadingSplash } from "@/components/portfolio/LoadingSplash";
import { ResumeModal } from "@/components/portfolio/ResumeModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sravan Sai Vuppula — Founder & Lead Developer, LYFSpot" },
      {
        name: "description",
        content:
          "Sravan Sai Vuppula — Founder & Lead Developer of LYFSpot. Building products that reject rigid templates and elevate everyday lives through engineering, design, and systems thinking.",
      },
      { property: "og:title", content: "Sravan Sai Vuppula — Founder, LYFSpot" },
      {
        property: "og:description",
        content:
          "Founder & Lead Developer of LYFSpot. Architecting products across civic tech, cinema systems, logistics intelligence, and enterprise cloud.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              name: "Sravan Sai Vuppula",
              jobTitle: "Founder & Lead Developer",
              worksFor: { "@type": "Organization", name: "LYFSpot" },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Hyderabad",
                addressRegion: "TS",
                addressCountry: "IN",
              },
              email: "mailto:sai1234comon@gmail.com",
            },
            {
              "@type": "Organization",
              name: "LYFSpot",
              founder: "Sravan Sai Vuppula",
              foundingDate: "2020-10",
            },
            {
              "@type": "WebSite",
              name: "Sravan Sai Vuppula",
              author: { "@type": "Person", name: "Sravan Sai Vuppula" },
            },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [resumeOpen, setResumeOpen] = useState(false);
  return (
    <>
      <LoadingSplash />
      <Nav onLaunchResume={() => setResumeOpen(true)} />
      <Portfolio onLaunchResume={() => setResumeOpen(true)} />
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}
