import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { FilesystemProvider } from "@/context/FilesystemContext";
import { Header } from "@/components/Header";
import { PROFILE_DATA } from "@/data/profileData";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f2" },
    { media: "(prefers-color-scheme: dark)", color: "#101114" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://husainhakim.vercel.app"),
  title: `${PROFILE_DATA.name} — ${PROFILE_DATA.title}`,
  description:
    "Cybersecurity workspace and technical portfolio of Husain Hakim. Featuring offensive security tooling, network reconnaissance, SUID privilege escalation research, backend architecture, and verified lab writeups.",
  keywords: [
    "Husain Hakim",
    "Cybersecurity",
    "Offensive Security",
    "Ethical Hacking",
    "Penetration Testing",
    "Network Security",
    "Privilege Escalation",
    "Password Audit",
    "Network Scanner",
    "File Signature Detector",
    "Backend Developer",
    "ITM Skills University",
  ],
  authors: [{ name: PROFILE_DATA.name, url: PROFILE_DATA.portfolio }],
  creator: PROFILE_DATA.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: PROFILE_DATA.portfolio,
    title: `${PROFILE_DATA.name} — ${PROFILE_DATA.title}`,
    description:
      "Interactive cybersecurity workspace & offensive security portfolio. Virtual filesystem explorer and integrated CLI terminal.",
    siteName: `${PROFILE_DATA.name} Portfolio`,
    images: [
      {
        url: "/husain.jpg",
        width: 800,
        height: 800,
        alt: PROFILE_DATA.name,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${PROFILE_DATA.name} — ${PROFILE_DATA.title}`,
    description:
      "Cybersecurity student dedicated to offensive security, penetration testing research, and systems engineering.",
    images: ["/husain.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PROFILE_DATA.name,
    jobTitle: "Cybersecurity Student & Backend Engineer",
    description: PROFILE_DATA.summary,
    url: PROFILE_DATA.portfolio,
    sameAs: [PROFILE_DATA.github, PROFILE_DATA.linkedin],
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "ITM Skills University",
      },
      {
        "@type": "EducationalOrganization",
        name: "SIES College",
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <FilesystemProvider>
            <div className="app-shell">
              <Header />
              <div className="workspace-main">{children}</div>
            </div>
          </FilesystemProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
