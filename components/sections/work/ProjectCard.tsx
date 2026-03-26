"use client";

import { useRouter } from "next/navigation";
import { Project } from "@/lib/data";

interface ProjectCardProps {
  project: Project;
  index: number;
  total: number;
}

export default function ProjectCard({ project, index, total }: ProjectCardProps) {
  const router = useRouter();

  const label = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/projects/${project.slug}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/projects/${project.slug}`);
        }
      }}
      className="group relative rounded-xl overflow-hidden bg-[#111111] border border-[#1f1f1f] cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_16px_48px_rgba(0,0,0,0.5),0_0_0_1px_rgba(229,196,151,0.15)]"
    >
      {/* Image section */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
        />

        {/* Gradient overlay — fades in on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* CTA overlay */}
        <div className="absolute inset-0 flex items-end justify-between p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-primary text-sm font-medium flex items-center gap-1.5">
            View Case Study
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>

        {/* Slide index watermark */}
        <div
          className="absolute bottom-3 right-4 font-headline font-bold text-white/[0.05] select-none pointer-events-none leading-none"
          style={{ fontSize: "4rem" }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Content section */}
      <div className="p-6 md:p-7 space-y-4">
        {/* Label */}
        <div className="flex items-center gap-3">
          <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/50">
            {label}
          </span>
          <div className="h-px flex-1 bg-primary/10" />
        </div>

        {/* Title */}
        <h3 className="font-headline font-bold text-on-surface text-xl md:text-2xl group-hover:text-primary transition-colors duration-300">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full border-[0.5px] border-primary/25 font-label text-[10px] uppercase tracking-wider bg-primary/5 text-primary/70 transition-colors duration-300 group-hover:bg-primary/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
