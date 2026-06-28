import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import Portfolio from "@/components/portfolio/Portfolio";
import { LoadingSplash } from "@/components/portfolio/LoadingSplash";
import { Nav } from "@/components/portfolio/Nav";
import { ResumeModal } from "@/components/portfolio/ResumeModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sravan Sai Vuppula — Founder & Lead Developer, LYFSpot" },
      {
        name: "description",
        content:
          "Sravan Sai Vuppula — Founder & Lead Developer of LYFSpot. MERN, SAP ABAP and enterprise cloud engineer crafting civic tech, cinema systems, logistics intelligence, and creative products from Hyderabad.",
      },
      { property: "og:title", content: "Sravan Sai Vuppula — Founder, LYFSpot" },
      {
        property: "og:description",
        content:
          "Founder & Lead Developer of LYFSpot. Architecting products across civic tech, cinema systems, logistics intelligence, and enterprise cloud.",
      },
      { property: "og:url", content: "https://warm-ink-portfolio.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://warm-ink-portfolio.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              name: "Sravan Sai Vuppula",
              alternateName: ["Sravan Sai", "Sravan Vuppula"],
              jobTitle: "Founder & Lead Developer",
              worksFor: { "@type": "Organization", name: "LYFSpot" },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Hyderabad",
                addressRegion: "TS",
                addressCountry: "IN",
              },
              email: "mailto:sai1234comon@gmail.com",
              url: "https://warm-ink-portfolio.lovable.app/",
              sameAs: [
                "https://github.com/sravansai-26",
                "https://www.linkedin.com/in/sravan-sai-vuppula-753b711ba",
                "https://medium.com/@sravansaivuppula",
                "https://twitter.com/vuppula_sai",
              ],
            },
            {
              "@type": "Organization",
              name: "LYFSpot",
              founder: "Sravan Sai Vuppula",
              foundingDate: "2020-10",
              url: "https://warm-ink-portfolio.lovable.app/",
            },
            {
              "@type": "WebSite",
              name: "Sravan Sai Vuppula",
              url: "https://warm-ink-portfolio.lovable.app/",
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

  // Sync modal with URL hash so back/forward navigation works.
  useEffect(() => {
    const sync = () => setResumeOpen(window.location.hash === "#resume");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const open = useCallback(() => {
    if (window.location.hash !== "#resume") {
      window.history.pushState(null, "", "#resume");
    }
    setResumeOpen(true);
  }, []);

  const close = useCallback(() => {
    if (window.location.hash === "#resume") {
      window.history.back();
    } else {
      setResumeOpen(false);
    }
  }, []);

  return (
    <>
      <LoadingSplash />
      <Nav onLaunchResume={open} />
      <Portfolio onLaunchResume={open} />
      <ResumeModal open={resumeOpen} onClose={close} />
    </>
  );
}
