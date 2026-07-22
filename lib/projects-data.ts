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
    intro?: string;
    items?: {
      title: string;
      description: string;
    }[];
    groups?: {
      label: string;
      items: {
        title: string;
        description: string;
      }[];
    }[];
  };
  knownLimitations?: {
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
    title: "Warden Admin Panel",
    slug: "warden-admin-panel",
    description:
      "Designed and built a production-grade internal admin panel with self-rolled session auth, permission-based RBAC, and full audit logging - a study in security judgment where the server is always the source of truth.",
    impact:
      "Delivered granular, permission-checked authorization enforced entirely at the API layer, with tamper-evident audit trails on every sensitive mutation. Self-rolled session auth (Argon2id, httpOnly cookies, server-side session store) replaces a third-party BaaS to demonstrate the underlying security fundamentals - timing-safe logins, account lockout, session revocation on credential change, and zero tokens ever exposed to client JavaScript.",
    image: "/assets/images/case-study-screenshots/02-dashboard.png",
    tags: [
      "Next.js",
      "TypeScript",
      "Express",
      "Prisma",
      "PostgreSQL",
      "Zod",
      "TanStack Query",
      "Tailwind",
      "Argon2id",
      "Docker",
    ],
    variant: "tiltneon",
    caseStudy: {
      number: "01",
      heroDescription:
        "An internal-tools admin panel engineered around a single principle - permissions are checked on the server, always. Self-rolled auth, granular RBAC, and audit logging built to convince a senior reviewer this is real, shippable software.",
      liveUrl: "https://warden-admin.akshforge.com",
      githubUrl: "https://github.com/AkshayPatil96/warden-admin",
      screenshots: [
        "/assets/images/case-study-screenshots/01-login.png",
        "/assets/images/case-study-screenshots/03-customers.png",
        "/assets/images/case-study-screenshots/04-subscriptions.png",
        "/assets/images/case-study-screenshots/05-invoices.png",
        "/assets/images/case-study-screenshots/06-users-roles.png",
        "/assets/images/case-study-screenshots/07-audit-log.png",
      ],
      challenge: {
        eyebrow: "THE CHALLENGE",
        title: "Authorization You Can Actually Trust",
        description:
          "Most admin panels lean on a BaaS for auth and gate the UI with role strings - which looks fine until you realize the client is deciding what it's allowed to do. The real challenge was building an access-control system that a security reviewer would trust: authorization enforced on the server for every request, granular permissions rather than role checks, credential handling that resists timing and enumeration attacks, and an audit trail that proves who changed what and when - all without hiding the mechanics behind a third-party service.",
      },
      engineeringResponse: {
        eyebrow: "ENGINEERING RESPONSE",
        title: "Server-Authoritative RBAC on a Layered Monolith",
        solutions: [
          {
            icon: "key",
            title: "Self-Rolled Session Auth",
            description:
              "Argon2id password hashing, opaque server-side sessions stored in Postgres, and httpOnly + Secure + SameSite cookies - no tokens in localStorage, ever. Sessions are revocable server-side, so a password change or reset can invalidate stolen cookies instantly.",
          },
          {
            icon: "verified_user",
            title: "Permission-Based Authorization",
            description:
              "An authorize('orders:write') middleware gates every protected route against granular permission keys resolved from the user's roles - never against role strings. UI hiding/disabling is treated as UX only; the API is the single source of truth.",
          },
          {
            icon: "hub",
            title: "Shared-Schema Modular Monolith",
            description:
              "Eight domain modules (auth, users, roles, customers, subscriptions, invoices, analytics, audit), each layered routes → controller → service → repository. Zod schemas live in a shared package and validate on both the API and the web forms - one contract, no drift.",
          },
        ],
      },
      architectureImage:
        "https://placehold.co/800x300/131313/e5c497?text=Layered+Modular+Monolith",
      architectureCaption:
        "MODULAR MONOLITH - ROUTES → CONTROLLER → SERVICE → REPOSITORY",
      architectureNote:
        "Chose a modular monolith with strict per-module layering over microservices - clear domain boundaries and testability without the operational tax of distributed infra for one app and one database.",
      deepDive: {
        eyebrow: "DEEP DIVE",
        cards: [
          {
            icon: "shield",
            title: "Permissions, Not Roles",
            description:
              "Roles (Admin / Manager / Viewer) are just bundles of permissions. The gate checks the atomic permission - 'invoices:delete' - so a role's capabilities can change without touching a single route. The difference is visibly enforced in both API responses and UI affordances.",
          },
          {
            icon: "timer",
            title: "Timing-Safe, Enumeration-Resistant Login",
            description:
              "A missing account still runs a verify against a pre-computed dummy Argon2id hash, so the response time matches the real path and attackers can't enumerate which emails exist. Password-reset requests always return 204 for the same reason.",
          },
          {
            icon: "history",
            title: "Audit Log as a First-Class Citizen",
            description:
              "Every sensitive mutation writes an audit entry (actor, action, entity, before/after JSON) inside the same transaction as the change itself - so the record and its proof commit or roll back together. Logins, lockouts, and session revocations are all captured.",
          },
          {
            icon: "cookie",
            title: "Cross-Origin httpOnly Sessions",
            description:
              "The Vercel-hosted frontend and a separate API host mean the session cookie is SameSite=None + Secure in production, falling back to Lax over http locally. A lightweight Next proxy does a cheap presence redirect - defense in depth, never the real gate.",
          },
        ],
      },
      hardParts: {
        eyebrow: "THE HARD PARTS",
        title: "The Details Security Reviewers Look For",
        items: [
          {
            title: "Closing the Account-Enumeration Gaps",
            description:
              "The obvious login is a leak: real accounts run Argon2 (slow), missing ones return instantly (fast), and that gap reveals valid emails. Solved by verifying against a throwaway Argon2id hash on the no-account path, returning one generic error for every failure, and making password-reset responses indistinguishable whether or not the email exists.",
          },
          {
            title: "Session Lifecycle on Credential Change",
            description:
              "Changing a password can't silently leave old sessions valid. A password change atomically revokes every OTHER session but keeps the current one; a reset revokes ALL sessions. Both happen in a transaction alongside the hash update and audit write, so there's no window where an old cookie still works.",
          },
          {
            title: "Auditability Without Partial Writes",
            description:
              "An audit log that can drift from reality is worse than none. By threading the same Prisma transaction client through both the domain write and writeAudit(), a failure anywhere rolls back the audit entry too - the log can never claim something happened that didn't.",
          },
        ],
        stats: [
          { value: "8", label: "DOMAIN MODULES" },
          { value: "4-Layer", label: "MODULE ARCHITECTURE" },
          { value: "0", label: "TOKENS IN LOCALSTORAGE" },
          { value: "100%", label: "SERVER-SIDE AUTHZ" },
        ],
      },
      infrastructure: {
        eyebrow: "INFRASTRUCTURE & DEPLOYMENT",
        title: "Environment Parity and a Gated Pipeline",
        items: [
          {
            title: "One-Command Local Stack",
            description:
              "docker-compose brings up Postgres, the API, and the web app together, so local development mirrors production - the whole point being parity, not decoration.",
          },
          {
            title: "CI Gate on Every PR",
            description:
              "GitHub Actions runs lint → typecheck → test → build, with Prisma migrations applied against a real Postgres service container. Nothing merges red.",
          },
          {
            title: "Integration Tests Against Real Postgres",
            description:
              "Vitest suites test the auth flow, a permission-denied case, and critical CRUD end-to-end against a throwaway Postgres - the database is never mocked, so the tests exercise real query and transaction behavior.",
          },
          {
            title: "Versioned Prisma Migrations",
            description:
              "All schema changes ship as versioned migrations in the repo; the database is never hand-edited. A seed script provisions demo data and the three role logins.",
          },
          {
            title: "Split Deploy: API on EC2, Web on Vercel",
            description:
              "The Express API runs on a shared EC2 host while the Next.js frontend deploys to Vercel - driving the cross-origin, SameSite=None cookie design rather than assuming same-origin convenience.",
          },
        ],
      },
      tradeoffs: {
        eyebrow: "TRADE-OFFS",
        items: [
          "Self-rolled session auth over Auth0/Clerk - more responsibility, but it demonstrates the security fundamentals a BaaS hides",
          "Server-side sessions over stateless JWTs - a DB lookup per request buys instant, reliable revocation",
          "Granular permissions over role checks - more rows to seed, but authorization that survives changing requirements",
          "Modular monolith over microservices - clear boundaries without distributed-systems overhead for one app",
          "Money stored as integer cents over floats - no rounding drift in billing math",
          "Kept the repository layer even on thin CRUD for consistency, accepting some pass-through boilerplate",
        ],
      },
      knownLimitations: {
        eyebrow: "KNOWN LIMITATIONS",
        title: "What This Implementation Doesn't Cover",
        items: [
          {
            title: "No In-Session Permission Refresh",
            description:
              "If an admin changes a role's permissions mid-session — say, stripping 'invoices:delete' from Manager — sessions already in progress won't reflect that until their next request resolves the user's roles from the database. For a low-risk internal tool the window is acceptable, but it is a known gap.",
          },
          {
            title: "Account Lockout Has No Auto-Expiry",
            description:
              "The lockout mechanism has no cooling-off timer. A locked account stays locked until an Admin explicitly unlocks it, meaning a misconfiguration or a targeted lockout attack against an admin account requires a human to resolve rather than simply waiting out a penalty period.",
          },
          {
            title: "Audit Log Stores Full Entity Snapshots Without Truncation",
            description:
              "Every sensitive mutation writes the full before/after entity JSON. There is no field-level diffing, no size cap, and no truncation strategy — a change to a single field on a large entity writes the entire object twice. Under heavy mutation traffic this grows the audit table quickly.",
          },
          {
            title: "Session Table Is Never Actively Pruned",
            description:
              "Expired sessions are validated and rejected on use but are never deleted by a background job or scheduled cleanup. In a test environment with frequent logins, or under sustained failed-auth attempts, the sessions table accumulates dead rows indefinitely until manual or scheduled cleanup is added.",
          },
        ],
      },
      retrospective: {
        eyebrow: "RETROSPECTIVE",
        quote: "Trust the Server, Never the Client.",
        closing:
          "The lesson that ran through every module was that security lives in the unhappy path - the missing account, the stolen cookie, the reset link replayed twice, the audit write that must not outlive its transaction. Building auth from primitives instead of importing a black box forced me to reason about each of those cases explicitly, and that's exactly the judgment this project exists to show.",
      },
    },
  },
  {
    id: 2,
    title: "Real-Time Chat Platform",
    slug: "real-time-chat-platform",
    description:
      "Designed and built a real-time messaging platform supporting multi-tab presence, delivery guarantees, and scalable pagination - solving consistency challenges in distributed real-time systems.",
    impact:
      "Achieved consistent real-time message delivery across multiple concurrent sessions with O(1) pagination and resilient presence tracking - ensuring no duplicate messages, accurate online status, and stable performance under growing datasets. Additionally, the system supports zero-downtime deployments, automatic failover, and self-healing infrastructure for high availability.",
    image: "https://placehold.co/800x450/1a1a1a/e5c497?text=Real-Chat+Preview",
    tags: [
      "Socket.IO",
      "Redis",
      "MongoDB",
      "React",
      "Node.js",
      "Express",
      "Clerk",
      "AWS S3",
    ],
    variant: "tiltneon",
    caseStudy: {
      number: "02",
      heroDescription:
        "A real-time messaging system engineered for consistency, presence accuracy, and scalable data access - built to handle the edge cases most chat apps ignore.",
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
          "The core challenge wasn't just sending messages - it was guaranteeing ordering, delivery state consistency, and presence accuracy across multiple browser tabs and reconnection scenarios. Webhook signature verification required raw body preservation before Express middleware parsing. Atomic consistency between message creation and conversation metadata updates demanded careful transaction orchestration. Meanwhile, rate limiting had to be distributed across potential server instances without falling back to fragile in-memory stores.",
      },
      engineeringResponse: {
        eyebrow: "ENGINEERING RESPONSE",
        title: "Modular Monolith with Real-Time Backbone",
        solutions: [
          {
            icon: "wifi",
            title: "Socket.IO with Redis Presence",
            description:
              "Enabled real-time messaging with Socket.IO, backed by Redis presence tracking using atomic INCR/DECR counters and TTL heartbeats - ensuring accurate multi-tab online/offline state without false disconnects.",
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
              "Decomposed the backend into 7 domain modules (Users, Conversations, Messages, Chat-Requests, Presence, Uploads, Webhooks) - each with its own model, repository, service, controller, and validator layers following interface-driven dependency injection.",
          },
        ],
      },
      architectureImage:
        "https://placehold.co/800x300/131313/e5c497?text=Modular+Monolith+Architecture",
      architectureCaption: "MODULAR MONOLITH - LAYERED SERVICE ARCHITECTURE",
      architectureNote:
        "Chose a modular monolith over microservices to maintain deployment simplicity while preserving clear domain boundaries and scalability.",
      deepDive: {
        eyebrow: "DEEP DIVE",
        cards: [
          {
            icon: "bolt",
            title: "Why Redis for Presence?",
            description:
              "Presence tracking requires sub-second latency and atomic updates - Redis INCR/DECR with TTL enabled accurate multi-session tracking without race conditions.",
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
              "Each browser tab opens its own socket connection, so a naive approach would toggle users offline every time a single tab closes. Solved with Redis INCR/DECR counters per userId - only emitting 'user:offline' when the count drops to zero, paired with a 120s TTL heartbeat as a safety net.",
          },
          {
            title: "Atomic Message + Conversation Updates",
            description:
              "Creating a message and updating the conversation's lastMessage field must succeed or fail together. Implemented a withTransaction() helper wrapping MongoDB sessions, ensuring atomic rollback on any failure - critical for the chat-request accept flow which creates a conversation and updates request status in one transaction.",
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
        intro:
          "Not all of this infrastructure was demanded by the app's actual load. The two groups below separate what the challenges on this page directly required from what was built as deliberate operational practice.",
        groups: [
          {
            label: "Core to the Problem",
            items: [
              {
                title: "Dockerized Multi-Service Architecture",
                description:
                  "Containerized backend services using Docker, isolating API and reverse proxy layers while ensuring consistent environments across development and production. Redis and MongoDB run as containerized sidecars, directly supporting the presence counter and transaction features the challenges demanded.",
              },
              {
                title: "Nginx Reverse Proxy with SSL",
                description:
                  "Configured Nginx with Let's Encrypt for HTTPS, handling TLS termination and routing. WebSocket connections over wss:// require a correctly configured reverse proxy — this is not optional for Socket.IO in production.",
              },
              {
                title: "CI/CD with GitHub Actions",
                description:
                  "Implemented automated deployments via GitHub Actions using SSH workflows to pull, build, and deploy containers without manual intervention. Ensures presence and pagination fixes reach production reliably without human error in the deploy step.",
              },
            ],
          },
          {
            label: "Built as Deliberate Ops Practice",
            items: [
              {
                title: "Zero-Downtime Blue-Green Deployment",
                description:
                  "Designed blue-green deployment where new containers are started, health-checked, and switched into traffic only after validation. This app's traffic doesn't justify the complexity — it was built as practice for zero-downtime release patterns.",
              },
              {
                title: "Automatic Failover with Nginx Load Balancing",
                description:
                  "Configured Nginx upstream failover across multiple containers with retry logic to ensure uninterrupted service. Intentionally over-engineered for a single-node app; the goal was gaining hands-on experience with upstream failover configuration.",
              },
              {
                title: "Self-Healing Infrastructure",
                description:
                  "Implemented a watchdog system using systemd to monitor container health and automatically restart unhealthy services. Added as an ops discipline exercise, not because the app had a crash-rate problem.",
              },
              {
                title: "Auto-Recovery on Server Restart",
                description:
                  "Built systemd-based recovery to automatically restart Docker services and reload Nginx after server reboot. Useful in any production context; included here to practice the full systemd service lifecycle.",
              },
            ],
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
      knownLimitations: {
        eyebrow: "KNOWN LIMITATIONS",
        title: "What This Implementation Doesn't Cover",
        items: [
          {
            title: "No API-Level Rate Limiting",
            description:
              "Redis was chosen partly to support distributed rate limiting, but no rate-limiting middleware is applied to message sends or API endpoints. A single connected socket can flood the system — the infrastructure is ready for it, but the guard isn't wired in.",
          },
          {
            title: "Presence State Is Not Durable",
            description:
              "Presence counters live exclusively in Redis with no persistence configured. A Redis restart clears all INCR/DECR state and every connected user appears offline until their next heartbeat re-emits the counter — recovery depends entirely on live sockets, not on a stored snapshot.",
          },
          {
            title: "Orphaned Final-Path S3 Files on Failed Message Commits",
            description:
              "The temp-to-final S3 copy runs before the MongoDB message write is committed. If the MongoDB write fails after the copy, the final-path file sits in S3 with no message referencing it. The 24-hour lifecycle rule covers the temp prefix only — orphaned final-path files are not auto-cleaned.",
          },
          {
            title: "Cursor Integrity Is Not Validated Server-Side",
            description:
              "Pagination cursors are opaque base64-encoded JSON, but the server does not verify the signature or structure of an incoming cursor. A malformed or tampered cursor produces unexpected query behavior — empty results or a parse error — rather than a clean 400 response.",
          },
        ],
      },
      retrospective: {
        eyebrow: "RETROSPECTIVE",
        quote: "Design for Disconnection, Build for Consistency.",
        closing:
          "The biggest lesson was that real-time systems are fundamentally about handling the unhappy path - socket disconnects, stale presence state, partial transaction failures, and orphaned uploads. Every feature demanded thinking in terms of 'what happens when this fails mid-way?' rather than just the success flow. Building the cursor pagination and presence counter systems taught me that elegant distributed design often comes down to choosing the right data structure at the right layer.",
      },
    },
  },
];
