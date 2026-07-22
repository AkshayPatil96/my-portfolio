"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { CaseStudy } from "@/lib/data";

interface ProjectKnownLimitationsProps {
  caseStudy: CaseStudy;
}

export default function ProjectKnownLimitations({
  caseStudy,
}: ProjectKnownLimitationsProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-limit-item]", {
        scrollTrigger: {
          trigger: "[data-limit-items]",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!caseStudy.knownLimitations) return null;

  return (
    <section
      ref={sectionRef}
      className="py-12 px-6 md:px-12 lg:px-24 bg-[#0B0B0B]"
    >
      <div className="max-w-6xl mx-auto">
        <p className="font-label text-xs uppercase tracking-[0.3em] text-primary/50 mb-4">
          {caseStudy.knownLimitations.eyebrow}
        </p>
        <h2 className="font-headline text-3xl md:text-4xl text-on-surface leading-tight mb-16">
          {caseStudy.knownLimitations.title}
        </h2>

        <div data-limit-items className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {caseStudy.knownLimitations.items.map((item, i) => (
            <div
              key={i}
              data-limit-item
              className="glass-card ghost-border rounded-lg p-6 flex gap-4 items-start"
            >
              <span className="material-symbols-outlined text-primary/40 text-lg mt-0.5 flex-shrink-0">
                warning
              </span>
              <div>
                <h3 className="font-label text-sm font-semibold text-on-surface mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-on-surface-variant/50 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
