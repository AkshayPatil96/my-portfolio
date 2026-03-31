"use client";

import { memo, useCallback, useState, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
  type NodeTypes,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  architectureConfigs,
  archColors,
  archGroupLabels,
  type ArchDiagramConfig,
  type ArchGroup,
  type ArchNodeConfig,
  type ArchEdgeConfig,
} from "@/lib/architecture-data";
import { CaseStudy } from "@/lib/projects-data";

// ─── Custom Node ─────────────────────────────────────────────────

interface ArchNodeData {
  label: string;
  group: ArchGroup;
  tooltip?: string;
  dashed?: boolean;
}

const ArchNode = memo(({ data }: NodeProps<ArchNodeData>) => {
  const [hovered, setHovered] = useState(false);
  const c = archColors[data.group];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: c.bg,
        border: `1.5px ${data.dashed ? "dashed" : "solid"} ${c.border}`,
        borderRadius: 12,
        padding: "10px 18px",
        color: c.text,
        fontSize: 13,
        fontWeight: 600,
        textAlign: "center",
        minWidth: 150,
        whiteSpace: "pre-line",
        lineHeight: "1.45",
        boxShadow: hovered ? `0 0 24px ${c.glow}` : `0 0 10px ${c.glow}`,
        transition: "box-shadow 0.2s ease",
        position: "relative",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ opacity: 0 }}
      />

      {data.label}

      {hovered && data.tooltip && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1a1a1a",
            border: `1px solid ${c.border}`,
            borderRadius: 8,
            padding: "8px 12px",
            color: "#e0e0e0",
            fontSize: 11,
            fontWeight: 400,
            lineHeight: "1.4",
            whiteSpace: "nowrap",
            maxWidth: 320,
            zIndex: 50,
            pointerEvents: "none",
            boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
          }}
        >
          {data.tooltip}
        </div>
      )}
    </div>
  );
});
ArchNode.displayName = "ArchNode";

// ─── Node Types ──────────────────────────────────────────────────

const nodeTypes: NodeTypes = {
  apiNode: ArchNode,
  applicationNode: ArchNode,
  domainNode: ArchNode,
  dataAccessNode: ArchNode,
  crossCuttingNode: ArchNode,
};

const typeForGroup: Record<ArchGroup, string> = {
  api: "apiNode",
  application: "applicationNode",
  domain: "domainNode",
  dataAccess: "dataAccessNode",
  crossCutting: "crossCuttingNode",
};

// ─── Build helpers ───────────────────────────────────────────────

const groupLabelStyle = {
  background: "transparent",
  border: "none",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  pointerEvents: "none" as const,
  padding: 0,
};

function buildNodes(config: ArchDiagramConfig): Node[] {
  // Derive group label positions from topmost node per group
  const groupPos = new Map<ArchGroup, { minY: number; minX: number }>();
  for (const n of config.nodes) {
    const existing = groupPos.get(n.group);
    if (!existing || n.position.y < existing.minY) {
      groupPos.set(n.group, { minY: n.position.y, minX: n.position.x });
    }
  }

  const labels: Node[] = Array.from(groupPos.entries()).map(([group, pos]) => ({
    id: `label-${group}`,
    type: "default",
    data: { label: archGroupLabels[group] },
    position: { x: pos.minX, y: pos.minY - 36 },
    selectable: false,
    draggable: false,
    style: { ...groupLabelStyle, color: `${archColors[group].text}40` },
  }));

  const rfNodes: Node<ArchNodeData>[] = config.nodes.map(
    (n: ArchNodeConfig) => ({
      id: n.id,
      type: typeForGroup[n.group],
      data: {
        label: n.label,
        group: n.group,
        tooltip: n.tooltip,
        dashed: n.dashed,
      },
      position: n.position,
    }),
  );

  // Annotation nodes
  const annotations: Node[] = (config.annotations ?? []).map((a) => ({
    id: a.id,
    type: "default",
    data: { label: a.label },
    position: a.position,
    selectable: false,
    draggable: false,
    style: {
      background:
        a.style === "badge" ? "rgba(229,196,151,0.08)" : "transparent",
      border: a.style === "badge" ? "1px solid rgba(229,196,151,0.2)" : "none",
      borderRadius: a.style === "badge" ? 6 : 0,
      padding: a.style === "badge" ? "4px 14px" : 0,
      fontSize: a.style === "badge" ? 10 : 9,
      fontWeight: 700,
      letterSpacing: "0.2em",
      textTransform: "uppercase" as const,
      color: a.color ?? "#ffffff20",
      pointerEvents: "none" as const,
      whiteSpace: "nowrap" as const,
    },
  }));

  return [...labels, ...annotations, ...rfNodes];
}

