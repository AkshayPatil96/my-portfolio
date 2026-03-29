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
  diagramConfigs,
  type DiagramConfig,
  type DiagramGroup,
  type DiagramNodeConfig,
  type DiagramEdgeConfig,
} from "@/lib/diagram-data";

// ─── Group Colors ────────────────────────────────────────────────
const colors: Record<DiagramGroup, { bg: string; border: string; text: string; glow: string }> = {
  infra: { bg: "#0d1b2a", border: "#1b4965", text: "#a8dadc", glow: "rgba(27,73,101,0.3)" },
  app: { bg: "#0b2b1a", border: "#2d6a4f", text: "#95d5b2", glow: "rgba(45,106,79,0.3)" },
  data: { bg: "#1a0b2e", border: "#5a189a", text: "#c77dff", glow: "rgba(90,24,154,0.3)" },
  external: { bg: "#2b1a00", border: "#e76f51", text: "#f4a261", glow: "rgba(231,111,81,0.3)" },
  cicd: { bg: "#1a1a1a", border: "#6c757d", text: "#adb5bd", glow: "rgba(108,117,125,0.3)" },
};

const typeForGroup: Record<DiagramGroup, string> = {
  infra: "infraNode",
  app: "appNode",
  data: "dataNode",
  external: "externalNode",
  cicd: "cicdNode",
};

const groupLabelNames: Record<DiagramGroup, string> = {
  infra: "INFRASTRUCTURE",
  app: "APPLICATION",
  data: "DATA LAYER",
  external: "EXTERNAL SERVICES",
  cicd: "CI/CD",
};

// ─── Custom Node Component ───────────────────────────────────────
interface DiagramNodeData {
  label: string;
  group: DiagramGroup;
  badge?: string;
  dashed?: boolean;
  tooltip?: string;
}

const DiagramNode = memo(({ data }: NodeProps<DiagramNodeData>) => {
  const [hovered, setHovered] = useState(false);
  const group = colors[data.group];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: group.bg,
        border: `1.5px ${data.dashed ? "dashed" : "solid"} ${group.border}`,
        borderRadius: 12,
        padding: "10px 18px",
        color: group.text,
        fontSize: 13,
        fontWeight: 600,
        textAlign: "center",
        minWidth: 150,
        whiteSpace: "pre-line",
        lineHeight: "1.45",
        boxShadow: hovered ? `0 0 20px ${group.glow}` : `0 0 8px ${group.glow}`,
        transition: "box-shadow 0.2s ease",
        position: "relative",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

      {data.label}

      {data.badge && (
        <div
          style={{
            position: "absolute",
            bottom: -22,
            left: "50%",
            transform: "translateX(-50%)",
            background: colors.infra.border,
            color: colors.infra.text,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "2px 8px",
            borderRadius: 4,
            whiteSpace: "nowrap",
          }}
        >
          {data.badge}
        </div>
      )}

      {hovered && data.tooltip && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1a1a1a",
            border: `1px solid ${group.border}`,
            borderRadius: 8,
            padding: "8px 12px",
            color: "#e0e0e0",
            fontSize: 11,
            fontWeight: 400,
            lineHeight: "1.4",
            whiteSpace: "nowrap",
            maxWidth: 280,
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
DiagramNode.displayName = "DiagramNode";

// ─── Node Types ──────────────────────────────────────────────────
const nodeTypes: NodeTypes = {
  infraNode: DiagramNode,
  appNode: DiagramNode,
  dataNode: DiagramNode,
  externalNode: DiagramNode,
  cicdNode: DiagramNode,
};

// ─── Build ReactFlow nodes / edges from config ──────────────────

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

function buildNodes(config: DiagramConfig): Node[] {
  // Collect unique groups used + their min-y positions for label placement
  const groupPositions = new Map<DiagramGroup, { minY: number; minX: number }>();
  for (const n of config.nodes) {
    const existing = groupPositions.get(n.group);
    if (!existing || n.position.y < existing.minY) {
      groupPositions.set(n.group, { minY: n.position.y, minX: n.position.x });
    }
  }

  // Generate group label nodes
  const labels: Node[] = Array.from(groupPositions.entries()).map(([group, pos]) => ({
    id: `label-${group}`,
    type: "default",
    data: { label: groupLabelNames[group] },
    position: { x: pos.minX, y: pos.minY - 40 },
    selectable: false,
    draggable: false,
    style: { ...groupLabelStyle, color: `${colors[group].text}40` },
  }));

  // Convert config nodes to ReactFlow nodes
  const rfNodes: Node<DiagramNodeData>[] = config.nodes.map((n: DiagramNodeConfig) => ({
    id: n.id,
    type: typeForGroup[n.group],
    data: {
      label: n.label,
      group: n.group,
      badge: n.badge,
      dashed: n.dashed,
      tooltip: n.tooltip,
    },
    position: n.position,
  }));

  return [...labels, ...rfNodes];
}

function buildEdges(config: DiagramConfig): Edge[] {
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

  return config.edges.map((e: DiagramEdgeConfig) => {
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

function buildLegend(config: DiagramConfig) {
  const usedGroups = new Set(config.nodes.map((n) => n.group));
  const hasPrimary = config.edges.some((e) => e.variant === "primary");

  const items = Array.from(usedGroups).map((g) => ({
    label: groupLabelNames[g],
    color: colors[g].border,
  }));

  if (hasPrimary) items.push({ label: "Primary Flow", color: "#a8dadc" });

  return items;
}

// ─── Diagram Flow Component ─────────────────────────────────────

function DiagramFlow({ config }: { config: DiagramConfig }) {
  const initialNodes = useMemo(() => buildNodes(config), [config]);
  const initialEdges = useMemo(() => buildEdges(config), [config]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const stableNodeTypes = useMemo(() => nodeTypes, []);

  // Build a group lookup from config nodes for MiniMap coloring
  const nodeGroupMap = useMemo(() => {
    const map = new Map<string, DiagramGroup>();
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
      <Background color="#ffffff08" gap={24} size={1} />
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
          if (node.id.startsWith("label-")) return "transparent";
          const group = nodeGroupMap.get(node.id);
          return group ? colors[group].border : "#6c757d";
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

interface InfraDiagramProps {
  slug: string;
}

export default function InfraDiagram({ slug }: InfraDiagramProps) {
  const config = diagramConfigs[slug];
  if (!config) return null;

  const legendItems = buildLegend(config);

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#0B0B0B]">
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
            <div key={item.label} className="flex items-center gap-2">
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
          style={{ height: 580 }}
        >
          <ReactFlowProvider>
            <DiagramFlow config={config} />
          </ReactFlowProvider>
        </div>

        <p className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/30 text-center mt-4">
          INTERACTIVE INFRASTRUCTURE DIAGRAM — DRAG · ZOOM · PAN · HOVER FOR DETAILS
        </p>
      </div>
    </section>
  );
}
