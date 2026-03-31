// ─── Architecture Diagram Types ──────────────────────────────────

export type ArchGroup = "api" | "application" | "domain" | "dataAccess" | "crossCutting";

export interface ArchNodeConfig {
  id: string;
  label: string;
  group: ArchGroup;
  position: { x: number; y: number };
  tooltip?: string;
  /** Renders as dashed border */
  dashed?: boolean;
}

export interface ArchEdgeConfig {
  id: string;
  source: string;
  target: string;
  label?: string;
  variant?: "primary" | "normal" | "dashed";
  color?: string;
}

export interface ArchAnnotation {
  id: string;
  label: string;
  position: { x: number; y: number };
  color?: string;
  /** "label" = faint floating text, "badge" = pill with border */
  style?: "label" | "badge";
}

export interface ArchDiagramConfig {
  eyebrow: string;
  title: string;
  subtitle?: string;
  nodes: ArchNodeConfig[];
  edges: ArchEdgeConfig[];
  annotations?: ArchAnnotation[];
}

// ─── Colors per group ────────────────────────────────────────────

export const archColors: Record<ArchGroup, { bg: string; border: string; text: string; glow: string }> = {
  api:          { bg: "#0d1b2a", border: "#1b4965", text: "#a8dadc", glow: "rgba(27,73,101,0.35)"  },
  application:  { bg: "#0b2b1a", border: "#2d6a4f", text: "#95d5b2", glow: "rgba(45,106,79,0.35)"  },
  domain:       { bg: "#1a0b2e", border: "#5a189a", text: "#c77dff", glow: "rgba(90,24,154,0.35)"  },
  dataAccess:   { bg: "#2b1a00", border: "#e76f51", text: "#f4a261", glow: "rgba(231,111,81,0.35)" },
  crossCutting: { bg: "#1a1a1a", border: "#6c757d", text: "#adb5bd", glow: "rgba(108,117,125,0.3)" },
};

export const archGroupLabels: Record<ArchGroup, string> = {
  api:          "API LAYER",
  application:  "APPLICATION LAYER",
  domain:       "DOMAIN LAYER",
  dataAccess:   "DATA ACCESS LAYER",
  crossCutting: "CROSS-CUTTING",
};

// ─── Architecture Configs by Project Slug ────────────────────────

