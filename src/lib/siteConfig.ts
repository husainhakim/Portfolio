import { PROFILE_DATA } from "@/data/profileData";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://portfolio.husainhakim.workers.dev";

export const FALLBACK_URL = "https://portfolio.husainhakim.workers.dev";

export const SITE_CONFIG = {
  name: "Husain Hakim",
  jobTitle: "Computer Science Student",
  alumniOf: "ITM Skills University",
  handle: PROFILE_DATA.handle,
  title: "Husain Hakim | Computer Science Student & Cybersecurity Portfolio",
  shortTitle: "Husain Hakim Portfolio",
  description:
    "Portfolio of Husain Hakim, Computer Science Student at ITM Skills University focused on cybersecurity, offensive security, and network telemetry.",
  url: SITE_URL,
  ogImage: `${SITE_URL}/opengraph-image`,
  keywords: [
    "Husain Hakim",
    "Computer Science Student",
    "ITM Skills University",
    "Cybersecurity Portfolio",
    "Offensive Security",
    "Defensive Security",
    "Network Telemetry",
    "Ethical Hacking",
    "Penetration Testing",
    "SUID Privilege Escalation",
    "Network Reconnaissance",
    "CYBER SONAR",
    "Security Automation",
    "File Signature Detector",
    "Password Entropy Audit",
    "Backend Developer Mumbai",
    "Linux Security",
  ],
  author: {
    name: "Husain Hakim",
    jobTitle: "Computer Science Student",
    alumniOf: "ITM Skills University",
    url: SITE_URL,
    email: PROFILE_DATA.email,
    github: "https://github.com/husainhakim",
    linkedin: "https://www.linkedin.com/in/husainhakim/",
    medium: PROFILE_DATA.medium,
    x: PROFILE_DATA.x,
  },
  location: {
    city: "Mumbai",
    region: "Maharashtra",
    country: "India",
    postalCode: "400001",
  },
};

export function getCanonicalUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}`;
}