function buildEdges(config: ArchDiagramConfig): Edge[] {
  const edgeBase = {
    type: "smoothstep" as const,
    animated: false,
    style: { stroke: "#ffffff18", strokeWidth: 1.5 },
    labelStyle: { fill: "#ffffff70", fontSize: 10, fontWeight: 500 },
    labelBgStyle: { fill: "#0B0B0B", fillOpacity: 0.9 },
    labelBgPadding: [6, 3] as [number, number],
    labelBgBorderRadius: 4,
  };

  const primaryBase = {
    ...edgeBase,
    animated: true,
    style: {
      stroke: "#a8dadc",
      strokeWidth: 2.5,
      filter: "drop-shadow(0 0 4px rgba(168,218,220,0.4))",
    },
  };

  return config.edges.map((e: ArchEdgeConfig) => {
    const isPrimary = e.variant === "primary";
    const isDashed = e.variant === "dashed";
    const base = isPrimary ? primaryBase : edgeBase;
    const strokeColor = e.color ?? (isPrimary ? "#a8dadc" : "#ffffff18");

    return {
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      ...base,
      style: {
        ...base.style,
        stroke: strokeColor,
        ...(isDashed && { strokeDasharray: "6 3" }),
      },
    };
  });
}

function buildLegend(config: ArchDiagramConfig) {
  const usedGroups = new Set(config.nodes.map((n) => n.group));
  const hasPrimary = config.edges.some((e) => e.variant === "primary");

  const items = Array.from(usedGroups).map((g) => ({
    label: archGroupLabels[g],
    color: archColors[g].border,
  }));

  if (hasPrimary) items.push({ label: "Primary Flow", color: "#a8dadc" });

  return items;
}

// ─── Flow Component ──────────────────────────────────────────────

function ArchFlow({ config }: { config: ArchDiagramConfig }) {
  const initialNodes = useMemo(() => buildNodes(config), [config]);
  const initialEdges = useMemo(() => buildEdges(config), [config]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const stableNodeTypes = useMemo(() => nodeTypes, []);

  const nodeGroupMap = useMemo(() => {
    const map = new Map<string, ArchGroup>();
    for (const n of config.nodes) map.set(n.id, n.group);
    return map;
  }, [config]);

  const onInit = useCallback((instance: { fitView: () => void }) => {
    setTimeout(() => instance.fitView(), 100);
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={stableNodeTypes}
      onInit={onInit}
      fitView
      minZoom={0.3}
      maxZoom={2}
      proOptions={{ hideAttribution: true }}
      style={{ background: "#060606" }}
    >
      <Background
        color="#ffffff08"
        gap={24}
        size={1}
      />
      <Controls
        showInteractive={false}
        style={{
          background: "#1a1a1a",
          borderRadius: 8,
          border: "1px solid #ffffff10",
        }}
      />
      <MiniMap
        nodeColor={(node) => {
          if (node.id.startsWith("label-") || node.id.startsWith("ann-"))
            return "transparent";
          const group = nodeGroupMap.get(node.id);
          return group ? archColors[group].border : "#6c757d";
        }}
        maskColor="#0B0B0Bcc"
        style={{
          background: "#111111",
          border: "1px solid #ffffff10",
          borderRadius: 8,
        }}
      />
    </ReactFlow>
  );
}

// ─── Exported Wrapper ────────────────────────────────────────────

interface ArchitectureDiagramProps {
  slug: string;
  caseStudy: CaseStudy;
}

export default function ArchitectureDiagram({
  slug,
  caseStudy,
}: ArchitectureDiagramProps) {
  const config = architectureConfigs[slug];
  if (!config) return null;

  const legendItems = buildLegend(config);

  return (
    <section className="py-12 px-6 md:px-12 lg:px-24 bg-[#0B0B0B]">
      <div className="max-w-6xl mx-auto">
        <p className="font-label text-xs uppercase tracking-[0.3em] text-primary/50 mb-4">
          {config.eyebrow}
        </p>
        <h2 className="font-headline text-3xl md:text-4xl text-on-surface leading-tight mb-12">
          {config.title}
          {config.subtitle && (
            <span className="block text-lg md:text-xl text-on-surface-variant/40 mt-2 font-body font-normal">
              {config.subtitle}
            </span>
          )}
        </h2>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          {legendItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2"
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/50">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Diagram */}
        <div
          className="rounded-lg overflow-hidden border border-outline-variant/20"
          style={{ height: 620 }}
        >
          <ReactFlowProvider>
            <ArchFlow config={config} />
          </ReactFlowProvider>
        </div>

        <p className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/30 text-center mt-4">
          INTERACTIVE ARCHITECTURE DIAGRAM — DRAG · ZOOM · PAN · HOVER FOR
          DETAILS
        </p>
        {caseStudy.architectureNote && (
          <p className="font-body text-on-surface-variant/50 text-sm text-center mt-3 max-w-2xl mx-auto leading-relaxed">
            {caseStudy.architectureNote}
          </p>
        )}
      </div>
    </section>
  );
}
