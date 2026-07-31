import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState, startTransition } from "react";

import Portfolio from "@/components/portfolio/Portfolio";
import { LoadingSplash } from "@/components/portfolio/LoadingSplash";
import { Nav } from "@/components/portfolio/Nav";
import { ResumeModal } from "@/components/portfolio/ResumeModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sravan Sai Vuppula | Full-Stack Developer & Founder" },
      {
        name: "description",
        content:
          "Portfolio of Sravan Sai Vuppula — Full-Stack Engineer, Founder of LYFSpot, and creator of scalable web & enterprise software.",
      },
      { property: "og:title", content: "Sravan Sai Vuppula | Full-Stack Developer & Founder" },
      {
        property: "og:description",
        content:
          "Portfolio of Sravan Sai Vuppula — Full-Stack Engineer, Founder of LYFSpot, and creator of scalable web & enterprise software.",
      },
      {
        property: "og:url",
        content: "https://buildwithsravan.dev",
      },
      {
        property: "og:image",
        content: "https://buildwithsravan.dev/og-image-v3.png",
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
        content: "Sravan Sai Vuppula | Full-Stack Developer & Founder",
      },
      {
        name: "twitter:description",
        content:
          "Portfolio of Sravan Sai Vuppula — Full-Stack Engineer, Founder of LYFSpot, and creator of scalable web & enterprise software.",
      },
      {
        name: "twitter:image",
        content: "https://buildwithsravan.dev/og-image-v3.png",
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
              "@id": "https://buildwithsravan.dev/#person",
              "name": "Sravan Sai Vuppula",
              "alternateName": "Vuppula Sravan Sai",
              "url": "https://buildwithsravan.dev",
              "image": "https://buildwithsravan.dev/assets/sravan-cutout.webp",
              "jobTitle": "Full-Stack Software Engineer & Founder",
              "worksFor": {
                "@type": "Organization",
                "name": "LYFSpot",
                "url": "https://linktr.ee/lyfspot"
              },
              "sameAs": [
                "https://github.com/sravansai-26",
                "https://linkedin.com/in/sravan-sai-vuppula-753b711ba",
                "https://twitter.com/vuppula_sai",
                "https://instagram.com/lyfspot",
                "https://medium.com/@sravansaivuppula"
              ]
            },
            {
              "@type": "WebSite",
              "@id": "https://buildwithsravan.dev/#website",
              "url": "https://buildwithsravan.dev",
              "name": "Sravan Sai Vuppula Portfolio",
              "description": "Official portfolio of Sravan Sai Vuppula — Full-Stack Developer & Founder of LYFSpot.",
              "publisher": {
                "@id": "https://buildwithsravan.dev/#person"
              },
              "inLanguage": "en"
            }
          ]
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
    const sync = () => {
      startTransition(() => {
        setResumeOpen(window.location.hash === "#resume");
      });
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const open = useCallback(() => {
    if (window.location.hash !== "#resume") {
      window.history.pushState(null, "", "#resume");
    }
    startTransition(() => {
      setResumeOpen(true);
    });
  }, []);

  const close = useCallback(() => {
    if (window.location.hash === "#resume") {
      window.history.back();
    } else {
      startTransition(() => {
        setResumeOpen(false);
      });
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
