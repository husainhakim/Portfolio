import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ClientWorkspace } from "@/components/ClientWorkspace";
import { PROJECTS_DATA } from "@/data/projectsData";
import { WRITEUPS_DATA } from "@/data/writeupsData";
import { BLOGS_DATA } from "@/data/blogsData";
import { PROFILE_DATA } from "@/data/profileData";
import { SITE_CONFIG, getCanonicalUrl } from "@/lib/siteConfig";

interface PageProps {
  params: Promise<{ path?: string[] }>;
}

export function generateStaticParams() {
  const staticPaths: { path?: string[] }[] = [
    { path: [] },
    { path: ["about"] },
    { path: ["projects"] },
    { path: ["writeups"] },
    { path: ["blogs"] },
    { path: ["skills"] },
    { path: ["experience"] },
    { path: ["contact"] },
    { path: ["vault"] },
  ];

  function collectVfsPaths(node: import("@/data/filesystemData").FSNode) {
    const parts = node.path.split("/").filter(Boolean);
    staticPaths.push({ path: parts });
    if (node.type === "directory") {
      node.children.forEach(collectVfsPaths);
    }
  }
  collectVfsPaths(VIRTUAL_FS);

  PROJECTS_DATA.forEach((p) => {
    staticPaths.push({ path: ["projects", p.slug] });
  });

  WRITEUPS_DATA.forEach((w) => {
    staticPaths.push({ path: ["writeups", w.category, w.slug] });
  });

  BLOGS_DATA.forEach((b) => {
    staticPaths.push({ path: ["blogs", b.slug] });
  });

  return staticPaths;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const pathArray = resolvedParams.path || [];
  const fullPath = `/${pathArray.join("/")}`;
  const canonicalUrl = getCanonicalUrl(fullPath);

  // 1. Root Homepage
  if (pathArray.length === 0) {
    return {
      title: "Portfolio - Husain Hakim",
      description: SITE_CONFIG.description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: "Portfolio - Husain Hakim",
        description: SITE_CONFIG.description,
        url: canonicalUrl,
        type: "profile",
      },
    };
  }

  const segment0 = pathArray[0].toLowerCase();

  // 2. About
  if (segment0 === "about") {
    const title = "About Husain Hakim — Cybersecurity & Systems Mindset";
    const description =
      "Background, education at ITM Skills University, offensive security philosophy, and technical methodologies of Husain Hakim.";
    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: { title, description, url: canonicalUrl, type: "profile" },
    };
  }

  // 3. Projects
  if (segment0 === "projects") {
    if (pathArray.length > 1) {
      const slug = pathArray[1];
      const project = PROJECTS_DATA.find((p) => p.slug === slug);
      if (project) {
        const title = `${project.name} — Offensive Security Tooling`;
        const description = project.summary;
        return {
          title,
          description,
          alternates: { canonical: canonicalUrl },
          openGraph: {
            title,
            description,
            url: canonicalUrl,
            type: "article",
          },
        };
      }
    }

    const title = "Security Projects & Tools — Husain Hakim";
    const description =
      "Bespoke cybersecurity and network reconnaissance utilities engineered by Husain Hakim, including CYBER // SONAR and File Signature Detector.";
    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: { title, description, url: canonicalUrl },
    };
  }

  // 4. Writeups
  if (segment0 === "writeups") {
    if (pathArray.length > 2) {
      const category = pathArray[1];
      const slug = pathArray[2];
      const writeup = WRITEUPS_DATA.find(
        (w) => w.category === category && w.slug === slug
      );
      if (writeup) {
        const title = `${writeup.title} — Security Research Writeup`;
        const description = writeup.summary;
        return {
          title,
          description,
          alternates: { canonical: canonicalUrl },
          openGraph: {
            title,
            description,
            url: canonicalUrl,
            type: "article",
          },
        };
      }
    }

    const title = "Security Research & Lab Writeups — Husain Hakim";
    const description =
      "Technical offensive security writeups on SUID binary privilege escalation, network scanning methodologies, and defense architectures.";
    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: { title, description, url: canonicalUrl },
    };
  }

  // 5. Blogs
  if (segment0 === "blogs") {
    if (pathArray.length > 1) {
      const slug = pathArray[1];
      const blog = BLOGS_DATA.find((b) => b.slug === slug);
      if (blog) {
        const title = `${blog.title} — Technical Publication`;
        const description = blog.summary;
        return {
          title,
          description,
          alternates: { canonical: canonicalUrl },
          openGraph: {
            title,
            description,
            url: canonicalUrl,
            type: "article",
          },
        };
      }
    }

    const title = "Technical Articles & Publications — Husain Hakim";
    const description =
      "In-depth articles covering backend architectures, security testing, and systems engineering by Husain Hakim.";
    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: { title, description, url: canonicalUrl },
    };
  }

  // 6. Skills
  if (segment0 === "skills") {
    const title = "Technical Skills & Security Matrix — Husain Hakim";
    const description =
      "Technical competencies in Python, C++, Linux Kernel & Internals, Network Packet Analysis, and Penetration Testing.";
    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: { title, description, url: canonicalUrl },
    };
  }

  // 7. Experience
  if (segment0 === "experience") {
    const title = "Professional Experience & Leadership — Husain Hakim";
    const description =
      "Professional track record as Backend Developer at LetsUpgrade and University Hackathon Organizer (₹6,85,000+ Prize Pools).";
    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: { title, description, url: canonicalUrl },
    };
  }

  // 8. Contact
  if (segment0 === "contact") {
    const title = "Contact & Communications — Husain Hakim";
    const description =
      "Get in touch with Husain Hakim for cybersecurity research, penetration testing collaborations, or software development.";
    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: { title, description, url: canonicalUrl },
    };
  }

  // 9. Vault
  if (segment0 === "vault") {
    const title = "Personal Security Vault — Husain Hakim";
    const description = "Encrypted personal vault and security credentials portal.";
    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: { title, description, url: canonicalUrl },
    };
  }

  // Fallback
  return {
    title: "Portfolio - Husain Hakim",
    description: SITE_CONFIG.description,
    alternates: { canonical: canonicalUrl },
  };
}

