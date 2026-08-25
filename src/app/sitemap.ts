import { MetadataRoute } from "next";
import { PROJECTS_DATA } from "@/data/projectsData";
import { WRITEUPS_DATA } from "@/data/writeupsData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://husainhakim.vercel.app";
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/writeups`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/skills`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/experience`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resume.pdf`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = PROJECTS_DATA.map((proj) => ({
    url: `${baseUrl}/projects/${proj.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const writeupRoutes: MetadataRoute.Sitemap = WRITEUPS_DATA.map((w) => ({
    url: `${baseUrl}/writeups/${w.category}/${w.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes, ...writeupRoutes];
}
