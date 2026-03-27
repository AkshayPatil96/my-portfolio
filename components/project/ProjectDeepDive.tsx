"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { CaseStudy } from "@/lib/data";

interface ProjectDeepDiveProps {
  caseStudy: CaseStudy;
}

export default function ProjectDeepDive({ caseStudy }: ProjectDeepDiveProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {


    const ctx = gsap.context(() => {
      gsap.from("[data-dive-card]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-12 lg:px-24 bg-[#0e0e0e]">
      <div className="max-w-6xl mx-auto">
        <p className="font-label text-xs uppercase tracking-[0.3em] text-primary/50 mb-12">
          {caseStudy.deepDive.eyebrow}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudy.deepDive.cards.map((card, i) => (
            <div
              key={i}
              data-dive-card
              className="group glass-card ghost-border rounded-lg p-8 hover:border-primary/20 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-xl">
                  {card.icon}
                </span>
              </div>
              <h3 className="font-headline text-xl text-on-surface mb-4">
                {card.title}
              </h3>
              <p className="font-body text-on-surface-variant/50 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
