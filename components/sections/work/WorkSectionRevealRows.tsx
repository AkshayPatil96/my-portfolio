"use client";

/**
 * WorkSectionRevealRows — Alternating left/right wipe reveal.
 *
 * Cards are laid out in a vertical list. As each row enters the viewport,
 * a clip-path wipe sweeps across (left→right on even rows, right→left on odd)
 * scrubbed by ScrollTrigger for precise control.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { projects } from "@/lib/data";

export default function WorkSectionRevealRows() {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    rowRefs.current.forEach((row, i) => {
      if (!row) return;
      const inner = innerRefs.current[i];
      const fromLeft = i % 2 === 0;

      // Start clipped (fully hidden), wipe to fully revealed
      gsap.fromTo(
        row,
        { clipPath: fromLeft ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" },
        {
          clipPath: "inset(0 0% 0 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            end: "top 30%",
            scrub: 0.6,
          },
        }
      );

      // Subtle counter-translate on inner content (parallax inside clip)
      if (inner) {
        gsap.fromTo(
          inner,
          { x: fromLeft ? -60 : 60, opacity: 0.3 },
          {
            x: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              end: "top 30%",
              scrub: 0.6,
            },
          }
        );
      }
    });

    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  return (
    <section id="work" className="relative py-28 md:py-36 px-6 md:px-16 lg:px-24">
      {/* Section header */}
      <div className="mb-20 max-w-5xl mx-auto flex items-end justify-between">
        <div>
          <p className="text-xs font-label text-primary/60 uppercase tracking-widest">03 — Work</p>
          <h2 className="text-5xl md:text-7xl font-headline font-bold mt-4 text-on-surface">
            Projects
          </h2>
        </div>
        <p className="hidden md:block text-on-surface-variant text-sm max-w-xs leading-relaxed text-right">
          Scroll to reveal each project.
        </p>
      </div>

      {/* Rows */}
      <div className="max-w-5xl mx-auto space-y-10">
        {projects.map((project, i) => {
          const fromLeft = i % 2 === 0;
          return (
            <div
              key={project.id}
              ref={(el) => { rowRefs.current[i] = el; }}
              className="rounded-2xl overflow-hidden ghost-border"
              style={{ clipPath: fromLeft ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" }}
            >
              <div
                ref={(el) => { innerRefs.current[i] = el; }}
                className={`grid md:grid-cols-2 gap-0 glass-card ${!fromLeft ? "md:[direction:rtl]" : ""}`}
              >
                {/* Image */}
                <div
                  className="aspect-video md:aspect-auto relative overflow-hidden bg-surface-container-lowest min-h-[200px]"
                  style={{ direction: "ltr" }}
                >
                  <div className="absolute inset-0 grid-overlay opacity-20" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-60 hover:opacity-90 transition-opacity duration-700"
                  />
                  {/* Index badge */}
                  <div className="absolute bottom-4 left-4 text-6xl font-headline font-bold text-white/5 select-none pointer-events-none">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                {/* Info */}
                <div
                  className="p-8 md:p-10 flex flex-col justify-center space-y-5"
                  style={{ direction: "ltr" }}
                >
                  <p className="text-xs font-label text-primary/60 uppercase tracking-widest">
                    {fromLeft ? "← Left reveal" : "Right reveal →"}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold font-headline text-on-surface">
                    {project.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full border-[0.5px] border-primary/30 font-label text-[10px] uppercase tracking-wider bg-primary/5 text-primary/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
