export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  type: "Full-Time / Internship" | "Leadership & Community" | "Academic";
  period: string;
  duration: string;
  location: string;
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
    role: "Backend Engineer",
    organization: "LetsUpgrade Edtech Pvt Ltd",
    type: "Full-Time / Internship",
    period: "Sept 2025 – July 2026",
    duration: "10 Months",
    location: "Mumbai, India (Hybrid)",
    technologies: [
      "Node.js",
      "Express.js",
      "MongoDB Atlas",
      "Distributed Event Architecture",
      "RESTful APIs",
      "Redis",
      "Postman",
    ],
    summary:
      "Core backend engineer responsible for architecting scalable microservices, re-engineering database trigger infrastructure into resilient event-driven workers, and maintaining production services supporting high-throughput educational workflows.",
    responsibilities: [
      "Architected and deployed event-driven Node.js worker services to replace legacy database-level triggers, dramatically streamlining system observability and operational reliability.",
      "Designed, developed, and deployed over 150+ core REST endpoints for the company, ensuring scalable backend architecture and reliable API lifecycles.",
      "Collaborated cross-functionally with product managers and frontend teams to translate technical requirements into robust database schemas and high-performance API endpoints.",
      "Implemented stringent server-side payload validation, sanitized database queries, and tuned indexing strategies to eliminate query bottlenecks.",
      "Authored comprehensive API documentation and Postman collections to ensure smooth client and mobile client integration.",
    ],
    technicalImpact: [
      {
        metric: "~95% Cost Reduction",
        description:
          "Successfully migrated 30+ MongoDB Atlas triggers into decoupled Node.js event listeners, mitigating cloud trigger execution overhead and reducing infrastructure compute expenses.",
      },
      {
        metric: "150+ APIs Authored",
        description:
          "Wrote and deployed over 150 RESTful APIs from scratch for the company, cultivating deep expertise in scalable architecture, API lifecycle management, and secure endpoint design.",
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
    ],
  },
];
