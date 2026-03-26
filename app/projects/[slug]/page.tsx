import { notFound } from "next/navigation";
import IntroOverlay from "@/components/IntroOverlay";
import ProjectCaseStudy from "@/components/project/ProjectCaseStudy";
import { projects } from "@/lib/data";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) return notFound();

  return (
    <>
      <IntroOverlay />

      <main>
        <ProjectCaseStudy project={project} allProjects={projects} />
      </main>
    </>
  );
}
