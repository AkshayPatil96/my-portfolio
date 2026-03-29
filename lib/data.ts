export type {
  ProjectVariant,
  DeepDiveCard,
  EngineeringSolution,
  HardPartItem,
  Stat,
  CaseStudy,
  Project,
} from './projects-data';
export { projects } from './projects-data';

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

export const experiences: Experience[] = [
  {
    id: 1,
    period: '2022 — PRESENT',
    label: 'Current Role',
    title: 'Senior Developer Analyst',
    company: 'Value Creatives Tech Solutions LLP',
    tags: ['Next.js', 'Node.js', 'MongoDB', 'AWS', 'Stripe'],
    isCurrent: true,

    details: [
      'Built and maintained full-stack applications using MERN and Next.js across multiple domains',
      'Designed REST APIs and backend services for healthcare, HR, property listing, and legal platforms',
      'Integrated payment workflows using Stripe and Razorpay including order creation, verification, and webhooks',
      'Worked with AWS services (S3, SES, EC2) for file handling, email workflows, and deployments',
      'Handled end-to-end feature development from frontend UI to backend logic and deployment',
    ],

    progression: [
      {
        title: 'Senior Developer Analyst',
        duration: 'Feb 2026 — Present',
        points: [
          'Leading development of production applications across multiple domains',
          'Driving architectural decisions and improving code quality across projects',
          'Mentoring team members and contributing to engineering best practices',
        ],
      },
      {
        title: 'Developer Analyst',
        duration: 'Nov 2022 — Jan 2026',
        points: [
          'Developed full-stack features using MERN stack and Next.js',
          'Built REST APIs and handled MongoDB-based data modeling',
          'Integrated Stripe and Razorpay payment flows with order lifecycle and verification',
        ],
      },
    ],
  },
  {
    id: 2,
    period: '2021 — 2022',
    label: 'Intensive Education',
    title: 'MERN Bootcamp',
    company: 'Masai School',
    tags: ['MongoDB', 'Express.js', 'React', 'Node.js', 'DSA'],
    isCurrent: false,

    details: [
      'Completed a structured full-time MERN program with focus on DSA and computer science fundamentals',
      'Built multiple full-stack applications covering authentication, APIs, and real-world use cases',
      'Developed strong problem-solving skills through data structures and algorithms practice',
      'Transitioned from a non-technical background into professional software development',
    ],

    progression: [
      {
        title: 'Core Foundations',
        points: [
          'Learned JavaScript, data structures, and core computer science concepts',
          'Practiced problem-solving using arrays, strings, recursion, and basic algorithms',
        ],
      },
      {
        title: 'Full-Stack Development',
        points: [
          'Built REST APIs with Node.js and Express',
          'Developed frontend applications using React and state management',
        ],
      },
      {
        title: 'Project & Deployment Phase',
        points: [
          'Built and deployed full-stack applications with authentication and database integration',
          'Worked on real-world use cases simulating production environments',
        ],
      },
    ],
  },
  {
    id: 3,
    period: '2017 — 2020',
    label: 'Early Career',
    title: 'Café Owner',
    company: 'Independent — Ashta, Maharashtra',
    tags: ['Operations', 'Team Management', 'Business'],
    isCurrent: false,

    details: [
      'Managed a team of 4–5 people, including hiring, scheduling, and coordination',
      'Handled vendor sourcing, pricing, and cost control to maintain consistent margins',
      'Worked across both operations and kitchen during peak hours, ensuring smooth service',
      'Ran daily operations including inventory and customer experience',
      'Built strong decision-making and problem-solving skills under real-world pressure',
    ],

    progression: [
      {
        title: 'Owner & Operator',
        points: [
          'Managed day-to-day business operations and customer experience',
          'Handled team coordination, vendor management, and cost control',
          'Worked hands-on across operations and kitchen during peak hours',
        ],
      },
    ],
  },
];

export const skills: Skill[] = [
  { name: 'React Architecture', value: 88 },
  { name: 'Node & Systems', value: 82 },
  { name: 'MongoDB / Mongoose', value: 78 },
  { name: 'UI / Motion Design', value: 75 },
  { name: 'TypeScript', value: 70 },
];

export const coreStack = [
  'React / Next.js',
  'TypeScript',
  'Node.js',
  'MongoDB',
  'Redis',
  'AWS S3 / SES',
  'Strapi',
  'Prisma',
];

export const SECTIONS = [
  { id: 'hero', label: '01 / 06 — HERO' },
  { id: 'expertise', label: '02 / 06 — EXPERTISE' },
  { id: 'about', label: '03 / 06 — ABOUT' },
  { id: 'work', label: '04 / 06 — WORK' },
  { id: 'experience', label: '05 / 06 — EXPERIENCE' },
  { id: 'contact', label: '06 / 06 — CONTACT' },
];
