"use client";

/**
 * WorkSectionStack — Sticky card stack with parallax depth.
 *
 * Each card sticks at the top and the next card slides up from beneath it
 * as you scroll. Cards subtly scale down and push back in Z to give a
 * layered-deck feel. Use as a drop-in replacement for WorkSection.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { projects } from "@/lib/data";

export default function WorkSectionStack() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const total = cards.length;

    cards.forEach((card, i) => {
      // Every card except the last scales and fades as the next one overtakes it
      if (i < total - 1) {
        gsap.to(card, {
          scale: 0.88,
          opacity: 0.4,
          filter: "blur(2px)",
          scrollTrigger: {
            trigger: card,
            start: "top top+=80",
            end: "+=400",
            scrub: true,
          },
        });
      }

      // Slide card up into view
      gsap.fromTo(
        card,
        { y: 120, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "top 40%",
            scrub: 0.8,
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative py-28 md:py-36 px-6 md:px-16 lg:px-24 max-w-5xl mx-auto"
    >
      {/* Section header */}
      <div className="mb-20 flex items-end justify-between">
        <div>
          <p className="text-xs font-label text-primary/60 uppercase tracking-widest">03 — Work</p>
          <h2 className="text-5xl md:text-7xl font-headline font-bold mt-4 text-on-surface">
            Projects
          </h2>
        </div>
        <p className="hidden md:block text-on-surface-variant text-sm max-w-xs leading-relaxed text-right">
          Scroll through to explore a&nbsp;selection of&nbsp;recent builds.
        </p>
      </div>

      {/* Stacking cards */}
      <div className="space-y-8">
        {projects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => { cardRefs.current[i] = el; }}
            // Sticky offset increases per card so they peek out at different heights
            className="sticky glass-card rounded-2xl overflow-hidden ghost-border"
            style={{ top: `${80 + i * 12}px` }}
          >
            <div className="grid md:grid-cols-5 gap-0">
              {/* Image */}
              <div className="md:col-span-3 aspect-video md:aspect-auto relative overflow-hidden bg-surface-container-lowest min-h-[220px]">
                <div className="absolute inset-0 grid-overlay opacity-20" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale-[60%] hover:grayscale-0 transition-all duration-700"
                />
              </div>
              {/* Info */}
              <div className="md:col-span-2 p-8 md:p-10 flex flex-col justify-between">
                <div className="space-y-4">
                  <p className="text-xs font-label text-primary/60 uppercase tracking-widest">
                    0{i + 1}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold font-headline text-on-surface">
                    {project.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-6">
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
        ))}
      </div>
    </section>
  );
}
