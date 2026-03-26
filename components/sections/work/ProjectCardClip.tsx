"use client";

import { Project } from "@/lib/data";

/**
 * ProjectCardClip — default reveal style.
 * The parent WorkSection drives the clip-path reveal via ScrollTrigger.
 * This card adds: grayscale→colour image transition + arrow icon on hover.
 */
export default function ProjectCardClip({ project }: { project: Project }) {
  return (
    <div className="relative border-[0.5px] border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-low group/card transition-shadow duration-700 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      {/* Image */}
      <div className="aspect-video relative overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 grid-overlay opacity-20" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover grayscale opacity-40 group-hover/card:grayscale-0 group-hover/card:opacity-80 transition-all duration-1000 group-hover/card:scale-110"
          src={project.image}
          alt={project.title}
        />
        <div className="absolute top-5 right-5 w-11 h-11 rounded-full glass-card flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 border-[0.5px] border-white/10">
          <span className="material-symbols-outlined text-primary">
            north_east
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-7 md:p-8 space-y-5">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-2 text-on-surface font-headline">
            {project.title}
          </h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            {project.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-1.5 rounded-full border-[0.5px] border-outline-variant/30 font-label text-[10px] uppercase tracking-wider bg-surface-container-highest/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
