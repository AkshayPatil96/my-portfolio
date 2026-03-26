export type ProjectVariant = "clip" | "tilt" | "glitch" | "neon" | "tiltneon";

export interface DeepDiveCard {
  icon: string;
  title: string;
  description: string;
}

export interface EngineeringSolution {
  icon: string;
  title: string;
  description: string;
}

export interface HardPartItem {
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface CaseStudy {
  number: string;
  heroDescription: string;
  liveUrl?: string;
  githubUrl?: string;
  screenshots: string[];
  challenge: {
    eyebrow: string;
    title: string;
    description: string;
  };
  engineeringResponse: {
    eyebrow: string;
    title: string;
    solutions: EngineeringSolution[];
  };
  architectureImage?: string;
  architectureCaption?: string;
  deepDive: {
    eyebrow: string;
    cards: DeepDiveCard[];
  };
  hardParts: {
    eyebrow: string;
    title: string;
    items: HardPartItem[];
    stats: Stat[];
  };
  retrospective: {
    eyebrow: string;
    quote: string;
    closing: string;
  };
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  impact?: string;
  image: string;
  tags: string[];
  variant: ProjectVariant;
  caseStudy?: CaseStudy;
}

export interface RoleProgression {
  title: string;
  duration?: string;
  points: string[];
}

export interface Experience {
  id: number;
  period: string;
  label: string;
  title: string;
  company: string;
  tags: string[];
  isCurrent: boolean;
  details?: string[];
  progression?: RoleProgression[];
}

export interface Skill {
  name: string;
  value: number;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Real-Time Chat Platform",
    slug: "real-time-chat-platform",
    description:
      "Built a production-grade real-time chat system with WebSocket-based messaging, presence tracking, and media sharing. Designed scalable backend architecture with modular services, Redis-based rate limiting, and optimized data flows for real-time performance.",
    impact:
      "Handles real-time messaging with delivery states, typing indicators, and O(1) pagination for large conversation datasets.",
    image: "/assets/images/real-chat-preview.png",
    tags: ["Socket.IO", "Redis", "PostgreSQL", "Next.js", "Node.js"],
    variant: "tiltneon",
    caseStudy: {
      number: "01",
      heroDescription:
        "Production-grade messaging system with real-time sync, presence tracking, and scalable architecture.",
      liveUrl: "#",
      githubUrl: "#",
      screenshots: [
        "https://placehold.co/560x380/1a1a1a/e5c497?text=Redis+Tracker",
        "https://placehold.co/560x380/1a1a1a/e5c497?text=Chat+Message+Analytics",
      ],
      challenge: {
        eyebrow: "THE CHALLENGE",
        title: "Scaling the Conversational Flow",
        description:
          "The primary bottleneck in building high-concurrency chat systems isn't just delivering a message — it's ensuring absolute consistency across distributed nodes. Legacy systems often struggle with message ordering during network partitions, race conditions in presence tracking, and the \"thundering herd\" problem during peak user activity.",
      },
      engineeringResponse: {
        eyebrow: "ENGINEERING RESPONSE",
        title: "Architectural Equilibrium",
        solutions: [
          {
            icon: "wifi",
            title: "WebSocket Chatter with Redis Pub/Sub",
            description:
              "Enabled horizontal scaling of socket servers by using Redis as a shared message broker, ensuring cross-instance synchronization.",
          },
          {
            icon: "view_list",
            title: "Cursor-Based Pagination",
            description:
              "Implemented created-at and id-based pagination to prevent duplicate message rendering and heavy database offsets during scroll-back.",
          },
          {
            icon: "hub",
            title: "Modular Presence Service",
            description:
              "Decoupled presence logic into a dedicated Redis-backed micro-service to handle heartbeat signals without saturating the main API.",
          },
        ],
      },
      architectureImage:
        "https://placehold.co/800x300/131313/e5c497?text=System+Architecture+Abstract",
      architectureCaption: "SYSTEM ARCHITECTURE ABSTRACT",
      deepDive: {
        eyebrow: "DEEP DIVE",
        cards: [
          {
            icon: "bolt",
            title: "Why Redis?",
            description:
              "To maintain sub-50ms latency for presence tracking and message delivery across global regions, an in-memory store was non-negotiable. Redis's native Pub/Sub and sorted-set handling fit high-velocity data better than any traditional RDBMS.",
          },
          {
            icon: "grid_view",
            title: "Cursor Pagination",
            description:
              "Unlike offset-based systems, cursor pagination preserves performance as the message history grows into millions. It provides a stable \"snapshot\" of the list, preventing UI flickers when new messages arrive during historical fetch.",
          },
          {
            icon: "cloud",
            title: "Socket.IO Utility",
            description:
              "While raw WebSockets are lean, Socket.IO provides critical fallbacks (HTTP long-polling), automatic reconnection logic, and room/namespace abstractions that accelerated the development of concurrent group-chat features.",
          },
        ],
      },
      hardParts: {
        eyebrow: "THE HARD PARTS",
        title: "Navigating Friction",
        items: [
          {
            title: "Multi-Device Presence",
            description:
              "Syncing \"Online\" status across multiple tabs and mobile apps without triggering state-change floods. Solved using a debounced TTL (Time-To-Live) strategy in Redis.",
          },
          {
            title: "Message Deduplication",
            description:
              "Handling network retries from the client-side that might result in double messages. Implemented client-side UUID generation and server-side idempotency checks.",
          },
        ],
        stats: [
          { value: "99.9%", label: "MESSAGE UPTIME" },
          { value: "<40ms", label: "DELIVERY LATENCY" },
          { value: "10k+", label: "CONCURRENT SOCKETS" },
          { value: "Zero", label: "ORDERING DRIFTS" },
        ],
      },
      retrospective: {
        eyebrow: "RETROSPECTIVE",
        quote: "Design for Failure, Build for Scale.",
        closing:
          "The biggest takeaway was the shift from \"how do I make this work\" to \"how does this system fail gracefully.\" Real-time engineering taught me that synchronization is more about handling disconnected states and eventual consistency than just fast pipelines.",
      },
    },
  },
  {
    id: 2,
    title: "Healthcare Analytics",
    slug: "healthcare-analytics",
    description:
      "Predictive patient data modeling with county-level geo scoring and real-time trend visualization.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAX9CqJ-LuDcNVkRDHTjdopfv_KE0fGm5zq9zCkY_Pa7q-azHrc8_IyMMXbiFj5I_1ufFPtZdxmf7KKD5UTJB29gWJBf6prOKWp_UaVsLek4DwWxBXJHKhIDp4QLG6ljnvNWZ6An7Av9PoYCAlLytLXLXfOstBiTrZxUpBYmBVOiRW-TQ2IIuM2vt9m8AyQWzZz4eKIk77cbuW9TeYnqVqE_8u2iLu_EbrPlSPtCLmvCPEuz2xk366sB28s-j3wq3dRjxJqrpZM0GaC",
    tags: ["React", "Node.js", "MongoDB", "AWS"],
    variant: "tiltneon",
    caseStudy: {
      number: "02",
      heroDescription:
        "Predictive patient data modeling platform with county-level geo scoring, real-time trend visualization, and HIPAA-compliant data pipelines.",
      liveUrl: "#",
      githubUrl: "#",
      screenshots: [
        "https://placehold.co/560x380/1a1a1a/e5c497?text=Patient+Dashboard",
        "https://placehold.co/560x380/1a1a1a/e5c497?text=Geo+Scoring+Map",
      ],
      challenge: {
        eyebrow: "THE CHALLENGE",
        title: "Modeling Health at Scale",
        description:
          "Healthcare data is messy, inconsistent, and highly regulated. The challenge was building a system that could ingest data from multiple EMR sources, normalize it in real time, and surface actionable insights without violating HIPAA compliance boundaries.",
      },
      engineeringResponse: {
        eyebrow: "ENGINEERING RESPONSE",
        title: "Data Pipeline Architecture",
        solutions: [
          {
            icon: "analytics",
            title: "ETL Pipeline with Stream Processing",
            description:
              "Built a Node.js stream processor that normalizes incoming HL7/FHIR data into a unified schema, enabling real-time dashboard updates.",
          },
          {
            icon: "map",
            title: "County-Level Geo Scoring",
            description:
              "Aggregated patient outcomes by geographic region using MongoDB geospatial queries and D3.js choropleth maps.",
          },
          {
            icon: "lock",
            title: "HIPAA-Compliant Storage Layer",
            description:
              "Encrypted data at rest with AES-256, implemented role-based access controls, and maintained full audit trails.",
          },
        ],
      },
      architectureImage:
        "https://placehold.co/800x300/131313/e5c497?text=Healthcare+Data+Pipeline",
      architectureCaption: "DATA PIPELINE OVERVIEW",
      deepDive: {
        eyebrow: "DEEP DIVE",
        cards: [
          {
            icon: "speed",
            title: "Real-Time Scoring",
            description:
              "Patient risk scores update within seconds of new lab results arriving, using a weighted algorithm that factors in 40+ clinical variables.",
          },
          {
            icon: "storage",
            title: "MongoDB Aggregation",
            description:
              "Complex aggregation pipelines handle millions of records efficiently, producing county-level summaries without pre-computation.",
          },
          {
            icon: "security",
            title: "Compliance First",
            description:
              "Every API endpoint enforces role-based access. PHI data never leaves encrypted boundaries, and all queries are audit-logged.",
          },
        ],
      },
      hardParts: {
        eyebrow: "THE HARD PARTS",
        title: "Healthcare Complexity",
        items: [
          {
            title: "Data Normalization",
            description:
              "Ingesting data from 12 different EMR systems, each with its own schema and terminology. Built a mapping layer that handles inconsistencies gracefully.",
          },
          {
            title: "Latency vs. Accuracy",
            description:
              "Balancing real-time dashboard updates with the need for accurate, validated data. Implemented a two-phase commit: show preliminary, then confirm.",
          },
        ],
        stats: [
          { value: "2.4M", label: "RECORDS PROCESSED" },
          { value: "<2s", label: "SCORE REFRESH" },
          { value: "40+", label: "CLINICAL VARIABLES" },
          { value: "100%", label: "HIPAA COMPLIANT" },
        ],
      },
      retrospective: {
        eyebrow: "RETROSPECTIVE",
        quote: "Data Without Context Is Just Noise.",
        closing:
          "This project taught me that the hardest part of analytics isn't the math — it's understanding the domain deeply enough to ask the right questions. Working with healthcare professionals reshaped how I think about user-centered data design.",
      },
    },
  },
  {
    id: 3,
    title: "Student Onboarding",
    slug: "student-onboarding",
    description:
      "Approval-gated registration with Prisma, TypeScript, and a three-module auth/profile architecture.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5IZBXgUg26edZRHt0-5qJgCzdQDg5-6x4EFt3RSM0IXK0uIHTgsoH7X69llMoyXHtM4vk_6RwjBlO0xrcG3bqoBTND9zs8cUwmViHsJ_rBnBF8aZSjcouatazQiNf7J7v7anpJoqt2W3c9rmx4UuibbvXx04P7lTXKPozxnZ0veB4vlRQE_ApIXBP7c9zx3qrJfpBzrPos4FLxToVjXL8w4siyk89sePqohtRAfgBknlxy_Vf4VPXqaw-G_oeghtzqzEAqJE0pqTE",
    tags: ["Next.js", "TypeScript", "Prisma"],
    variant: "tiltneon",
    caseStudy: {
      number: "03",
      heroDescription:
        "Approval-gated student registration system with a three-module architecture for auth, profile management, and admin review workflows.",
      liveUrl: "#",
      githubUrl: "#",
      screenshots: [
        "https://placehold.co/560x380/1a1a1a/e5c497?text=Registration+Form",
        "https://placehold.co/560x380/1a1a1a/e5c497?text=Admin+Dashboard",
      ],
      challenge: {
        eyebrow: "THE CHALLENGE",
        title: "Taming the Registration Maze",
        description:
          "Building a registration system that supports multi-step approval workflows, document uploads, and role-based dashboards — all while keeping the student experience simple and frustration-free.",
      },
      engineeringResponse: {
        eyebrow: "ENGINEERING RESPONSE",
        title: "Modular Auth Architecture",
        solutions: [
          {
            icon: "person_add",
            title: "Three-Module Auth System",
            description:
              "Separated registration, profile completion, and admin approval into independent modules with shared state via Prisma.",
          },
          {
            icon: "verified_user",
            title: "Role-Based Access Control",
            description:
              "Implemented granular RBAC using middleware guards, supporting student, reviewer, and admin roles with distinct permissions.",
          },
          {
            icon: "fact_check",
            title: "Approval Workflow Engine",
            description:
              "Built a state-machine-based workflow that tracks each application from submission through review to final approval or rejection.",
          },
        ],
      },
      architectureImage:
        "https://placehold.co/800x300/131313/e5c497?text=Onboarding+Flow+Diagram",
      architectureCaption: "ONBOARDING FLOW ARCHITECTURE",
      deepDive: {
        eyebrow: "DEEP DIVE",
        cards: [
          {
            icon: "schema",
            title: "Prisma Schema Design",
            description:
              "Designed a normalized schema with relations between Users, Applications, Documents, and ReviewLogs — enabling efficient queries across the approval pipeline.",
          },
          {
            icon: "upload_file",
            title: "Document Pipeline",
            description:
              "Secure file uploads with S3 presigned URLs, virus scanning middleware, and automatic thumbnail generation for review panels.",
          },
          {
            icon: "mail",
            title: "Notification System",
            description:
              "Event-driven emails via SES triggered at each state transition, keeping students informed without polling the dashboard.",
          },
        ],
      },
      hardParts: {
        eyebrow: "THE HARD PARTS",
        title: "Workflow Edge Cases",
        items: [
          {
            title: "Partial Submissions",
            description:
              "Students abandoning forms mid-way required auto-save with draft state, resumable sessions, and expiration policies.",
          },
          {
            title: "Concurrent Reviews",
            description:
              "Multiple admins reviewing the same application simultaneously. Solved with optimistic locking and real-time status broadcasting.",
          },
        ],
        stats: [
          { value: "3-Step", label: "APPROVAL FLOW" },
          { value: "<500ms", label: "FORM RESPONSE" },
          { value: "98%", label: "COMPLETION RATE" },
          { value: "Zero", label: "DATA CONFLICTS" },
        ],
      },
      retrospective: {
        eyebrow: "RETROSPECTIVE",
        quote: "Simplicity Is the Ultimate Sophistication.",
        closing:
          "The hardest part was hiding the complexity from the student. Behind a clean three-step form lies a multi-actor approval engine, but the user never sees the machinery. That's the goal of good UX engineering.",
      },
    },
  },
  {
    id: 4,
    title: "HookWriter MVP",
    slug: "hookwriter-mvp",
    description:
      "AI copywriting tool with OTP dual-auth and LLM-powered social hooks via Auth.js custom Credentials provider.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCNpbB7TRdpZ51UmIbpK3x0xq-hyF4lJm_vLSlgox3wtKZk5Vz9uHXd07SlyRDPSvNQ-G3Dn_i7JtUenXZUgcJQzXiMn0TIXae15BUrSZvtzaQTLbeHes5ejRCkKiyyjnhtckiIZcsGpYuAgYdpGqeuoB9OF2sDJEoWr5g9dMZD110LFqpeihqF9YIFcWKoVUN2pUDAHD5foRKL3_OxbP9O17ML7nYAxs8Pb6L8dyedu0FKW0qZUVIZ2J1-7bDNw-aEATgVxv8Cn7Bq",
    tags: ["Next.js", "Auth.js", "Node.js"],
    variant: "tiltneon",
    caseStudy: {
      number: "04",
      heroDescription:
        "AI-powered copywriting tool that generates high-converting social media hooks using LLMs, with dual OTP authentication and usage-based billing.",
      liveUrl: "#",
      githubUrl: "#",
      screenshots: [
        "https://placehold.co/560x380/1a1a1a/e5c497?text=Hook+Generator+UI",
        "https://placehold.co/560x380/1a1a1a/e5c497?text=Auth+Flow",
      ],
      challenge: {
        eyebrow: "THE CHALLENGE",
        title: "Making AI Accessible for Creators",
        description:
          "Creators need instant, platform-specific copy — not generic AI output. The challenge was wrapping LLM capabilities in a UX that feels like a creative tool, not a tech demo, while managing token costs and preventing abuse.",
      },
      engineeringResponse: {
        eyebrow: "ENGINEERING RESPONSE",
        title: "LLM Integration Pipeline",
        solutions: [
          {
            icon: "smart_toy",
            title: "Prompt Engineering Layer",
            description:
              "Crafted platform-specific prompt templates (Twitter, LinkedIn, Instagram) that constrain LLM output to high-converting hook patterns.",
          },
          {
            icon: "fingerprint",
            title: "Dual OTP Authentication",
            description:
              "Custom Auth.js Credentials provider supporting both email OTP and phone OTP for passwordless, friction-free onboarding.",
          },
          {
            icon: "toll",
            title: "Token Usage Metering",
            description:
              "Real-time token counting and rate limiting per user tier, preventing cost overruns while maintaining responsive generation.",
          },
        ],
      },
      architectureImage:
        "https://placehold.co/800x300/131313/e5c497?text=LLM+Pipeline+Architecture",
      architectureCaption: "LLM PIPELINE ARCHITECTURE",
      deepDive: {
        eyebrow: "DEEP DIVE",
        cards: [
          {
            icon: "edit_note",
            title: "Prompt Templates",
            description:
              "Each social platform has distinct hook patterns. The system uses structured prompt templates with tone, length, and CTA constraints.",
          },
          {
            icon: "vpn_key",
            title: "Auth.js Custom Provider",
            description:
              "Extended Auth.js with a custom Credentials provider that handles OTP generation, verification, and session management in a single flow.",
          },
          {
            icon: "trending_up",
            title: "Usage Analytics",
            description:
              "Dashboard showing generation history, token usage trends, and hook performance scores based on engagement patterns.",
          },
        ],
      },
      hardParts: {
        eyebrow: "THE HARD PARTS",
        title: "AI Product Challenges",
        items: [
          {
            title: "Output Consistency",
            description:
              "LLMs are non-deterministic. Built a scoring and retry layer that evaluates output quality before showing it to the user.",
          },
          {
            title: "Cost Management",
            description:
              "Balancing generation quality with token costs. Implemented caching for similar prompts and tiered model selection based on user plan.",
          },
        ],
        stats: [
          { value: "5", label: "PLATFORMS SUPPORTED" },
          { value: "<3s", label: "GENERATION TIME" },
          { value: "87%", label: "USER SATISFACTION" },
          { value: "40%", label: "COST REDUCTION" },
        ],
      },
      retrospective: {
        eyebrow: "RETROSPECTIVE",
        quote: "Ship the MVP, Then Let Users Design the Product.",
        closing:
          "Starting with a minimal hook generator and iterating based on creator feedback was more valuable than any amount of upfront planning. Real users revealed use cases I never anticipated.",
      },
    },
  },
  {
    id: 5,
    title: "E-commerce Platform",
    slug: "e-commerce-platform",
    description:
      "Scalable marketplace with wishlist folders, Stripe + Razorpay, admin panel and Redux RTK Query with HTTP-only cookie auth.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3xKDCvvKmfKkX3Qa0nparTOrHM7thJ07AmjJ33BG0AFpB01gwMs3fzomO7Xf9NwISgFX28cWKzbe2tAdc9c6kSdbGgP3Qwud1VUiupZ4QSY4hva40V1VeZlmFxqilVpXOuiqBw7GC7wKDebKt_oVtp5PLMPDfD0sGHmG6CPB1L0oEZZzC_N4UWLgCeGrQwSeGXpuLE3rvwBjIqp9tLZJUmCwXIFszBATWl1tN7vQJXOR9VZgU1peWfsB-6YIXiqEDY-yPoHKbxWLO",
    tags: ["React", "Redux", "Stripe"],
    variant: "tiltneon",
    caseStudy: {
      number: "05",
      heroDescription:
        "Full-featured marketplace with wishlists, dual payment gateways (Stripe + Razorpay), comprehensive admin panel, and Redux RTK Query for optimistic state management.",
      liveUrl: "#",
      githubUrl: "#",
      screenshots: [
        "https://placehold.co/560x380/1a1a1a/e5c497?text=Product+Catalog",
        "https://placehold.co/560x380/1a1a1a/e5c497?text=Admin+Panel",
      ],
      challenge: {
        eyebrow: "THE CHALLENGE",
        title: "Building a Resilient Marketplace",
        description:
          "E-commerce demands reliability across payments, inventory, and user sessions. The challenge was unifying Stripe and Razorpay under one checkout flow, while managing complex cart state and real-time inventory locks.",
      },
      engineeringResponse: {
        eyebrow: "ENGINEERING RESPONSE",
        title: "Commerce Architecture",
        solutions: [
          {
            icon: "payments",
            title: "Dual Payment Gateway",
            description:
              "Unified Stripe and Razorpay under a single checkout abstraction with automatic failover and currency-based routing.",
          },
          {
            icon: "inventory_2",
            title: "Inventory Lock System",
            description:
              "Redis-based inventory reservations during checkout flow, preventing overselling with automatic expiry on abandoned carts.",
          },
          {
            icon: "admin_panel_settings",
            title: "Admin Dashboard",
            description:
              "Full CRUD admin panel with order management, analytics dashboards, and bulk product operations via CSV import.",
          },
        ],
      },
      architectureImage:
        "https://placehold.co/800x300/131313/e5c497?text=Commerce+System+Architecture",
      architectureCaption: "COMMERCE ARCHITECTURE DIAGRAM",
      deepDive: {
        eyebrow: "DEEP DIVE",
        cards: [
          {
            icon: "favorite",
            title: "Wishlist Folders",
            description:
              "Users organize saved products into custom folders with sharing capabilities, powered by RTK Query's optimistic cache updates.",
          },
          {
            icon: "cookie",
            title: "HTTP-Only Cookie Auth",
            description:
              "Secure session management using HTTP-only cookies with refresh token rotation, eliminating XSS attack vectors on auth tokens.",
          },
          {
            icon: "sync",
            title: "RTK Query Caching",
            description:
              "Aggressive cache invalidation strategy with tag-based refetching — cart updates reflect instantly across all open tabs.",
          },
        ],
      },
      hardParts: {
        eyebrow: "THE HARD PARTS",
        title: "Checkout Complexity",
        items: [
          {
            title: "Payment Reconciliation",
            description:
              "Handling webhook failures and payment state mismatches between gateway responses and our order database. Built a reconciliation job that runs every 5 minutes.",
          },
          {
            title: "Cart Abandonment Recovery",
            description:
              "Inventory locks expire, but user carts persist. Re-validating stock availability when users return required graceful degradation with clear messaging.",
          },
        ],
        stats: [
          { value: "2", label: "PAYMENT GATEWAYS" },
          { value: "99.7%", label: "CHECKOUT SUCCESS" },
          { value: "15K+", label: "PRODUCTS MANAGED" },
          { value: "<200ms", label: "CART OPERATIONS" },
        ],
      },
      retrospective: {
        eyebrow: "RETROSPECTIVE",
        quote: "Every Edge Case Is Someone's Main Case.",
        closing:
          "E-commerce humbles you. The happy path is 20% of the work — the other 80% is handling failed payments, expired sessions, out-of-stock items, and users who find every possible edge case.",
      },
    },
  },
  {
    id: 6,
    title: "Design System UI",
    slug: "design-system-ui",
    description:
      "Component library with token-driven theming, Storybook docs, and an auto-generated Figma token pipeline.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuASP7oUmGCM1ERp_jq5V5M-m86kxnJJmN1JI3EkRbj5rDrUW6CbHMpMpDiINqe7GnagD9vbYGuvCgLHbrRMRrLJMCDZmv-xgkbwTR0qZAZqBHeFPkConjlQ2TN7cMSj0YGZZMpDJUVtZjNWVHRRqqdlY9TmzBePvjOTaUrjR-6uyTd-1lGFBQi5FUPezd7wk56s9OQ4qrJfPMXJGVzXL01dclMUH1-T1E9gX6D_aD2Ah9YE3e-dA7ikygGRXXijWqjpVEY24G64Rfj",
    tags: ["Figma", "Storybook", "TypeScript", "GSAP"],
    variant: "tiltneon",
    caseStudy: {
      number: "06",
      heroDescription:
        "Comprehensive component library with token-driven theming, interactive Storybook documentation, and an automated Figma-to-code token synchronization pipeline.",
      liveUrl: "#",
      githubUrl: "#",
      screenshots: [
        "https://placehold.co/560x380/1a1a1a/e5c497?text=Component+Library",
        "https://placehold.co/560x380/1a1a1a/e5c497?text=Storybook+Docs",
      ],
      challenge: {
        eyebrow: "THE CHALLENGE",
        title: "Bridging Design and Code",
        description:
          "Design systems fail when designers and developers speak different languages. The challenge was building a single source of truth where Figma tokens automatically propagate to code, and every component is documented with live examples.",
      },
      engineeringResponse: {
        eyebrow: "ENGINEERING RESPONSE",
        title: "Token Pipeline Architecture",
        solutions: [
          {
            icon: "palette",
            title: "Token-Driven Theming",
            description:
              "CSS custom properties generated from Figma tokens via Style Dictionary, enabling runtime theme switching with zero JS overhead.",
          },
          {
            icon: "auto_stories",
            title: "Storybook Documentation",
            description:
              "Every component has interactive stories with controls, accessibility audits, and auto-generated prop tables.",
          },
          {
            icon: "sync_alt",
            title: "Figma Token Pipeline",
            description:
              "GitHub Actions workflow that syncs Figma design tokens to the codebase on every Figma publish event, keeping design and code in lock-step.",
          },
        ],
      },
      architectureImage:
        "https://placehold.co/800x300/131313/e5c497?text=Design+Token+Pipeline",
      architectureCaption: "TOKEN PIPELINE FLOW",
      deepDive: {
        eyebrow: "DEEP DIVE",
        cards: [
          {
            icon: "brush",
            title: "Style Dictionary",
            description:
              "Transforms Figma tokens into platform-specific outputs: CSS variables, Tailwind config, and React Native StyleSheet objects from a single source.",
          },
          {
            icon: "animation",
            title: "GSAP Micro-Interactions",
            description:
              "Reusable motion primitives built with GSAP — fade, slide, spring — exposed as React hooks for consistent animations across the system.",
          },
          {
            icon: "accessibility",
            title: "A11y First",
            description:
              "Every component passes WCAG 2.1 AA standards. Storybook's a11y addon runs automated audits on every story, catching regressions early.",
          },
        ],
      },
      hardParts: {
        eyebrow: "THE HARD PARTS",
        title: "Systemic Consistency",
        items: [
          {
            title: "Token Naming Conflicts",
            description:
              "Figma designers and developers used different naming conventions. Built a translation layer that maps design-friendly names to code-friendly tokens.",
          },
          {
            title: "Version Drift",
            description:
              "Keeping Storybook, Figma, and production code synchronized across versions. Automated CI checks flag any token mismatches on PR.",
          },
        ],
        stats: [
          { value: "60+", label: "COMPONENTS" },
          { value: "200+", label: "DESIGN TOKENS" },
          { value: "100%", label: "A11Y COVERAGE" },
          { value: "<1min", label: "TOKEN SYNC" },
        ],
      },
      retrospective: {
        eyebrow: "RETROSPECTIVE",
        quote: "A Design System Is a Product, Not a Project.",
        closing:
          "The most important insight was treating the design system as a living product with its own roadmap, consumers, and SLA — not a one-time deliverable that gathers dust.",
      },
    },
  },
];

