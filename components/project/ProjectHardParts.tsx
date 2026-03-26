"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { CaseStudy } from "@/lib/data";

interface ProjectHardPartsProps {
  caseStudy: CaseStudy;
}

export default function ProjectHardParts({ caseStudy }: ProjectHardPartsProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-hard-item]", {
        scrollTrigger: {
          trigger: "[data-hard-items]",
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.from("[data-stat]", {
        scrollTrigger: {
          trigger: "[data-stats-grid]",
          start: "top 80%",
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-12 lg:px-24 bg-[#0B0B0B]">
      <div className="max-w-6xl mx-auto">
        <p className="font-label text-xs uppercase tracking-[0.3em] text-primary/50 mb-4">
          {caseStudy.hardParts.eyebrow}
        </p>
        <h2 className="font-headline text-3xl md:text-4xl text-on-surface leading-tight mb-16">
          {caseStudy.hardParts.title}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left — Items */}
          <div data-hard-items className="space-y-10">
            {caseStudy.hardParts.items.map((item, i) => (
              <div key={i} data-hard-item>
                <h3 className="font-label text-base font-semibold text-on-surface mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-on-surface-variant/50 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Right — Stats */}
          <div data-stats-grid className="grid grid-cols-2 gap-6 content-start">
            {caseStudy.hardParts.stats.map((stat, i) => (
              <div
                key={i}
                data-stat
                className="glass-card ghost-border rounded-lg p-6 text-center"
              >
                <p className="font-headline text-3xl md:text-4xl text-primary font-bold">
                  {stat.value}
                </p>
                <p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface-variant/40 mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