export const architectureConfigs: Record<string, ArchDiagramConfig> = {

  // ── Real-Time Chat Platform ────────────────────────────────────
  "real-time-chat-platform": {
    eyebrow: "INTERNAL ARCHITECTURE",
    title: "Modular Monolith — Layered Service Architecture",
    subtitle: "Single Deployable Unit",
    nodes: [
      // ── API Layer ──────────────────────────────────────────────
      {
        id: "rest-controllers",
        label: "🌐  REST Controllers",
        group: "api",
        position: { x: 200, y: 30 },
        tooltip: "Express route handlers for HTTP endpoints (users, conversations, messages, uploads)",
      },
      {
        id: "ws-gateway",
        label: "⚡  WebSocket Gateway",
        group: "api",
        position: { x: 540, y: 30 },
        tooltip: "Socket.IO server handling real-time messaging, presence, and typing events",
      },

      // ── Application Layer ──────────────────────────────────────
      {
        id: "auth-service",
        label: "🔐  Auth Service",
        group: "application",
        position: { x: 30, y: 210 },
        tooltip: "Clerk webhook verification, JWT validation, and session management",
      },
      {
        id: "chat-service",
        label: "💬  Chat Service",
        group: "application",
        position: { x: 270, y: 210 },
        tooltip: "Message CRUD, cursor pagination, delivery tracking, and conversation management",
      },
      {
        id: "user-service",
        label: "👤  User Service",
        group: "application",
        position: { x: 510, y: 210 },
        tooltip: "User profile sync via Clerk webhooks, online status tracking",
      },
      {
        id: "notification-service",
        label: "🔔  Notification Service",
        group: "application",
        position: { x: 750, y: 210 },
        tooltip: "Event-driven notifications for new messages, presence changes, and typing indicators",
      },

      // ── Domain Layer ───────────────────────────────────────────
      {
        id: "entities",
        label: "📦  Entities\nUser · Message · Conversation",
        group: "domain",
        position: { x: 100, y: 400 },
        tooltip: "Core domain models with validation rules and relationship definitions",
      },
      {
        id: "business-logic",
        label: "⚙️  Business Logic\nRules · Policies",
        group: "domain",
        position: { x: 420, y: 400 },
        tooltip: "Chat-request acceptance logic, rate limit policies, message ordering guarantees",
      },
      {
        id: "domain-events",
        label: "📡  Domain Events\nEmit · Subscribe",
        group: "domain",
        position: { x: 720, y: 400 },
        tooltip: "Internal event system for decoupled cross-module communication",
      },

      // ── Data Access Layer ──────────────────────────────────────
      {
        id: "repositories",
        label: "🗄️  Repositories\nUserRepo · MessageRepo · ConvoRepo",
        group: "dataAccess",
        position: { x: 150, y: 580 },
        tooltip: "Interface-driven data access with cursor pagination and atomic transactions",
      },
      {
        id: "orm",
        label: "🔧  ORM / ODM\nMongoose + MongoDB",
        group: "dataAccess",
        position: { x: 530, y: 580 },
        tooltip: "Mongoose schemas with compound indexes, MongoDB sessions for transactions",
      },

      // ── Cross-Cutting Concerns ─────────────────────────────────
      {
        id: "middleware",
        label: "🛡️  Middleware\nAuth · Rate Limiting",
        group: "crossCutting",
        position: { x: 950, y: 60 },
        tooltip: "Express middleware chain: Clerk auth guard, Redis-backed rate limiter, CORS",
      },
      {
        id: "validation",
        label: "✅  Validation\nZod Schemas",
        group: "crossCutting",
        position: { x: 950, y: 250 },
        tooltip: "Request/response validation using Zod schemas at controller boundaries",
      },
      {
        id: "event-bus",
        label: "🔀  Event Bus\nAsync Communication",
        group: "crossCutting",
        position: { x: 950, y: 440 },
        tooltip: "In-process event emitter enabling loose coupling between service modules",
      },
    ],

    edges: [
      // ── API → Services (primary flow) ──────────────────────────
      { id: "e-rest-auth",    source: "rest-controllers", target: "auth-service",         label: "authenticate",  variant: "primary" },
      { id: "e-rest-chat",    source: "rest-controllers", target: "chat-service",         label: "messages",      variant: "primary", color: "#2d6a4f" },
      { id: "e-rest-user",    source: "rest-controllers", target: "user-service",         label: "profiles",      variant: "primary", color: "#2d6a4f" },
      { id: "e-ws-chat",      source: "ws-gateway",       target: "chat-service",         label: "real-time",     variant: "primary", color: "#2d6a4f" },
      { id: "e-ws-notify",    source: "ws-gateway",       target: "notification-service", label: "events",        variant: "primary", color: "#2d6a4f" },

      // ── Services → Domain ──────────────────────────────────────
      { id: "e-auth-entities", source: "auth-service",  target: "entities",       label: "User",          color: "#5a189a" },
      { id: "e-chat-entities", source: "chat-service",  target: "entities",       label: "Message",       color: "#5a189a" },
      { id: "e-chat-logic",    source: "chat-service",  target: "business-logic", label: "rules",         color: "#5a189a" },
      { id: "e-user-entities", source: "user-service",  target: "entities",       label: "User",          color: "#5a189a" },
      { id: "e-user-logic",    source: "user-service",  target: "business-logic", label: "policies",      color: "#5a189a" },

      // ── Domain → Data Access ───────────────────────────────────
      { id: "e-entities-repo", source: "entities",       target: "repositories", label: "persist",  color: "#e76f51" },
      { id: "e-logic-repo",    source: "business-logic", target: "repositories", label: "query",    color: "#e76f51" },
      { id: "e-repo-orm",      source: "repositories",   target: "orm",          label: "Mongoose", color: "#e76f51" },

      // ── Services → Event Bus ───────────────────────────────────
      { id: "e-chat-bus",   source: "chat-service", target: "event-bus",           label: "emit",      variant: "dashed", color: "#6c757d" },
      { id: "e-user-bus",   source: "user-service", target: "event-bus",           label: "emit",      variant: "dashed", color: "#6c757d" },
      { id: "e-bus-notify", source: "event-bus",    target: "notification-service", label: "subscribe", variant: "dashed", color: "#6c757d" },

      // ── Domain Events → Event Bus ──────────────────────────────
      { id: "e-events-bus", source: "domain-events", target: "event-bus", label: "dispatch", variant: "dashed", color: "#6c757d" },

      // ── Cross-cutting connections ──────────────────────────────
      { id: "e-mw-rest", source: "middleware",  target: "rest-controllers", label: "guard",    variant: "dashed", color: "#6c757d" },
      { id: "e-mw-ws",   source: "middleware",  target: "ws-gateway",       label: "guard",    variant: "dashed", color: "#6c757d" },
      { id: "e-val-rest", source: "validation", target: "rest-controllers", label: "validate", variant: "dashed", color: "#6c757d" },
    ],

    annotations: [
      {
        id: "ann-boundary",
        label: "── Internal Module Boundaries ──",
        position: { x: 280, y: 160 },
        color: "#ffffff15",
        style: "label",
      },
      {
        id: "ann-boundary-2",
        label: "── Internal Module Boundaries ──",
        position: { x: 280, y: 350 },
        color: "#ffffff15",
        style: "label",
      },
      {
        id: "ann-deploy",
        label: "SINGLE DEPLOYABLE UNIT",
        position: { x: 310, y: 680 },
        color: "#e5c497",
        style: "badge",
      },
    ],
  },
};
