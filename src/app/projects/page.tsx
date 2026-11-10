import type { Metadata } from "next";
import { getPortfolioSnapshot } from "@/lib/data/portfolio-repository";
import { ProjectsArchiveClient } from "@/components/ProjectsArchiveClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Project Archive & Case Studies",
  description:
    "Deep-dive architectural case studies, database trade-offs, and system metrics by Fadli Hifziansyah.",
  alternates: {
    canonical: "/projects",
  },
};

export default async function ProjectsPage() {
  const snapshot = await getPortfolioSnapshot();
  return <ProjectsArchiveClient projects={snapshot.projects} />;
}
