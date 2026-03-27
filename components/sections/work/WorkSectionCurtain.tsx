"use client";

/**
 * WorkSectionCurtain — Full-viewport curtain wipe per project.
 *
 * Each project occupies the full viewport height. Scrolling scrubs two curtain
 * panels that pull apart (top and bottom) to reveal the project image and
 * info beneath, like theatre curtains opening. Projects are sequenced in a
 * pinned container; GSAP ScrollTrigger drives the curtain split per panel.
 */

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { projects } from "@/lib/data";

export default function WorkSectionCurtain() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const curtainTopRefs = useRef<(HTMLDivElement | null)[]>([]);
  const curtainBotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[];

    panels.forEach((panel, i) => {
      const curtainTop = curtainTopRefs.current[i];
      const curtainBot = curtainBotRefs.current[i];

      // Pin each full-screen panel while the curtain animates
      ScrollTrigger.create({
        trigger: panel,
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: i < panels.length - 1,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          // Curtains sweep out 0→50% of panel height
          const pct = Math.min(p * 2, 1) * 50;
          if (curtainTop) gsap.set(curtainTop, { yPercent: -pct });
          if (curtainBot) gsap.set(curtainBot, { yPercent: pct });
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  return (
    <div ref={wrapperRef} id="work">
      {projects.map((project, i) => (
        <div
          key={project.id}
          ref={(el) => { panelRefs.current[i] = el; }}
          className="relative w-full h-screen overflow-hidden bg-surface-container-low"
        >
          {/* Background image — always visible underneath curtains */}
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/60 to-transparent" />
          </div>

          {/* Foreground content */}
          <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-20 z-10">
            {/* Section label only on first panel */}
            {i === 0 && (
              <div className="absolute top-10 left-10 md:left-20">
              <p className="text-xs font-label text-primary/60 uppercase tracking-widest">03 — Work</p>
              </div>
            )}
            <p className="text-xs font-label text-primary/50 uppercase tracking-widest mb-3">
              0{i + 1} / 0{projects.length}
            </p>
            <h2 className="text-5xl md:text-8xl font-headline font-bold text-on-surface mb-4 leading-none">
              {project.title}
            </h2>
            <p className="text-on-surface-variant max-w-xl text-base md:text-lg leading-relaxed mb-6">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full border-[0.5px] border-primary/30 font-label text-[10px] uppercase tracking-wider bg-primary/5 text-primary/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Top curtain */}
          <div
            ref={(el) => { curtainTopRefs.current[i] = el; }}
            className="absolute top-0 left-0 w-full h-1/2 bg-surface-container z-20 origin-top flex items-end justify-center pb-2"
            style={{ willChange: "transform" }}
          >
            {/* Decorative text on curtain */}
            <p className="text-xs font-label text-on-surface-variant/20 uppercase tracking-[0.5em] select-none pb-4">
              Scroll to open ↓
            </p>
          </div>

          {/* Bottom curtain */}
          <div
            ref={(el) => { curtainBotRefs.current[i] = el; }}
            className="absolute bottom-0 left-0 w-full h-1/2 bg-surface-container z-20 origin-bottom flex items-start justify-center pt-2"
            style={{ willChange: "transform" }}
          >
            {/* Thin line on seam */}
            <div className="absolute top-0 left-0 w-full h-px bg-primary/20" />
          </div>
        </div>
      ))}
    </div>
  );
}
