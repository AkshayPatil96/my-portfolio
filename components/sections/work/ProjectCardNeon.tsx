"use client";

import { useRef } from "react";
import gsap from "gsap";
import { Project } from "@/lib/data";

/**
 * ProjectCardNeon — spotlight / neon-glow card.
 * A radial spotlight follows the cursor across the card surface,
 * creating a living light-source effect. On hover the border pulses
 * with a warm golden glow.
 */
export default function ProjectCardNeon({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const spot = spotRef.current;
    if (!card || !spot) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    gsap.to(spot, {
      background: `radial-gradient(400px circle at ${x}% ${y}%, rgba(229,196,151,0.09), transparent 50%)`,
      duration: 0.25,
      ease: "power1.out",
    });
  };

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      boxShadow:
        "0 0 0 1px rgba(229,196,151,0.45), 0 0 36px rgba(229,196,151,0.18), 0 20px 40px rgba(0,0,0,0.5)",
      duration: 0.4,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      boxShadow:
        "0 0 0 0.5px rgba(78,69,59,0.3), 0 0 0 rgba(229,196,151,0), 0 0 0 rgba(0,0,0,0)",
      duration: 0.5,
    });
    if (spotRef.current) {
      gsap.to(spotRef.current, { background: "transparent", duration: 0.5 });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="spotlight-card relative rounded-xl overflow-hidden bg-surface-container-low group/card"
      style={{ boxShadow: "0 0 0 0.5px rgba(78,69,59,0.3)" }}
    >
      {/* Spotlight overlay */}
      <div
        ref={spotRef}
        className="absolute inset-0 z-10 pointer-events-none rounded-xl"
      />

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-px h-16 bg-gradient-to-b from-primary/60 to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-16 h-px bg-gradient-to-l from-primary/60 to-transparent z-20 pointer-events-none" />

      {/* Image */}
      <div className="aspect-video relative overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 grid-overlay opacity-20" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover grayscale opacity-40 group-hover/card:grayscale-0 group-hover/card:opacity-75 transition-all duration-1000 group-hover/card:scale-105"
          src={project.image}
          alt={project.title}
        />
        <div className="absolute top-5 right-5 w-11 h-11 rounded-full glass-card flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 border-[0.5px] border-white/10 z-30">
          <span className="material-symbols-outlined text-primary">
            north_east
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-7 md:p-8 space-y-5 relative z-10">
        <div>
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
