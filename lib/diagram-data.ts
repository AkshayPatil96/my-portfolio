// ─── Diagram Configuration Types ─────────────────────────────────

export type DiagramGroup = "infra" | "app" | "data" | "external" | "cicd";

export interface DiagramNodeConfig {
  id: string;
  label: string;
  group: DiagramGroup;
  position: { x: number; y: number };
  badge?: string;
  dashed?: boolean;
  tooltip?: string;
}

export interface DiagramEdgeConfig {
  id: string;
  source: string;
  target: string;
  label?: string;
  /** 'primary' = animated glow, 'dashed' = dashed stroke, default = normal */
  variant?: "primary" | "normal" | "dashed";
  /** Override stroke color */
  color?: string;
}

export interface DiagramConfig {
  eyebrow: string;
  title: string;
  subtitle?: string;
  nodes: DiagramNodeConfig[];
  edges: DiagramEdgeConfig[];
}

// ─── Diagram Data by Project Slug ────────────────────────────────

export const diagramConfigs: Record<string, DiagramConfig> = {
  "real-time-chat-platform": {
    eyebrow: "SYSTEM ARCHITECTURE",
    title: "Real-Time Chat Infrastructure",
    subtitle: "Zero-Downtime + Failover",
    nodes: [
      // INFRASTRUCTURE
      {
        id: "users",
        label: "👤  Users",
        group: "infra",
        position: { x: 0, y: 190 },
        tooltip: "Client browsers connecting over HTTPS",
      },
      {
        id: "nginx",
        label: "⚡  Nginx\nReverse Proxy + Load Balancer\n(Failover Enabled)",
        group: "infra",
        position: { x: 280, y: 165 },
        badge: "Automatic Failover",
        tooltip: "Handles HTTPS, routing, load balancing, and failover",
      },

      // APPLICATION
      {
        id: "api-blue",
        label: "🐳  api-blue\n(Docker)",
        group: "app",
        position: { x: 580, y: 80 },
        tooltip: "Stateless backend instance running in blue-green deployment",
      },
      {
        id: "api-green",
        label: "🐳  api-green\n(Docker)",
        group: "app",
        position: { x: 580, y: 280 },
        tooltip: "Stateless backend instance running in blue-green deployment",
      },

      // DATA LAYER
      {
        id: "mongodb",
        label: "🗄️  MongoDB",
        group: "data",
        position: { x: 880, y: 80 },
        tooltip: "Stores messages and conversations with cursor-based pagination",
      },
      {
        id: "redis",
        label: "⚡  Redis",
        group: "data",
        position: { x: 880, y: 280 },
        tooltip: "Handles presence tracking and rate limiting",
      },

      // EXTERNAL SERVICES
      {
        id: "s3",
        label: "☁️  S3\n(Presigned Uploads)",
        group: "external",
        position: { x: 1140, y: 80 },
        tooltip: "Handles file uploads using presigned URLs",
      },
      {
        id: "clerk",
        label: "🔐  Clerk Auth",
        group: "external",
        position: { x: 1140, y: 280 },
        tooltip: "Authentication provider with webhook-based user sync",
      },

      // CI/CD
      {
        id: "github-actions",
        label: "⚙️  GitHub Actions\nCI/CD",
        group: "cicd",
        position: { x: 0, y: 400 },
        tooltip: "CI/CD pipeline deploying via SSH",
      },

      // HEALTH MONITOR
      {
        id: "health-monitor",
        label: "🩺  Health Monitor\nsystemd + script",
        group: "infra",
        position: { x: 580, y: 440 },
        dashed: true,
        tooltip: "Continuously checks container health and restarts unhealthy instances",
      },
    ],
    edges: [
      // Primary request flow (highlighted)
      { id: "e-users-nginx", source: "users", target: "nginx", label: "HTTPS", variant: "primary" },
      { id: "e-nginx-blue", source: "nginx", target: "api-blue", variant: "primary", color: "#3a86a8" },
      { id: "e-nginx-green", source: "nginx", target: "api-green", variant: "primary", color: "#40916c" },
      { id: "e-blue-mongo", source: "api-blue", target: "mongodb", label: "messages", variant: "primary", color: "#c77dff" },
      { id: "e-green-mongo", source: "api-green", target: "mongodb", label: "messages", variant: "primary", color: "#c77dff" },

      // API → Redis
      { id: "e-blue-redis", source: "api-blue", target: "redis", label: "presence / rate limiting", color: "#5a189a" },
      { id: "e-green-redis", source: "api-green", target: "redis", label: "presence / rate limiting", color: "#5a189a" },

      // API → S3
      { id: "e-blue-s3", source: "api-blue", target: "s3", label: "presigned uploads", color: "#e76f51" },

      // Clerk → API (webhook)
      { id: "e-clerk-api", source: "clerk", target: "api-green", label: "webhooks", color: "#e76f51" },

      // GitHub Actions → Nginx (deploy)
      { id: "e-gh-nginx", source: "github-actions", target: "nginx", label: "SSH Deploy", variant: "dashed", color: "#6c757d" },

      // Health Monitor → API containers
      { id: "e-health-blue", source: "health-monitor", target: "api-blue", label: "health check", variant: "dashed", color: "#1b4965" },
      { id: "e-health-green", source: "health-monitor", target: "api-green", label: "health check", variant: "dashed", color: "#1b4965" },
    ],
  },

  // ─── Healthcare Analytics ──────────────────────────────────────
  "healthcare-analytics": {
    eyebrow: "SYSTEM ARCHITECTURE",
    title: "Healthcare Data Pipeline",
    subtitle: "ETL + Real-Time Scoring",
    nodes: [
      // INFRASTRUCTURE
      {
        id: "emr-sources",
        label: "🏥  EMR Sources\n(12 Systems)",
        group: "infra",
        position: { x: 0, y: 80 },
        tooltip: "HL7/FHIR data from multiple Electronic Medical Record systems",
      },
      {
        id: "api-gateway",
        label: "🔀  API Gateway\n(Rate Limited)",
        group: "infra",
        position: { x: 0, y: 280 },
        tooltip: "HIPAA-compliant ingestion endpoint with rate limiting",
      },

      // APPLICATION
      {
        id: "etl-processor",
        label: "⚙️  ETL Processor\nNode.js Streams",
        group: "app",
        position: { x: 300, y: 80 },
        tooltip: "Stream processor normalizing HL7/FHIR data into unified schema",
      },
      {
        id: "scoring-engine",
        label: "📊  Scoring Engine\n(40+ Variables)",
        group: "app",
        position: { x: 300, y: 280 },
        tooltip: "Weighted risk scoring algorithm processing clinical variables",
      },
      {
        id: "dashboard-api",
        label: "🖥️  Dashboard API\nExpress + RBAC",
        group: "app",
        position: { x: 600, y: 180 },
        tooltip: "REST API with role-based access controls and audit logging",
      },

      // DATA LAYER
      {
        id: "mongodb",
        label: "🗄️  MongoDB\nGeospatial Indexes",
        group: "data",
        position: { x: 900, y: 80 },
        tooltip: "Patient data with geospatial queries for county-level aggregation",
      },
      {
        id: "encryption-layer",
        label: "🔐  AES-256\nEncryption at Rest",
        group: "data",
        position: { x: 900, y: 280 },
        tooltip: "PHI data encrypted at rest with full audit trails",
      },

      // EXTERNAL
      {
        id: "react-dashboard",
        label: "📈  React Dashboard\nD3.js Choropleth",
        group: "external",
        position: { x: 1200, y: 80 },
        tooltip: "Real-time geo scoring visualization with county-level maps",
      },
      {
        id: "audit-log",
        label: "📋  Audit Trail\nCompliance Log",
        group: "external",
        position: { x: 1200, y: 280 },
        tooltip: "HIPAA-required audit logging for all data access events",
      },

      // CI/CD
      {
        id: "aws-services",
        label: "☁️  AWS\nECS + CloudWatch",
        group: "cicd",
        position: { x: 600, y: 400 },
        tooltip: "Managed container orchestration with monitoring and alerts",
      },
    ],
    edges: [
      // Primary flow: EMR → ETL → MongoDB → Dashboard
      { id: "e-emr-etl", source: "emr-sources", target: "etl-processor", label: "HL7/FHIR", variant: "primary" },
      { id: "e-etl-mongo", source: "etl-processor", target: "mongodb", label: "normalized data", variant: "primary", color: "#c77dff" },
      { id: "e-api-dashboard", source: "dashboard-api", target: "react-dashboard", label: "REST + WS", variant: "primary", color: "#f4a261" },

      // Gateway → Scoring
      { id: "e-gateway-scoring", source: "api-gateway", target: "scoring-engine", label: "lab results", color: "#2d6a4f" },
      { id: "e-scoring-mongo", source: "scoring-engine", target: "mongodb", label: "risk scores", color: "#5a189a" },

      // Dashboard API connections
      { id: "e-mongo-dashapi", source: "mongodb", target: "dashboard-api", label: "aggregation queries", color: "#5a189a" },
      { id: "e-dashapi-audit", source: "dashboard-api", target: "audit-log", label: "access logs", color: "#e76f51" },

      // Encryption
      { id: "e-mongo-encrypt", source: "mongodb", target: "encryption-layer", label: "PHI storage", variant: "dashed", color: "#5a189a" },

      // AWS monitoring
      { id: "e-aws-etl", source: "aws-services", target: "etl-processor", label: "orchestration", variant: "dashed", color: "#6c757d" },
      { id: "e-aws-scoring", source: "aws-services", target: "scoring-engine", label: "monitoring", variant: "dashed", color: "#6c757d" },
    ],
  },

  // ─── Student Onboarding ────────────────────────────────────────
  "student-onboarding": {
    eyebrow: "SYSTEM ARCHITECTURE",
    title: "Student Onboarding System",
    subtitle: "Approval-Gated Registration",
    nodes: [
      // INFRASTRUCTURE
      {
        id: "student",
        label: "🎓  Student\nBrowser",
        group: "infra",
        position: { x: 0, y: 180 },
        tooltip: "Student accessing the registration portal",
      },
      {
        id: "admin",
        label: "👨‍💼  Admin / Reviewer\nBrowser",
        group: "infra",
        position: { x: 0, y: 380 },
        tooltip: "Admins and reviewers managing applications",
      },

      // APPLICATION
      {
        id: "nextjs-app",
        label: "⚡  Next.js App\nApp Router + RSC",
        group: "app",
        position: { x: 300, y: 80 },
        tooltip: "Server-rendered Next.js application with React Server Components",
      },
      {
        id: "auth-module",
        label: "🔐  Auth Module\nRBAC Middleware",
        group: "app",
        position: { x: 300, y: 260 },
        tooltip: "Role-based access control supporting student, reviewer, and admin roles",
      },
      {
        id: "workflow-engine",
        label: "🔄  Workflow Engine\nState Machine",
        group: "app",
        position: { x: 300, y: 440 },
        tooltip: "State-machine tracking applications from submission through approval",
      },

      // DATA LAYER
      {
        id: "prisma",
        label: "💎  Prisma ORM\nPostgreSQL",
        group: "data",
        position: { x: 620, y: 180 },
        tooltip: "Normalized schema with Users, Applications, Documents, ReviewLogs",
      },
      {
        id: "s3-docs",
        label: "📁  S3\nDocument Storage",
        group: "data",
        position: { x: 620, y: 380 },
        tooltip: "Secure file uploads with presigned URLs and virus scanning",
      },

      // EXTERNAL
      {
        id: "ses",
        label: "📧  AWS SES\nEmail Notifications",
        group: "external",
        position: { x: 920, y: 180 },
        tooltip: "Event-driven emails triggered at each workflow state transition",
      },
      {
        id: "virus-scan",
        label: "🛡️  Virus Scanner\nMiddleware",
        group: "external",
        position: { x: 920, y: 380 },
        tooltip: "Scans uploaded documents before storage",
      },
    ],
    edges: [
      // Primary flow: Student → App → Prisma → SES
      { id: "e-student-app", source: "student", target: "nextjs-app", label: "registration", variant: "primary" },
      { id: "e-app-prisma", source: "nextjs-app", target: "prisma", label: "CRUD", variant: "primary", color: "#c77dff" },
      { id: "e-prisma-ses", source: "prisma", target: "ses", label: "state changes", variant: "primary", color: "#f4a261" },

      // Admin flow
      { id: "e-admin-app", source: "admin", target: "nextjs-app", label: "review panel", color: "#1b4965" },
      { id: "e-app-auth", source: "nextjs-app", target: "auth-module", label: "guard", color: "#2d6a4f" },
      { id: "e-auth-workflow", source: "auth-module", target: "workflow-engine", label: "authorized", color: "#2d6a4f" },
      { id: "e-workflow-prisma", source: "workflow-engine", target: "prisma", label: "state update", color: "#5a189a" },

      // Document upload
      { id: "e-app-s3", source: "nextjs-app", target: "s3-docs", label: "uploads", color: "#e76f51" },
      { id: "e-s3-virus", source: "s3-docs", target: "virus-scan", label: "scan", variant: "dashed", color: "#e76f51" },
    ],
  },

  // ─── HookWriter MVP ───────────────────────────────────────────
  "hookwriter-mvp": {
    eyebrow: "SYSTEM ARCHITECTURE",
    title: "HookWriter AI Pipeline",
    subtitle: "LLM-Powered Content Generation",
    nodes: [
      // INFRASTRUCTURE
      {
        id: "creator",
        label: "✍️  Creator\nBrowser",
        group: "infra",
        position: { x: 0, y: 190 },
        tooltip: "Content creators accessing the hook generation tool",
      },

      // APPLICATION
      {
        id: "nextjs-app",
        label: "⚡  Next.js App\nApp Router",
        group: "app",
        position: { x: 280, y: 80 },
        tooltip: "Frontend application with server actions for LLM orchestration",
      },
      {
        id: "authjs",
        label: "🔐  Auth.js\nDual OTP Provider",
        group: "app",
        position: { x: 280, y: 300 },
        tooltip: "Custom Credentials provider supporting email and phone OTP",
      },
      {
        id: "prompt-engine",
        label: "🧠  Prompt Engine\nTemplate System",
        group: "app",
        position: { x: 560, y: 80 },
        tooltip: "Platform-specific prompt templates with tone, length, and CTA constraints",
      },
      {
        id: "quality-scorer",
        label: "📏  Quality Scorer\n+ Retry Layer",
        group: "app",
        position: { x: 560, y: 300 },
        tooltip: "Evaluates LLM output quality and retries if below threshold",
      },

      // EXTERNAL
      {
        id: "llm-api",
        label: "🤖  LLM API\n(OpenAI / Claude)",
        group: "external",
        position: { x: 860, y: 80 },
        tooltip: "Large Language Model API for hook generation",
      },
      {
        id: "otp-service",
        label: "📱  OTP Service\nEmail + SMS",
        group: "external",
        position: { x: 860, y: 300 },
        tooltip: "Sends OTP codes via email and SMS for passwordless authentication",
      },

      // DATA LAYER
      {
        id: "db",
        label: "🗄️  Database\nUsers + History",
        group: "data",
        position: { x: 560, y: 480 },
        tooltip: "Stores user profiles, generation history, and token usage",
      },
      {
        id: "cache",
        label: "⚡  Redis Cache\nPrompt Dedup",
        group: "data",
        position: { x: 860, y: 480 },
        tooltip: "Caches similar prompt results to reduce LLM API costs",
      },

      // CI/CD
      {
        id: "metering",
        label: "📊  Token Metering\nUsage Limits",
        group: "cicd",
        position: { x: 0, y: 420 },
        tooltip: "Real-time token counting and rate limiting per user tier",
      },
    ],
    edges: [
      // Primary flow: Creator → App → Prompt → LLM
      { id: "e-creator-app", source: "creator", target: "nextjs-app", label: "generate hook", variant: "primary" },
      { id: "e-app-prompt", source: "nextjs-app", target: "prompt-engine", label: "platform + tone", variant: "primary", color: "#2d6a4f" },
      { id: "e-prompt-llm", source: "prompt-engine", target: "llm-api", label: "completion request", variant: "primary", color: "#f4a261" },

      // Quality check
      { id: "e-llm-scorer", source: "llm-api", target: "quality-scorer", label: "raw output", color: "#e76f51" },
      { id: "e-scorer-app", source: "quality-scorer", target: "nextjs-app", label: "validated hook", color: "#2d6a4f" },

      // Auth flow
      { id: "e-app-auth", source: "nextjs-app", target: "authjs", label: "session", color: "#1b4965" },
      { id: "e-auth-otp", source: "authjs", target: "otp-service", label: "send OTP", color: "#e76f51" },

      // Data
      { id: "e-app-db", source: "nextjs-app", target: "db", label: "history + usage", color: "#5a189a" },
      { id: "e-prompt-cache", source: "prompt-engine", target: "cache", label: "cache lookup", variant: "dashed", color: "#5a189a" },

      // Metering
      { id: "e-metering-app", source: "metering", target: "nextjs-app", label: "usage check", variant: "dashed", color: "#6c757d" },
      { id: "e-metering-db", source: "metering", target: "db", label: "token counts", variant: "dashed", color: "#6c757d" },
    ],
  },

  // ─── E-Commerce Platform ──────────────────────────────────────
  "e-commerce-platform": {
    eyebrow: "SYSTEM ARCHITECTURE",
    title: "E-Commerce Platform",
    subtitle: "Dual Payment Gateway + Inventory",
    nodes: [
      // INFRASTRUCTURE
      {
        id: "buyer",
        label: "🛒  Buyer\nBrowser",
        group: "infra",
        position: { x: 0, y: 80 },
        tooltip: "Customers browsing products and checking out",
      },
      {
        id: "admin-user",
        label: "👨‍💼  Admin\nDashboard",
        group: "infra",
        position: { x: 0, y: 320 },
        tooltip: "Admin panel for order management and product operations",
      },

      // APPLICATION
      {
        id: "react-spa",
        label: "⚛️  React SPA\nRTK Query",
        group: "app",
        position: { x: 300, y: 80 },
        tooltip: "Single-page app with optimistic cache updates via Redux RTK Query",
      },
      {
        id: "express-api",
        label: "🚀  Express API\nHTTP-Only Cookies",
        group: "app",
        position: { x: 300, y: 290 },
        tooltip: "REST API with secure cookie auth and refresh token rotation",
      },
      {
        id: "checkout-service",
        label: "💳  Checkout Service\nGateway Abstraction",
        group: "app",
        position: { x: 600, y: 80 },
        tooltip: "Unified checkout flow with currency-based payment routing",
      },

      // EXTERNAL
      {
        id: "stripe",
        label: "💰  Stripe\n(International)",
        group: "external",
        position: { x: 920, y: 30 },
        tooltip: "International payment processing with webhook confirmations",
      },
      {
        id: "razorpay",
        label: "💰  Razorpay\n(India)",
        group: "external",
        position: { x: 920, y: 180 },
        tooltip: "Indian payment processing with UPI support",
      },

      // DATA
      {
        id: "mongodb",
        label: "🗄️  MongoDB\nProducts + Orders",
        group: "data",
        position: { x: 600, y: 290 },
        tooltip: "Product catalog, orders, wishlists, and user data",
      },
      {
        id: "redis",
        label: "⚡  Redis\nInventory Locks",
        group: "data",
        position: { x: 600, y: 460 },
        tooltip: "Inventory reservations with auto-expiry on abandoned carts",
      },

      // CI/CD
      {
        id: "reconciliation",
        label: "🔄  Reconciliation\nCron Job (5min)",
        group: "cicd",
        position: { x: 920, y: 380 },
        tooltip: "Periodic job reconciling payment gateway state with order database",
      },
      {
        id: "webhooks",
        label: "📡  Payment Webhooks\nStripe + Razorpay",
        group: "cicd",
        position: { x: 920, y: 530 },
        tooltip: "Webhook handlers confirming payment state transitions",
      },
    ],
    edges: [
      // Primary flow: Buyer → React → Checkout → Stripe/Razorpay
      { id: "e-buyer-react", source: "buyer", target: "react-spa", label: "browse + cart", variant: "primary" },
      { id: "e-react-checkout", source: "react-spa", target: "checkout-service", label: "checkout", variant: "primary", color: "#2d6a4f" },
      { id: "e-checkout-stripe", source: "checkout-service", target: "stripe", label: "USD/EUR", variant: "primary", color: "#f4a261" },
      { id: "e-checkout-razorpay", source: "checkout-service", target: "razorpay", label: "INR/UPI", variant: "primary", color: "#f4a261" },

      // API connections
      { id: "e-react-api", source: "react-spa", target: "express-api", label: "RTK Query", color: "#2d6a4f" },
      { id: "e-admin-api", source: "admin-user", target: "express-api", label: "admin CRUD", color: "#1b4965" },
      { id: "e-api-mongo", source: "express-api", target: "mongodb", label: "products/orders", color: "#5a189a" },

      // Inventory locks
      { id: "e-checkout-redis", source: "checkout-service", target: "redis", label: "reserve stock", color: "#5a189a" },
      { id: "e-redis-mongo", source: "redis", target: "mongodb", label: "lock sync", variant: "dashed", color: "#5a189a" },

      // Webhooks & reconciliation
      { id: "e-stripe-webhook", source: "stripe", target: "webhooks", label: "payment events", variant: "dashed", color: "#e76f51" },
      { id: "e-razorpay-webhook", source: "razorpay", target: "webhooks", label: "payment events", variant: "dashed", color: "#e76f51" },
      { id: "e-webhook-api", source: "webhooks", target: "express-api", label: "confirm order", color: "#6c757d" },
      { id: "e-recon-mongo", source: "reconciliation", target: "mongodb", label: "fix mismatches", variant: "dashed", color: "#6c757d" },
    ],
  },

  // ─── Design System UI ─────────────────────────────────────────
  "design-system-ui": {
    eyebrow: "SYSTEM ARCHITECTURE",
    title: "Design System Pipeline",
    subtitle: "Figma → Code Token Sync",
    nodes: [
      // EXTERNAL (Design sources)
      {
        id: "figma",
        label: "🎨  Figma\nDesign Tokens",
        group: "external",
        position: { x: 0, y: 80 },
        tooltip: "Source of truth for design tokens (colors, spacing, typography)",
      },
      {
        id: "designers",
        label: "👩‍🎨  Designers\nFigma Publish",
        group: "external",
        position: { x: 0, y: 300 },
        tooltip: "Designers publishing token updates in Figma",
      },

      // CI/CD (Pipeline)
      {
        id: "github-actions",
        label: "⚙️  GitHub Actions\nToken Sync CI",
        group: "cicd",
        position: { x: 300, y: 80 },
        tooltip: "Workflow triggered on Figma publish events to sync tokens",
      },
      {
        id: "style-dictionary",
        label: "📖  Style Dictionary\nTransform Layer",
        group: "cicd",
        position: { x: 300, y: 300 },
        tooltip: "Transforms Figma tokens into CSS vars, Tailwind config, and RN styles",
      },

      // APPLICATION
      {
        id: "component-lib",
        label: "📦  Component Library\nReact + TypeScript",
        group: "app",
        position: { x: 620, y: 80 },
        tooltip: "60+ components with token-driven theming and GSAP animations",
      },
      {
        id: "storybook",
        label: "📚  Storybook\nInteractive Docs",
        group: "app",
        position: { x: 620, y: 300 },
        tooltip: "Live documentation with controls, a11y audits, and prop tables",
      },
      {
        id: "gsap-hooks",
        label: "✨  GSAP Hooks\nMotion Primitives",
        group: "app",
        position: { x: 620, y: 480 },
        tooltip: "Reusable animation hooks: fade, slide, spring for consistent motion",
      },

      // DATA (Outputs)
      {
        id: "css-vars",
        label: "🎯  CSS Variables\nRuntime Theming",
        group: "data",
        position: { x: 940, y: 30 },
        tooltip: "CSS custom properties enabling runtime theme switching with zero JS",
      },
      {
        id: "tailwind-cfg",
        label: "🌀  Tailwind Config\nGenerated Tokens",
        group: "data",
        position: { x: 940, y: 190 },
        tooltip: "Auto-generated Tailwind config from design tokens",
      },
      {
        id: "a11y-reports",
        label: "♿  A11y Reports\nWCAG 2.1 AA",
        group: "data",
        position: { x: 940, y: 370 },
        tooltip: "Automated accessibility audits running on every component story",
      },

      // INFRA
      {
        id: "npm-registry",
        label: "📦  npm Registry\nPublished Package",
        group: "infra",
        position: { x: 940, y: 530 },
        tooltip: "Published component library consumable by downstream projects",
      },
    ],
    edges: [
      // Primary flow: Figma → GH Actions → Style Dictionary → Components
      { id: "e-figma-gh", source: "figma", target: "github-actions", label: "publish event", variant: "primary" },
      { id: "e-gh-sd", source: "github-actions", target: "style-dictionary", label: "extract tokens", variant: "primary", color: "#adb5bd" },
      { id: "e-sd-lib", source: "style-dictionary", target: "component-lib", label: "transformed tokens", variant: "primary", color: "#2d6a4f" },

      // Token outputs
      { id: "e-sd-css", source: "style-dictionary", target: "css-vars", label: "CSS vars", color: "#5a189a" },
      { id: "e-sd-tw", source: "style-dictionary", target: "tailwind-cfg", label: "TW config", color: "#5a189a" },

      // Designer workflow
      { id: "e-designer-figma", source: "designers", target: "figma", label: "token updates", color: "#e76f51" },

      // Component lib connections
      { id: "e-lib-storybook", source: "component-lib", target: "storybook", label: "stories", color: "#2d6a4f" },
      { id: "e-lib-gsap", source: "component-lib", target: "gsap-hooks", label: "motion", color: "#2d6a4f" },
      { id: "e-storybook-a11y", source: "storybook", target: "a11y-reports", label: "audit", color: "#5a189a" },

      // Publishing
      { id: "e-lib-npm", source: "component-lib", target: "npm-registry", label: "publish", variant: "dashed", color: "#1b4965" },
      { id: "e-gh-npm", source: "github-actions", target: "npm-registry", label: "CI release", variant: "dashed", color: "#6c757d" },
    ],
  },
};
