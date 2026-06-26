import { useState } from "react";
import { motion } from "framer-motion";

type Axis = { label: string; value: number; detail: string };

const axes: Axis[] = [
  { label: "MERN", value: 0.95, detail: "MongoDB · Express · React · Node — production stack across 7 shipped products." },
  { label: "Mobile", value: 0.78, detail: "React Native, Expo, Capacitor — dual-interface mobile applications." },
  { label: "Enterprise / SAP", value: 0.82, detail: "ABAP, S/4HANA Cloud, RAP — SAP Certified Associate." },
  { label: "Cloud & DevOps", value: 0.8, detail: "AWS, GCP, Cloudinary, Git, deployment orchestration." },
  { label: "Backend / Java", value: 0.78, detail: "Spring, Spring Boot, FastAPI, MySQL — enterprise simulations." },
  { label: "Systems Design", value: 0.9, detail: "Architecture, workflow optimization, project orchestration." },
];

export function SkillsRadar() {
  const [active, setActive] = useState<number | null>(null);
  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 130;
  const n = axes.length;

  const point = (i: number, v: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(angle) * radius * v, cy + Math.sin(angle) * radius * v] as const;
  };

  const polygon = axes.map((a, i) => point(i, a.value).join(",")).join(" ");
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[auto_1fr]">
      <div className="relative mx-auto">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          {rings.map((r) => (
            <polygon
              key={r}
              points={axes.map((_, i) => point(i, r).join(",")).join(" ")}
              fill="none"
              stroke="rgba(26,33,40,0.10)"
              strokeWidth="1"
            />
          ))}
          {axes.map((_, i) => {
            const [x, y] = point(i, 1);
            return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(26,33,40,0.10)" strokeWidth="1" />;
          })}
          <motion.polygon
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
            points={polygon}
            fill="rgba(42,111,142,0.18)"
            stroke="#2A6F8E"
            strokeWidth="1.5"
          />
          {axes.map((a, i) => {
            const [x, y] = point(i, a.value);
            return (
              <g key={a.label} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}>
                <circle
                  cx={x}
                  cy={y}
                  r={active === i ? 7 : 4}
                  fill={active === i ? "#1A2128" : "#2A6F8E"}
                  className="cursor-pointer transition-all"
                />
              </g>
            );
          })}
          {axes.map((a, i) => {
            const [lx, ly] = point(i, 1.18);
            return (
              <text
                key={a.label}
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="JetBrains Mono, monospace"
                fontSize="11"
                fill="#4A5560"
                style={{ letterSpacing: "0.04em", textTransform: "uppercase" }}
              >
                {a.label}
              </text>
            );
          })}
        </svg>
      </div>
      <div className="space-y-2">
        {axes.map((a, i) => (
          <button
            key={a.label}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className={`block w-full border-t border-[color:var(--hairline)] py-3 text-left transition-colors ${
              active === i ? "text-ink" : "text-ink-secondary hover:text-ink"
            }`}
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-display text-[17px] font-semibold">{a.label}</span>
              <span className="font-mono text-[12px] text-ink-muted">{Math.round(a.value * 100)}</span>
            </div>
            {active === i && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 max-w-[480px] text-[14px] leading-[1.6] text-ink-secondary"
              >
                {a.detail}
              </motion.p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
