export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  location?: string;
  status: 'Current' | 'Completed';
  details: string[];
}

export interface ProfileData {
  name: string;
  handle: string;
  title: string;
  subtitle: string;
  statusLine: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  x: string;
  portfolio: string;
  avatarUrl: string;
  resumeUrl: string;
  summary: string;
  corePillars: string[];
  education: EducationItem[];
  mindset: {
    philosophy: string;
    focusAreas: string[];
    currentLabWork: string[];
  };
}

export const PROFILE_DATA: ProfileData = {
  name: "Husain Hakim",
  handle: "husainhakim",
  title: "Cybersecurity Student | Offensive Security",
  subtitle: "Ethical Hacking • Vulnerability Research • Technical Systems",
  statusLine: "LEARN → BUILD → TEST → DOCUMENT",
  location: "Mumbai, India",
  email: "husain.m.hakim.533@gmail.com",
  github: "https://github.com/husainhakim",
  linkedin: "https://www.linkedin.com/in/husainhakim/",
  x: "https://x.com/Husain533",
  portfolio: "https://husainhakim.vercel.app",
  avatarUrl: "/husain.jpg",
  resumeUrl: "/resume.pdf",
  summary:
    "Cybersecurity student focused on offensive security, ethical hacking, and vulnerability discovery. Passionate about understanding low-level systems, network architecture, and software internals to identify flaws, build defensive utilities, and document technical findings through structured labs and writeups.",
  corePillars: [
    "Reconnaissance & Asset Discovery",
    "Network Protocol Analysis & Scanning",
    "Authentication & Access Control Auditing",
    "Linux Internals & Privilege Escalation",
    "Security Automation & Tool Engineering",
  ],
  education: [
    {
      institution: "ITM Skills University",
      degree: "Bachelor of Technology in Computer Science & Engineering (B.Tech CSE)",
      period: "2023 – 2027 (Expected May 2027)",
      status: "Current",
      details: [
        "Specialization in Computer Science fundamentals, operating systems, distributed architectures, and network protocols.",
        "Hackathon Organizer: Organized three university hackathons with prize pools exceeding ₹6,85,000.",
        "Mentor at ITM Buildathon 3.0 guiding student teams on software engineering and technical system designs.",
      ],
    },
    {
      institution: "SIES College of Arts, Science & Commerce",
      degree: "Higher Secondary Certificate (Junior College / Science)",
      period: "2021 – 2023",
      status: "Completed",
      details: [
        "Focused on Mathematics, Physics, and Computer Science foundations.",
      ],
    },
    {
      institution: "St. Mary's High School",
      degree: "Secondary School Certificate (SSC)",
      period: "2011 – 2021",
      status: "Completed",
      details: [
        "Foundational schooling with strong academic achievements in mathematics and analytical subjects.",
      ],
    },
  ],
  mindset: {
    philosophy:
      "Offensive security is not about indiscriminate exploitation; it is the discipline of deeply understanding complex systems so thoroughly that deviations, misconfigurations, and logic vulnerabilities become evident. Progression is built on systematic experimentation in authorized lab environments.",
    focusAreas: [
      "Ethical Hacking & Penetration Testing Methodologies",
      "Network Discovery, Port Auditing & Service Fingerprinting",
      "Cryptographic Hash Verification & Password Entropy Audits",
      "File Header / Magic Bytes Signature Verification",
      "Web Application Security & API Logic Testing",
    ],
    currentLabWork: [
      "Custom python network probing & protocol packet dissection",
      "Linux file permissions, SUID capabilities & cron privilege escalation vectors",
      "Porting backend architecture experience into automated security reconnaissance utilities",
    ],
  },
};
