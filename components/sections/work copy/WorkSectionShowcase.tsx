"use client";

/**
 * WorkSectionShowcase - Editorial case-study rows.
 *
 * No pinning: each project is a full-width alternating row.
 * Entrance = clip reveal on the image + staggered meta fade.
 * Continuous subtle parallax on the image while scrolling.
 * All motion is skipped under prefers-reduced-motion.
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { projects } from "@/lib/data";

const MAX_TAGS = 5;

export default function WorkSectionShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(sectionRef);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from(".ws-header > *", {
          scrollTrigger: { trigger: ".ws-header", start: "top 85%" },
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
        });

        gsap.utils.toArray<HTMLElement>(".ws-row").forEach((row) => {
          const frame = row.querySelector(".ws-frame");
          const parallax = row.querySelector(".ws-parallax");
          const meta = row.querySelectorAll(".ws-meta > *");
          const line = row.querySelector(".ws-line");

          gsap.from(frame, {
            scrollTrigger: { trigger: row, start: "top 78%" },
            clipPath: "inset(14% 8% 14% 8% round 16px)",
            opacity: 0,
            scale: 0.98,
            duration: 1.1,
            ease: "power3.out",
          });

          gsap.from(meta, {
            scrollTrigger: { trigger: row, start: "top 72%" },
            y: 36,
            opacity: 0,
            duration: 0.8,
            stagger: 0.09,
            ease: "power3.out",
          });

          gsap.from(line, {
            scrollTrigger: { trigger: row, start: "top 72%" },
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1,
            ease: "power2.out",
          });

          gsap.fromTo(
            parallax,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="py-32 lg:py-40 px-8 lg:px-12 bg-surface-container-lowest overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="ws-header mb-20 lg:mb-28">
          <span className="font-label text-xs uppercase tracking-widest text-primary mb-6 block">
            04 // Selected Work
          </span>
          <h2 className="font-headline text-4xl lg:text-6xl leading-tight text-on-surface max-w-3xl">
            Projects engineered for production.
          </h2>
          <p className="mt-6 text-lg text-on-surface-variant max-w-xl">
            Deep-dive case studies - architecture decisions, hard problems,
            and the trade-offs behind each system.
          </p>
        </div>

        {/* Project rows */}
        <div className="space-y-28 lg:space-y-40">
          {projects.map((project, i) => {
            const flipped = i % 2 === 1;
            const number = String(i + 1).padStart(2, "0");
            const extraTags = project.tags.length - MAX_TAGS;

            return (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="ws-row group relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-surface-container-lowest rounded-xl"
              >
                {/* Image */}
                <div className={`lg:col-span-7 ${flipped ? "lg:order-2" : ""}`}>
                  <div className="ws-frame relative aspect-[16/10] rounded-xl overflow-hidden border border-white/[0.06] bg-surface-container transition-shadow duration-500 group-hover:shadow-[0_24px_80px_rgba(0,0,0,0.55),0_0_0_1px_rgba(229,196,151,0.18)]">
                    {/* Parallax wrapper is taller than the frame so it can drift */}
                    <div className="ws-parallax absolute inset-x-0 -inset-y-[8%]">
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                    </div>

                    {/* Hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Hover CTA chip */}
                    <div className="absolute bottom-5 left-5 flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm border border-primary/25 text-primary text-sm font-label translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out">
                      View Case Study
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div
                  className={`lg:col-span-5 relative ${flipped ? "lg:order-1" : ""}`}
                >
                  {/* Ghost numeral */}
                  <span
                    aria-hidden
                    className="hidden lg:block absolute -top-24 -left-4 font-headline font-bold leading-none select-none pointer-events-none text-transparent"
                    style={{
                      fontSize: "9rem",
                      WebkitTextStroke: "1px rgba(229,196,151,0.14)",
                    }}
                  >
                    {number}
                  </span>

                  <div className="ws-meta relative space-y-5">
                    <div className="flex items-center gap-4">
                      <span className="font-label text-[11px] uppercase tracking-[0.3em] text-primary/60">
                        {number} — Case Study
                      </span>
                      <div className="ws-line h-px flex-1 bg-primary/20" />
                    </div>

                    <h3 className="font-headline font-bold text-on-surface text-3xl lg:text-4xl leading-snug group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>

                    <p className="text-on-surface-variant text-base leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {project.tags.slice(0, MAX_TAGS).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full border-[0.5px] border-primary/25 font-label text-[10px] uppercase tracking-wider bg-primary/5 text-primary/70 transition-colors duration-300 group-hover:bg-primary/10"
                        >
                          {tag}
                        </span>
                      ))}
                      {extraTags > 0 && (
                        <span className="px-3 py-1 rounded-full font-label text-[10px] uppercase tracking-wider text-on-surface-variant/60">
                          +{extraTags} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2 text-primary/60 group-hover:text-primary transition-colors duration-300">
                      <span className="font-label text-[11px] uppercase tracking-[0.15em]">
                        Read the full breakdown
                      </span>
                      <span className="inline-block text-sm transition-transform duration-300 group-hover:translate-x-1.5">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
