export interface ContractProof {
  id: string;
  termNumber: number;
  termTitle: string;
  badge: string;
  period: string;
  duration: string;
  role: string;
  summary: string;
  keyContributions: string[];
  fileUrl: string;
  fileName: string;
  fileSize: string;
  verified: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  type: "Full-Time / Internship" | "Leadership & Community" | "Academic";
  period: string;
  duration: string;
  totalDurationMonths: number;
  location: string;
  contracts: ContractProof[];
  technologies: string[];
  summary: string;
  responsibilities: string[];
  technicalImpact: {
    metric: string;
    description: string;
  }[];
  keyTakeaways: string[];
}

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: "letsupgrade-backend",
    role: "Backend Developer",
    organization: "LetsUpgrade Edtech Pvt Ltd",
    type: "Full-Time / Internship",
    period: "Sept 2025 – July 2026",
    duration: "10 Months (3 Consecutive Contracts)",
    totalDurationMonths: 10,
    location: "Mumbai, India (Hybrid)",
    contracts: [
      {
        id: "contract-1",
        termNumber: 1,
        termTitle: "Contract Term 1: Initial Backend Engineering",
        badge: "Contract 1 • 4 Months",
        period: "Sept 2025 – Dec 2025",
        duration: "4 Months",
        role: "Backend Developer",
        summary: "Initial engagement architecting backend services, initiating MongoDB Atlas trigger migrations, and constructing high-throughput REST APIs.",
        keyContributions: [
          "Initiated decoupling of legacy database triggers into asynchronous Node.js background workers.",
          "Engineered RESTful API endpoints supporting student onboarding and assessment services.",
          "Implemented strict schema validation and query optimization for high-traffic endpoints.",
        ],
        fileUrl: "/Experience/HusainLU_Sept-Dec25.jpeg",
        fileName: "HusainLU_Sept-Dec25.jpeg",
        fileSize: "97.4 KB",
        verified: true,
      },
      {
        id: "contract-2",
        termNumber: 2,
        termTitle: "Contract Term 2: Contract Renewal & Infrastructure Scale",
        badge: "Contract 2 • 4 Months (Renewal)",
        period: "Jan 2026 – Apr 2026",
        duration: "4 Months",
        role: "Backend Developer",
        summary: "Contract renewed following strong technical performance; focused on scaling event-driven microservices, reducing compute costs by 95%, and handling large-scale database operations.",
        keyContributions: [
          "Migrated 30+ MongoDB Atlas Triggers into dedicated Node.js event-driven workers, cutting infrastructure compute costs by up to 95%.",
          "Maintained and optimized backend services across 300+ REST APIs and 10M+ MongoDB documents.",
          "Implemented robust defensive security checks, input sanitization, and index tuning across critical database collections.",
        ],
        fileUrl: "/Experience/HusainLU_Jan-Apr26.jpeg",
        fileName: "HusainLU_Jan-Apr26.jpeg",
        fileSize: "174.5 KB",
        verified: true,
      },
      {
        id: "contract-3",
        termNumber: 3,
        termTitle: "Contract Term 3: Contract Extension & Enterprise Delivery",
        badge: "Contract 3 • 3-4 Months (Extension)",
        period: "Apr 2026 – July 2026",
        duration: "3-4 Months",
        role: "Backend Developer",
        summary: "Extended for a third consecutive contract term; led client architecture discussions, refined production service resilience, and delivered comprehensive API specifications.",
        keyContributions: [
          "Participated in core client architecture meetings to translate complex business workflows into scalable backend implementations.",
          "Standardized API documentation and Postman collections across distributed development teams.",
          "Conducted backend load testing and error budget management for mission-critical learning workflows.",
        ],
        fileUrl: "/Experience/HusainLU_Apr-Jul26.jpeg",
        fileName: "HusainLU_Apr-Jul26.jpeg",
        fileSize: "92.5 KB",
        verified: true,
      },
    ],
    technologies: [
      "Node.js",
      "Express.js",
      "MongoDB Atlas",
      "Distributed Event Architecture",
      "RESTful APIs",
      "FastAPI",
      "Django",
      "Postman",
    ],
    summary:
      "Core backend developer for 10 continuous months across three consecutive contracts (Sept–Dec 2025, Jan–Apr 2026, and Apr–July 2026). Responsible for architecting scalable microservices, re-engineering database trigger infrastructure into resilient event-driven workers, reducing cloud compute expenses by up to 95%, and maintaining production services across 300+ REST APIs and 10M+ MongoDB documents.",
    responsibilities: [
      "Completed 10 continuous months of production backend engineering spanning 3 consecutive contract renewals and extensions.",
      "Migrated 30+ MongoDB Atlas Triggers to Node.js event-driven services, reducing infrastructure costs by up to 95% while improving scalability and maintainability.",
      "Developed and maintained backend services for a platform with 300+ REST APIs and 10M+ MongoDB documents, delivering production features and working with large-scale data systems.",
      "Collaborated cross-functionally with product managers and frontend teams to translate technical requirements into robust database schemas and high-performance API endpoints.",
      "Implemented stringent server-side payload validation, sanitized database queries, and tuned indexing strategies to eliminate query bottlenecks.",
      "Authored comprehensive API documentation and Postman collections to ensure smooth client and mobile client integration.",
    ],
    technicalImpact: [
      {
        metric: "10-Month Continuous Tenancy",
        description:
          "Successfully retained and renewed across 3 consecutive contract terms: Sept–Dec 2025 (Contract 1), Jan–Apr 2026 (Contract 2), and Apr–July 2026 (Contract 3).",
      },
      {
        metric: "~95% Cost Reduction",
        description:
          "Successfully migrated 30+ MongoDB Atlas triggers into decoupled Node.js event listeners, mitigating cloud trigger execution overhead and reducing infrastructure compute expenses.",
      },
      {
        metric: "300+ REST APIs & 10M+ Docs",
        description:
          "Developed and maintained backend services for a platform with 300+ REST APIs and 10M+ MongoDB documents, delivering production features and working with large-scale data systems.",
      },
      {
        metric: "Client Architecture Meetings",
        description:
          "Actively participated in core client meetings to capture technical requirements, bridging the gap between business needs and robust backend architectural solutions.",
      },
    ],
    keyTakeaways: [
      "Deep understanding of distributed backend systems, event loops, and asynchronous I/O at production scale.",
      "Practical experience in defensive API design, ensuring authorization checks and payload validation are strictly enforced at the service tier.",
      "Experience optimizing high-concurrency database queries against large datasets.",
      "Proven reliability and value delivery demonstrated through 3 consecutive contract cycles over 10 continuous months.",
    ],
  },
];
