"use client";

import type { Project } from "@/lib/data";
import { diagramConfigs } from "@/lib/diagram-data";
import ProjectHero from "./ProjectHero";
import ProjectChallenge from "./ProjectChallenge";
import ProjectDeepDive from "./ProjectDeepDive";
import ProjectHardParts from "./ProjectHardParts";
import ProjectInfrastructure from "./ProjectInfrastructure";
import InfraDiagram from "./InfraDiagram";
import ProjectTradeoffs from "./ProjectTradeoffs";
import ProjectRetrospective from "./ProjectRetrospective";
import ProjectFooter from "./ProjectFooter";

interface ProjectCaseStudyProps {
  project: Project;
  allProjects: Project[];
}

export default function ProjectCaseStudy({ project, allProjects }: ProjectCaseStudyProps) {
  const cs = project.caseStudy;
  const hasDiagram = project.slug in diagramConfigs;

  if (!cs) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="text-center">
          <p className="font-label text-xs uppercase tracking-[0.3em] text-primary/60 mb-4">
            Project
          </p>
          <h1 className="font-headline text-4xl md:text-5xl text-on-surface">
            {project.title}
          </h1>
          <p className="font-body text-on-surface-variant/50 mt-4">
            Case study coming soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProjectHero project={project} />
      <ProjectChallenge caseStudy={cs} />
      <ProjectDeepDive caseStudy={cs} />
      <ProjectHardParts caseStudy={cs} />
      {cs.infrastructure && <ProjectInfrastructure caseStudy={cs} />}
      {hasDiagram && <InfraDiagram slug={project.slug} />}
      <ProjectTradeoffs caseStudy={cs} />
      <ProjectRetrospective caseStudy={cs} />
      <ProjectFooter currentProject={project} allProjects={allProjects} />
    </>
  );
}
