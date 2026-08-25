export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export const SKILLS_DATA: SkillCategory[] = [
  {
    id: "languages",
    category: "Programming Languages",
    skills: ["Python", "JavaScript", "C++"],
  },
  {
    id: "networking-infrastructure",
    category: "Networking & Infrastructure",
    skills: [
      "TCP/IP & Network Protocols",
      "Subnetting & CIDR",
      "DNS & DHCP",
      "NAT / PAT",
      "VLANs",
      "Network Scanning & Enumeration",
      "Network Traffic Analysis",
    ],
  },
  {
    id: "linux-systems",
    category: "Linux & Systems",
    skills: [
      "Linux Administration",
      "Linux CLI",
      "File Permissions & Ownership",
      "User & Group Management",
      "Process & Service Management",
      "SSH",
      "Filesystem & Mount Management",
      "Bash/Shell",
    ],
  },
  {
    id: "development-backend",
    category: "Development / Backend",
    skills: [
      "React.js",
      "Node.js",
      "Express.js",
      "REST API Development",
      "MongoDB",
      "SQL",
      "MERN Stack",
      "Event-Driven Backend Development",
      "API Testing",
      "Django",
      "FastAPI",
    ],
  },
  {
    id: "cybersecurity",
    category: "Cybersecurity",
    skills: [
      "ARP Spoof Detection",
      "JWT Security Analysis",
      "SUID/Privilege Escalation Auditing",
      "Vulnerability Scanning & Enumeration",
    ],
  },
  {
    id: "devops-engineering",
    category: "DevOps / Engineering",
    skills: [
      "Git",
      "GitHub",
      "CI/CD",
      "Jenkins",
      "Docker",
      "Vercel",
      "MongoDB Atlas",
      "Automated Testing",
      "RabbitMQ",
    ],
  },
  {
    id: "testing",
    category: "Testing",
    skills: ["Selenium", "Cypress", "JMeter", "Postman"],
  },
  {
    id: "tools",
    category: "Tools",
    skills: ["VS Code", "OpenCV"],
  },
  {
    id: "soft-skills",
    category: "Soft Skills",
    skills: [
      "Problem-Solving",
      "Team Collaboration",
      "Critical Thinking",
      "Time Management",
      "Adaptability",
    ],
  },
];
