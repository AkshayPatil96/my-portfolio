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
  architectureNote?: string;
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
  infrastructure?: {
    eyebrow: string;
    title: string;
    items: {
      title: string;
      description: string;
    }[];
  };
  tradeoffs?: {
    eyebrow: string;
    items: string[];
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

export const projects: Project[] = [
  {
    id: 1,
    title: "Real-Time Chat Platform",
    slug: "real-time-chat-platform",
    description:
      "Designed and built a real-time messaging platform supporting multi-tab presence, delivery guarantees, and scalable pagination — solving consistency challenges in distributed real-time systems.",
    impact:
      "Achieved consistent real-time message delivery across multiple concurrent sessions with O(1) pagination and resilient presence tracking — ensuring no duplicate messages, accurate online status, and stable performance under growing datasets. Additionally, the system supports zero-downtime deployments, automatic failover, and self-healing infrastructure for high availability.",
    image: "https://placehold.co/800x450/1a1a1a/e5c497?text=Real-Chat+Preview",
    tags: ["Socket.IO", "Redis", "MongoDB", "React", "Node.js", "Express", "Clerk", "AWS S3"],
    variant: "tiltneon",
    caseStudy: {
      number: "01",
      heroDescription:
        "A real-time messaging system engineered for consistency, presence accuracy, and scalable data access — built to handle the edge cases most chat apps ignore.",
      liveUrl: "https://real-chat.akshforge.com/",
      githubUrl: "https://github.com/AkshayPatil96/real-chat",
      screenshots: [
        "https://placehold.co/560x380/1a1a1a/e5c497?text=Chat+Conversation+View",
        "https://placehold.co/560x380/1a1a1a/e5c497?text=Presence+%26+Typing+Indicators",
      ],
      challenge: {
        eyebrow: "THE CHALLENGE",
        title: "Reliable Messaging at Concurrent Scale",
        description:
          "The core challenge wasn't just sending messages — it was guaranteeing ordering, delivery state consistency, and presence accuracy across multiple browser tabs and reconnection scenarios. Webhook signature verification required raw body preservation before Express middleware parsing. Atomic consistency between message creation and conversation metadata updates demanded careful transaction orchestration. Meanwhile, rate limiting had to be distributed across potential server instances without falling back to fragile in-memory stores.",
      },
      engineeringResponse: {
        eyebrow: "ENGINEERING RESPONSE",
        title: "Modular Monolith with Real-Time Backbone",
        solutions: [
          {
            icon: "wifi",
            title: "Socket.IO with Redis Presence",
            description:
              "Enabled real-time messaging with Socket.IO, backed by Redis presence tracking using atomic INCR/DECR counters and TTL heartbeats — ensuring accurate multi-tab online/offline state without false disconnects.",
          },
          {
            icon: "view_list",
            title: "Cursor-Based Pagination",
            description:
              "Replaced offset-based queries with opaque base64-encoded cursors keyed on (createdAt, _id), delivering O(1) pagination performance and preventing duplicate rendering during concurrent real-time inserts.",
          },
          {
            icon: "hub",
            title: "SOLID Modular Architecture",
            description:
              "Decomposed the backend into 7 domain modules (Users, Conversations, Messages, Chat-Requests, Presence, Uploads, Webhooks) — each with its own model, repository, service, controller, and validator layers following interface-driven dependency injection.",
          },
        ],
      },
      architectureImage:
        "https://placehold.co/800x300/131313/e5c497?text=Modular+Monolith+Architecture",
      architectureCaption: "MODULAR MONOLITH — LAYERED SERVICE ARCHITECTURE",
      architectureNote:
        "Chose a modular monolith over microservices to maintain deployment simplicity while preserving clear domain boundaries and scalability.",
      deepDive: {
        eyebrow: "DEEP DIVE",
        cards: [
          {
            icon: "bolt",
            title: "Why Redis for Presence?",
            description:
              "Presence tracking requires sub-second latency and atomic updates — Redis INCR/DECR with TTL enabled accurate multi-session tracking without race conditions.",
          },
          {
            icon: "grid_view",
            title: "Cursor Pagination Internals",
            description:
              "Each cursor encodes a base64 JSON of { createdAt, _id }. The query filters using a compound condition (createdAt < cursor OR createdAt = cursor AND _id < cursor._id) against a compound descending index, yielding stable reverse-chronological traversal immune to mid-scroll inserts.",
          },
          {
            icon: "cloud",
            title: "S3 Upload State Machine",
            description:
              "File uploads follow a temp-to-final S3 flow: presigned PUT URL → upload to temp/ prefix → on message send, backend atomically copies to final path and deletes temp. A 24-hour S3 lifecycle rule auto-cleans orphaned temp files, preventing storage leaks.",
          },
          {
            icon: "sync",
            title: "Zero-Downtime Deployment Strategy",
            description:
              "Implemented blue-green deployment with health checks and traffic switching using Nginx to ensure seamless releases without downtime.",
          },
        ],
      },
      hardParts: {
        eyebrow: "THE HARD PARTS",
        title: "Navigating Real-Time Friction",
        items: [
          {
            title: "Solving Multi-Tab Presence Consistency",
            description:
              "Each browser tab opens its own socket connection, so a naive approach would toggle users offline every time a single tab closes. Solved with Redis INCR/DECR counters per userId — only emitting 'user:offline' when the count drops to zero, paired with a 120s TTL heartbeat as a safety net.",
          },
          {
            title: "Atomic Message + Conversation Updates",
            description:
              "Creating a message and updating the conversation's lastMessage field must succeed or fail together. Implemented a withTransaction() helper wrapping MongoDB sessions, ensuring atomic rollback on any failure — critical for the chat-request accept flow which creates a conversation and updates request status in one transaction.",
          },
          {
            title: "Webhook Body Parsing Order",
            description:
              "Clerk webhooks require the raw request body for Svix HMAC signature verification, but Express.json() consumes it. Solved by registering webhook routes with express.raw() before any body-parsing middleware in the middleware chain.",
          },
        ],
        stats: [
          { value: "7", label: "DOMAIN MODULES" },
          { value: "120s", label: "PRESENCE TTL" },
          { value: "O(1)", label: "PAGINATION COST" },
          { value: "3-Stage", label: "DELIVERY TRACKING" },
        ],
      },
      infrastructure: {
        eyebrow: "INFRASTRUCTURE & DEPLOYMENT",
        title: "Production-Grade Deployment & Reliability",
        items: [
          {
            title: "Dockerized Multi-Service Architecture",
            description:
              "Containerized backend services using Docker, isolating API and reverse proxy layers while ensuring consistent environments across development and production.",
          },
          {
            title: "Nginx Reverse Proxy with SSL",
            description:
              "Configured Nginx with Let's Encrypt for HTTPS, handling TLS termination, routing, and failover between backend instances.",
          },
          {
            title: "CI/CD with GitHub Actions",
            description:
              "Implemented automated deployments via GitHub Actions using SSH workflows to pull, build, and deploy containers without manual intervention.",
          },
          {
            title: "Zero-Downtime Blue-Green Deployment",
            description:
              "Designed blue-green deployment where new containers are started, health-checked, and switched into traffic only after validation.",
          },
          {
            title: "Automatic Failover with Nginx Load Balancing",
            description:
              "Configured Nginx upstream failover across multiple containers with retry logic to ensure uninterrupted service.",
          },
          {
            title: "Self-Healing Infrastructure",
            description:
              "Implemented a watchdog system using systemd to monitor container health and automatically restart unhealthy services.",
          },
          {
            title: "Auto-Recovery on Server Restart",
            description:
              "Built systemd-based recovery to automatically restart Docker services and reload Nginx after server reboot.",
          },
        ],
      },
      tradeoffs: {
        eyebrow: "TRADE-OFFS",
        items: [
          "Chose Redis over in-memory state for presence to support horizontal scaling",
          "Used modular monolith instead of microservices to reduce deployment complexity",
          "Implemented cursor pagination to avoid offset inefficiencies at scale",
          "Chose VPS + Docker over managed services to gain full control over infrastructure and deployment behavior",
          "Implemented blue-green deployment to eliminate downtime at the cost of added system complexity",
          "Used Nginx load balancing instead of external load balancers to keep the system lightweight and cost-efficient",
        ],
      },
      retrospective: {
        eyebrow: "RETROSPECTIVE",
        quote: "Design for Disconnection, Build for Consistency.",
        closing:
          "The biggest lesson was that real-time systems are fundamentally about handling the unhappy path — socket disconnects, stale presence state, partial transaction failures, and orphaned uploads. Every feature demanded thinking in terms of 'what happens when this fails mid-way?' rather than just the success flow. Building the cursor pagination and presence counter systems taught me that elegant distributed design often comes down to choosing the right data structure at the right layer.",
      },
    },
  },
  // {
  //   id: 2,
  //   title: "Healthcare Analytics",
  //   slug: "healthcare-analytics",
  //   description:
  //     "Predictive patient data modeling with county-level geo scoring and real-time trend visualization.",
  //   image:
  //     "https://lh3.googleusercontent.com/aida-public/AB6AXuAX9CqJ-LuDcNVkRDHTjdopfv_KE0fGm5zq9zCkY_Pa7q-azHrc8_IyMMXbiFj5I_1ufFPtZdxmf7KKD5UTJB29gWJBf6prOKWp_UaVsLek4DwWxBXJHKhIDp4QLG6ljnvNWZ6An7Av9PoYCAlLytLXLXfOstBiTrZxUpBYmBVOiRW-TQ2IIuM2vt9m8AyQWzZz4eKIk77cbuW9TeYnqVqE_8u2iLu_EbrPlSPtCLmvCPEuz2xk366sB28s-j3wq3dRjxJqrpZM0GaC",
  //   tags: ["React", "Node.js", "MongoDB", "AWS"],
  //   variant: "tiltneon",
  //   caseStudy: {
  //     number: "02",
  //     heroDescription:
  //       "Predictive patient data modeling platform with county-level geo scoring, real-time trend visualization, and HIPAA-compliant data pipelines.",
  //     liveUrl: "#",
  //     githubUrl: "#",
  //     screenshots: [
  //       "https://placehold.co/560x380/1a1a1a/e5c497?text=Patient+Dashboard",
  //       "https://placehold.co/560x380/1a1a1a/e5c497?text=Geo+Scoring+Map",
  //     ],
  //     challenge: {
  //       eyebrow: "THE CHALLENGE",
  //       title: "Modeling Health at Scale",
  //       description:
  //         "Healthcare data is messy, inconsistent, and highly regulated. The challenge was building a system that could ingest data from multiple EMR sources, normalize it in real time, and surface actionable insights without violating HIPAA compliance boundaries.",
  //     },
  //     engineeringResponse: {
  //       eyebrow: "ENGINEERING RESPONSE",
  //       title: "Data Pipeline Architecture",
  //       solutions: [
  //         {
  //           icon: "analytics",
  //           title: "ETL Pipeline with Stream Processing",
  //           description:
  //             "Built a Node.js stream processor that normalizes incoming HL7/FHIR data into a unified schema, enabling real-time dashboard updates.",
  //         },
  //         {
  //           icon: "map",
  //           title: "County-Level Geo Scoring",
  //           description:
  //             "Aggregated patient outcomes by geographic region using MongoDB geospatial queries and D3.js choropleth maps.",
  //         },
  //         {
  //           icon: "lock",
  //           title: "HIPAA-Compliant Storage Layer",
  //           description:
  //             "Encrypted data at rest with AES-256, implemented role-based access controls, and maintained full audit trails.",
  //         },
  //       ],
  //     },
  //     architectureImage:
  //       "https://placehold.co/800x300/131313/e5c497?text=Healthcare+Data+Pipeline",
  //     architectureCaption: "DATA PIPELINE OVERVIEW",
  //     deepDive: {
  //       eyebrow: "DEEP DIVE",
  //       cards: [
  //         {
  //           icon: "speed",
  //           title: "Real-Time Scoring",
  //           description:
  //             "Patient risk scores update within seconds of new lab results arriving, using a weighted algorithm that factors in 40+ clinical variables.",
  //         },
  //         {
  //           icon: "storage",
  //           title: "MongoDB Aggregation",
  //           description:
  //             "Complex aggregation pipelines handle millions of records efficiently, producing county-level summaries without pre-computation.",
  //         },
  //         {
  //           icon: "security",
  //           title: "Compliance First",
  //           description:
  //             "Every API endpoint enforces role-based access. PHI data never leaves encrypted boundaries, and all queries are audit-logged.",
  //         },
  //       ],
  //     },
  //     hardParts: {
  //       eyebrow: "THE HARD PARTS",
  //       title: "Healthcare Complexity",
  //       items: [
  //         {
  //           title: "Data Normalization",
  //           description:
  //             "Ingesting data from 12 different EMR systems, each with its own schema and terminology. Built a mapping layer that handles inconsistencies gracefully.",
  //         },
  //         {
  //           title: "Latency vs. Accuracy",
  //           description:
  //             "Balancing real-time dashboard updates with the need for accurate, validated data. Implemented a two-phase commit: show preliminary, then confirm.",
  //         },
  //       ],
  //       stats: [
  //         { value: "2.4M", label: "RECORDS PROCESSED" },
  //         { value: "<2s", label: "SCORE REFRESH" },
  //         { value: "40+", label: "CLINICAL VARIABLES" },
  //         { value: "100%", label: "HIPAA COMPLIANT" },
  //       ],
  //     },
  //     retrospective: {
  //       eyebrow: "RETROSPECTIVE",
  //       quote: "Data Without Context Is Just Noise.",
  //       closing:
  //         "This project taught me that the hardest part of analytics isn't the math — it's understanding the domain deeply enough to ask the right questions. Working with healthcare professionals reshaped how I think about user-centered data design.",
  //     },
  //   },
  // },
  // {
  //   id: 3,
  //   title: "Student Onboarding",
  //   slug: "student-onboarding",
  //   description:
  //     "Approval-gated registration with Prisma, TypeScript, and a three-module auth/profile architecture.",
  //   image:
  //     "https://lh3.googleusercontent.com/aida-public/AB6AXuC5IZBXgUg26edZRHt0-5qJgCzdQDg5-6x4EFt3RSM0IXK0uIHTgsoH7X69llMoyXHtM4vk_6RwjBlO0xrcG3bqoBTND9zs8cUwmViHsJ_rBnBF8aZSjcouatazQiNf7J7v7anpJoqt2W3c9rmx4UuibbvXx04P7lTXKPozxnZ0veB4vlRQE_ApIXBP7c9zx3qrJfpBzrPos4FLxToVjXL8w4siyk89sePqohtRAfgBknlxy_Vf4VPXqaw-G_oeghtzqzEAqJE0pqTE",
  //   tags: ["Next.js", "TypeScript", "Prisma"],
  //   variant: "tiltneon",
  //   caseStudy: {
  //     number: "03",
  //     heroDescription:
  //       "Approval-gated student registration system with a three-module architecture for auth, profile management, and admin review workflows.",
  //     liveUrl: "#",
  //     githubUrl: "#",
  //     screenshots: [
  //       "https://placehold.co/560x380/1a1a1a/e5c497?text=Registration+Form",
  //       "https://placehold.co/560x380/1a1a1a/e5c497?text=Admin+Dashboard",
  //     ],
  //     challenge: {
  //       eyebrow: "THE CHALLENGE",
  //       title: "Taming the Registration Maze",
  //       description:
  //         "Building a registration system that supports multi-step approval workflows, document uploads, and role-based dashboards — all while keeping the student experience simple and frustration-free.",
  //     },
  //     engineeringResponse: {
  //       eyebrow: "ENGINEERING RESPONSE",
  //       title: "Modular Auth Architecture",
  //       solutions: [
  //         {
  //           icon: "person_add",
  //           title: "Three-Module Auth System",
  //           description:
  //             "Separated registration, profile completion, and admin approval into independent modules with shared state via Prisma.",
  //         },
  //         {
  //           icon: "verified_user",
  //           title: "Role-Based Access Control",
  //           description:
  //             "Implemented granular RBAC using middleware guards, supporting student, reviewer, and admin roles with distinct permissions.",
  //         },
  //         {
  //           icon: "fact_check",
  //           title: "Approval Workflow Engine",
  //           description:
  //             "Built a state-machine-based workflow that tracks each application from submission through review to final approval or rejection.",
  //         },
  //       ],
  //     },
  //     architectureImage:
  //       "https://placehold.co/800x300/131313/e5c497?text=Onboarding+Flow+Diagram",
  //     architectureCaption: "ONBOARDING FLOW ARCHITECTURE",
  //     deepDive: {
  //       eyebrow: "DEEP DIVE",
  //       cards: [
  //         {
  //           icon: "schema",
  //           title: "Prisma Schema Design",
  //           description:
  //             "Designed a normalized schema with relations between Users, Applications, Documents, and ReviewLogs — enabling efficient queries across the approval pipeline.",
  //         },
  //         {
  //           icon: "upload_file",
  //           title: "Document Pipeline",
  //           description:
  //             "Secure file uploads with S3 presigned URLs, virus scanning middleware, and automatic thumbnail generation for review panels.",
  //         },
  //         {
  //           icon: "mail",
  //           title: "Notification System",
  //           description:
  //             "Event-driven emails via SES triggered at each state transition, keeping students informed without polling the dashboard.",
  //         },
  //       ],
  //     },
  //     hardParts: {
  //       eyebrow: "THE HARD PARTS",
  //       title: "Workflow Edge Cases",
  //       items: [
  //         {
  //           title: "Partial Submissions",
  //           description:
  //             "Students abandoning forms mid-way required auto-save with draft state, resumable sessions, and expiration policies.",
  //         },
  //         {
  //           title: "Concurrent Reviews",
  //           description:
  //             "Multiple admins reviewing the same application simultaneously. Solved with optimistic locking and real-time status broadcasting.",
  //         },
  //       ],
  //       stats: [
  //         { value: "3-Step", label: "APPROVAL FLOW" },
  //         { value: "<500ms", label: "FORM RESPONSE" },
  //         { value: "98%", label: "COMPLETION RATE" },
  //         { value: "Zero", label: "DATA CONFLICTS" },
  //       ],
  //     },
  //     retrospective: {
  //       eyebrow: "RETROSPECTIVE",
  //       quote: "Simplicity Is the Ultimate Sophistication.",
  //       closing:
  //         "The hardest part was hiding the complexity from the student. Behind a clean three-step form lies a multi-actor approval engine, but the user never sees the machinery. That's the goal of good UX engineering.",
  //     },
  //   },
  // },
  // {
  //   id: 4,
  //   title: "HookWriter MVP",
  //   slug: "hookwriter-mvp",
  //   description:
  //     "AI copywriting tool with OTP dual-auth and LLM-powered social hooks via Auth.js custom Credentials provider.",
  //   image:
  //     "https://lh3.googleusercontent.com/aida-public/AB6AXuCNpbB7TRdpZ51UmIbpK3x0xq-hyF4lJm_vLSlgox3wtKZk5Vz9uHXd07SlyRDPSvNQ-G3Dn_i7JtUenXZUgcJQzXiMn0TIXae15BUrSZvtzaQTLbeHes5ejRCkKiyyjnhtckiIZcsGpYuAgYdpGqeuoB9OF2sDJEoWr5g9dMZD110LFqpeihqF9YIFcWKoVUN2pUDAHD5foRKL3_OxbP9O17ML7nYAxs8Pb6L8dyedu0FKW0qZUVIZ2J1-7bDNw-aEATgVxv8Cn7Bq",
  //   tags: ["Next.js", "Auth.js", "Node.js"],
  //   variant: "tiltneon",
  //   caseStudy: {
  //     number: "04",
  //     heroDescription:
  //       "AI-powered copywriting tool that generates high-converting social media hooks using LLMs, with dual OTP authentication and usage-based billing.",
  //     liveUrl: "#",
  //     githubUrl: "#",
  //     screenshots: [
  //       "https://placehold.co/560x380/1a1a1a/e5c497?text=Hook+Generator+UI",
  //       "https://placehold.co/560x380/1a1a1a/e5c497?text=Auth+Flow",
  //     ],
  //     challenge: {
  //       eyebrow: "THE CHALLENGE",
  //       title: "Making AI Accessible for Creators",
  //       description:
  //         "Creators need instant, platform-specific copy — not generic AI output. The challenge was wrapping LLM capabilities in a UX that feels like a creative tool, not a tech demo, while managing token costs and preventing abuse.",
  //     },
  //     engineeringResponse: {
  //       eyebrow: "ENGINEERING RESPONSE",
  //       title: "LLM Integration Pipeline",
  //       solutions: [
  //         {
  //           icon: "smart_toy",
  //           title: "Prompt Engineering Layer",
  //           description:
  //             "Crafted platform-specific prompt templates (Twitter, LinkedIn, Instagram) that constrain LLM output to high-converting hook patterns.",
  //         },
  //         {
  //           icon: "fingerprint",
  //           title: "Dual OTP Authentication",
  //           description:
  //             "Custom Auth.js Credentials provider supporting both email OTP and phone OTP for passwordless, friction-free onboarding.",
  //         },
  //         {
  //           icon: "toll",
  //           title: "Token Usage Metering",
  //           description:
  //             "Real-time token counting and rate limiting per user tier, preventing cost overruns while maintaining responsive generation.",
  //         },
  //       ],
  //     },
  //     architectureImage:
  //       "https://placehold.co/800x300/131313/e5c497?text=LLM+Pipeline+Architecture",
  //     architectureCaption: "LLM PIPELINE ARCHITECTURE",
  //     deepDive: {
  //       eyebrow: "DEEP DIVE",
  //       cards: [
  //         {
  //           icon: "edit_note",
  //           title: "Prompt Templates",
  //           description:
  //             "Each social platform has distinct hook patterns. The system uses structured prompt templates with tone, length, and CTA constraints.",
  //         },
  //         {
  //           icon: "vpn_key",
  //           title: "Auth.js Custom Provider",
  //           description:
  //             "Extended Auth.js with a custom Credentials provider that handles OTP generation, verification, and session management in a single flow.",
  //         },
  //         {
  //           icon: "trending_up",
  //           title: "Usage Analytics",
  //           description:
  //             "Dashboard showing generation history, token usage trends, and hook performance scores based on engagement patterns.",
  //         },
  //       ],
  //     },
  //     hardParts: {
  //       eyebrow: "THE HARD PARTS",
  //       title: "AI Product Challenges",
  //       items: [
  //         {
  //           title: "Output Consistency",
  //           description:
  //             "LLMs are non-deterministic. Built a scoring and retry layer that evaluates output quality before showing it to the user.",
  //         },
  //         {
  //           title: "Cost Management",
  //           description:
  //             "Balancing generation quality with token costs. Implemented caching for similar prompts and tiered model selection based on user plan.",
  //         },
  //       ],
  //       stats: [
  //         { value: "5", label: "PLATFORMS SUPPORTED" },
  //         { value: "<3s", label: "GENERATION TIME" },
  //         { value: "87%", label: "USER SATISFACTION" },
  //         { value: "40%", label: "COST REDUCTION" },
  //       ],
  //     },
  //     retrospective: {
  //       eyebrow: "RETROSPECTIVE",
  //       quote: "Ship the MVP, Then Let Users Design the Product.",
  //       closing:
  //         "Starting with a minimal hook generator and iterating based on creator feedback was more valuable than any amount of upfront planning. Real users revealed use cases I never anticipated.",
  //     },
  //   },
  // },
  // {
  //   id: 5,
  //   title: "E-commerce Platform",
  //   slug: "e-commerce-platform",
  //   description:
  //     "Scalable marketplace with wishlist folders, Stripe + Razorpay, admin panel and Redux RTK Query with HTTP-only cookie auth.",
  //   image:
  //     "https://lh3.googleusercontent.com/aida-public/AB6AXuC3xKDCvvKmfKkX3Qa0nparTOrHM7thJ07AmjJ33BG0AFpB01gwMs3fzomO7Xf9NwISgFX28cWKzbe2tAdc9c6kSdbGgP3Qwud1VUiupZ4QSY4hva40V1VeZlmFxqilVpXOuiqBw7GC7wKDebKt_oVtp5PLMPDfD0sGHmG6CPB1L0oEZZzC_N4UWLgCeGrQwSeGXpuLE3rvwBjIqp9tLZJUmCwXIFszBATWl1tN7vQJXOR9VZgU1peWfsB-6YIXiqEDY-yPoHKbxWLO",
  //   tags: ["React", "Redux", "Stripe"],
  //   variant: "tiltneon",
  //   caseStudy: {
  //     number: "05",
  //     heroDescription:
  //       "Full-featured marketplace with wishlists, dual payment gateways (Stripe + Razorpay), comprehensive admin panel, and Redux RTK Query for optimistic state management.",
  //     liveUrl: "#",
  //     githubUrl: "#",
  //     screenshots: [
  //       "https://placehold.co/560x380/1a1a1a/e5c497?text=Product+Catalog",
  //       "https://placehold.co/560x380/1a1a1a/e5c497?text=Admin+Panel",
  //     ],
  //     challenge: {
  //       eyebrow: "THE CHALLENGE",
  //       title: "Building a Resilient Marketplace",
  //       description:
  //         "E-commerce demands reliability across payments, inventory, and user sessions. The challenge was unifying Stripe and Razorpay under one checkout flow, while managing complex cart state and real-time inventory locks.",
  //     },
  //     engineeringResponse: {
  //       eyebrow: "ENGINEERING RESPONSE",
  //       title: "Commerce Architecture",
  //       solutions: [
  //         {
  //           icon: "payments",
  //           title: "Dual Payment Gateway",
  //           description:
  //             "Unified Stripe and Razorpay under a single checkout abstraction with automatic failover and currency-based routing.",
  //         },
  //         {
  //           icon: "inventory_2",
  //           title: "Inventory Lock System",
  //           description:
  //             "Redis-based inventory reservations during checkout flow, preventing overselling with automatic expiry on abandoned carts.",
  //         },
  //         {
  //           icon: "admin_panel_settings",
  //           title: "Admin Dashboard",
  //           description:
  //             "Full CRUD admin panel with order management, analytics dashboards, and bulk product operations via CSV import.",
  //         },
  //       ],
  //     },
  //     architectureImage:
  //       "https://placehold.co/800x300/131313/e5c497?text=Commerce+System+Architecture",
  //     architectureCaption: "COMMERCE ARCHITECTURE DIAGRAM",
  //     deepDive: {
  //       eyebrow: "DEEP DIVE",
  //       cards: [
  //         {
  //           icon: "favorite",
  //           title: "Wishlist Folders",
  //           description:
  //             "Users organize saved products into custom folders with sharing capabilities, powered by RTK Query's optimistic cache updates.",
  //         },
  //         {
  //           icon: "cookie",
  //           title: "HTTP-Only Cookie Auth",
  //           description:
  //             "Secure session management using HTTP-only cookies with refresh token rotation, eliminating XSS attack vectors on auth tokens.",
  //         },
  //         {
  //           icon: "sync",
  //           title: "RTK Query Caching",
  //           description:
  //             "Aggressive cache invalidation strategy with tag-based refetching — cart updates reflect instantly across all open tabs.",
  //         },
  //       ],
  //     },
  //     hardParts: {
  //       eyebrow: "THE HARD PARTS",
  //       title: "Checkout Complexity",
  //       items: [
  //         {
  //           title: "Payment Reconciliation",
  //           description:
  //             "Handling webhook failures and payment state mismatches between gateway responses and our order database. Built a reconciliation job that runs every 5 minutes.",
  //         },
  //         {
  //           title: "Cart Abandonment Recovery",
  //           description:
  //             "Inventory locks expire, but user carts persist. Re-validating stock availability when users return required graceful degradation with clear messaging.",
  //         },
  //       ],
  //       stats: [
  //         { value: "2", label: "PAYMENT GATEWAYS" },
  //         { value: "99.7%", label: "CHECKOUT SUCCESS" },
  //         { value: "15K+", label: "PRODUCTS MANAGED" },
  //         { value: "<200ms", label: "CART OPERATIONS" },
  //       ],
  //     },
  //     retrospective: {
  //       eyebrow: "RETROSPECTIVE",
  //       quote: "Every Edge Case Is Someone's Main Case.",
  //       closing:
  //         "E-commerce humbles you. The happy path is 20% of the work — the other 80% is handling failed payments, expired sessions, out-of-stock items, and users who find every possible edge case.",
  //     },
  //   },
  // },
  // {
  //   id: 6,
  //   title: "Design System UI",
  //   slug: "design-system-ui",
  //   description:
  //     "Component library with token-driven theming, Storybook docs, and an auto-generated Figma token pipeline.",
  //   image:
  //     "https://lh3.googleusercontent.com/aida-public/AB6AXuASP7oUmGCM1ERp_jq5V5M-m86kxnJJmN1JI3EkRbj5rDrUW6CbHMpMpDiINqe7GnagD9vbYGuvCgLHbrRMRrLJMCDZmv-xgkbwTR0qZAZqBHeFPkConjlQ2TN7cMSj0YGZZMpDJUVtZjNWVHRRqqdlY9TmzBePvjOTaUrjR-6uyTd-1lGFBQi5FUPezd7wk56s9OQ4qrJfPMXJGVzXL01dclMUH1-T1E9gX6D_aD2Ah9YE3e-dA7ikygGRXXijWqjpVEY24G64Rfj",
  //   tags: ["Figma", "Storybook", "TypeScript", "GSAP"],
  //   variant: "tiltneon",
  //   caseStudy: {
  //     number: "06",
  //     heroDescription:
  //       "Comprehensive component library with token-driven theming, interactive Storybook documentation, and an automated Figma-to-code token synchronization pipeline.",
  //     liveUrl: "#",
  //     githubUrl: "#",
  //     screenshots: [
  //       "https://placehold.co/560x380/1a1a1a/e5c497?text=Component+Library",
  //       "https://placehold.co/560x380/1a1a1a/e5c497?text=Storybook+Docs",
  //     ],
  //     challenge: {
  //       eyebrow: "THE CHALLENGE",
  //       title: "Bridging Design and Code",
  //       description:
  //         "Design systems fail when designers and developers speak different languages. The challenge was building a single source of truth where Figma tokens automatically propagate to code, and every component is documented with live examples.",
  //     },
  //     engineeringResponse: {
  //       eyebrow: "ENGINEERING RESPONSE",
  //       title: "Token Pipeline Architecture",
  //       solutions: [
  //         {
  //           icon: "palette",
  //           title: "Token-Driven Theming",
  //           description:
  //             "CSS custom properties generated from Figma tokens via Style Dictionary, enabling runtime theme switching with zero JS overhead.",
  //         },
  //         {
  //           icon: "auto_stories",
  //           title: "Storybook Documentation",
  //           description:
  //             "Every component has interactive stories with controls, accessibility audits, and auto-generated prop tables.",
  //         },
  //         {
  //           icon: "sync_alt",
  //           title: "Figma Token Pipeline",
  //           description:
  //             "GitHub Actions workflow that syncs Figma design tokens to the codebase on every Figma publish event, keeping design and code in lock-step.",
  //         },
  //       ],
  //     },
  //     architectureImage:
  //       "https://placehold.co/800x300/131313/e5c497?text=Design+Token+Pipeline",
  //     architectureCaption: "TOKEN PIPELINE FLOW",
  //     deepDive: {
  //       eyebrow: "DEEP DIVE",
  //       cards: [
  //         {
  //           icon: "brush",
  //           title: "Style Dictionary",
  //           description:
  //             "Transforms Figma tokens into platform-specific outputs: CSS variables, Tailwind config, and React Native StyleSheet objects from a single source.",
  //         },
  //         {
  //           icon: "animation",
  //           title: "GSAP Micro-Interactions",
  //           description:
  //             "Reusable motion primitives built with GSAP — fade, slide, spring — exposed as React hooks for consistent animations across the system.",
  //         },
  //         {
  //           icon: "accessibility",
  //           title: "A11y First",
  //           description:
  //             "Every component passes WCAG 2.1 AA standards. Storybook's a11y addon runs automated audits on every story, catching regressions early.",
  //         },
  //       ],
  //     },
  //     hardParts: {
  //       eyebrow: "THE HARD PARTS",
  //       title: "Systemic Consistency",
  //       items: [
  //         {
  //           title: "Token Naming Conflicts",
  //           description:
  //             "Figma designers and developers used different naming conventions. Built a translation layer that maps design-friendly names to code-friendly tokens.",
  //         },
  //         {
  //           title: "Version Drift",
  //           description:
  //             "Keeping Storybook, Figma, and production code synchronized across versions. Automated CI checks flag any token mismatches on PR.",
  //         },
  //       ],
  //       stats: [
  //         { value: "60+", label: "COMPONENTS" },
  //         { value: "200+", label: "DESIGN TOKENS" },
  //         { value: "100%", label: "A11Y COVERAGE" },
  //         { value: "<1min", label: "TOKEN SYNC" },
  //       ],
  //     },
  //     retrospective: {
  //       eyebrow: "RETROSPECTIVE",
  //       quote: "A Design System Is a Product, Not a Project.",
  //       closing:
  //         "The most important insight was treating the design system as a living product with its own roadmap, consumers, and SLA — not a one-time deliverable that gathers dust.",
  //     },
  //   },
  // },
];
