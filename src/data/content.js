// ============================================================
// Portfolio Content — single source of truth
// ============================================================

export const IDENTITY = {
  name: "Husain Hakim",
  role: "Backend Developer",
  company: "LetsUpgrade Edtech Pvt Ltd",
  email: "husainh@letsupgrade.in",
  phone: "+91-9137481813",
  github: "https://github.com/husainhakim",
  linkedin: "https://linkedin.com/in/husainhakim",
  prompt: "husain@portfolio:~$",
};

export const ABOUT = {
  summary: `Backend Developer with 1 year of experience in EdTech, skilled in
building REST APIs, comfortable in startup and enterprise environments.
Strong team collaborator, independent worker, focused on continuous
learning and reliable backend solutions.`,
  tagline: "I build the things you never see — and that's the point.",
};

export const SKILLS = [
  {
    category: "Languages",
    items: ["Python", "JavaScript", "C++"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express.js", "Django", "FastAPI"],
  },
  {
    category: "Databases",
    items: ["MongoDB", "SQL", "Firebase"],
  },
  {
    category: "Testing / Automation",
    items: ["Selenium", "Cypress", "JMeter", "Postman"],
  },
  {
    category: "Tools & DevOps",
    items: ["Git", "GitHub", "Jenkins", "VS Code", "OpenCV"],
  },
];

export const EXPERIENCE = [
  {
    title: "Backend Developer",
    company: "LetsUpgrade Edtech Pvt Ltd",
    period: "Sept 2024 – Present",
    bullets: [
      "Developed & maintained backend for a platform with 500+ REST APIs serving 10M+ MongoDB documents.",
      "Migrated 30+ MongoDB Atlas Triggers to Node.js event-driven services — cutting infrastructure costs by up to 95%.",
      "Worked directly with clients, translating requirements into actionable development tasks.",
    ],
  },
];

export const PROJECTS = [
  {
    name: "SmartZone",
    slug: "smartzone",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB"],
    url: "https://delivery-clustering.vercel.app",
    repo: null,
    description:
      "Full-stack logistics platform that uses Union-Find (DSU) clustering for delivery zone optimization. Features interactive maps, analytics dashboard, and JWT + Google OAuth + OTP authentication.",
    highlights: [
      "DSU clustering algorithm for intelligent delivery zone grouping",
      "Interactive map visualization of delivery clusters",
      "Analytics dashboard with real-time metrics",
      "Multi-auth: JWT, Google OAuth, OTP verification",
    ],
  },
  {
    name: "URL-Shortener",
    slug: "url-shortener",
    tech: ["Node.js", "Express.js", "MongoDB", "JWT"],
    url: null,
    repo: "https://github.com/husainhakim/URL-Shortener",
    description:
      "Secure URL shortener service with custom aliases, link expiration, rate limiting, and middleware-based authorization.",
    highlights: [
      "Custom alias support for branded short links",
      "Link expiration with TTL configuration",
      "Rate limiting to prevent abuse",
      "JWT-based middleware authorization",
    ],
  },
  {
    name: "Food-Del",
    slug: "food-del",
    tech: ["MongoDB", "Express.js", "React.js", "Node.js", "JMeter", "Cypress", "Selenium", "Jenkins"],
    url: null,
    repo: "https://github.com/husainhakim/Food-Del",
    description:
      "Full-stack food delivery application with real-time order tracking, admin dashboard, and a full automated testing suite wired into a Jenkins CI/CD pipeline.",
    highlights: [
      "Real-time order tracking with live status updates",
      "Admin dashboard for menu & order management",
      "End-to-end tests: Cypress + Selenium",
      "Performance tests: JMeter load testing",
      "Jenkins CI/CD pipeline integration",
    ],
  },
];

export const EDUCATION = [
  {
    degree: "B.Tech Computer Science",
    institution: "ITM Skills University",
    period: "Aug 2023 – May 2027",
    cgpa: "8.8 / 10",
  },
];

export const ACHIEVEMENTS = [
  "Solved 200+ LeetCode problems; HackerRank 5★ in Python & Java",
  "Certifications: MongoDB University, Advanced Selenium (LambdaTest), Java Programming (Great Learning)",
  "Organized 2 hackathons with a combined prize pool of ₹6,00,000+",
  "Mentor @ ITM Buildathon 3.0",
  "Volunteer @ Swift Mumbai",
];

export const ASCII_LOGO = `
██╗  ██╗██╗   ██╗███████╗ █████╗ ██╗███╗   ██╗
██║  ██║██║   ██║██╔════╝██╔══██╗██║████╗  ██║
███████║██║   ██║███████╗███████║██║██╔██╗ ██║
██╔══██║██║   ██║╚════██║██╔══██║██║██║╚██╗██║
██║  ██║╚██████╔╝███████║██║  ██║██║██║ ╚████║
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝`;

export const BOOT_LOGS = [
  { text: "BIOS v2.4.1 — Portfolio OS kernel loading...", delay: 0 },
  { text: "Checking system integrity............... [OK]", delay: 180 },
  { text: "Mounting /dev/skills........................ [OK]", delay: 320 },
  { text: "Loading skills.json......................... [OK]", delay: 460 },
  { text: "Loading experience.json..................... [OK]", delay: 580 },
  { text: "Loading projects.json....................... [OK]", delay: 700 },
  { text: "Connecting to github.com/husainhakim....... [OK]", delay: 880 },
  { text: "Initializing command parser................. [OK]", delay: 1020 },
  { text: "Spawning shell process...................... [OK]", delay: 1160 },
  { text: "Starting portfolio.sh....................... [OK]", delay: 1280 },
  { text: "", delay: 1400 },
  { text: "Welcome, visitor. System ready.", delay: 1480 },
];
