import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/data/site";
import { getProjectBySlug } from "@/lib/data/portfolio-repository";
import { ProjectCaseStudyClient } from "@/components/ProjectCaseStudyClient";

export const revalidate = 3600;

export async function generateStaticParams() {
  return PROJECTS.filter((p) => p.status === "published").map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { project } = await getProjectBySlug(slug);
  if (!project) {
    return { title: "Case Study Not Found" };
  }
  const shortTitle =
    project.title.length > 48 ? `${project.title.slice(0, 45).trim()}...` : project.title;
  const shortDesc =
    project.summaryEn.length > 155
      ? `${project.summaryEn.slice(0, 152).trim()}...`
      : project.summaryEn;
  return {
    title: shortTitle,
    description: shortDesc,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { project, nextProject } = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectCaseStudyClient project={project} nextProject={nextProject} />;
}
