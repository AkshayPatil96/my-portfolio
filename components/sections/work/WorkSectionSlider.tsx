"use client";

/**
 * WorkSectionSlider — Fixed-size card carousel, horizontal scroll on scrub.
 *
 * The section pins while GSAP scrubs the card track sideways.
 * Cards stay the same width (like normal project cards) — they don't go full-screen.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { projects } from "@/lib/data";
import ProjectCard from "./ProjectCard";

export default function WorkSectionSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ctx = gsap.context(() => {
      // Scroll distance = total track width minus the visible viewport width
      const getScrollAmt = () => -(track.scrollWidth - container.offsetWidth);

      gsap.to(track, {
        x: getScrollAmt,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          // Give ~100px of scroll per 100px of overflow track
          end: () => `+=${track.scrollWidth - container.offsetWidth + window.innerHeight * 0.5}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="work"
      className="relative w-full h-screen overflow-hidden bg-surface-container-lowest flex flex-col justify-center"
    >
      {/* Header */}
      <div className="flex-shrink-0 px-10 md:px-20 pt-16 pb-8 flex items-end justify-between">
        <div>
          <p className="font-label text-[10px] uppercase tracking-[0.35em] text-primary/50 mb-3">
            03 — Selected Work
          </p>
          <h2 className="font-headline font-bold text-on-surface text-4xl md:text-6xl tracking-tighter leading-none">
            Projects
          </h2>
        </div>
        <p className="hidden md:block font-label text-[10px] uppercase tracking-widest text-on-surface-variant/30">
          Scroll to browse →
        </p>
      </div>

      {/* Card track */}
      <div
        ref={trackRef}
        className="flex items-center gap-6 px-10 md:px-20 pb-16 will-change-transform"
        style={{ width: "max-content" }}
      >
        {projects.map((project, i) => (
          <div
            key={project.id}
            className="flex-shrink-0"
            style={{ width: "clamp(300px, 38vw, 520px)" }}
          >
            <ProjectCard
              project={project}
              index={i}
              total={projects.length}
            />
          </div>
        ))}

        {/* End spacer so last card can fully slide into view */}
        <div className="flex-shrink-0 w-10 md:w-20" aria-hidden />
      </div>

      {/* Progress bar at very bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/[0.04]">
        <div
          id="slider-progress"
          className="h-full bg-primary/35 origin-left"
          style={{ width: "0%" }}
        />
      </div>
    </section>
  );
}
