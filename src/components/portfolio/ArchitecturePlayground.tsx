import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type NodeId = "client" | "gateway" | "auth" | "controller" | "service" | "model" | "db" | "cdn";

type Edge = { from: NodeId; to: NodeId; label?: string };

type Flow = {
  id: string;
  name: string;
  stack: string;
  summary: string;
  path: Edge[];
};

const flows: Flow[] = [
  {
    id: "resolveit",
    name: "Resolveit · Civic Ticket Lifecycle",
    stack: "React · Express · MongoDB · Cloudinary",
    summary:
      "A citizen files a civic issue with photo evidence. The request is authenticated, validated, tagged, persisted, and the media is mirrored to a CDN for fast public display.",
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
    summary:
      "A hauler requests a trip. The dispatcher resolves the optimal driver-route pairing and writes the trip + driver assignment atomically.",
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
    summary:
      "A production lead opens a film's ledger. The session is validated and an aggregate budget snapshot is returned in one read.",
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
  client: { x: 40, y: 180, label: "Client", sub: "React / RN" },
  gateway: { x: 200, y: 180, label: "Gateway", sub: "Express / FastAPI" },
  auth: { x: 360, y: 60, label: "Auth", sub: "JWT / Session" },
  controller: { x: 360, y: 180, label: "Controller", sub: "Route handler" },
  service: { x: 520, y: 180, label: "Service", sub: "Business logic" },
  model: { x: 680, y: 180, label: "Model", sub: "Mongoose / ODM" },
  db: { x: 840, y: 180, label: "MongoDB", sub: "Atlas cluster" },
  cdn: { x: 520, y: 320, label: "Cloudinary", sub: "Media store" },
};

const NODE_W = 130;
const NODE_H = 60;

export function ArchitecturePlayground() {
  const [active, setActive] = useState(0);
  const [focusNode, setFocusNode] = useState<NodeId | null>(null);
  const flow = flows[active];

  const allFlowNodes = useMemo(() => {
    const s = new Set<NodeId>();
    flow.path.forEach((p) => {
      s.add(p.from);
      s.add(p.to);
    });
    return s;
  }, [flow]);

  // Edges/nodes highlighted by focus
  const highlightedEdges = useMemo(() => {
    if (!focusNode) return new Set(flow.path.map((_, i) => i));
    const idxs = new Set<number>();
    flow.path.forEach((e, i) => {
      if (e.from === focusNode || e.to === focusNode) idxs.add(i);
    });
    return idxs;
  }, [focusNode, flow]);

  const highlightedNodes = useMemo(() => {
    if (!focusNode) return allFlowNodes;
    const s = new Set<NodeId>([focusNode]);
    flow.path.forEach((e) => {
      if (e.from === focusNode) s.add(e.to);
      if (e.to === focusNode) s.add(e.from);
    });
    return s;
  }, [focusNode, flow, allFlowNodes]);

  function selectFlow(i: number) {
    setActive(i);
    setFocusNode(null);
  }

  return (
    <div className="rounded-2xl border border-white/40 bg-white/40 p-5 backdrop-blur-xl md:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {flows.map((f, i) => (
            <button
              key={f.id}
              onClick={() => selectFlow(i)}
              className={`rounded-full border px-3.5 py-1.5 text-[11.5px] font-medium uppercase tracking-[0.14em] transition-colors ${
                i === active
                  ? "border-ink bg-ink text-background"
                  : "border-[color:var(--hairline)] bg-white/40 text-ink-secondary hover:bg-white/70"
              }`}
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {f.name.split(" · ")[0]}
            </button>
          ))}
        </div>
        {focusNode && (
          <button
            onClick={() => setFocusNode(null)}
            className="rounded-full border border-[color:var(--hairline)] bg-white/60 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-ink-secondary hover:bg-white"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Clear focus
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="relative overflow-x-auto rounded-xl border border-[color:var(--hairline)] bg-gradient-to-br from-white/60 to-white/20 p-3">
          <svg viewBox="0 0 990 410" className="w-full min-w-[720px]">
            <defs>
              <marker
                id="arrow-active"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10 z" fill="var(--accent-blue)" />
              </marker>
              <marker
                id="arrow-dim"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10 z" fill="rgba(26,33,40,0.25)" />
              </marker>
            </defs>

            {/* edges */}
            {flow.path.map((p, i) => {
              const a = layout[p.from];
              const b = layout[p.to];
              const isHi = highlightedEdges.has(i);
              return (
                <g key={i} opacity={isHi ? 1 : 0.18}>
                  <motion.line
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                    x1={a.x + NODE_W}
                    y1={a.y + NODE_H / 2}
                    x2={b.x}
                    y2={b.y + NODE_H / 2}
                    stroke={isHi ? "var(--accent-blue)" : "rgba(26,33,40,0.4)"}
                    strokeWidth={isHi ? 1.8 : 1}
                    strokeDasharray="4 4"
                    markerEnd={`url(#${isHi ? "arrow-active" : "arrow-dim"})`}
                  />
                  {p.label && (
                    <text
                      x={(a.x + NODE_W + b.x) / 2}
                      y={(a.y + b.y) / 2 + 22}
                      textAnchor="middle"
                      fill={isHi ? "var(--ink-secondary)" : "var(--ink-muted)"}
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
              const inFlow = allFlowNodes.has(id);
              const isHi = highlightedNodes.has(id);
              const isFocus = focusNode === id;
              if (!inFlow) return null;
              return (
                <g
                  key={id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setFocusNode(isFocus ? null : id)}
                  opacity={isHi ? 1 : 0.35}
                >
                  <rect
                    x={n.x}
                    y={n.y}
                    width={NODE_W}
                    height={NODE_H}
                    rx={12}
                    fill={
                      isFocus ? "var(--accent-blue)" : isHi ? "var(--deep-ink)" : "var(--surface)"
                    }
                    stroke={isFocus ? "var(--accent-blue)" : "var(--hairline)"}
                    strokeWidth={isFocus ? 2 : 1}
                  />
                  <text
                    x={n.x + NODE_W / 2}
                    y={n.y + 26}
                    textAnchor="middle"
                    fill={isFocus || isHi ? "white" : "var(--ink)"}
                    style={{
                      fontFamily: "DM Sans",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {n.label}
                  </text>
                  <text
                    x={n.x + NODE_W / 2}
                    y={n.y + 44}
                    textAnchor="middle"
                    fill={isFocus || isHi ? "rgba(255,255,255,0.75)" : "var(--ink-muted)"}
                    style={{ fontFamily: "JetBrains Mono", fontSize: 9 }}
                  >
                    {n.sub}
                  </text>
                </g>
              );
            })}
          </svg>
          <div
            className="mt-2 px-2 text-[11px] text-ink-muted"
            style={{ fontFamily: "Roboto, sans-serif", letterSpacing: "0.06em" }}
          >
            Tip — click any node to focus its inbound and outbound routes.
          </div>
        </div>

        <div className="rounded-xl border border-[color:var(--hairline)] bg-white/50 p-5">
          <div className="mono-label mb-2">Active Flow</div>
          <div className="font-display text-[20px] font-bold text-ink">{flow.name}</div>
          <div
            className="mt-1 text-[11px] uppercase text-ink-muted"
            style={{ fontFamily: "Roboto, sans-serif", letterSpacing: "0.14em" }}
          >
            {flow.stack}
          </div>
          <p className="mt-3 text-[13.5px] leading-[1.65] text-ink-secondary">{flow.summary}</p>

          {focusNode && (
            <div className="mt-4 rounded-lg border border-[color:var(--accent-blue)]/30 bg-[color:var(--accent-blue)]/10 px-3 py-2 text-[12px] text-ink">
              Focused on <span className="font-semibold">{layout[focusNode].label}</span> — showing
              only the routes that touch this node.
            </div>
          )}

          <ol className="mt-5 space-y-2">
            {flow.path.map((p, i) => {
              const isHi = highlightedEdges.has(i);
              return (
                <li
                  key={i}
                  className={`grid grid-cols-[24px_1fr] items-baseline gap-3 text-[13px] transition-opacity ${
                    isHi ? "opacity-100" : "opacity-35"
                  }`}
                >
                  <span className="font-mono text-[11px] text-ink-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ink-secondary">
                    <button
                      type="button"
                      onClick={() => setFocusNode(p.from)}
                      className="font-medium text-ink hover:underline"
                    >
                      {layout[p.from].label}
                    </button>{" "}
                    <span className="text-ink-muted">→</span>{" "}
                    <button
                      type="button"
                      onClick={() => setFocusNode(p.to)}
                      className="font-medium text-ink hover:underline"
                    >
                      {layout[p.to].label}
                    </button>
                    {p.label && (
                      <span className="ml-2 font-mono text-[11px] text-accent-blue">
                        · {p.label}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
