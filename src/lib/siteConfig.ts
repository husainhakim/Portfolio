import { PROFILE_DATA } from "@/data/profileData";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://husainhakim.me";

export const FALLBACK_URL = "https://husainhakim.vercel.app";

export const SITE_CONFIG = {
  name: PROFILE_DATA.name,
  handle: PROFILE_DATA.handle,
  title: `${PROFILE_DATA.name} — ${PROFILE_DATA.title}`,
  shortTitle: "Husain Hakim Portfolio",
  description:
    "Interactive cybersecurity workspace & offensive security portfolio of Husain Hakim. Featuring penetration testing research, SUID privilege escalation, custom reconnaissance utilities, and backend engineering.",
  url: SITE_URL,
  ogImage: `${SITE_URL}/opengraph-image`,
  keywords: [
    "Husain Hakim",
    "Cybersecurity Portfolio",
    "Offensive Security",
    "Ethical Hacking",
    "Penetration Testing",
    "SUID Privilege Escalation",
    "Network Reconnaissance",
    "Security Automation",
    "File Signature Detector",
    "Password Entropy Audit",
    "Backend Developer Mumbai",
    "ITM Skills University",
    "Linux Security",
  ],
  author: {
    name: PROFILE_DATA.name,
    url: SITE_URL,
    email: PROFILE_DATA.email,
    github: PROFILE_DATA.github,
    linkedin: PROFILE_DATA.linkedin,
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
