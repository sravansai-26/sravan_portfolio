import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const solid = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: "none",
};

/* -------- UI -------- */
export const ArrowRight = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);
export const Plus = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const Minus = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <path d="M5 12h14" />
  </svg>
);
export const Close = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const Menu = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const Send = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);
export const ExternalLink = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <path d="M15 3h6v6M10 14L21 3M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6" />
  </svg>
);

/* -------- Domain glyphs (custom geometric, no emoji) -------- */
export const WebIcon = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
  </svg>
);
export const BlogIcon = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <path d="M4 4h12l4 4v12H4z" />
    <path d="M16 4v4h4M7 12h10M7 16h7" />
  </svg>
);
export const GatewayIcon = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <rect x="3" y="6" width="18" height="12" rx="1.5" />
    <path d="M3 10h18M8 14h2M14 14h2" />
  </svg>
);
export const DesignIcon = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <path d="M3 21l3-1 12-12-2-2L4 18l-1 3z" />
    <path d="M14 6l4 4" />
  </svg>
);
export const TerminalIcon = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <rect x="3" y="4" width="18" height="16" rx="1.5" />
    <path d="M7 9l3 3-3 3M13 15h4" />
  </svg>
);
export const SparkIcon = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
  </svg>
);
export const DocIcon = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4M9 12h6M9 16h6M9 8h2" />
  </svg>
);
export const ShieldIcon = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" />
  </svg>
);

/* -------- Brand marks (monochrome line/solid, custom) -------- */
export const GitHubIcon = (p: IconProps) => (
  <svg {...solid} {...p}>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.04 11.04 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.82 1.19 3.08 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.56C20.22 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z" />
  </svg>
);
export const LinkedInIcon = (p: IconProps) => (
  <svg {...solid} {...p}>
    <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9.5h4V21H3V9.5zm7 0h3.83v1.57h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.66 4.8 6.13V21h-4v-5.18c0-1.24-.02-2.83-1.72-2.83-1.72 0-1.98 1.34-1.98 2.74V21h-4V9.5z" />
  </svg>
);
export const XIcon = (p: IconProps) => (
  <svg {...solid} {...p}>
    <path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.79l-4.78-6.43L5.27 22H2.51l7.02-8.02L1.5 2h6.92l4.33 5.84L18.24 2z" />
  </svg>
);
export const MediumIcon = (p: IconProps) => (
  <svg {...solid} {...p}>
    <path d="M2.846 6.887a.92.92 0 0 0-.3-.776L.563 3.731V3.37h6.16l4.76 10.43L15.667 3.37h5.872v.361l-1.7 1.628a.5.5 0 0 0-.188.479v12.04a.5.5 0 0 0 .188.48l1.66 1.627v.36h-8.35v-.36l1.72-1.667c.168-.169.168-.218.168-.48V7.626L10.249 19.7h-.647L4.034 7.625v8.092c-.046.347.069.696.31.949l2.237 2.715v.36H.246v-.36L2.483 16.66a1.1 1.1 0 0 0 .363-.95V6.887z" />
  </svg>
);
export const LinktreeIcon = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <path d="M12 3v18M5 8l14 8M5 16l14-8" />
  </svg>
);
export const TelegramIcon = (p: IconProps) => (
  <svg {...solid} {...p}>
    <path d="M21.5 3.2 2.4 10.6c-1 .4-1 1 0 1.3l4.8 1.5 1.9 5.8c.2.6.4.8.8.8.4 0 .6-.2.9-.5l2.4-2.3 4.9 3.6c.9.5 1.5.2 1.8-.8L22.9 4.8c.3-1.2-.4-1.8-1.4-1.6zM9 15.6l-.5 4.1 1.5-4.3 9.3-8.4L9 15.6z" />
  </svg>
);
export const WhatsAppIcon = (p: IconProps) => (
  <svg {...solid} {...p}>
    <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.2-.5-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.3 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.1-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 4.9L2 22l5.3-1.3c1.4.7 3 1.1 4.7 1.1 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3C4.1 14.9 3.7 13.5 3.7 12 3.7 7.5 7.5 3.7 12 3.7s8.3 3.8 8.3 8.3-3.8 8-8.3 8z" />
  </svg>
);
export const InstagramIcon = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);
export const YouTubeIcon = (p: IconProps) => (
  <svg {...solid} {...p}>
    <path d="M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.3-1C16.5 3.6 12 3.6 12 3.6s-4.5 0-7.8.3c-.5.1-1.5.1-2.3 1C1.2 5.6 1 7.2 1 7.2S.8 9.1.8 11v1.8c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2.1.9 2.6 1 1.9.2 8 .3 8 .3s4.5 0 7.8-.3c.5-.1 1.5-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8V11c0-1.9-.2-3.8-.2-3.8zM9.7 14.6V8l5.8 3.3-5.8 3.3z" />
  </svg>
);
export const ThreadsIcon = (p: IconProps) => (
  <svg {...solid} {...p}>
    <path d="M17.4 11.1c-.1 0-.2-.1-.2-.1-.2-3.6-2.2-5.6-5.5-5.7-2 0-3.7.8-4.7 2.4l1.8 1.2c.8-1.2 2-1.5 2.9-1.5 1.1 0 2 .3 2.5.9.4.5.7 1.1.8 1.9-.9-.2-1.9-.2-2.9-.2-3 .2-4.9 1.9-4.8 4.3.1 1.2.7 2.3 1.6 3 1.1.8 2.5 1.2 4 1.1 2-.1 3.5-.9 4.6-2.3.8-1.1 1.3-2.4 1.5-4.2.9.6 1.6 1.3 2 2.3.7 1.6.7 4.2-1.4 6.3-1.8 1.8-4 2.6-7.2 2.6-3.6 0-6.4-1.2-8.2-3.5C2.3 16.4 1.4 13.4 1.4 12c0-1.4.9-4.4 2.6-6.5C5.8 3.2 8.5 2 12.1 2c3.7 0 6.4 1.2 8.2 3.5 1 1.3 1.7 2.9 2.1 4.7l-2.1.5c-.2-1.4-.7-2.7-1.4-3.6-1.4-1.8-3.6-2.7-6.7-2.7-2.9 0-5 1-6.4 2.8C4.4 8.7 3.7 11.2 3.7 12c0 .8.7 3.3 2.1 5 1.4 1.8 3.5 2.8 6.4 2.8 2.6 0 4.4-.6 5.8-2 1.7-1.7 1.6-3.8 1.1-5-.3-.7-.8-1.3-1.5-1.7-.1.5-.2 1-.4 1.5-.5 1.4-1.4 2.5-2.6 3.3-1 .6-2.3.9-3.6.7-1-.1-2-.4-2.7-1-.9-.6-1.3-1.5-1.3-2.4 0-1.7 1.5-3 3.6-3.1.7 0 1.4 0 2.1.1.9.1 1.7.3 2.5.5 0-.1 0-.2.1-.2z" />
  </svg>
);
export const FacebookIcon = (p: IconProps) => (
  <svg {...solid} {...p}>
    <path d="M22 12a10 10 0 1 0-11.6 9.9V14.9H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v6.9A10 10 0 0 0 22 12z" />
  </svg>
);
export const WritcoIcon = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" />
    <path d="M14 6l4 4" />
    <path d="M3 21h18" />
  </svg>
);
