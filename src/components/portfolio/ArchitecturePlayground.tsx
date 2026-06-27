import { useState } from "react";
import { motion } from "framer-motion";

type NodeId = "client" | "gateway" | "auth" | "controller" | "service" | "model" | "db" | "cdn";

type Flow = {
  id: string;
  name: string;
  stack: string;
  path: { from: NodeId; to: NodeId; label?: string }[];
};

const flows: Flow[] = [
  {
    id: "resolveit",
    name: "Resolveit · Civic Ticket Lifecycle",
    stack: "React · Express · MongoDB · Cloudinary",
    path: [
      { from: "client", to: "gateway", label: "POST /api/issues" },
      { from: "gateway", to: "auth", label: "JWT verify" },
      { from: "auth", to: "controller", label: "issueController" },
      { from: "controller", to: "service", label: "validate + tag" },
      { from: "service", to: "model", label: "Issue.create()" },
      { from: "model", to: "db", label: "insert" },
      { from: "controller", to: "cdn", label: "upload media" },
    ],
  },
  {
    id: "loadmate",
    name: "Smart LoadMate · Trip Dispatch",
    stack: "React Native · FastAPI · MongoDB",
    path: [
      { from: "client", to: "gateway", label: "POST /trip/request" },
      { from: "gateway", to: "controller", label: "dispatchRouter" },
      { from: "controller", to: "service", label: "route optimizer" },
      { from: "service", to: "model", label: "Trip + Driver" },
      { from: "model", to: "db", label: "write" },
    ],
  },
  {
    id: "shotweave",
    name: "Shotweave · Production Ledger",
    stack: "React · Python · MongoDB",
    path: [
      { from: "client", to: "gateway", label: "GET /production/:id" },
      { from: "gateway", to: "auth", label: "session" },
      { from: "auth", to: "controller", label: "prodController" },
      { from: "controller", to: "model", label: "Budget aggregate" },
      { from: "model", to: "db", label: "read" },
    ],
  },
];

const layout: Record<NodeId, { x: number; y: number; label: string; sub: string }> = {
  client:    { x: 60,  y: 180, label: "Client",     sub: "React / RN" },
  gateway:   { x: 220, y: 180, label: "Gateway",    sub: "Express / FastAPI" },
  auth:      { x: 360, y: 60,  label: "Auth",       sub: "JWT / Session" },
  controller:{ x: 380, y: 180, label: "Controller", sub: "Route handler" },
  service:   { x: 540, y: 180, label: "Service",    sub: "Business logic" },
  model:     { x: 700, y: 180, label: "Model",      sub: "Mongoose / ODM" },
  db:        { x: 840, y: 180, label: "MongoDB",    sub: "Atlas cluster" },
  cdn:       { x: 540, y: 320, label: "Cloudinary", sub: "Media store" },
};

export function ArchitecturePlayground() {
  const [active, setActive] = useState(0);
  const flow = flows[active];
  const activeNodes = new Set<NodeId>();
  flow.path.forEach((p) => {
    activeNodes.add(p.from);
    activeNodes.add(p.to);
  });

  return (
    <div className="rounded-2xl border border-white/40 bg-white/40 p-5 backdrop-blur-xl md:p-8">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {flows.map((f, i) => (
          <button
            key={f.id}
            onClick={() => setActive(i)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
              i === active
                ? "border-ink bg-ink text-background"
                : "border-[color:var(--hairline)] bg-white/40 text-ink-secondary hover:bg-white/70"
            }`}
          >
            {f.name.split(" · ")[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="relative overflow-x-auto rounded-xl border border-[color:var(--hairline)] bg-gradient-to-br from-white/60 to-white/20 p-3">
          <svg viewBox="0 0 920 400" className="w-full min-w-[720px]">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="var(--accent-blue)" />
              </marker>
            </defs>
            {/* edges */}
            {flow.path.map((p, i) => {
              const a = layout[p.from];
              const b = layout[p.to];
              return (
                <g key={i}>
                  <motion.line
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                    x1={a.x + 60}
                    y1={a.y + 30}
                    x2={b.x}
                    y2={b.y + 30}
                    stroke="var(--accent-blue)"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    markerEnd="url(#arrow)"
                  />
                  {p.label && (
                    <text
                      x={(a.x + 60 + b.x) / 2}
                      y={(a.y + b.y) / 2 + 22}
                      textAnchor="middle"
                      className="fill-ink-muted"
                      style={{ fontFamily: "JetBrains Mono", fontSize: 10 }}
                    >
                      {p.label}
                    </text>
                  )}
                </g>
              );
            })}
            {/* nodes */}
            {(Object.keys(layout) as NodeId[]).map((id) => {
              const n = layout[id];
              const on = activeNodes.has(id);
              return (
                <g key={id} opacity={on ? 1 : 0.3}>
                  <rect
                    x={n.x}
                    y={n.y}
                    width={120}
                    height={60}
                    rx={10}
                    fill={on ? "var(--deep-ink)" : "var(--surface)"}
                    stroke="var(--hairline)"
                  />
                  <text
                    x={n.x + 60}
                    y={n.y + 26}
                    textAnchor="middle"
                    fill={on ? "white" : "var(--ink)"}
                    style={{ fontFamily: "DM Sans", fontSize: 14, fontWeight: 700 }}
                  >
                    {n.label}
                  </text>
                  <text
                    x={n.x + 60}
                    y={n.y + 44}
                    textAnchor="middle"
                    fill={on ? "rgba(255,255,255,0.65)" : "var(--ink-muted)"}
                    style={{ fontFamily: "JetBrains Mono", fontSize: 9 }}
                  >
                    {n.sub}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="rounded-xl border border-[color:var(--hairline)] bg-white/50 p-5">
          <div className="mono-label mb-2">Active Flow</div>
          <div className="font-display text-[20px] font-bold text-ink">{flow.name}</div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            {flow.stack}
          </div>
          <ol className="mt-5 space-y-2">
            {flow.path.map((p, i) => (
              <li key={i} className="grid grid-cols-[24px_1fr] items-baseline gap-3 text-[13px]">
                <span className="font-mono text-[11px] text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-ink-secondary">
                  <span className="font-medium text-ink">{layout[p.from].label}</span>{" "}
                  <span className="text-ink-muted">→</span>{" "}
                  <span className="font-medium text-ink">{layout[p.to].label}</span>
                  {p.label && (
                    <span className="ml-2 font-mono text-[11px] text-accent-blue">· {p.label}</span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
