import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import Portfolio from "@/components/portfolio/Portfolio";
import { LoadingSplash } from "@/components/portfolio/LoadingSplash";
import { Nav } from "@/components/portfolio/Nav";
import { ResumeModal } from "@/components/portfolio/ResumeModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sravan Sai Vuppula | Portfolio" },
      {
        name: "description",
        content:
          "Official portfolio of Sravan Sai Vuppula. Full Stack Developer, Founder of LYFSpot, and creator of products in civic tech, AI, logistics, and enterprise software.",
      },
      { property: "og:title", content: "Sravan Sai Vuppula | Portfolio" },
      {
        property: "og:description",
        content:
          "Explore the official portfolio of Sravan Sai Vuppula, Full Stack Developer and Founder of LYFSpot.",
      },
      {
        property: "og:url",
        content: "https://buildwithsravan.dev",
      },
      {
        property: "og:image",
        content: "https://buildwithsravan.dev/og-image-v2.png",
      },
      {
        property: "og:image:width",
        content: "1200",
      },
      {
        property: "og:image:height",
        content: "630",
      },
      {
        property: "og:image:type",
        content: "image/png",
      },
      {
        property: "og:image:alt",
        content: "Sravan Sai Vuppula | Full Stack Developer Portfolio",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Sravan Sai Vuppula | Portfolio",
      },
      {
        name: "twitter:description",
        content:
          "Official portfolio of Sravan Sai Vuppula. Full Stack Developer and Founder of LYFSpot.",
      },
      {
        name: "twitter:image",
        content: "https://buildwithsravan.dev/og-image-v2.png",
      },
    ],

    links: [
      {
        rel: "canonical",
        href: "https://buildwithsravan.dev",
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
              alternateName: ["Sravan Sai", "Sravan Vuppula"],
              jobTitle: "Founder & Full Stack Developer",
              worksFor: {
                "@type": "Organization",
                name: "LYFSpot",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Hyderabad",
                addressRegion: "Telangana",
                addressCountry: "IN",
              },
              email: "mailto:sai1234comon@gmail.com",
              url: "https://buildwithsravan.dev",
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
              url: "https://buildwithsravan.dev",
            },
            {
              "@type": "WebSite",
              name: "Sravan Sai Vuppula",
              url: "https://buildwithsravan.dev",
              author: {
                "@type": "Person",
                name: "Sravan Sai Vuppula",
              },
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

export default Route;
