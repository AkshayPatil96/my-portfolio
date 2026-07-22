"use client";

/**
 * ExperienceSection - Left-rail timeline.
 *
 * One vertical rail on every breakpoint (no alternating sides):
 * mobile/tablet get the rail on the left edge, desktop adds a
 * dedicated period column before the rail. The gold line draws
 * itself in as you scroll; rows fade up staggered. Cards expand
 * on click/tap only. Motion is skipped under
 * prefers-reduced-motion.
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { experiences } from "@/lib/data";
import ExperienceCard from "./ExperienceCard";

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggle = (id: number) =>
    setExpandedId((prev) => (prev === id ? null : id));

  useEffect(() => {
    const mm = gsap.matchMedia(sectionRef);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from(".xp-header > *", {
          scrollTrigger: {
            trigger: ".xp-header",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
        });

        // Gold rail draws in while the timeline scrolls through view
        gsap.fromTo(
          ".xp-line-fill",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: ".xp-rows",
              start: "top 70%",
              end: "bottom 55%",
              scrub: 1,
            },
          },
        );

        gsap.utils.toArray<HTMLElement>(".xp-row").forEach((row) => {
          gsap.from(row, {
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            y: 44,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
          });
        });

        gsap.from(".xp-cta > *", {
          scrollTrigger: {
            trigger: ".xp-cta",
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="py-24 md:py-32 px-6 sm:px-8 lg:px-12 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at top right, rgba(200,169,126,0.04) 0%, transparent 60%)",
      }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="xp-header mb-16 md:mb-24">
          <span className="font-label text-xs uppercase tracking-widest text-primary mb-6 block">
            05 // Experience
          </span>
          <h2 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter max-w-2xl leading-tight">
            Professional <em className="italic font-normal">Chapters</em>
          </h2>
        </div>

        {/* Timeline */}
        <div className="xp-rows relative">
          {/* Base rail + animated gold fill */}
          <div className="absolute left-[7px] md:left-[11.5rem] top-2 bottom-2 w-px bg-outline-variant/30" />
          <div
            className="xp-line-fill absolute left-[7px] md:left-[11.5rem] top-2 bottom-2 w-px bg-gradient-to-b from-primary/70 via-primary/40 to-primary/10"
            style={{ transformOrigin: "top center" }}
          />

          <div className="space-y-12 md:space-y-16">
            {experiences.map((exp) => {
              const isExpanded = expandedId === exp.id;

              return (
                <div
                  key={exp.id}
                  className="xp-row relative pl-10 md:pl-0 md:grid md:grid-cols-[10rem_3rem_1fr] md:items-start"
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute top-9 left-0 md:left-[calc(11.5rem-7px)] w-[15px] h-[15px] rounded-full border-4 border-background z-10 transition-all duration-300 ${
                      exp.isCurrent || isExpanded ? "" : "bg-outline-variant"
                    }`}
                    style={
                      exp.isCurrent || isExpanded
                        ? {
                            background: "#e5c497",
                            boxShadow: isExpanded
                              ? "0 0 24px rgba(229,196,151,0.7)"
                              : "0 0 16px rgba(229,196,151,0.45)",
                          }
                        : undefined
                    }
                  />

                  {/* Period - desktop column */}
                  <div className="hidden md:block text-right pt-7 pr-2">
                    <span className="font-label text-lg lg:text-xl font-light text-on-surface-variant/85 tracking-tight whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>

                  {/* Rail gutter (desktop) */}
                  <div className="hidden md:block" />

                  {/* Card */}
                  <ExperienceCard
                    experience={exp}
                    isExpanded={isExpanded}
                    onToggle={() => toggle(exp.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="xp-cta mt-24 md:mt-32 text-center">
          <p className="text-on-surface-variant text-lg italic mb-8">
            Looking for the full architectural blueprint?
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6">
            <button className="mag-btn bg-primary text-on-primary font-label uppercase tracking-widest px-8 md:px-10 py-4 rounded-full text-xs font-bold">
              Download Resume
            </button>
            <button className="mag-btn ghost-border text-on-surface font-label uppercase tracking-widest px-8 md:px-10 py-4 rounded-full text-xs font-bold hover:bg-surface-container transition-all">
              View LinkedIn
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
