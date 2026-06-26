import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const ArrowRight = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export const Plus = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Minus = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 12h14" />
  </svg>
);

export const Close = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const Menu = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

// Brand icons (simple monochrome line marks)
export const GitHubIcon = (p: IconProps) => (
  <svg {...base} {...p} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.04 11.04 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.82 1.19 3.08 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.56C20.22 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

export const LinkedInIcon = (p: IconProps) => (
  <svg {...base} {...p} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9.5h4V21H3V9.5zm7 0h3.83v1.57h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.66 4.8 6.13V21h-4v-5.18c0-1.24-.02-2.83-1.72-2.83-1.72 0-1.98 1.34-1.98 2.74V21h-4V9.5z" />
  </svg>
);

export const XIcon = (p: IconProps) => (
  <svg {...base} {...p} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.79l-4.78-6.43L5.27 22H2.51l7.02-8.02L1.5 2h6.92l4.33 5.84L18.24 2zm-2.38 18.27h1.88L7.22 3.62H5.21l10.65 16.65z" />
  </svg>
);

export const MediumIcon = (p: IconProps) => (
  <svg {...base} {...p} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M2.846 6.887a.92.92 0 0 0-.3-.776L.563 3.731V3.37h6.16l4.76 10.43L15.667 3.37h5.872v.361l-1.7 1.628a.5.5 0 0 0-.188.479v12.04a.5.5 0 0 0 .188.48l1.66 1.627v.36h-8.35v-.36l1.72-1.667c.168-.169.168-.218.168-.48V7.626L10.249 19.7h-.647L4.034 7.625v8.092c-.046.347.069.696.31.949l2.237 2.715v.36H.246v-.36L2.483 16.66a1.1 1.1 0 0 0 .363-.95V6.887z" />
  </svg>
);

export const LinktreeIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 2v20M5 7h14M5 17h14M7 12h10" />
  </svg>
);

// Placeholder logo mark used for missing brand icons (e.g., Naxrita India)
export const PlaceholderMark = (p: IconProps) => (
  <svg {...base} {...p} viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M3 9h18M9 3v18" strokeOpacity="0.35" />
  </svg>
);
