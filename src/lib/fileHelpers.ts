import { ROOT_PATH } from "@/data/filesystemData";

export interface BreadcrumbSegment {
  name: string;
  path: string;
  isLast: boolean;
}

export function buildBreadcrumbs(currentPath: string): BreadcrumbSegment[] {
  if (currentPath === ROOT_PATH) {
    return [{ name: "Home", path: ROOT_PATH, isLast: true }];
  }

  const relative = currentPath.slice(ROOT_PATH.length);
  const segments = relative.split("/").filter(Boolean);

  const result: BreadcrumbSegment[] = [
    { name: "Home", path: ROOT_PATH, isLast: segments.length === 0 },
  ];

  let accumulated = ROOT_PATH;
  segments.forEach((seg, idx) => {
    accumulated += `/${seg}`;
    result.push({
      name: seg,
      path: accumulated,
      isLast: idx === segments.length - 1,
    });
  });

  return result;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileBadgeVariant(fileType: string): {
  label: string;
  colorClass: string;
} {
  switch (fileType) {
    case "project":
      return { label: "Project", colorClass: "badge-project" };
    case "writeup":
      return { label: "Writeup", colorClass: "badge-writeup" };
    case "blog":
      return { label: "Blog", colorClass: "badge-blog" };
    case "learning":
      return { label: "Path", colorClass: "badge-learning" };
    case "experience":
      return { label: "Career", colorClass: "badge-experience" };
    case "contact":
      return { label: "Contact", colorClass: "badge-contact" };
    case "pdf":
      return { label: "PDF Doc", colorClass: "badge-pdf" };
    case "markdown":
      return { label: "Markdown", colorClass: "badge-markdown" };
    default:
      return { label: "File", colorClass: "badge-default" };
  }
}
