import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { FilesystemProvider } from "@/context/FilesystemContext";
import { TourProvider } from "@/context/TourContext";
import { Header } from "@/components/Header";
import { PROFILE_DATA } from "@/data/profileData";
import { SITE_URL, SITE_CONFIG } from "@/lib/siteConfig";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${PROFILE_DATA.name} — ${PROFILE_DATA.title}`,
    template: `%s | ${PROFILE_DATA.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: PROFILE_DATA.name, url: SITE_URL }],
  creator: PROFILE_DATA.name,
  publisher: PROFILE_DATA.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: `${PROFILE_DATA.name} — ${PROFILE_DATA.title}`,
    description: SITE_CONFIG.description,
    siteName: `${PROFILE_DATA.name} — Offensive Security Workspace`,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${PROFILE_DATA.name} — Offensive Security Workspace`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PROFILE_DATA.name} — ${PROFILE_DATA.title}`,
    description: SITE_CONFIG.description,
    creator: "@Husain533",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: PROFILE_DATA.name,
    jobTitle: "Cybersecurity Student & Offensive Security Researcher",
    description: PROFILE_DATA.summary,
    url: SITE_URL,
    image: `${SITE_URL}/husain.jpg`,
    email: `mailto:${PROFILE_DATA.email}`,
    sameAs: [
      PROFILE_DATA.github,
      PROFILE_DATA.linkedin,
      PROFILE_DATA.x,
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_CONFIG.location.city,
      addressRegion: SITE_CONFIG.location.region,
      addressCountry: SITE_CONFIG.location.country,
    },
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "ITM Skills University",
        url: "https://www.itmuniversity.org",
      },
      {
        "@type": "EducationalOrganization",
        name: "SIES College of Arts, Science & Commerce",
      },
    ],
    knowsAbout: [
      "Offensive Security",
      "Ethical Hacking",
      "Penetration Testing",
      "Network Protocol Dissection",
      "Linux Privilege Escalation",
      "Software Systems Security",
      "Reverse Engineering",
    ],
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#service`,
    name: "Husain Hakim — Cybersecurity & Vulnerability Research Consulting",
    description:
      "Offensive security research, penetration testing, network reconnaissance, and security audit services based in Mumbai, India.",
    url: SITE_URL,
    image: `${SITE_URL}/husain.jpg`,
    telephone: "+91-9999999999",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "19.0760",
      longitude: "72.8777",
    },
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
    founder: {
      "@type": "Person",
      name: PROFILE_DATA.name,
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: `${PROFILE_DATA.name} Portfolio`,
    description: SITE_CONFIG.description,
    author: {
      "@id": `${SITE_URL}/#person`,
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (var i = 0; i < registrations.length; i++) {
                    registrations[i].unregister();
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <FilesystemProvider>
            <TourProvider>
              <div className="app-shell">
                <Header />
                <div className="workspace-main">{children}</div>
              </div>
            </TourProvider>
          </FilesystemProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