export const experiences: Experience[] = [
  {
    id: 1,
    period: "2022 — PRESENT",
    label: "Current Role",
    title: "Senior Developer Analyst",
    company: "Value Creatives Tech Solutions LLP",
    tags: ["Next.js", "Node.js", "MongoDB", "AWS", "Stripe"],
    isCurrent: true,

    details: [
      "Built and maintained full-stack applications using MERN and Next.js across multiple domains",
      "Designed REST APIs and backend services for healthcare, HR, property listing, and legal platforms",
      "Integrated payment workflows using Stripe and Razorpay including order creation, verification, and webhooks",
      "Worked with AWS services (S3, SES, EC2) for file handling, email workflows, and deployments",
      "Handled end-to-end feature development from frontend UI to backend logic and deployment",
    ],

    progression: [
      {
        title: "Senior Developer Analyst",
        duration: "Feb 2026 — Present",
        points: [
          "Leading development of production applications across multiple domains",
          "Driving architectural decisions and improving code quality across projects",
          "Mentoring team members and contributing to engineering best practices",
        ],
      },
      {
        title: "Developer Analyst",
        duration: "Nov 2022 — Jan 2026",
        points: [
          "Developed full-stack features using MERN stack and Next.js",
          "Built REST APIs and handled MongoDB-based data modeling",
          "Integrated Stripe and Razorpay payment flows with order lifecycle and verification",
        ],
      },
    ],
  },
  {
    id: 2,
    period: "2021 — 2022",
    label: "Intensive Education",
    title: "MERN Bootcamp",
    company: "Masai School",
    tags: ["MongoDB", "Express.js", "React", "Node.js", "DSA"],
    isCurrent: false,

    details: [
      "Completed a structured full-time MERN program with focus on DSA and computer science fundamentals",
      "Built multiple full-stack applications covering authentication, APIs, and real-world use cases",
      "Developed strong problem-solving skills through data structures and algorithms practice",
      "Transitioned from a non-technical background into professional software development",
    ],

    progression: [
      {
        title: "Core Foundations",
        // duration: "Apr 2021 — Aug 2021",
        points: [
          "Learned JavaScript, data structures, and core computer science concepts",
          "Practiced problem-solving using arrays, strings, recursion, and basic algorithms",
        ],
      },
      {
        title: "Full-Stack Development",
        // duration: "Aug 2021 — Nov 2021",
        points: [
          "Built REST APIs with Node.js and Express",
          "Developed frontend applications using React and state management",
        ],
      },
      {
        title: "Project & Deployment Phase",
        // duration: "Nov 2021 — Feb 2022",
        points: [
          "Built and deployed full-stack applications with authentication and database integration",
          "Worked on real-world use cases simulating production environments",
        ],
      },
    ],
  },
  {
    id: 3,
    period: "2017 — 2020",
    label: "Early Career",
    title: "Café Owner",
    company: "Independent — Ashta, Maharashtra",
    tags: ["Operations", "Team Management", "Business"],
    isCurrent: false,

    details: [
      "Managed a team of 4–5 people, including hiring, scheduling, and coordination",
      "Handled vendor sourcing, pricing, and cost control to maintain consistent margins",
      "Worked across both operations and kitchen during peak hours, ensuring smooth service",
      "Ran daily operations including inventory and customer experience",
      "Built strong decision-making and problem-solving skills under real-world pressure",
    ],

    progression: [
      {
        title: "Owner & Operator",
        points: [
          "Managed day-to-day business operations and customer experience",
          "Handled team coordination, vendor management, and cost control",
          "Worked hands-on across operations and kitchen during peak hours",
        ],
      },
    ],
  },
];

export const skills: Skill[] = [
  { name: "React Architecture", value: 88 },
  { name: "Node & Systems", value: 82 },
  { name: "MongoDB / Mongoose", value: 78 },
  { name: "UI / Motion Design", value: 75 },
  { name: "TypeScript", value: 70 },
];

export const coreStack = [
  "React / Next.js",
  "TypeScript",
  "Node.js",
  "MongoDB",
  "Redis",
  "AWS S3 / SES",
  "Strapi",
  "Prisma",
];

export const SECTIONS = [
  { id: "hero", label: "01 / 06 — HERO" },
  { id: "expertise", label: "02 / 06 — EXPERTISE" },
  { id: "about", label: "03 / 06 — ABOUT" },
  { id: "work", label: "04 / 06 — WORK" },
  { id: "experience", label: "05 / 06 — EXPERIENCE" },
  { id: "contact", label: "06 / 06 — CONTACT" },
];
