"use client";

import { useState } from "react";
import { Project } from "@/lib/data";

/**
 * ProjectCardGlitch — RGB-split glitch effect on the title when hovered.
 * Two colour-shifted copies of the title animate in random clip-path slices
 * to create a CRT / signal-corruption look. The image also flickers slightly.
 */
export default function ProjectCardGlitch({ project }: { project: Project }) {
  const [glitching, setGlitching] = useState(false);

  return (
    <div
      className="relative border-[0.5px] border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-low group/card transition-shadow duration-700 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
      onMouseEnter={() => setGlitching(true)}
      onMouseLeave={() => setGlitching(false)}
    >
      {/* Image */}
      <div className="aspect-video relative overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 grid-overlay opacity-20" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`w-full h-full object-cover transition-all duration-700 ${
            glitching
              ? "opacity-60 grayscale-0 scale-105"
              : "opacity-40 grayscale"
          }`}
          src={project.image}
          alt={project.title}
        />

        {/* Glitch scan-line overlay */}
        {glitching && (
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
            }}
          />
        )}

        <div className="absolute top-5 right-5 w-11 h-11 rounded-full glass-card flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 border-[0.5px] border-white/10">
          <span className="material-symbols-outlined text-primary">
            north_east
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-7 md:p-8 space-y-5">
        <div>
          {/* Glitch title wrapper */}
          <div className={`relative mb-2 ${glitching ? "glitch-active" : ""}`}>
            <h3 className="text-2xl md:text-3xl font-bold text-on-surface font-headline relative z-10">
              {project.title}
            </h3>
            {glitching && (
              <>
                <h3
                  className="glitch-layer-1 absolute inset-0 text-2xl md:text-3xl font-bold font-headline pointer-events-none"
                  aria-hidden
                >
                  {project.title}
                </h3>
                <h3
                  className="glitch-layer-2 absolute inset-0 text-2xl md:text-3xl font-bold font-headline pointer-events-none"
                  aria-hidden
                >
                  {project.title}
                </h3>
              </>
            )}
          </div>

          <p className="text-on-surface-variant text-sm leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`px-4 py-1.5 rounded-full border-[0.5px] font-label text-[10px] uppercase tracking-wider transition-all duration-300 ${
                glitching
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-outline-variant/30 bg-surface-container-highest/50 text-on-surface-variant"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
