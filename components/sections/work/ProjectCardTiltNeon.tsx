"use client";

import { useRef } from "react";
import gsap from "gsap";
import { Project } from "@/lib/data";

/**
 * ProjectCardTiltNeon — Tilt + Neon merged card.
 *
 * Combines:
 * - 3-D perspective rotateX/Y tilt that follows the mouse (from Tilt)
 * - Elastic spring-back on mouse-leave (from Tilt)
 * - Radial spotlight that tracks the cursor across the surface (from Neon)
 * - Golden border glow pulse on hover (from Neon)
 * - Moving shine overlay tied to tilt angle (from Tilt, enhanced)
 * - Corner accent lines + title colour shift (from Neon)
 */
export default function ProjectCardTiltNeon({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();

    // Normalised -1 → +1
    const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    // Percentage 0-100 for spotlight position
    const px = ((nx + 1) / 2) * 100;
    const py = ((ny + 1) / 2) * 100;

    // 3-D tilt
    gsap.to(card, {
      rotateY: nx * 12,
      rotateX: -ny * 12,
      transformPerspective: 900,
      ease: "power2.out",
      duration: 0.35,
    });

    // Spotlight that tracks cursor
    if (spotRef.current) {
      gsap.to(spotRef.current, {
        background: `radial-gradient(380px circle at ${px}% ${py}%, rgba(229,196,151,0.11), transparent 55%)`,
        duration: 0.2,
        ease: "power1.out",
      });
    }

    // Directional shine tied to tilt angle
    if (shineRef.current) {
      gsap.to(shineRef.current, {
        opacity: 0.07,
        background: `radial-gradient(260px circle at ${px}% ${py}%, rgba(229,196,151,0.9), transparent 65%)`,
        duration: 0.3,
      });
    }
  };

  const handleMouseEnter = () => {
    // Neon border glow
    gsap.to(cardRef.current, {
      boxShadow:
        "0 0 0 1px rgba(229,196,151,0.5), 0 0 40px rgba(229,196,151,0.2), 0 24px 48px rgba(0,0,0,0.55)",
      duration: 0.4,
    });
  };

  const handleMouseLeave = () => {
    // Spring back tilt
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      boxShadow: "0 0 0 0.5px rgba(78,69,59,0.3)",
      duration: 0.9,
      ease: "elastic.out(1, 0.55)",
    });
    if (spotRef.current) {
      gsap.to(spotRef.current, { background: "transparent", duration: 0.5 });
    }
    if (shineRef.current) {
      gsap.to(shineRef.current, { opacity: 0, duration: 0.5 });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        boxShadow: "0 0 0 0.5px rgba(78,69,59,0.3)",
      }}
      className="relative rounded-xl overflow-hidden bg-surface-container-low group/card"
    >
      {/* Spotlight overlay (Neon) */}
      <div
        ref={spotRef}
        className="absolute inset-0 z-10 pointer-events-none rounded-xl"
      />

      {/* Directional shine overlay (Tilt) */}
      <div
        ref={shineRef}
        className="absolute inset-0 z-20 pointer-events-none rounded-xl opacity-0"
      />

      {/* Decorative corner accent (Neon) */}
      <div className="absolute top-0 right-0 w-px h-20 bg-gradient-to-b from-primary/70 to-transparent z-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-20 h-px bg-gradient-to-l from-primary/70 to-transparent z-30 pointer-events-none" />

      {/* Image */}
      <div className="aspect-video relative overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 grid-overlay opacity-20" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover grayscale opacity-40 group-hover/card:grayscale-0 group-hover/card:opacity-80 transition-all duration-900 group-hover/card:scale-108"
          src={project.image}
          alt={project.title}
        />
        {/* 3-D floating badge (Tilt) */}
        <div
          style={{ transform: "translateZ(36px)" }}
          className="absolute top-5 right-5 w-11 h-11 rounded-full glass-card flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-400 border-[0.5px] border-white/10 z-40"
        >
          <span className="material-symbols-outlined text-primary">
            north_east
          </span>
        </div>
      </div>

      {/* Info panel — slightly lifted in 3-D space */}
      <div
        className="p-7 md:p-8 space-y-5 relative z-10"
        style={{ transform: "translateZ(18px)" }}
      >
        <div>
          {/* Title shifts to primary on hover (Neon) */}
          <h3 className="text-2xl md:text-3xl font-bold mb-2 text-on-surface font-headline group-hover/card:text-primary transition-colors duration-500">
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
              className="px-4 py-1.5 rounded-full border-[0.5px] border-primary/30 font-label text-[10px] uppercase tracking-wider bg-primary/5 text-primary/80 transition-all duration-300 group-hover/card:bg-primary/15"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
