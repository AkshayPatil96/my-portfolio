"use client";

import { useEffect, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { experiences } from "@/lib/data";
import ExperienceCard from "./ExperienceCard";

export default function ExperienceSection() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline SVG line draw via scrub
      const tlLine = document.getElementById("tl-line");
      const tlContainer = document.getElementById("timeline-container");
      if (tlLine && tlContainer) {
        ScrollTrigger.create({
          trigger: tlContainer,
          start: "top 65%",
          end: "bottom 35%",
          scrub: 2,
          onUpdate(self) {
            const h = tlContainer.offsetHeight;
            const svg = document.getElementById("timeline-svg");
            if (svg) svg.style.height = h + "px";
            tlLine.setAttribute("y2", String(h));
            const len = h + 20;
            tlLine.setAttribute("stroke-dasharray", String(len));
            tlLine.setAttribute(
              "stroke-dashoffset",
              String(len * (1 - self.progress))
            );
          },
        });
      }

      // Fade-up for section header + timeline rows
      document
        .querySelectorAll<HTMLElement>("#experience .gsap-fade")
        .forEach((el) => {
          gsap.from(el, {
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
            y: 44,
            opacity: 0,
            duration: 0.9,
            delay: parseFloat(el.dataset.delay ?? "0"),
            ease: "power3.out",
          });
        });
    });

    return () => ctx.revert();
  }, []);

  const handleExpand = (id: number) => setExpandedId(id);
  const handleCollapse = (id: number) =>
    setExpandedId((prev) => (prev === id ? null : prev));

  return (
    <section
      id="experience"
      className="py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at top right, rgba(200,169,126,0.04) 0%, transparent 60%)",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 lg:px-24">
        {/* Header */}
        <div className="mb-20 gsap-fade">
          <span className="font-label text-primary tracking-[0.4em] uppercase text-sm block mb-4">
            04 / experience
          </span>
          <h2 className="font-headline text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter max-w-2xl leading-tight">
            Professional <em className="italic font-normal">Chapters</em>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative" id="timeline-container">
          {/* Vertical center line — desktop only */}
          <svg
            id="timeline-svg"
            className="absolute pointer-events-none hidden md:block"
            style={{
              left: "50%",
              top: 0,
              transform: "translateX(-50%)",
              width: "2px",
              zIndex: 0,
              overflow: "visible",
            }}
          >
            <line
              id="tl-line"
              x1="1"
              y1="0"
              x2="1"
              y2="100"
              stroke="rgba(229,196,151,0.25)"
              strokeWidth="1.5"
              strokeDasharray="2000"
              strokeDashoffset="2000"
            />
          </svg>

          <div className="space-y-20 md:space-y-28">
            {experiences.map((exp, i) => {
              const isLeft = i % 2 === 0;
              const isExpanded = expandedId === exp.id;

              return (
                <div
                  key={exp.id}
                  className="relative flex flex-col md:flex-row items-start md:items-center gsap-fade"
                  data-delay={String(i * 0.1)}
                >
                  {/* ── Desktop: year label ── */}
                  {/* Left side — shown when card is on the right (isLeft=true) */}
                  <div
                    className={`hidden md:flex w-1/2 ${
                      isLeft ? "pr-20 justify-end" : "pl-20 justify-start order-last"
                    }`}
                  >
                    <span className="font-label text-3xl lg:text-4xl font-light text-on-surface-variant/85 tracking-tighter">
                      {exp.period}
                    </span>
                  </div>

                  {/* Timeline dot */}
                  <div
                    className={`absolute left-0 md:left-1/2 w-4 h-4 rounded-full border-4 border-background md:-translate-x-1/2 z-10 top-5 md:top-auto flex-shrink-0 transition-all duration-300 ${
                      exp.isCurrent ? "" : "bg-outline-variant"
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

                  {/* Card column */}
                  <div
                    className={`w-full md:w-1/2 pl-8 ${
                      isLeft ? "md:pl-20 md:pr-0" : "md:pr-20 md:pl-0"
                    }`}
                  >
                    <ExperienceCard
                      experience={exp}
                      isExpanded={isExpanded}
                      onExpand={() => handleExpand(exp.id)}
                      onCollapse={() => handleCollapse(exp.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-32 text-center gsap-fade">
          <p className="text-on-surface-variant text-lg italic mb-8">
            Looking for the full architectural blueprint?
          </p>
          <div className="flex justify-center gap-4 md:gap-6">
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