import { notFound } from "next/navigation";
import { findNodeByPath, VIRTUAL_FS } from "@/data/filesystemData";

function isValidPath(pathArray: string[]): boolean {
  if (pathArray.length === 0) return true;
  const seg0 = pathArray[0].toLowerCase();
  
  if (seg0 === "about" || seg0 === "skills" || seg0 === "experience" || seg0 === "contact" || seg0 === "vault") {
    return pathArray.length === 1;
  }
  if (seg0 === "projects") {
    if (pathArray.length === 1) return true;
    if (pathArray.length === 2) return PROJECTS_DATA.some((p) => p.slug === pathArray[1]);
    return false;
  }
  if (seg0 === "writeups") {
    if (pathArray.length === 1) return true;
    if (pathArray.length === 3) return WRITEUPS_DATA.some((w) => w.category === pathArray[1] && w.slug === pathArray[2]);
    return false;
  }
  if (seg0 === "blogs") {
    if (pathArray.length === 1) return true;
    if (pathArray.length === 2) return BLOGS_DATA.some((b) => b.slug === pathArray[1]);
    return false;
  }
  if (seg0 === "home") {
    return findNodeByPath(`/${pathArray.join("/")}`, VIRTUAL_FS) !== null;
  }
  return false;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const pathArray = resolvedParams.path || [];

  if (!isValidPath(pathArray)) {
    notFound();
  }

  const fullPath = `/${pathArray.join("/")}`;
  const canonicalUrl = getCanonicalUrl(fullPath);

  // Build Breadcrumbs
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Workspace Root",
      item: SITE_CONFIG.url,
    },
  ];

  let currentBuiltPath = "";
  pathArray.forEach((seg, idx) => {
    currentBuiltPath += `/${seg}`;
    const name = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
    breadcrumbItems.push({
      "@type": "ListItem",
      position: idx + 2,
      name,
      item: getCanonicalUrl(currentBuiltPath),
    });
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  // Check if active item is a project
  let projectSchema = null;
  let activeProject = null;
  if (pathArray[0] === "projects" && pathArray[1]) {
    activeProject = PROJECTS_DATA.find((p) => p.slug === pathArray[1]);
    if (activeProject) {
      projectSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: activeProject.name,
        description: activeProject.summary,
        applicationCategory: "SecurityApplication",
        operatingSystem: "Linux, macOS, Windows",
        author: {
          "@type": "Person",
          name: PROFILE_DATA.name,
          url: SITE_CONFIG.url,
        },
        codeRepository: activeProject.githubUrl || PROFILE_DATA.github,
      };
    }
  }

  // Check if active item is a writeup
  let writeupSchema = null;
  let activeWriteup = null;
  if (pathArray[0] === "writeups" && pathArray[2]) {
    activeWriteup = WRITEUPS_DATA.find(
      (w) => w.category === pathArray[1] && w.slug === pathArray[2]
    );
    if (activeWriteup) {
      writeupSchema = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: activeWriteup.title,
        description: activeWriteup.summary,
        author: {
          "@type": "Person",
          name: PROFILE_DATA.name,
          url: SITE_CONFIG.url,
        },
        datePublished: activeWriteup.date || "2025-01-01",
        mainEntityOfPage: canonicalUrl,
      };
    }
  }

  // Determine single primary heading for semantic crawlable source
  let semanticHeading = `${PROFILE_DATA.name} — ${PROFILE_DATA.title}`;
  let semanticDescription = PROFILE_DATA.summary;

  if (activeProject) {
    semanticHeading = `${activeProject.name} — Offensive Security Tool`;
    semanticDescription = activeProject.summary;
  } else if (activeWriteup) {
    semanticHeading = `${activeWriteup.title} — Security Writeup`;
    semanticDescription = activeWriteup.summary;
  } else if (pathArray[0] === "about") {
    semanticHeading = `About ${PROFILE_DATA.name} — Offensive Security & Systems`;
    semanticDescription = PROFILE_DATA.summary;
  } else if (pathArray[0] === "projects") {
    semanticHeading = `Offensive Security & Systems Engineering Projects`;
    semanticDescription = "Directory of security utilities and network tools.";
  } else if (pathArray[0] === "writeups") {
    semanticHeading = `Cybersecurity Research & Penetration Testing Writeups`;
    semanticDescription = "Vulnerability research and lab postmortems.";
  } else if (pathArray[0] === "contact") {
    semanticHeading = `Contact ${PROFILE_DATA.name}`;
    semanticDescription = `Get in touch for security research and engineering collaborations.`;
  }

  return (
    <>
      {/* Structured Breadcrumbs Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Project Software Schema if applicable */}
      {projectSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
        />
      )}

      {/* Writeup Article Schema if applicable */}
      {writeupSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(writeupSchema) }}
        />
      )}

      {/* Client Interactive Workspace */}
      <ClientWorkspace />

      {/* Crawlable Semantic Layer with single distinct H1 */}
      <section
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
        aria-hidden="true"
      >
        <h1>{semanticHeading}</h1>
        <p>{semanticDescription}</p>
        <nav aria-label="Internal Workspace Sitemap">
          <ul>
            <li><Link href="/">/home/husain (Root)</Link></li>
            <li><Link href="/about">/home/husain/about.md</Link></li>
            <li><Link href="/projects">/home/husain/projects</Link></li>
            {PROJECTS_DATA.map((p) => (
              <li key={p.id}>
                <Link href={`/projects/${p.slug}`}>{p.name}</Link>
              </li>
            ))}
            <li><Link href="/writeups">/home/husain/writeups</Link></li>
            {WRITEUPS_DATA.map((w) => (
              <li key={w.id}>
                <Link href={`/writeups/${w.category}/${w.slug}`}>{w.title}</Link>
              </li>
            ))}
            <li><Link href="/blogs">/home/husain/blogs</Link></li>
            <li><Link href="/skills">/home/husain/skills</Link></li>
            <li><Link href="/experience">/home/husain/experience</Link></li>
            <li><Link href="/contact">/home/husain/contact</Link></li>
          </ul>
        </nav>
      </section>
    </>
  );
}
