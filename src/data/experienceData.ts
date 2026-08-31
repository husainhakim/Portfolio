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
    role: "Backend Developer",
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
      "FastAPI",
      "Django",
      "Postman",
    ],
    summary:
      "Core backend developer responsible for architecting scalable microservices, re-engineering database trigger infrastructure into resilient event-driven workers, and maintaining production services supporting high-throughput educational workflows.",
    responsibilities: [
      "Migrated 30+ MongoDB Atlas Triggers to Node.js event-driven services, reducing infrastructure costs by up to 95% while improving scalability and maintainability.",
      "Developed and maintained backend services for a platform with 300+ REST APIs and 10M+ MongoDB documents, delivering production features and working with large-scale data systems.",
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
    ],
  },
];
