"use client";

import { useRef } from "react";
import gsap from "gsap";
import { Project } from "@/lib/data";

/**
 * ProjectCardTilt — 3-D perspective tilt following the mouse.
 * The card rotates on X/Y axes as the cursor moves over it,
 * creating a depth illusion. Springs back on mouse-leave.
 */
export default function ProjectCardTilt({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    gsap.to(card, {
      rotateY: x * 10,
      rotateX: -y * 10,
      transformPerspective: 900,
      ease: "power2.out",
      duration: 0.4,
    });

    // Moving shine overlay
    if (shineRef.current) {
      gsap.to(shineRef.current, {
        opacity: 0.06,
        background: `radial-gradient(300px circle at ${((x + 1) / 2) * 100}% ${((y + 1) / 2) * 100}%, rgba(229,196,151,1), transparent 60%)`,
        duration: 0.3,
      });
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 1,
      ease: "elastic.out(1, 0.6)",
    });
    if (shineRef.current) {
      gsap.to(shineRef.current, { opacity: 0, duration: 0.5 });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d" }}
      className="relative border-[0.5px] border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-low group/card transition-shadow duration-700 hover:shadow-[0_24px_48px_rgba(0,0,0,0.5)] cursor-none"
    >
      {/* 3D shine overlay */}
      <div
        ref={shineRef}
        className="absolute inset-0 z-20 pointer-events-none rounded-xl opacity-0"
      />

      {/* Image */}
      <div className="aspect-video relative overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 grid-overlay opacity-20" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover grayscale opacity-50 group-hover/card:grayscale-0 group-hover/card:opacity-80 transition-all duration-700"
          src={project.image}
          alt={project.title}
        />
        {/* 3D floating badge */}
        <div
          style={{ transform: "translateZ(32px)" }}
          className="absolute top-5 right-5 w-11 h-11 rounded-full glass-card flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 border-[0.5px] border-white/10"
        >
          <span className="material-symbols-outlined text-primary">
            north_east
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-7 md:p-8 space-y-5" style={{ transform: "translateZ(16px)" }}>
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
